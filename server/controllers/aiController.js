import Chat from '../models/chatModel.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.5-flash';

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text, apiKey) {
    const res = await fetch(`${GEMINI_API_BASE}/models/text-embedding-004:embedContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text }] }
        })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to embed prompt');
    return data.embedding.values;
}

const SYSTEM_PROMPT = `You are TryGPT, a friendly, helpful, and intelligent AI assistant. 
You should:
- Be conversational, warm, and engaging
- Use markdown formatting (headings, bold, code blocks, lists, tables) to structure responses
- Provide detailed, accurate, and well-organized answers
- Use code blocks with language identifiers when sharing code
- Always be honest if you don't know something`;

const buildContents = (messages, personality = 'helpful') => {
    const personalityMap = {
        helpful: 'Be thorough and helpful.',
        concise: 'Be concise and to-the-point. Give short, direct answers.',
        creative: 'Be creative, use vivid language, metaphors, and storytelling.',
    };

    const contents = [];
    contents.push({
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT + '\n\nPersonality: ' + (personalityMap[personality] || personalityMap.helpful) + '\n\nPlease acknowledge.' }]
    });
    contents.push({
        role: 'model',
        parts: [{ text: "Understood! I'm TryGPT, ready to help. What can I do for you?" }]
    });

    const recentMessages = messages.slice(-20);
    for (const msg of recentMessages) {
        // Skip locally generated images (e.g. from the fallback engine)
        if (msg.isImage && !msg.inlineData) continue;
        
        const parts = [{ text: msg.content }];
        
        // Add image attachment if present
        if (msg.inlineData && msg.inlineData.data) {
            let base64Data = msg.inlineData.data;
            // Strip the data URL prefix if it exists (Gemini expects pure base64)
            if (base64Data.includes('base64,')) {
                base64Data = base64Data.split('base64,')[1];
            }
            parts.push({
                inlineData: {
                    mimeType: msg.inlineData.mimeType || 'image/jpeg',
                    data: base64Data
                }
            });
        }

        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: parts
        });
    }

    return contents;
};

// @desc    Generate AI Response (Streaming SSE)
// @route   POST /api/ai/generate
// @access  Private
export const generateResponse = async (req, res) => {
    try {
        const { chatId, messages, personality, streaming } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Server missing Gemini API Key' });
        }

        let augmentedMessages = messages ? JSON.parse(JSON.stringify(messages)) : []; // Deep copy to avoid mutating req.body

        if (chatId) {
            try {
                const chat = await Chat.findById(chatId);
                if (chat && chat.documents && chat.documents.length > 0) {
                    const lastMsg = augmentedMessages[augmentedMessages.length - 1];
                    if (lastMsg && lastMsg.role === 'user') {
                        const promptEmbedding = await getEmbedding(lastMsg.content, apiKey);
                        const scoredChunks = chat.documents.map(doc => ({
                            text: doc.text,
                            score: cosineSimilarity(promptEmbedding, doc.embedding)
                        }));
                        scoredChunks.sort((a, b) => b.score - a.score);
                        const topChunks = scoredChunks.slice(0, 3);
                        
                        const contextText = topChunks.map((c, i) => `[Source ${i+1}]: ${c.text}`).join('\n\n');
                        
                        lastMsg.content = `${lastMsg.content}\n\n---\nContext from uploaded documents:\n${contextText}\n\nPlease use the above context to answer the question if relevant.`;
                    }
                }
            } catch (err) {
                console.error('Vector search failed:', err);
                // Continue without context if RAG fails
            }
        }

        const contents = buildContents(augmentedMessages, personality);

        const config = {
            contents,
            generationConfig: {
                temperature: personality === 'creative' ? 0.9 : 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 4096,
            },
        };

        if (streaming) {
            // Streaming SSE implementation
            const response = await fetch(
                `${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API Error:', errorText);
                let cleanMessage = 'AI Generation failed';
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error && errorJson.error.message) {
                        cleanMessage = errorJson.error.message;
                    }
                } catch (e) {
                    cleanMessage = errorText;
                }
                
                // Add a friendly message if it's a rate limit
                if (cleanMessage.includes('exceeded your current quota') || response.status === 429) {
                    cleanMessage = "You have exceeded the free tier rate limit for Gemini API (15 requests per minute). Please wait a few seconds and try again.";
                }

                return res.status(response.status).json({ message: cleanMessage });
            }

            // Set headers for Server-Sent Events
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            if (typeof response.body.on === 'function') {
                // Fallback for node-fetch if it's used
                response.body.on('data', (chunk) => res.write(chunk));
                response.body.on('end', () => res.end());
                response.body.on('error', (err) => {
                    console.error('Stream error:', err);
                    res.end();
                });
            } else {
                // Native fetch ReadableStream
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            res.end();
                            break;
                        }
                        res.write(decoder.decode(value, { stream: true }));
                    }
                } catch (err) {
                    console.error('Stream reading error:', err);
                    res.end();
                }
            }

        } else {
            // Non-streaming implementation
            const response = await fetch(
                `${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config),
                }
            );

            const rawBody = await response.text();
            let data = {};
            try {
                data = rawBody ? JSON.parse(rawBody) : {};
            } catch (e) {
                if (response.ok) throw new Error('AI response was not valid JSON');
            }
            
            if (!response.ok) {
                console.error('Gemini API Error:', rawBody);
                let cleanMessage = data.error?.message || rawBody || 'AI Generation failed';
                
                if (cleanMessage.includes('exceeded your current quota') || response.status === 429) {
                    cleanMessage = "You have exceeded the free tier rate limit for Gemini API (15 requests per minute). Please wait a few seconds and try again.";
                }

                return res.status(response.status).json({ message: cleanMessage });
            }

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            res.json({ response: text });
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: error.message });
    }
};
