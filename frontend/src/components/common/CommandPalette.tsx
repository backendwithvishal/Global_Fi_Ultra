import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { toggleTheme, logout } = useApp()
  const listRef = useRef<HTMLDivElement>(null)

  const items = [
    { id: 'dash', name: 'Go to Dashboard', category: 'Navigation', shortcut: 'G D', action: () => navigate('/') },
    { id: 'markets', name: 'Go to Markets', category: 'Navigation', shortcut: 'G M', action: () => navigate('/markets') },
    { id: 'watch', name: 'Go to Watchlists', category: 'Navigation', shortcut: 'G W', action: () => navigate('/watchlists') },
    { id: 'alerts', name: 'Go to Alerts', category: 'Navigation', shortcut: 'G A', action: () => navigate('/alerts') },
    { id: 'ai', name: 'Go to AI Insights', category: 'Navigation', shortcut: 'G I', action: () => navigate('/ai') },
    { id: 'teams', name: 'Go to Organization Settings', category: 'Workspace', shortcut: 'G T', action: () => navigate('/settings/teams') },
    { id: 'billing', name: 'Go to Billing & Subscription', category: 'Workspace', shortcut: 'G B', action: () => navigate('/settings/billing') },
    { id: 'dev', name: 'Go to Developer API Keys', category: 'Workspace', shortcut: 'G K', action: () => navigate('/settings/developer') },
    { id: 'theme', name: 'Toggle Light/Dark Theme', category: 'Settings', shortcut: 'T T', action: () => toggleTheme() },
    { id: 'logout', name: 'Logout / Sign Out', category: 'System', shortcut: 'L O', action: () => logout() },
  ]

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setSearch('')
        setSelectedIndex(0)
      }

      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action()
          setIsOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-[var(--bg-overlay)] backdrop-blur-[6px]">
      <div 
        className="w-full max-w-[550px] overflow-hidden rounded-xl border border-[var(--border-3)] bg-[var(--bg-2)] shadow-[var(--shadow-overlay)] animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-2)]">
          <svg className="w-5 h-5 text-[var(--text-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="w-full bg-transparent text-[var(--text-1)] text-[14px] placeholder-[var(--text-3)] outline-none border-none"
            placeholder="Type a command or search..."
            autoFocus
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-4)] border border-[var(--border-2)] text-[10px] text-[var(--text-3)] font-mono uppercase">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2 scrollbar-none" ref={listRef}>
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--text-3)]">No commands matching search query.</div>
          ) : (
            filteredItems.map((item, index) => {
              const isActive = index === selectedIndex
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-[13px] transition-colors ${
                    isActive ? 'bg-[var(--bg-4)] text-[var(--text-1)] border-l-2 border-[var(--accent)]' : 'text-[var(--text-2)]'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    item.action()
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-3)] tracking-wider w-[80px] truncate">{item.category}</span>
                    <span className={isActive ? 'font-medium' : ''}>{item.name}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-[10px] text-[var(--text-3)] font-mono">{item.shortcut}</span>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-2)] bg-[var(--bg-1)] text-[11px] text-[var(--text-3)]">
          <div className="flex items-center gap-3">
            <span>Use <span className="font-mono">↑↓</span> to navigate</span>
            <span><span className="font-mono">↵</span> to select</span>
          </div>
          <span>Press <span className="font-mono">Ctrl+K</span> to close</span>
        </div>
      </div>
    </div>
  )
}
