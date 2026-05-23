// Simple API utility to handle fetches with JWT tokens

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('trygpt-token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const api = {
    // Auth
    register: async (data) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
        return res.json();
    },

    login: async (data) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
        return res.json();
    },

    getMe: async () => {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    },

    // Chats
    getChats: async () => {
        const res = await fetch(`${API_URL}/chats`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch chats');
        return res.json();
    },

    createChat: async (name) => {
        const res = await fetch(`${API_URL}/chats`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Failed to create chat');
        return res.json();
    },

    updateChat: async (id, data) => {
        const res = await fetch(`${API_URL}/chats/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update chat');
        return res.json();
    },

    deleteChat: async (id) => {
        const res = await fetch(`${API_URL}/chats/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete chat');
        return res.json();
    },

    // AI Stream
    generateStream: async (messages, personality, onChunk, onDone, onError) => {
        try {
            const res = await fetch(`${API_URL}/ai/generate`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ messages, personality, streaming: true }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'AI Generation failed');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                onChunk(fullText);
            }
            onDone(fullText);
        } catch (error) {
            onError(error);
        }
    }
};
