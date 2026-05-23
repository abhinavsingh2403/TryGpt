// Gemini AI API Service
// Uses Google's Gemini API for real intelligent responses
// Falls back to local aiEngine if no API key or on error

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_MODEL = 'gemini-2.0-flash'

// System prompt that shapes TryGPT's personality
const SYSTEM_PROMPT = `You are TryGPT, a friendly, helpful, and intelligent AI assistant. 
You should:
- Be conversational, warm, and engaging
- Use markdown formatting (headings, bold, code blocks, lists, tables) to structure responses
- Provide detailed, accurate, and well-organized answers
- Use code blocks with language identifiers when sharing code (e.g. \`\`\`javascript)
- Use emojis sparingly but appropriately to add warmth
- Be concise when the question is simple, detailed when it's complex
- When writing code, include comments and explain key parts
- When explaining concepts, use analogies and examples
- Format lists and comparisons as tables when appropriate
- Always be honest if you don't know something`

/**
 * Get the stored API key from localStorage
 */
export function getApiKey() {
    return localStorage.getItem('trygpt-gemini-key') || ''
}

/**
 * Save the API key to localStorage
 */
export function setApiKey(key) {
    localStorage.setItem('trygpt-gemini-key', key.trim())
}

/**
 * Check if API key is configured
 */
export function hasApiKey() {
    return !!getApiKey()
}

/**
 * Build the conversation history for the API
 */
function buildContents(messages, personality = 'helpful') {
    const personalityMap = {
        helpful: 'Be thorough and helpful.',
        concise: 'Be concise and to-the-point. Give short, direct answers.',
        creative: 'Be creative, use vivid language, metaphors, and storytelling.',
    }

    const contents = []

    // Add system context as first user turn (Gemini doesn't have system role in contents)
    contents.push({
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT + '\n\nPersonality: ' + (personalityMap[personality] || personalityMap.helpful) + '\n\nPlease acknowledge.' }]
    })
    contents.push({
        role: 'model',
        parts: [{ text: 'Understood! I\'m TryGPT, ready to help. What can I do for you?' }]
    })

    // Add conversation history (last 20 messages for context window efficiency)
    const recentMessages = messages.slice(-20)
    for (const msg of recentMessages) {
        if (msg.isImage) continue // Skip image messages
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        })
    }

    return contents
}

/**
 * Call Gemini API (non-streaming)
 */
export async function callGeminiAPI(messages, personality = 'helpful') {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('NO_API_KEY')

    const contents = buildContents(messages, personality)

    const response = await fetch(
        `${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: personality === 'creative' ? 0.9 : 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 4096,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                ],
            }),
        }
    )

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 400 && errorData?.error?.message?.includes('API key')) {
            throw new Error('INVALID_API_KEY')
        }
        if (response.status === 429) {
            throw new Error('RATE_LIMITED')
        }
        throw new Error(`API_ERROR: ${response.status}`)
    }

    const data = await response.json()

    // Extract text from response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('EMPTY_RESPONSE')

    return text
}

/**
 * Call Gemini API with streaming
 * Returns an async generator that yields text chunks
 */
export async function* streamGeminiAPI(messages, personality = 'helpful') {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('NO_API_KEY')

    const contents = buildContents(messages, personality)

    const response = await fetch(
        `${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: personality === 'creative' ? 0.9 : 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 4096,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                ],
            }),
        }
    )

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 400) throw new Error('INVALID_API_KEY')
        if (response.status === 429) throw new Error('RATE_LIMITED')
        throw new Error(`API_ERROR: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE events
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6).trim()
                if (!jsonStr || jsonStr === '[DONE]') continue

                try {
                    const data = JSON.parse(jsonStr)
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
                    if (text) yield text
                } catch {
                    // Skip malformed JSON
                }
            }
        }
    }
}

/**
 * Validate an API key by making a tiny request
 */
export async function validateApiKey(key) {
    try {
        const response = await fetch(
            `${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'Say "ok"' }] }],
                    generationConfig: { maxOutputTokens: 5 },
                }),
            }
        )
        return response.ok
    } catch {
        return false
    }
}
