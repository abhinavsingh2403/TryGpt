const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash';

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
        const { messages, personality, streaming } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Server missing Gemini API Key' });
        }

        const contents = buildContents(messages || [], personality);

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
                return res.status(response.status).json({ message: `Gemini API Error: ${errorText}` });
            }

            // Set headers for Server-Sent Events
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            response.body.on('data', (chunk) => {
                res.write(chunk);
            });

            response.body.on('end', () => {
                res.end();
            });

            response.body.on('error', (err) => {
                console.error('Stream error:', err);
                res.end();
            });

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

            const data = await response.json();
            
            if (!response.ok) {
                return res.status(response.status).json({ message: data.error?.message || 'API Error' });
            }

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            res.json({ response: text });
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: error.message });
    }
};
