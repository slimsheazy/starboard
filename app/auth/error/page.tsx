"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StarBackground } from "@/components/star-background"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access was denied. Please try again."
      case "Verification":
        return "The verification token has expired or has already been used."
      default:
        return "An unexpected error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarBackground />
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-md border-red-500/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Authentication Error</CardTitle>
          <CardDescription className="text-red-200">{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-white text-white hover:bg-white hover:text-purple-900 bg-transparent"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
