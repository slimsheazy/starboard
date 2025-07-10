// lib/auth.ts (distinctly TypeScript, not TSX)
import type { User } from "@supabase/supabase-js"

import { supabase } from "@/lib/supabase"

function getErrorMessage(error: Error | string): string {
  const message = typeof error === "string" ? error : error.message

  switch (message) {
    case "Failed to fetch":
      return "Please check your internet connection."
    case "Auth session missing!":
      return "You’re currently signed out. Please sign in first."
    default:
      console.error("Unexpected error message:", message)
      return "An unexpected error occurred. Please try again."
  }
}

export async function getCurrentUser(): Promise<{ user: User | null; error?: string }> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error && error.message !== "Auth session missing!") {
      console.error("Get session error:", error)
      return {
        user: null,
        error: getErrorMessage(error),
      }
    }

    return { user: session?.user ?? null }
  } catch (error) {
    console.error("Unexpected get session error:", error)
    return {
      user: null,
      error: "Failed to get user information.",
    }
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error && error.message !== "Auth session missing!") {
      console.error("Sign-out error:", error)
      return { success: false, error: getErrorMessage(error) }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected sign-out error:", error)
    return { success: false, error: "Failed to sign out. Please try again." }
  }
}

/**
 * True if the current origin is HTTPS or localhost – required by Google OAuth.
 * Browsers block the OAuth redirect flow on insecure origins (http except localhost).
 */
export function supportsOAuthRedirect() {
  const { protocol, hostname } = window.location
  return protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1"
}

interface SignInResult {
  success: boolean
  requiresRedirect?: boolean
  error?: string
}

/**
 * Initiates Supabase Google OAuth sign-in.
 * Returns { success: true, requiresRedirect: true } when the redirect is started,
 * or { success: false, error } on failure.
 */
export async function signInWithGoogle(): Promise<SignInResult> {
  if (!supportsOAuthRedirect()) {
    return {
      success: false,
      error: "Google sign-in requires HTTPS (or localhost for development).",
    }
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("Google OAuth error:", error)
      return { success: false, error: getErrorMessage(error) }
    }

    // Supabase will now redirect the browser to Google's OAuth page.
    return { success: true, requiresRedirect: true }
  } catch (err) {
    console.error("Unexpected OAuth error:", err)
    return { success: false, error: "Failed to start Google sign-in. Please try again." }
  }
}

/**
 * Subscribe to Supabase auth events.
 * Automatically maps the session to its `user` (or `null` when signed-out) and
 * returns an unsubscribe function.
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}
