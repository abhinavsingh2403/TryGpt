// Simple API utility to handle fetches with JWT tokens

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('trygpt-token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const readJson = async (res) => {
    const text = await res.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

const createApiError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    if (status === 429 || /quota|rate limit|too many requests|free tier/i.test(message)) {
        error.code = 'RATE_LIMIT';
    } else if (/missing gemini api key|api key/i.test(message)) {
        error.code = 'MISSING_API_KEY';
    } else {
        error.code = 'API_ERROR';
    }
    return error;
};

export const api = {
    // Auth
    register: async (payload) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },

    login: async (payload) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    getMe: async () => {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
        return data;
    },

    // Chats
    getChats: async () => {
        const res = await fetch(`${API_URL}/chats`, { headers: getHeaders() });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to fetch chats');
        return data;
    },

    createChat: async (name) => {
        const res = await fetch(`${API_URL}/chats`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name }),
        });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to create chat');
        return data;
    },

    updateChat: async (id, payload) => {
        const res = await fetch(`${API_URL}/chats/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const responseData = await readJson(res);
        if (!res.ok) throw new Error(responseData.message || 'Failed to update chat');
        return responseData;
    },

    deleteChat: async (id) => {
        const res = await fetch(`${API_URL}/chats/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to delete chat');
        return data;
    },

    // PDF Extraction
    extractPdf: async (file) => {
        const formData = new FormData()
        formData.append('pdf', file)
        const response = await fetch(`${API_URL}/pdf/extract`, {
            method: 'POST',
            headers: {
                ...(localStorage.getItem('trygpt-token') ? { Authorization: `Bearer ${localStorage.getItem('trygpt-token')}` } : {}),
            },
            body: formData,
        })
        const data = await readJson(response)
        if (!response.ok) throw new Error(data.message || 'Failed to extract PDF')
        return data
    },

    // AI Stream
    generateStream: async (chatId, messages, personality, onChunk, onDone, onError, signal) => {
        try {
            const res = await fetch(`${API_URL}/ai/generate`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ chatId, messages, personality, streaming: true }),
                signal,
            });

            if (!res.ok) {
                const error = await readJson(res);
                throw createApiError(error.message || 'AI Generation failed', res.status);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the last incomplete line

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (!dataStr || dataStr === '[DONE]') continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                fullText += data.candidates[0].content.parts[0].text;
                                onChunk(fullText);
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE chunk:', e);
                        }
                    }
                }
            }
            onDone(fullText.trim() || fullText);
        } catch (error) {
            onError(error);
        }
    }
};
