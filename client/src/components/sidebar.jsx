import { useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'


const Sidebar = () => {
  const navigate = useNavigate()
  const {
    chats, selectedChat, setSelectedChat, theme, setTheme, user,
    sidebarOpen, setSidebarOpen, createNewChat, deleteChat, logout, setChats,
    settings, updateSettings,
  } = useAppContext()
  const [search, setSearch] = useState("")
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const isDark = theme === 'dark'

  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    setSidebarOpen(false)
    navigate('/')
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    if (confirmDeleteId === chatId) {
      deleteChat(chatId)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(chatId)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  const startRename = (e, chat) => {
    e.stopPropagation()
    setRenamingId(chat._id)
    setRenameValue(chat.messages.length > 0 ? chat.messages[0].content.slice(0, 40) : chat.name)
  }

  const finishRename = (chatId) => {
    if (renameValue.trim()) {
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, name: renameValue.trim() } : c))
      if (selectedChat?._id === chatId) {
        setSelectedChat(prev => ({ ...prev, name: renameValue.trim() }))
      }
    }
    setRenamingId(null)
  }

  const filteredChats = chats.filter((chat) =>
    chat.messages[0]
      ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
      : chat.name.toLowerCase().includes(search.toLowerCase())
  )

  // Collapsed sidebar (desktop only)
  if (collapsed) {
    return (
      <div className={`flex flex-col h-screen w-16 items-center py-4 border-r flex-shrink-0 max-md:hidden
        ${isDark ? 'bg-[#0d0d12] border-white/10' : 'bg-white border-gray-200'}`}>
        {/* Expand button */}
        <button onClick={() => setCollapsed(false)} className={`p-2 rounded-lg mb-4 transition-colors cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`} title="Expand sidebar">
          <svg className={`w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <div className="relative w-9 h-9 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-purple-600 rounded-full shadow-lg">
            <div className={`absolute inset-[2px] rounded-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-800'}`}>
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">T</span>
            </div>
          </div>
        </div>

        {/* New chat */}
        <button onClick={createNewChat} className="w-9 h-9 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all mb-4" title="New Chat">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Chat icons */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center gap-1 mt-2">
          {chats.slice(0, 10).map((chat) => {
            const isActive = selectedChat?._id === chat._id
            return (
              <button
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer
                  ${isActive
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : isDark
                      ? 'hover:bg-white/[0.06] text-white/40 border border-transparent'
                      : 'hover:bg-gray-100 text-gray-500 border border-transparent'
                  }`}
                title={chat.messages.length > 0 ? chat.messages[0].content.slice(0, 40) : chat.name}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            )
          })}
        </div>

        {/* Bottom icons */}
        <div className="flex flex-col gap-2 mt-auto">
          <button onClick={() => { navigate('/community'); setSidebarOpen(false) }} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-100'}`} title="Community">🎨</button>
          <button onClick={() => { navigate('/credits'); setSidebarOpen(false) }} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-100'}`} title="Credits">💎</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-100'}`} title="Toggle theme">{isDark ? '☀️' : '🌙'}</button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md mx-auto cursor-pointer" title={user?.name}>
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`flex flex-col h-screen w-[280px] p-4 border-r transition-all duration-300 flex-shrink-0
        ${isDark ? 'bg-[#0d0d12] border-white/10' : 'bg-white border-gray-200'}
        max-md:fixed max-md:left-0 max-md:z-50
        ${sidebarOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
      `}>
        {/* Logo row */}
        <div className="flex items-center gap-3 mb-5 px-2 pt-1">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-purple-600 rounded-full shadow-lg">
              <div className={`absolute inset-[2px] rounded-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-800'}`}>
                <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">T</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black bg-gradient-to-r from-violet-500 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight tracking-tight">TryGPT</h1>
            <p className={`text-[10px] font-medium ${isDark ? 'text-purple-400/70' : 'text-gray-400'}`}>AI Assistant</p>
          </div>
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(true)}
            className={`hidden md:block p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            title="Collapse sidebar"
          >
            <svg className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <button
          onClick={createNewChat}
          className="flex justify-center items-center w-full py-2.5 text-white bg-gradient-to-r from-violet-600 to-blue-600 text-sm rounded-xl cursor-pointer hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] transition-all duration-300 font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        {/* Search */}
        <div className={`flex items-center gap-2 p-2.5 mt-4 rounded-xl border transition-all duration-300
          ${isDark
            ? 'bg-white/[0.04] border-white/10 focus-within:border-violet-500/40'
            : 'bg-gray-50 border-gray-200 focus-within:border-violet-500'
          }`}>
          <svg className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-white/30' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search conversations"
            className={`text-xs outline-none bg-transparent flex-1 ${isDark ? 'text-white placeholder:text-white/25' : 'text-gray-800 placeholder:text-gray-400'}`}
          />
          {search && (
            <button onClick={() => setSearch('')} className={`text-xs cursor-pointer ${isDark ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'}`}>✕</button>
          )}
        </div>

        {/* Chat count */}
        {chats.length > 0 && (
          <div className="flex justify-between items-center mt-4 mb-1 px-2">
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
              Recent
            </p>
            <span className={`text-[10px] ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{filteredChats.length}</span>
          </div>
        )}

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto mt-1 min-h-0 space-y-0.5">
          {filteredChats.map((chat) => {
            const isActive = selectedChat?._id === chat._id
            const chatTitle = chat.messages.length > 0 ? chat.messages[0].content.slice(0, 28) : chat.name
            const isRenaming = renamingId === chat._id
            const isConfirmingDelete = confirmDeleteId === chat._id

            return (
              <div
                key={chat._id}
                onClick={() => !isRenaming && handleSelectChat(chat)}
                className={`group p-2.5 px-3 rounded-xl cursor-pointer flex justify-between items-center transition-all duration-200
                  ${isActive
                    ? isDark ? 'bg-violet-500/15 border border-violet-500/25' : 'bg-violet-50 border border-violet-300'
                    : isDark ? 'hover:bg-white/[0.04] border border-transparent' : 'hover:bg-gray-50 border border-transparent'
                  }`}
              >
                <div className="flex-1 min-w-0">
                  {isRenaming ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => finishRename(chat._id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') finishRename(chat._id); if (e.key === 'Escape') setRenamingId(null) }}
                      className={`text-sm font-medium w-full outline-none rounded px-1 ${isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-800'}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <p className={`truncate text-sm font-medium ${
                        isActive ? isDark ? 'text-violet-300' : 'text-violet-700' : isDark ? 'text-white/70' : 'text-gray-700'
                      }`}>{chatTitle}</p>
                      <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                        {moment(chat.updatedAt).fromNow()} · {chat.messages.length} msgs
                      </p>
                    </>
                  )}
                </div>

                {/* Actions */}
                {!isRenaming && (
                  <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-all">
                    {/* Rename */}
                    <button
                      onClick={(e) => startRename(e, chat)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                      title="Rename"
                    >
                      <svg className={`w-3 h-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Delete */}
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isConfirmingDelete
                          ? 'bg-red-500/20 text-red-400'
                          : isDark ? 'hover:bg-red-500/20 text-white/40' : 'hover:bg-red-50 text-gray-400'
                      }`}
                      title={isConfirmingDelete ? 'Click again to confirm' : 'Delete'}
                    >
                      <svg className={`w-3 h-3 ${isConfirmingDelete ? 'text-red-400' : isDark ? 'text-white/40' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Empty state */}
          {filteredChats.length === 0 && chats.length > 0 && (
            <div className={`text-center py-8 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
              <p className="text-sm">No results found</p>
              <button onClick={() => setSearch('')} className="text-xs text-violet-500 mt-1 cursor-pointer hover:underline">Clear search</button>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className={`flex flex-col gap-1.5 flex-shrink-0 mt-auto pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <button onClick={() => { navigate('/community'); setSidebarOpen(false) }}
            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all text-left group w-full ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'}`}>
            <span className="text-base">🎨</span>
            <p className={`text-sm font-medium ${isDark ? 'text-white/50 group-hover:text-white/80' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>Community</p>
          </button>

          <button onClick={() => { navigate('/credits'); setSidebarOpen(false) }}
            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all text-left group w-full ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'}`}>
            <span className="text-base">💎</span>
            <p className={`text-sm font-medium ${isDark ? 'text-white/50 group-hover:text-white/80' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>
              Credits: <span className="gradient-text font-bold">{user?.credits}</span>
            </p>
          </button>

          {/* Settings */}
          <button onClick={() => setShowSettings(true)}
            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all text-left group w-full ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'}`}>
            <span className="text-base">⚙️</span>
            <div className="flex-1 flex items-center justify-between">
              <p className={`text-sm font-medium ${isDark ? 'text-white/50 group-hover:text-white/80' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>Settings</p>
            </div>
          </button>

          {/* Theme toggle */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">{isDark ? '🌙' : '☀️'}</span>
              <p className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-gray-600'}`}>{isDark ? 'Dark' : 'Light'} Mode</p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className="sr-only peer" checked={theme === 'dark'} readOnly />
              <div className={`w-10 h-5 rounded-full transition-all ${isDark ? 'bg-gradient-to-r from-violet-600 to-blue-600' : 'bg-gray-300'}`}></div>
              <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm"></span>
            </label>
          </div>

          {/* User profile */}
          {user && (
            <div className={`flex items-center gap-3 p-2.5 mt-1 rounded-xl ${isDark ? 'bg-white/[0.03] border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                {user.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                <p className={`text-[10px] truncate ${isDark ? 'text-white/25' : 'text-gray-400'}`}>{user.email}</p>
              </div>
              <button onClick={logout}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'}`} title="Logout">
                <svg className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* ===== Settings Modal ===== */}
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border p-6 max-h-[85vh] overflow-y-auto
              ${isDark ? 'bg-[#16161d] border-white/10' : 'bg-white border-gray-200'}`}
              onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>⚙️ Settings</h2>
                <button onClick={() => setShowSettings(false)}
                  className={`p-1.5 rounded-lg cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <svg className={`w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>


              {/* Personality */}
              <div className="mb-5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  AI Personality
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[{ key: 'helpful', label: '🤝 Helpful', desc: 'Thorough' }, { key: 'concise', label: '⚡ Concise', desc: 'Brief' }, { key: 'creative', label: '🎨 Creative', desc: 'Vivid' }].map(p => (
                    <button key={p.key}
                      onClick={() => updateSettings({ personality: p.key })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer
                        ${settings.personality === p.key
                          ? isDark ? 'border-violet-500/40 bg-violet-500/10' : 'border-violet-500 bg-violet-50'
                          : isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                      <div className="text-sm">{p.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 mb-5">
                {/* Streaming */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-700'}`}>Streaming</p>
                    <p className={`text-[10px] ${isDark ? 'text-white/25' : 'text-gray-400'}`}>See responses as they generate</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.streamingEnabled}
                      onChange={() => updateSettings({ streamingEnabled: !settings.streamingEnabled })} />
                    <div className={`w-10 h-5 rounded-full transition-all ${settings.streamingEnabled ? 'bg-gradient-to-r from-violet-600 to-blue-600' : isDark ? 'bg-white/15' : 'bg-gray-300'}`}></div>
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm"></span>
                  </label>
                </div>

                {/* Use Gemini */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-700'}`}>Use Gemini AI</p>
                    <p className={`text-[10px] ${isDark ? 'text-white/25' : 'text-gray-400'}`}>When disabled, uses built-in offline responses</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.useGemini}
                      onChange={() => updateSettings({ useGemini: !settings.useGemini })} />
                    <div className={`w-10 h-5 rounded-full transition-all ${settings.useGemini ? 'bg-gradient-to-r from-violet-600 to-blue-600' : isDark ? 'bg-white/15' : 'bg-gray-300'}`}></div>
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm"></span>
                  </label>
                </div>
              </div>

              {/* Font Size */}
              <div className="mb-2">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  Text Size
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[{ key: 'small', label: 'Small' }, { key: 'medium', label: 'Medium' }, { key: 'large', label: 'Large' }].map(s => (
                    <button key={s.key}
                      onClick={() => updateSettings({ fontSize: s.key })}
                      className={`p-2 rounded-xl border text-sm text-center transition-all cursor-pointer
                        ${settings.fontSize === s.key
                          ? isDark ? 'border-violet-500/40 bg-violet-500/10' : 'border-violet-500 bg-violet-50'
                          : isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar
