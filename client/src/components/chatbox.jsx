import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../context/Appcontext'
import { api } from '../utils/api'
import Message, { TypingIndicator, StreamingMessage, AIThinkingIndicator } from './message'

const Chatbox = () => {
  const {
    selectedChat, sendMessage, isTyping, isThinking, isStreaming, streamingText, stopStreaming,
    user, setSidebarOpen, createNewChat, theme, apiKeyStatus
  } = useAppContext()
  const [input, setInput] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [isExtractingPdf, setIsExtractingPdf] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChat?.messages?.length, isTyping, streamingText])

  useEffect(() => { inputRef.current?.focus() }, [selectedChat?._id])

  const onSubmit = () => {
    if (!input.trim() && !attachment) return

    if (attachment?.type === 'pdf') {
      const promptText = input.trim() ? input : 'Please analyze this document:'
      const textToSend = `${promptText}\n\n[Attached Document: ${attachment.name}]`
      sendMessage(textToSend, attachment)
    } else {
      sendMessage(input, attachment)
    }
    
    setInput('')
    setAttachment(null)
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type === 'application/pdf') {
      setIsExtractingPdf(true)
      try {
        const result = await api.extractPdf(file)
        setAttachment({
          type: 'pdf',
          name: file.name,
          documents: result.documents,
          pageCount: result.pageCount,
        })
      } catch (err) {
        alert("Failed to read PDF: " + err.message)
      } finally {
        setIsExtractingPdf(false)
      }
    } else {
      const reader = new FileReader()
      reader.onload = (evt) => {
        setAttachment({
          type: 'image',
          mimeType: file.type,
          data: evt.target.result // contains base64
        })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = null // reset input
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Voice Mode. Please use Chrome or Edge.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    
    let currentFinal = inputRef.current ? inputRef.current.value : input
    
    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      if (final) currentFinal += (currentFinal ? ' ' : '') + final
      setInput((currentFinal + ' ' + interim).trim())
      
      // Auto resize textarea
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px'
      }
    }
    
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const hasMessages = selectedChat?.messages?.length > 0

  const prompts = [
    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>, title: 'Write a story', desc: 'about a futuristic city powered by AI', color: 'from-violet-500/10 to-blue-500/10', borderColor: 'border-violet-500/20 hover:border-violet-500/40' },
    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, title: 'Generate an image', desc: 'of a sunset over snow-capped mountains', color: 'from-orange-500/10 to-rose-500/10', borderColor: 'border-orange-500/20 hover:border-orange-500/40' },
    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, title: 'Write code for', desc: 'a REST API with Express and MongoDB', color: 'from-emerald-500/10 to-teal-500/10', borderColor: 'border-emerald-500/20 hover:border-emerald-500/40' },
    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, title: 'Explain simply', desc: 'how quantum computing works', color: 'from-cyan-500/10 to-sky-500/10', borderColor: 'border-cyan-500/20 hover:border-cyan-500/40' },
    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>, title: 'Top programming', desc: 'languages to learn in 2025', color: 'from-amber-500/10 to-yellow-500/10', borderColor: 'border-amber-500/20 hover:border-amber-500/40' },
    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Write an email', desc: 'for a job application follow-up', color: 'from-pink-500/10 to-fuchsia-500/10', borderColor: 'border-pink-500/20 hover:border-pink-500/40' },
  ]

  const imageCount = selectedChat?.messages?.filter(m => m.isImage)?.length || 0
  const isGeminiActive = apiKeyStatus === 'configured'

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 border-b flex-shrink-0 backdrop-blur-md
        ${isDark ? 'border-white/10 bg-[#111118]/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(prev => !prev)}
            className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedChat?.name || 'New Chat'}
            </h2>
            <p className={`text-[11px] ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
              {hasMessages ? `${selectedChat.messages.length} messages${imageCount > 0 ? ` · ${imageCount} images` : ''}` : 'Start a conversation'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button onClick={createNewChat}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-gray-100 text-gray-400'}`}
              title="New Chat">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          {/* AI Status indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium
            ${isGeminiActive
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isGeminiActive ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></div>
            {isGeminiActive ? 'Gemini AI' : 'Offline Mode'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-20 xl:px-32 py-6">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow"></div>
              <div className={`absolute inset-[3px] rounded-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-800'}`}>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">T</span>
              </div>
            </div>

            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Hello, <span className="gradient-text">{user?.name || 'there'}</span> 👋
            </h1>
            <p className={`text-center mb-3 max-w-lg ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              I'm TryGPT — your AI assistant for writing, creating images, coding, and much more.
            </p>

            {/* API status banner */}
            {!isGeminiActive && (
              <div className={`mb-6 px-4 py-2 rounded-xl text-xs flex items-center gap-2 max-w-md ${isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/15' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                <span>⚡</span>
                <span>Add a <strong>Gemini API key</strong> in Settings for real AI responses. Currently using built-in offline mode.</span>
              </div>
            )}

            {/* Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl stagger-children">
              {prompts.map((p, i) => (
                <button key={i}
                  onClick={() => { setInput(`${p.title} ${p.desc}`); inputRef.current?.focus() }}
                  className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br ${p.color} border ${p.borderColor}
                    hover:scale-[1.02] hover:shadow-lg transition-all duration-300 text-left group cursor-pointer`}>
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
                    {p.icon}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{p.title}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick tips */}
            <div className={`mt-8 flex flex-wrap gap-2 justify-center ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
              <span className="text-xs">💡 Try:</span>
              {['hello', 'what can you do?', 'explain AI', '25 * 4'].map((tip, i) => (
                <button key={i} onClick={() => { setInput(tip); inputRef.current?.focus() }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer
                    ${isDark ? 'border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300' : 'border-gray-200 hover:border-violet-500/40 hover:bg-violet-50 hover:text-violet-600'}`}>
                  {tip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {selectedChat.messages.map((msg, i) => (
              <Message key={`${selectedChat._id}-${i}`} message={msg} messageIndex={i} />
            ))}
            {/* Streaming response */}
            {isStreaming && streamingText && (
              <StreamingMessage text={streamingText} />
            )}
            {/* Typing dots (when waiting for API, before stream starts) */}
            {isThinking && <AIThinkingIndicator />}
            {isTyping && !isThinking && !isStreaming && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {!hasMessages && <div ref={messagesEndRef} />}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 md:px-8 lg:px-20 xl:px-32 pb-4 pt-2">
        <div className="max-w-3xl mx-auto">
          <div className={`flex flex-col p-2 rounded-2xl border shadow-lg transition-all duration-300
            ${isDark
              ? 'border-white/15 bg-white/[0.04] shadow-none focus-within:border-violet-500/50'
              : 'border-gray-300 bg-white focus-within:border-violet-50 focus-within:shadow-violet-500/10 focus-within:shadow-xl'
            }`}>
            
            {/* Attachment Preview */}
            {isExtractingPdf && (
              <div className="relative inline-flex items-center gap-2 ml-2 mt-1 mb-2 px-3 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-500/20 text-sm font-medium">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                Extracting PDF...
              </div>
            )}
            {attachment && (
              <div className="relative inline-flex ml-2 mt-1 mb-2">
                {attachment.type === 'pdf' ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[150px]">{attachment.name}</span>
                      <span className="text-xs opacity-70">{attachment.pageCount} pages</span>
                    </div>
                  </div>
                ) : (
                  <img src={attachment.data} alt="attachment" className="h-16 w-16 object-cover rounded-lg border border-gray-300 shadow-sm" />
                )}
                <button onClick={() => setAttachment(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer shadow-md">✕</button>
              </div>
            )}

            <div className="flex items-end gap-2 px-1">
              {/* Paperclip Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full transition-colors cursor-pointer ${isDark ? 'text-white/40 hover:bg-white/10 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                title="Attach Document or Image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,application/pdf" className="hidden" />

              {/* Microphone Button */}
              <button 
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center relative
                  ${isListening 
                    ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                    : isDark ? 'text-white/40 hover:bg-white/10 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                title="Voice Mode"
              >
                {isListening && <span className="absolute w-full h-full rounded-full border-2 border-red-500/50 animate-ping"></span>}
                <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
              </button>

              <textarea ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
              placeholder="Message TryGPT..." rows={1}
              className={`flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed py-1
                ${isDark ? 'text-white placeholder:text-white/25' : 'text-gray-800 placeholder:text-gray-400'}`}
              style={{ minHeight: '24px', maxHeight: '150px' }} />

            {isTyping ? (
              <button onClick={stopStreaming}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg shadow-red-500/25 cursor-pointer"
                title="Stop generating">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              </button>
            ) : (
              <button onClick={onSubmit} disabled={!input.trim() && !attachment}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 mb-0.5
                  ${(input.trim() || attachment)
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 cursor-pointer'
                    : `${isDark ? 'bg-white/10' : 'bg-gray-200'} cursor-not-allowed`}`}>
                <svg className={`w-4 h-4 ${(input.trim() || attachment) ? 'text-white' : isDark ? 'text-white/30' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            )}
            </div>
          </div>

          <p className={`text-[10px] text-center mt-2 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
            {isGeminiActive ? 'Powered by Gemini AI' : 'Offline mode — add API key in Settings for real AI'} · TryGPT can make mistakes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Chatbox
