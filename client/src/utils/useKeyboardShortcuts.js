import { useEffect } from 'react'

/**
 * Global keyboard shortcuts hook
 * @param {Object} handlers - Map of shortcut actions to handler functions
 * @param {Function} handlers.newChat - Ctrl+N
 * @param {Function} handlers.focusInput - Ctrl+/
 * @param {Function} handlers.toggleSidebar - Ctrl+B
 * @param {Function} handlers.toggleTheme - Ctrl+Shift+T
 * @param {Function} handlers.closeSidebar - Escape
 */
export function useKeyboardShortcuts(handlers) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isCtrl = e.ctrlKey || e.metaKey
            const isShift = e.shiftKey

            if (e.key === 'Escape' && handlers.closeSidebar) {
                handlers.closeSidebar()
                return
            }

            if (isCtrl && e.key === 'n') {
                e.preventDefault()
                handlers.newChat?.()
                return
            }

            if (isCtrl && e.key === '/') {
                e.preventDefault()
                handlers.focusInput?.()
                return
            }

            if (isCtrl && e.key === 'b') {
                e.preventDefault()
                handlers.toggleSidebar?.()
                return
            }

            if (isCtrl && isShift && (e.key === 'T' || e.key === 't')) {
                e.preventDefault()
                handlers.toggleTheme?.()
                return
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handlers])
}

// Shortcut definitions for display in settings/UI
export const SHORTCUT_LIST = [
    { keys: ['Ctrl', 'N'], action: 'New Chat' },
    { keys: ['Ctrl', '/'], action: 'Focus Input' },
    { keys: ['Ctrl', 'B'], action: 'Toggle Sidebar' },
    { keys: ['Ctrl', 'Shift', 'T'], action: 'Toggle Theme' },
    { keys: ['Esc'], action: 'Close Sidebar' },
]
