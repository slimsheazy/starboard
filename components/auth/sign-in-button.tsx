"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signInWithGoogle, supportsOAuthRedirect } from "@/lib/auth"
import { User, AlertCircle } from "lucide-react"

interface SignInButtonProps {
  onSuccess?: () => void
  className?: string
}

export default function SignInButton({ onSuccess, className = "" }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await signInWithGoogle()

      if (result.success) {
        if (result.requiresRedirect) {
          // OAuth redirect initiated - user will be redirected to Google
          // No need to do anything here as the redirect is automatic
        } else {
          // Direct success (shouldn't happen with OAuth but handle it)
          onSuccess?.()
        }
      } else {
        setError(result.error || "Sign in failed")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (!supportsOAuthRedirect()) {
    return (
      <div className={`text-center ${className}`}>
        <div className="p-4 bg-yellow-600/20 border border-yellow-600/40 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-yellow-300 text-sm">Google sign-in requires a secure connection (HTTPS) or localhost.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-600/20 border border-red-600/40 rounded-lg mb-4"
        >
          <div className="flex items-center gap-2 text-red-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </motion.div>
      )}

      <motion.button
        onClick={handleSignIn}
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <User className="w-5 h-5" />
            <span>Sign in with Google</span>
          </>
        )}
      </motion.button>

      <p className="text-xs text-white/50 mt-3">By signing in, you agree to our terms of service and privacy policy.</p>
    </div>
  )
}
