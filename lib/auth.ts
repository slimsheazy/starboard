import { supabase } from "./supabase"
import type { AuthError, User } from "@supabase/supabase-js"

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface SignInResult {
  success: boolean
  error?: string
  requiresRedirect?: boolean
}

/**
 * Sign in with Google OAuth
 * Handles both redirect and popup flows based on environment
 */
export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    // Clear any existing errors
    const redirectUrl = getRedirectUrl()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        scopes: "email profile",
      },
    })

    if (error) {
      console.error("Google sign-in error:", error)
      return {
        success: false,
        error: getErrorMessage(error),
      }
    }

    // OAuth redirect initiated successfully
    return {
      success: true,
      requiresRedirect: true,
    }
  } catch (error) {
    console.error("Unexpected sign-in error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Sign-out error:", error)
      return {
        success: false,
        error: getErrorMessage(error),
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected sign-out error:", error)
    return {
      success: false,
      error: "Failed to sign out. Please try again.",
    }
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser(): Promise<{ user: User | null; error?: string }> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Get user error:", error)
      return {
        user: null,
        error: getErrorMessage(error),
      }
    }

    return { user }
  } catch (error) {
    console.error("Unexpected get user error:", error)
    return {
      user: null,
      error: "Failed to get user information.",
    }
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event, session?.user?.id)
    callback(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}

/**
 * Get the appropriate redirect URL based on environment
 */
function getRedirectUrl(): string {
  // In production, use the actual domain
  if (typeof window !== "undefined") {
    const { protocol, host } = window.location
    return `${protocol}//${host}/auth/callback`
  }

  // Fallback for server-side rendering
  return process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    : "http://localhost:3000/auth/callback"
}

/**
 * Convert Supabase auth errors to user-friendly messages
 */
function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case "Invalid login credentials":
      return "Invalid email or password. Please try again."
    case "Email not confirmed":
      return "Please check your email and click the confirmation link."
    case "Too many requests":
      return "Too many sign-in attempts. Please wait a moment and try again."
    case "Signup not allowed for this instance":
      return "New registrations are currently disabled."
    default:
      // Log the actual error for debugging
      console.error("Auth error details:", error)
      return error.message || "Authentication failed. Please try again."
  }
}

/**
 * Check if the current environment supports OAuth redirects
 */
export function supportsOAuthRedirect(): boolean {
  return typeof window !== "undefined" && window.location.protocol.startsWith("http")
}
