"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarBackground } from "@/components/star-background"
import { BottomNav } from "@/components/bottom-nav"
import { SignInButton } from "@/components/auth/sign-in-button"
import { User, BookOpen, Sparkles } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StarBackground />
        <div className="text-white text-xl">Loading your cosmic profile...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <StarBackground />
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-md border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Access Required</CardTitle>
            <CardDescription className="text-purple-200">Please sign in to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 relative">
      <StarBackground />
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-purple-600 text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold text-white">{user.name}</CardTitle>
            <CardDescription className="text-purple-200">{user.email}</CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{user.stats.totalReadings}</div>
              <div className="text-sm text-purple-200">Total Readings</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{user.stats.totalFortunes}</div>
              <div className="text-sm text-purple-200">Fortunes Received</div>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Charms */}
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Favorite Charms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.stats.favoriteCharms.length > 0 ? (
                user.stats.favoriteCharms.map((charm, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-200">
                    {charm}
                  </Badge>
                ))
              ) : (
                <p className="text-purple-300">No favorite charms yet. Start creating readings!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Member Since:</span>
              <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Last Login:</span>
              <span className="text-white">{new Date(user.lastLogin).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Theme:</span>
              <span className="text-white capitalize">{user.preferences.theme}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} className="flex-1 bg-purple-600 hover:bg-purple-700">
            New Reading
          </Button>
          <Button
            onClick={() => router.push("/charms")}
            variant="outline"
            className="flex-1 border-white text-white hover:bg-white hover:text-purple-900"
          >
            View History
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
