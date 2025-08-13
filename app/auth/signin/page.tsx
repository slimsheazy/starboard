"use client"

import { useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StarBackground } from "@/components/star-background"

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/profile")
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/profile",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarBackground />
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome to Starboard</CardTitle>
          <CardDescription className="text-purple-200">
            Sign in to access your cosmic readings and fortune history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            Continue with Google
          </Button>
          <p className="text-xs text-purple-300 text-center">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
