import React from 'react'
import { Moon, Sun, Bell, Wifi, WifiOff, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  connected: boolean
  warningCount?: number
}

export function Header({ connected, warningCount = 0 }: HeaderProps) {
  const { isDark, toggleTheme, currentUser, logout } = useApp()
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center justify-between h-14 px-5 border-b border-border/60 bg-card/80 backdrop-blur-xl shrink-0 w-full"
      role="banner"
    >
      {/* Left — connection status */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/system')}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all',
            connected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15'
              : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15'
          )}
          aria-label={connected ? 'WebSocket connected — view system' : 'WebSocket disconnected'}
        >
          {connected ? (
            <Wifi className="w-3 h-3" aria-hidden="true" />
          ) : (
            <WifiOff className="w-3 h-3" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{connected ? 'Live' : 'Offline'}</span>
          {connected && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label={`Notifications${warningCount > 0 ? `, ${warningCount} new` : ''}`}
          onClick={() => navigate('/system')}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {warningCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none" aria-hidden="true">
              {warningCount > 9 ? '9+' : warningCount}
            </span>
          )}
        </Button>

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun className="h-4 w-4" aria-hidden="true" />
            : <Moon className="h-4 w-4" aria-hidden="true" />
          }
        </Button>

        {/* User */}
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-2.5 text-muted-foreground hover:text-foreground">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </div>
                <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate text-foreground">
                  {currentUser.firstName}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" onClick={() => navigate('/login')} className="gap-1.5">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            Sign in
          </Button>
        )}
      </div>
    </header>
  )
}
