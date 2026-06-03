import React from 'react'
import { Search, X } from 'lucide-react'

interface UserSearchProps { value: string; onChange: (v: string) => void }

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-3)]" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by name or email…"
        className="w-full h-9 pl-9 pr-8 bg-slate-50 dark:bg-[var(--bg-input)] border border-slate-200 dark:border-[var(--border)] hover:border-slate-300 dark:hover:border-[var(--border-md)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-lg text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] transition-all duration-150"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
