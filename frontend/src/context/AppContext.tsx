import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, ToastMessage, Organization } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { generateId } from '@/lib/utils'

interface AppContextValue {
  // Auth
  currentUser: User | null
  token: string | null
  setCurrentUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void

  // SaaS Multi-tenancy
  currentOrganization: Organization | null
  setCurrentOrganization: (org: Organization | null) => void
  userOrganizations: Organization[]
  setUserOrganizations: (orgs: Organization[]) => void
  refreshUserOrganizations: () => Promise<void>

  // Theme
  isDark: boolean
  toggleTheme: () => void

  // Toast
  toasts: ToastMessage[]
  toast: {
    success: (title: string, description?: string) => string
    error: (title: string, description?: string) => string
    warning: (title: string, description?: string) => string
    info: (title: string, description?: string) => string
  }
  removeToast: (id: string) => void

  // Global loading
  isGlobalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { isDark, toggleTheme } = useTheme()
  const { toasts, toast, removeToast } = useToast()

  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('gfu_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem('gfu_token')
  )

  const [currentOrganization, setCurrentOrgState] = useState<Organization | null>(() => {
    try {
      const stored = localStorage.getItem('gfu_current_org')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [userOrganizations, setUserOrgsState] = useState<Organization[]>([])
  const [isGlobalLoading, setGlobalLoading] = useState(false)

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user)
    if (user) {
      localStorage.setItem('gfu_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('gfu_user')
    }
  }, [])

  const setToken = useCallback((t: string | null) => {
    setTokenState(t)
    if (t) {
      localStorage.setItem('gfu_token', t)
    } else {
      localStorage.removeItem('gfu_token')
    }
  }, [])

  const setCurrentOrganization = useCallback((org: Organization | null) => {
    setCurrentOrgState(org)
    if (org) {
      localStorage.setItem('gfu_current_org', JSON.stringify(org))
    } else {
      localStorage.removeItem('gfu_current_org')
    }
  }, [])

  const setUserOrganizations = useCallback((orgs: Organization[]) => {
    setUserOrgsState(orgs)
  }, [])

  const refreshUserOrganizations = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:4000/api/v1/organizations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.orgs) {
        setUserOrganizations(data.orgs)
        // If current org is not set or not in list, select first
        if (data.orgs.length > 0) {
          const match = data.orgs.find((o: Organization) => o._id === currentOrganization?._id)
          if (!match) {
            setCurrentOrganization(data.orgs[0])
          } else {
            setCurrentOrganization(match)
          }
        } else {
          setCurrentOrganization(null)
        }
      }
    } catch (err) {
      console.error('Failed to load organizations', err)
    }
  }, [token, currentOrganization, setCurrentOrganization, setUserOrganizations])

  // Automatically refresh organizations on log in
  useEffect(() => {
    if (token && currentUser) {
      refreshUserOrganizations()
    } else {
      setUserOrgsState([])
      setCurrentOrgState(null)
    }
  }, [token, currentUser, refreshUserOrganizations])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setToken(null)
    setCurrentOrganization(null)
    setUserOrganizations([])
    toast.info('Signed out', 'You have been signed out successfully.')
  }, [setCurrentUser, setToken, setCurrentOrganization, setUserOrganizations, toast])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        token,
        setCurrentUser,
        setToken,
        logout,
        currentOrganization,
        setCurrentOrganization,
        userOrganizations,
        setUserOrganizations,
        refreshUserOrganizations,
        isDark,
        toggleTheme,
        toasts,
        toast,
        removeToast,
        isGlobalLoading,
        setGlobalLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { generateId }
