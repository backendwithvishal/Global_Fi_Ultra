import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, Bell, BookMarked, Users,
  Bot, Activity, Settings, ChevronLeft, ChevronRight,
  BarChart3, Shield, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: 'default' | 'info' | 'success' | 'warning'
}

const navItems: NavItem[] = [
  { label: 'Dashboard',   href: '/',          icon: LayoutDashboard },
  { label: 'Markets',     href: '/markets',   icon: TrendingUp },
  { label: 'Assets',      href: '/assets',    icon: BarChart3 },
  { label: 'Watchlists',  href: '/watchlists',icon: BookMarked },
  { label: 'Alerts',      href: '/alerts',    icon: Bell },
  { label: 'AI Insights', href: '/ai',        icon: Bot, badge: 'AI', badgeVariant: 'info' },
  { label: 'Users',       href: '/users',     icon: Users },
  { label: 'System',      href: '/system',    icon: Activity },
  { label: 'Admin',       href: '/admin',     icon: Shield },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden border-r border-border/60 bg-card"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3.5 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary shrink-0 shadow-lg shadow-primary/30">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-sm tracking-tight whitespace-nowrap text-foreground"
              >
                Global-Fi Ultra
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.href)

          return (
            <NavLink
              key={item.href}
              to={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-primary/12 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
                  transition={{ duration: 0.2 }}
                />
              )}

              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
                aria-hidden="true"
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex-1 whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {!collapsed && item.badge && (
                <Badge variant={item.badgeVariant ?? 'default'} className="text-[10px] px-1.5 py-0 h-4">
                  {item.badge}
                </Badge>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-card border border-border/60 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-opacity duration-150">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 text-primary">{item.badge}</span>
                  )}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-border/60 p-2">
        <NavLink
          to="/settings"
          aria-label="Settings"
          className={cn(
            'relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group',
            location.pathname === '/settings'
              ? 'bg-primary/12 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-card border border-border/60 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-opacity">
              Settings
            </div>
          )}
        </NavLink>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[52px] z-20 flex items-center justify-center h-6 w-6 rounded-full border border-border/60 bg-card shadow-md hover:bg-accent transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight className="h-3 w-3 text-muted-foreground" />
          : <ChevronLeft className="h-3 w-3 text-muted-foreground" />
        }
      </button>
    </motion.aside>
  )
}
