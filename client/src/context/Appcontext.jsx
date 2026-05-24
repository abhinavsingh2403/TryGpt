import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyChats, dummyUserData } from '../assets/assets'
import { generateAIResponse } from '../utils/aiEngine'
import { callGeminiAPI, streamGeminiAPI, hasApiKey, getApiKey, setApiKey, validateApiKey } from '../utils/geminiApi'
import { api } from '../utils/api'

const AppContext = createContext()

function generateChatTitle(text) {
    if (!text) return 'New Chat'
    const fillers = ['please', 'can you', 'could you', 'i want', 'i need', 'i would like', 'help me', 'a', 'an', 'the', 'me']
    let cleaned = text.trim()
    fillers.forEach(f => {
        cleaned = cleaned.replace(new RegExp(`^${f}\\s+`, 'i'), '')
    })
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    if (cleaned.length > 30) cleaned = cleaned.slice(0, 30).replace(/\s+\S*$/, '') + '…'
    return cleaned || 'New Chat'
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('trygpt-settings')
        if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return {
        fontSize: 'medium',
        streamingEnabled: true,
        personality: 'helpful',
        useGemini: true,  // Use Gemini API when key is available
    }
}

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [isThinking, setIsThinking] = useState(false)
    const [streamingText, setStreamingText] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const [settings, setSettings] = useState(loadSettings)
    const [apiKeyStatus, setApiKeyStatus] = useState('configured') // Always configured since backend handles it
    const [pinnedChats, setPinnedChats] = useState(() => {
        try { return JSON.parse(localStorage.getItem('trygpt-pinned') || '[]') } catch { return [] }
    })
    const selectedChatRef = useRef(null)
    const abortControllerRef = useRef(null)

    useEffect(() => { selectedChatRef.current = selectedChat }, [selectedChat])
    useEffect(() => { localStorage.setItem('trygpt-settings', JSON.stringify(settings)) }, [settings])
    useEffect(() => { localStorage.setItem('trygpt-pinned', JSON.stringify(pinnedChats)) }, [pinnedChats])

    const updateSettings = useCallback((updates) => {
        setSettings(prev => ({ ...prev, ...updates }))
    }, [])

    // API Key management
    const saveApiKey = useCallback(async (key) => {
        if (!key.trim()) {
            setApiKey('')
            setApiKeyStatus('none')
            return false
        }
        setApiKeyStatus('validating')
        const valid = await validateApiKey(key.trim())
        if (valid) {
            setApiKey(key.trim())
            setApiKeyStatus('configured')
            return true
        } else {
            setApiKeyStatus('invalid')
            return false
        }
    }, [])

    const removeApiKey = useCallback(() => {
        setApiKey('')
        setApiKeyStatus('none')
    }, [])

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('trygpt-token')
            if (token) {
                const userData = await api.getMe()
                setUser(userData)
            }
        } catch {
            localStorage.removeItem('trygpt-token')
        }
    }
    useEffect(() => { fetchUser() }, [])

    const fetchuserchats = async () => {
        try {
            const data = await api.getChats()
            setChats(data)
            if (data.length > 0) setSelectedChat(data[0])
        } catch (err) {
            console.error('Failed to load chats:', err)
        }
    }

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        if (user) fetchuserchats()
        else { setChats([]); setSelectedChat(null) }
    }, [user])

    useEffect(() => {
        const sizeMap = { small: '13px', medium: '14px', large: '16px' }
        document.documentElement.style.setProperty('--chat-font-size', sizeMap[settings.fontSize] || '14px')
    }, [settings.fontSize])

    // Stop any ongoing generation
    const stopStreaming = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
        setIsStreaming(false)
        setIsTyping(false)
        setStreamingText('')
    }, [])

    const createNewChat = useCallback(async () => {
        try {
            const newChat = await api.createChat('New Chat')
            setChats(prev => [newChat, ...prev])
            setSelectedChat(newChat)
            setSidebarOpen(false)
            navigate('/')
        } catch (error) {
            console.error('Failed to create chat:', error)
        }
    }, [navigate])

    const deleteChat = useCallback(async (chatId) => {
        try {
            await api.deleteChat(chatId)
            setChats(prev => {
                const remaining = prev.filter(c => c._id !== chatId)
                if (selectedChatRef.current?._id === chatId) setSelectedChat(remaining[0] || null)
                return remaining
            })
            setPinnedChats(prev => prev.filter(id => id !== chatId))
        } catch (error) {
            console.error('Failed to delete chat:', error)
        }
    }, [])

    const togglePinChat = useCallback((chatId) => {
        setPinnedChats(prev => prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId])
    }, [])

    const clearAllChats = useCallback(() => {
        const newChat = {
            _id: 'chat_' + Date.now(),
            userId: user?._id, userName: user?.name,
            name: 'New Chat', messages: [],
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        }
        setChats([newChat]); setSelectedChat(newChat); setPinnedChats([])
    }, [user])

    // ======= CORE: Send Message with Gemini API + Local Fallback =======
    const sendMessage = useCallback(async (text, attachment = null) => {
        if ((!text.trim() && !attachment) || !selectedChatRef.current || isTyping) return

        const currentChat = selectedChatRef.current
        const userMsg = {
            isImage: false, isPublished: false,
            role: 'user', content: text.trim(), timestamp: Date.now(),
        }
        
        if (attachment) {
            userMsg.inlineData = {
                mimeType: attachment.mimeType,
                data: attachment.data // base64 string
            }
        }

        const updatedChat = {
            ...currentChat,
            messages: [...currentChat.messages, userMsg],
            updatedAt: new Date().toISOString(),
        }

        if (currentChat.messages.length === 0 || currentChat.name === 'New Chat') {
            updatedChat.name = generateChatTitle(text.trim())
        }

        setSelectedChat(updatedChat)
        setChats(prev => prev.map(c => c._id === updatedChat._id ? updatedChat : c))
        setIsThinking(true)
        setIsTyping(false)

        // Check if this is an image request (always use local engine for images)
        const lower = text.toLowerCase()
        const isImageRequest = (
            (lower.includes('generate') || lower.includes('create') || lower.includes('make') || lower.includes('draw')) &&
            (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('art'))
        )

        if (isImageRequest) {
            // Save user message to DB first
            if (updatedChat._id) {
                await api.updateChat(updatedChat._id, updatedChat)
            }
            // Use local engine for image generation (Pollinations AI)
            const { response, isImage, delay } = await generateAIResponse(text.trim(), updatedChat.messages)
            setTimeout(async () => {
                const assistantMsg = { isImage, isPublished: isImage, role: 'assistant', content: response, timestamp: Date.now() }
                const chatWithResponse = { ...updatedChat, messages: [...updatedChat.messages, assistantMsg], updatedAt: new Date().toISOString() }
                setSelectedChat(chatWithResponse)
                setChats(prev => prev.map(c => c._id === chatWithResponse._id ? chatWithResponse : c))
                // CRUCIAL: Save generated image to database
                if (chatWithResponse._id) {
                    await api.updateChat(chatWithResponse._id, chatWithResponse)
                }
                setIsThinking(false)
                setIsTyping(false)
            }, delay)
            return
        }

        // Try Gemini API first if enabled
        const useApi = settings.useGemini

        if (useApi) {
            const controller = new AbortController()
            abortControllerRef.current = controller

            try {
                // Save user message to DB first
                if (updatedChat._id) {
                    await api.updateChat(updatedChat._id, updatedChat)
                }

                if (settings.streamingEnabled) {
                    // Streaming mode via Backend
                    setIsStreaming(true)
                    setStreamingText('')
                    let finalResponse = ''

                    await new Promise((resolve, reject) => {
                        api.generateStream(
                            updatedChat.messages,
                            settings.personality,
                            (text) => {
                                if (controller.signal.aborted) reject(new Error('Aborted'))
                                if (text.length > 0) setIsThinking(false) // First chunk arrived, stop thinking
                                setStreamingText(text)
                            },
                            (fullText) => {
                                finalResponse = fullText
                                resolve()
                            },
                            (err) => reject(err)
                        )
                    })

                    if (!controller.signal.aborted) {
                        const assistantMsg = { isImage: false, isPublished: false, role: 'assistant', content: finalResponse, timestamp: Date.now() }
                        const chatWithResponse = { ...updatedChat, messages: [...updatedChat.messages, assistantMsg], updatedAt: new Date().toISOString() }
                        setSelectedChat(chatWithResponse)
                        setChats(prev => prev.map(c => c._id === chatWithResponse._id ? chatWithResponse : c))
                        if (chatWithResponse._id) await api.updateChat(chatWithResponse._id, chatWithResponse)
                    }
                } else {
                    // Non-streaming is currently just streaming fast via backend, we'll use the same for now for simplicity
                    let finalResponse = ''
                    await new Promise((resolve, reject) => {
                        api.generateStream(
                            updatedChat.messages,
                            settings.personality,
                            () => {},
                            (fullText) => { finalResponse = fullText; resolve() },
                            (err) => reject(err)
                        )
                    })
                    if (!controller.signal.aborted) {
                        const assistantMsg = { isImage: false, isPublished: false, role: 'assistant', content: finalResponse, timestamp: Date.now() }
                        const chatWithResponse = { ...updatedChat, messages: [...updatedChat.messages, assistantMsg], updatedAt: new Date().toISOString() }
                        setSelectedChat(chatWithResponse)
                        setChats(prev => prev.map(c => c._id === chatWithResponse._id ? chatWithResponse : c))
                        if (chatWithResponse._id) await api.updateChat(chatWithResponse._id, chatWithResponse)
                    }
                }
            } catch (error) {
                console.warn('Gemini API failed, falling back to local engine:', error.message)
                // Fallback to local engine
                await fallbackToLocal(text.trim(), updatedChat)
            } finally {
                abortControllerRef.current = null
                setIsStreaming(false)
                setStreamingText('')
                setIsTyping(false)
                setIsThinking(false)
            }
        } else {
            // Use local AI engine
            await fallbackToLocal(text.trim(), updatedChat)
        }
    }, [isTyping, settings])

    // Local AI engine fallback with simulated streaming
    const fallbackToLocal = useCallback(async (text, updatedChat) => {
        const { response, isImage, delay } = await generateAIResponse(text, updatedChat.messages)

        return new Promise((resolve) => {
            setTimeout(() => {
                if (settings.streamingEnabled && !isImage) {
                    // Simulate streaming for local responses
                    setIsStreaming(true)
                    setStreamingText('')
                    let index = 0
                    const chunkSize = Math.max(1, Math.floor(response.length / 100))
                    const interval = setInterval(() => {
                        index += chunkSize
                        if (index >= response.length) {
                            setStreamingText(response)
                            clearInterval(interval)
                            setTimeout(async () => {
                                const assistantMsg = { isImage, isPublished: isImage, role: 'assistant', content: response, timestamp: Date.now() }
                                const chatWithResponse = { ...updatedChat, messages: [...updatedChat.messages, assistantMsg], updatedAt: new Date().toISOString() }
                                setSelectedChat(chatWithResponse)
                                setChats(prev => prev.map(c => c._id === chatWithResponse._id ? chatWithResponse : c))
                                if (chatWithResponse._id) {
                                    try { await api.updateChat(chatWithResponse._id, chatWithResponse) } catch (e) { console.error(e) }
                                }
                                setIsStreaming(false)
                                setStreamingText('')
                                setIsTyping(false)
                                resolve()
                            }, 100)
                        } else {
                            setStreamingText(response.slice(0, index))
                        }
                    }, 15)
                } else {
                    const assistantMsg = { isImage, isPublished: isImage, role: 'assistant', content: response, timestamp: Date.now() }
                    const chatWithResponse = { ...updatedChat, messages: [...updatedChat.messages, assistantMsg], updatedAt: new Date().toISOString() }
                    setSelectedChat(chatWithResponse)
                    setChats(prev => prev.map(c => c._id === chatWithResponse._id ? chatWithResponse : c))
                    setIsTyping(false)
                    if (chatWithResponse._id) {
                        api.updateChat(chatWithResponse._id, chatWithResponse).then(resolve).catch(resolve)
                    } else {
                        resolve()
                    }
                }
            }, delay)
        })
    }, [settings.streamingEnabled])

    // Regenerate the last assistant response
    const regenerateResponse = useCallback(async (messageIndex) => {
        if (!selectedChatRef.current || isTyping) return
        const currentChat = selectedChatRef.current
        const userMsg = currentChat.messages[messageIndex - 1]
        if (!userMsg || userMsg.role !== 'user') return

        const truncatedMessages = currentChat.messages.slice(0, messageIndex)
        const truncatedChat = { ...currentChat, messages: truncatedMessages, updatedAt: new Date().toISOString() }
        setSelectedChat(truncatedChat)
        setChats(prev => prev.map(c => c._id === truncatedChat._id ? truncatedChat : c))

        // Re-send the user message
        setIsTyping(true)

        const useApi = settings.useGemini
        if (useApi) {
            try {
                // Save user message to DB first
                if (truncatedChat._id) {
                    await api.updateChat(truncatedChat._id, truncatedChat)
                }

                setIsStreaming(true)
                setStreamingText('')
                let finalResponse = ''

                await new Promise((resolve, reject) => {
                    api.generateStream(
                        truncatedChat.messages,
                        settings.personality,
                        (text) => {
                            if (abortControllerRef.current?.signal.aborted) reject(new Error('Aborted'))
                            setStreamingText(text)
                        },
                        (fullText) => {
                            finalResponse = fullText
                            resolve()
                        },
                        (err) => reject(err)
                    )
                })

                if (!abortControllerRef.current?.signal.aborted) {
                    const assistantMsg = { isImage: false, isPublished: false, role: 'assistant', content: finalResponse, timestamp: Date.now() }
                    const chatWithResponse = { ...truncatedChat, messages: [...truncatedChat.messages, assistantMsg], updatedAt: new Date().toISOString() }
                    setSelectedChat(chatWithResponse)
                    setChats(prev => prev.map(c => c._id === chatWithResponse._id ? chatWithResponse : c))
                    if (chatWithResponse._id) await api.updateChat(chatWithResponse._id, chatWithResponse)
                }
            } catch {
                await fallbackToLocal(userMsg.content, truncatedChat)
            } finally {
                setIsStreaming(false)
                setStreamingText('')
                setIsTyping(false)
            }
        } else {
            await fallbackToLocal(userMsg.content, truncatedChat)
        }
    }, [isTyping, settings, fallbackToLocal])

    const editMessage = useCallback((messageIndex, newText) => {
        if (!selectedChatRef.current || isTyping) return
        const currentChat = selectedChatRef.current
        const truncatedMessages = currentChat.messages.slice(0, messageIndex)
        const editedChat = { ...currentChat, messages: truncatedMessages, updatedAt: new Date().toISOString() }
        setSelectedChat(editedChat)
        setChats(prev => prev.map(c => c._id === editedChat._id ? editedChat : c))
        setTimeout(() => sendMessage(newText), 100)
    }, [isTyping, sendMessage])

    const logout = useCallback(() => { localStorage.removeItem('trygpt-token'); setUser(null); navigate('/login') }, [navigate])
    const login = useCallback((userData) => { setUser(userData); navigate('/') }, [navigate])

    const value = {
        navigate, user, setUser, chats, setChats,
        selectedChat, setSelectedChat, theme, setTheme,
        sidebarOpen, setSidebarOpen, isTyping, isThinking, isStreaming, streamingText,
        createNewChat, deleteChat, sendMessage, editMessage,
        regenerateResponse, stopStreaming, logout, login,
        settings, updateSettings, pinnedChats, togglePinChat, clearAllChats,
        apiKeyStatus, saveApiKey, removeApiKey,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}