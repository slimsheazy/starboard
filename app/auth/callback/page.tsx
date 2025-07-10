"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import StarBackground from "@/components/star-background"
import { CheckIcon, CloseIcon } from "@/components/cosmic-icons"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      // Get the URL hash or search params
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const searchParams = new URLSearchParams(window.location.search)

      // Check for error in URL
      const error = hashParams.get("error") || searchParams.get("error")
      const errorDescription = hashParams.get("error_description") || searchParams.get("error_description")

      if (error) {
        console.error("OAuth error:", error, errorDescription)
        setErrorMessage(errorDescription || "Authentication failed")
        setStatus("error")
        return
      }

      // Handle the OAuth callback
      const { data, error: authError } = await supabase.auth.getSession()

      if (authError) {
        console.error("Session error:", authError)
        setErrorMessage(authError.message)
        setStatus("error")
        return
      }

      if (data.session) {
        setStatus("success")

        // Redirect to profile page after a brief success message
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } else {
        setErrorMessage("No session found")
        setStatus("error")
      }
    } catch (error) {
      console.error("Callback handling error:", error)
      setErrorMessage("An unexpected error occurred")
      setStatus("error")
    }
  }

  const handleRetry = () => {
    router.push("/profile")
  }

  return (
    <main className="relative min-h-screen bg-black text-white flex items-center justify-center">
      <StarBackground />

      <div className="relative z-10 text-center max-w-md px-4">
        {status === "loading" && (
          <div>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-xl font-light tracking-wide mb-2">Completing Sign In</h1>
            <p className="text-white/70">Please wait while we authenticate your account...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-16 h-16 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-light tracking-wide mb-2">Welcome to Starboard!</h1>
            <p className="text-white/70">Sign in successful. Redirecting to your profile...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
              <CloseIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-light tracking-wide mb-2">Sign In Failed</h1>
            <p className="text-white/70 mb-6">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
