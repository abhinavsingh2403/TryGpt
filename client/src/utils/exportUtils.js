/**
 * Export a chat conversation as formatted Markdown
 */
export function exportAsMarkdown(chat) {
    const title = chat.name || 'Untitled Chat'
    const date = new Date(chat.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    let md = `# ${title}\n\n`
    md += `> Exported from TryGPT on ${date}\n\n---\n\n`

    for (const msg of chat.messages) {
        const role = msg.role === 'user' ? 'You' : 'TryGPT'
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        md += `### ${role} - ${time}\n\n`

        if (msg.isImage) {
            md += `![AI Generated Image](${msg.content})\n\n`
        } else {
            md += `${msg.content}\n\n`
        }

        md += `---\n\n`
    }

    return md
}

/**
 * Export a chat conversation as plain text
 */
export function exportAsText(chat) {
    const title = chat.name || 'Untitled Chat'
    const date = new Date(chat.createdAt).toLocaleDateString()

    let txt = `${title}\nExported from TryGPT on ${date}\n${'='.repeat(50)}\n\n`

    for (const msg of chat.messages) {
        const role = msg.role === 'user' ? 'You' : 'TryGPT'
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        txt += `[${time}] ${role}:\n`

        if (msg.isImage) {
            txt += `[AI Generated Image]\n${msg.content}\n`
        } else {
            txt += `${msg.content}\n`
        }

        txt += `\n${'-'.repeat(40)}\n\n`
    }

    return txt
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        return true
    }
}
