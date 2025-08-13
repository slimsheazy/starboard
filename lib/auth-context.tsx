"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import type { Session } from "next-auth"
import type { UserProfile } from "./user-storage"
import { createUserProfile, getUserProfile, saveUserProfile } from "./user-storage"

interface AuthContextType {
  user: UserProfile | null
  session: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Inner component that uses useSession
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session.user.id || session.user.email || "anonymous"
      let profile = getUserProfile(userId)

      if (!profile) {
        profile = createUserProfile({
          id: userId,
          name: session.user.name || "Anonymous User",
          email: session.user.email || "",
          image: session.user.image || null,
        })
        saveUserProfile(profile)
      }
      setUserProfile(profile)
    } else if (status === "unauthenticated") {
      setUserProfile(null)
    }
  }, [session, status])

  const handleSignIn = async () => {
    const { signIn } = await import("next-auth/react")
    try {
      await signIn("google", {
        callbackUrl: "/profile",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react")
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const contextValue: AuthContextType = {
    user: userProfile,
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Main AuthProvider that wraps with SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
