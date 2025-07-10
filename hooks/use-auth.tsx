"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { getCurrentUser, onAuthStateChange, type AuthState } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(({ user, error }) => {
      setAuthState({
        user,
        loading: false,
        error: error || null,
      })
    })

    // Listen for auth changes
    const unsubscribe = onAuthStateChange((user) => {
      setAuthState((prev) => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }))
    })

    return unsubscribe
  }, [])

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))

    const { signOut: authSignOut } = await import("@/lib/auth")
    const result = await authSignOut()

    if (!result.success) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: result.error || "Sign out failed",
      }))
    }
  }

  const refreshUser = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))

    const { user, error } = await getCurrentUser()
    setAuthState({
      user,
      loading: false,
      error: error || null,
    })
  }

  const value: AuthContextType = {
    ...authState,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
