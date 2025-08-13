"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { User, LogOut } from "lucide-react"

export function SignInButton() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()

  if (isLoading) {
    return (
      <Button disabled className="bg-purple-600 hover:bg-purple-700">
        Loading...
      </Button>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Welcome, {user.name}</span>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="bg-transparent border-white text-white hover:bg-white hover:text-purple-900"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={signIn} className="bg-purple-600 hover:bg-purple-700 text-white">
      <User className="w-4 h-4 mr-2" />
      Sign In with Google
    </Button>
  )
}
