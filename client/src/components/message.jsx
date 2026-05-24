import { useState } from 'react'
import { useAppContext } from '../context/Appcontext'

const Message = ({ message }) => {
  const { user, theme } = useAppContext()
  const [copied, setCopied] = useState(false)
  const [copiedMsg, setCopiedMsg] = useState(false)
  const [reaction, setReaction] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const isUser = message.role === 'user'
  const isDark = theme === 'dark'

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const copyFullMessage = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopiedMsg(true)
      setTimeout(() => setCopiedMsg(false), 2000)
    })
  }

  const handleDownload = async () => {
    if (!message.content) return;
    try {
      const response = await fetch(message.content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trygpt-art-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
      window.open(message.content, '_blank');
    }
  }

  // ===== MARKDOWN PARSER =====

  const renderMarkdown = (text) => {
    if (!text) return null
    const codeBlockRegex = /(```[\s\S]*?```)/g
    const parts = text.split(codeBlockRegex)

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const inner = part.slice(3, -3)
        const newlineIdx = inner.indexOf('\n')
        let language = 'code'
        let code = inner

        if (newlineIdx !== -1) {
          const maybeLang = inner.slice(0, newlineIdx).trim()
          if (maybeLang && maybeLang.length < 30 && !maybeLang.includes(' ')) {
            language = maybeLang
            code = inner.slice(newlineIdx + 1)
          }
        }

        return (
          <div key={i} className="my-3 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center bg-[#181825] px-4 py-2 border border-purple-500/20 border-b-0 rounded-t-xl">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-mono">{language}</span>
              <button
                onClick={() => copyToClipboard(code)}
                className="text-xs px-3 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all cursor-pointer"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <pre className="bg-[#1e1e2e] p-4 overflow-x-auto border border-purple-500/20 border-t-0 rounded-b-xl">
              <code className="text-sm font-mono text-[#cdd6f4] leading-relaxed whitespace-pre">{code}</code>
            </pre>
          </div>
        )
      }

      return <div key={i}>{renderLines(part)}</div>
    })
  }

  const renderLines = (text) => {
    const lines = text.split('\n')

    // Detect tables (lines with | separators)
    let tableBuffer = []
    const elements = []

    const flushTable = () => {
      if (tableBuffer.length >= 2) {
        elements.push(renderTable(tableBuffer, elements.length))
      } else {
        tableBuffer.forEach((line, ti) => {
          elements.push(<p key={`p-${elements.length}-${ti}`} className="leading-7 my-0.5">{applyInline(line)}</p>)
        })
      }
      tableBuffer = []
    }

    lines.forEach((line, i) => {
      const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|')
      const isSeparator = /^\|[\s\-:|]+\|$/.test(line.trim())

      if (isTableRow || isSeparator) {
        tableBuffer.push(line)
        return
      }

      if (tableBuffer.length > 0) {
        flushTable()
      }

      if (line.trim() === '') { elements.push(<div key={i} className="h-2" />); return }
      if (line.startsWith('### ')) { elements.push(<h3 key={i} className="text-base font-bold mt-3 mb-1.5">{applyInline(line.slice(4))}</h3>); return }
      if (line.startsWith('## ')) { elements.push(<h2 key={i} className="text-lg font-bold mt-4 mb-2">{applyInline(line.slice(3))}</h2>); return }
      if (line.startsWith('# ')) { elements.push(<h1 key={i} className="text-xl font-bold mt-4 mb-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">{applyInline(line.slice(2))}</h1>); return }
      if (line.trim() === '---') { elements.push(<hr key={i} className={`my-4 ${isDark ? 'border-white/10' : 'border-gray-300'}`} />); return }

      // Bullet list
      if (line.trimStart().startsWith('- ') || line.trimStart().startsWith('* ')) {
        const indent = line.length - line.trimStart().length
        const content = line.trimStart().slice(2)
        elements.push(
          <div key={i} className="flex gap-2.5 my-1 items-start" style={{ paddingLeft: `${Math.max(indent * 6, 8)}px` }}>
            <span className="text-purple-500 mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span className="leading-7">{applyInline(content)}</span>
          </div>
        )
        return
      }

      // Numbered list
      const numMatch = line.trimStart().match(/^(\d+)\.\s(.+)/)
      if (numMatch) {
        elements.push(
          <div key={i} className="flex gap-2.5 my-1 items-start pl-2">
            <span className="text-purple-500 font-semibold flex-shrink-0 min-w-[1.4rem] text-right">{numMatch[1]}.</span>
            <span className="leading-7">{applyInline(numMatch[2])}</span>
          </div>
        )
        return
      }

      // Blockquote
      if (line.trimStart().startsWith('> ')) {
        const content = line.trimStart().slice(2)
        elements.push(
          <div key={i} className={`pl-4 border-l-3 my-2 py-1 italic ${isDark ? 'border-purple-500/40 text-white/60' : 'border-purple-400 text-gray-600'}`}>
            {applyInline(content)}
          </div>
        )
        return
      }

      elements.push(<p key={i} className="leading-7 my-0.5">{applyInline(line)}</p>)
    })

    if (tableBuffer.length > 0) flushTable()

    return elements
  }

  // Render markdown tables
  const renderTable = (rows, keyBase) => {
    const parseRow = (row) => row.trim().slice(1, -1).split('|').map(c => c.trim())
    const headerCells = parseRow(rows[0])
    // Skip separator row (rows[1])
    const bodyRows = rows.slice(2).map(r => parseRow(r))

    return (
      <div key={`table-${keyBase}`} className="my-4 overflow-x-auto rounded-xl">
        <table className={`w-full text-sm border-collapse ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
          <thead>
            <tr className={isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}>
              {headerCells.map((cell, ci) => (
                <th key={ci} className={`px-4 py-2.5 text-left font-semibold border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  {applyInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri} className={`${ri % 2 === 0 ? '' : isDark ? 'bg-white/[0.02]' : 'bg-gray-50'} hover:${isDark ? 'bg-white/[0.05]' : 'bg-gray-100'} transition-colors`}>
                {row.map((cell, ci) => (
                  <td key={ci} className={`px-4 py-2 border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    {applyInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Parse bold, inline code
  const applyInline = (text) => {
    if (!text) return text
    const tokens = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      const boldIdx = remaining.indexOf('**')
      const codeIdx = remaining.indexOf('`')

      let earliest = -1
      let type = ''

      if (boldIdx !== -1 && (codeIdx === -1 || boldIdx <= codeIdx)) {
        earliest = boldIdx; type = 'bold'
      } else if (codeIdx !== -1) {
        earliest = codeIdx; type = 'code'
      }

      if (earliest === -1) { tokens.push(remaining); break }
      if (earliest > 0) tokens.push(remaining.slice(0, earliest))

      if (type === 'bold') {
        const end = remaining.indexOf('**', earliest + 2)
        if (end === -1) { tokens.push(remaining.slice(earliest)); break }
        tokens.push(<strong key={key++} className="font-bold">{remaining.slice(earliest + 2, end)}</strong>)
        remaining = remaining.slice(end + 2)
      } else if (type === 'code') {
        const end = remaining.indexOf('`', earliest + 1)
        if (end === -1) { tokens.push(remaining.slice(earliest)); break }
        tokens.push(
          <code key={key++} className={`text-[0.85em] px-1.5 py-0.5 rounded-md font-mono ${isDark ? 'bg-purple-500/15 text-purple-300' : 'bg-purple-500/10 text-purple-600'}`}>
            {remaining.slice(earliest + 1, end)}
          </code>
        )
        remaining = remaining.slice(end + 1)
      }
    }

    return tokens
  }

  // ===== IMAGE MESSAGE =====
  if (message.isImage) {
    return (
      <div className={`flex gap-3 mb-6 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
        <Avatar isUser={isUser} user={user} isDark={isDark} />
        <div className={`max-w-sm rounded-2xl overflow-hidden shadow-xl relative group min-h-[250px] min-w-[250px] flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <span className={`text-xs font-medium animate-pulse ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Painting your masterpiece...</span>
            </div>
          )}
          <img
            src={message.content}
            alt="AI Generated"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {message.isPublished && imageLoaded && (
            <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-medium shadow-lg">
              ✓ Published
            </div>
          )}
          {imageLoaded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-white/70 text-[10px]">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="flex gap-1.5">
                <button 
                  onClick={handleDownload}
                  className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer" title="Download">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ===== TEXT MESSAGE =====
  return (
    <div className={`group flex gap-3 mb-5 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar isUser={isUser} user={user} isDark={isDark} />

      <div className="max-w-[75%] min-w-[60px]">
        {/* Bubble */}
        <div className={`${isUser
          ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg shadow-violet-500/15'
          : `${isDark ? 'bg-white/[0.06] border-white/10 text-gray-100' : 'bg-gray-100 border-gray-200 text-gray-800'} rounded-2xl rounded-tl-sm px-4 py-3 border`
        }`}>
          {isUser ? (
            <>
              {message.inlineData && (
                <div className="mb-2">
                  <img src={message.inlineData.data.startsWith('data:') ? message.inlineData.data : `data:${message.inlineData.mimeType};base64,${message.inlineData.data}`} 
                       alt="Uploaded attachment" 
                       className="max-w-full max-h-60 rounded-xl object-contain border border-white/20 shadow-sm" />
                </div>
              )}
              {message.content && <p className="text-sm leading-7">{message.content}</p>}
            </>
          ) : (
            <div className="text-sm markdown-content">
              {renderMarkdown(message.content)}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isUser ? isDark ? 'text-white/25' : 'text-gray-400' : isDark ? 'text-white/20' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Action buttons — visible on hover */}
          {!isUser && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              <button
                onClick={copyFullMessage}
                className={`p-1 rounded-md transition-colors cursor-pointer ${isDark ? 'hover:bg-white/10 text-white/30 hover:text-white/60' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                title="Copy message"
              >
                {copiedMsg ? (
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {/* Reaction buttons */}
              {['👍', '👎'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setReaction(reaction === emoji ? null : emoji)}
                  className={`p-1 rounded-md transition-all cursor-pointer text-xs
                    ${reaction === emoji
                      ? 'bg-violet-500/20 scale-110'
                      : isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                    }`}
                  title={emoji === '👍' ? 'Good response' : 'Bad response'}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable avatar component
const Avatar = ({ isUser, user, isDark }) => (
  <div className="flex-shrink-0 mt-1">
    {isUser ? (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
        {user?.name?.[0] || 'U'}
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-500 to-purple-600 p-[2px] shadow-lg">
        <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-800'}`}>
          <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">T</span>
        </div>
      </div>
    )}
  </div>
)

// AI Thinking Indicator
export const AIThinkingIndicator = () => {
  const { theme } = useAppContext()
  const isDark = theme === 'dark'

  return (
    <div className="flex gap-3 mb-5 animate-fade-in">
      <Avatar isUser={false} isDark={isDark} />
      <div className={`rounded-2xl rounded-tl-sm px-6 py-4 border relative overflow-hidden flex items-center gap-3 ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-gray-100/50 border-gray-200'}`}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        {/* Glowing Orb */}
        <div className="relative flex items-center justify-center w-5 h-5">
          <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
        </div>

        {/* Dynamic Text */}
        <span className={`text-sm font-medium tracking-wide animate-pulse-slow ${isDark ? 'bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
          Analyzing request...
        </span>
      </div>
    </div>
  )
}

// Typing indicator
export const TypingIndicator = () => {
  const { theme } = useAppContext()
  const isDark = theme === 'dark'

  return (
    <div className="flex gap-3 mb-5 animate-fade-in">
      <Avatar isUser={false} isDark={isDark} />
      <div className={`rounded-2xl rounded-tl-sm px-5 py-4 border ${isDark ? 'bg-white/[0.06] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
        <div className="flex gap-1.5 items-center h-4">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      </div>
    </div>
  )
}

// Streaming message - shows live text being generated
export const StreamingMessage = ({ text }) => {
  const { theme } = useAppContext()
  const isDark = theme === 'dark'

  // Simple inline render for streaming (no full markdown parse during streaming for performance)
  const renderStreamingText = (text) => {
    if (!text) return null
    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const inner = part.slice(3, part.endsWith('```') ? -3 : undefined)
        const newlineIdx = inner.indexOf('\n')
        let language = 'code', code = inner
        if (newlineIdx !== -1) {
          const maybeLang = inner.slice(0, newlineIdx).trim()
          if (maybeLang && maybeLang.length < 30 && !maybeLang.includes(' ')) {
            language = maybeLang
            code = inner.slice(newlineIdx + 1)
          }
        }
        return (
          <div key={i} className="my-3 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center bg-[#181825] px-4 py-2 border border-purple-500/20 border-b-0 rounded-t-xl">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-mono">{language}</span>
            </div>
            <pre className="bg-[#1e1e2e] p-4 overflow-x-auto border border-purple-500/20 border-t-0 rounded-b-xl">
              <code className="text-sm font-mono text-[#cdd6f4] leading-relaxed whitespace-pre">{code}</code>
            </pre>
          </div>
        )
      }
      // Render as simple text with line breaks
      return <span key={i} className="whitespace-pre-wrap">{part}</span>
    })
  }

  return (
    <div className="flex gap-3 mb-5 animate-fade-in">
      <Avatar isUser={false} isDark={isDark} />
      <div className={`max-w-[75%] min-w-[60px] rounded-2xl rounded-tl-sm px-4 py-3 border
        ${isDark ? 'bg-white/[0.06] border-white/10 text-gray-100' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>
        <div className="text-sm markdown-content">
          {renderStreamingText(text)}
          <span className="inline-block w-2 h-4 bg-violet-500 rounded-sm animate-pulse ml-0.5 align-text-bottom"></span>
        </div>
      </div>
    </div>
  )
}

export default Message
