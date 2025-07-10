"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import StarBackground from "@/components/star-background"
import BottomNav from "@/components/bottom-nav"
import ProfileModal from "@/components/profile-modal"
import SignInButton from "@/components/auth/sign-in-button"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { User, Calendar, Sparkles, Trophy, AlertCircle } from "lucide-react"

interface Fortune {
  id: string
  fortune_text: string
  category: string
  spin_date: string
}

interface UserProfile {
  username: string
  avatar_url: string | null
  total_points: number
  level: number
  readings_count: number
}

export default function ProfilePage() {
  const { user, loading: authLoading, error: authError, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fortunes, setFortunes] = useState<Fortune[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [savedReadings, setSavedReadings] = useState([])

  useEffect(() => {
    if (user) {
      loadUserData()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const loadUserData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }

      if (profileData) {
        setProfile(profileData)
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          username: user.user_metadata?.full_name || user.email?.split("@")[0] || "Cosmic Traveler",
          avatar_url: user.user_metadata?.avatar_url || null,
          total_points: 0,
          level: 1,
          readings_count: 0,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single()

        if (createError) {
          throw createError
        }

        setProfile(createdProfile)
      }

      // Load fortunes
      const { data: fortunesData, error: fortunesError } = await supabase
        .from("fortunes")
        .select("*")
        .eq("user_id", user.id)
        .order("spin_date", { ascending: false })

      if (fortunesError) {
        throw fortunesError
      }

      setFortunes(fortunesData || [])
    } catch (error: any) {
      console.error("Error loading user data:", error)
      setError(error.message || "Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setProfile(null)
      setFortunes([])
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      love: "text-pink-400 bg-pink-400/10",
      career: "text-blue-400 bg-blue-400/10",
      health: "text-green-400 bg-green-400/10",
      wisdom: "text-purple-400 bg-purple-400/10",
      prosperity: "text-yellow-400 bg-yellow-400/10",
    }
    return colors[category as keyof typeof colors] || "text-white bg-white/10"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const toggleSavedReadings = () => {
    // Placeholder for saved readings functionality
  }

  if (authLoading || loading) {
    return (
      <main className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <StarBackground />
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (authError || error) {
    return (
      <main className="relative min-h-screen bg-black text-white pb-20">
        <StarBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-light tracking-wide mb-4">Something went wrong</h1>
            <p className="text-white/70 mb-6">{authError || error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
        <BottomNav onOpenSavedReadings={toggleSavedReadings} savedReadingsCount={savedReadings.length} />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative min-h-screen bg-black text-white pb-20">
        <StarBackground />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-light tracking-wide mb-4">Welcome to Starboard</h1>
            <p className="text-white/70 mb-8 leading-relaxed">
              Sign in to save your fortunes, track your cosmic journey, and unlock personalized insights.
            </p>

            <SignInButton />
          </motion.div>
        </div>

        <BottomNav onOpenSavedReadings={toggleSavedReadings} savedReadingsCount={savedReadings.length} />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white pb-20">
      <StarBackground />

      <div className="relative z-10 px-4 py-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default icon if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}
            <User className={`w-10 h-10 text-white ${profile?.avatar_url ? "hidden" : ""}`} />
          </div>

          <h1 className="text-2xl font-light tracking-wide mb-2">
            {profile?.username || user.email?.split("@")[0] || "Cosmic Traveler"}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>Level {profile?.level || 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>{profile?.total_points || 0} points</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
          >
            <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-light text-white">{fortunes.length}</p>
            <p className="text-xs text-white/60">Fortunes Received</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
          >
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-light text-white">{profile?.readings_count || 0}</p>
            <p className="text-xs text-white/60">Readings Cast</p>
          </motion.div>
        </div>

        {/* Recent Fortunes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-light tracking-wide mb-4">Recent Fortunes</h2>

          {fortunes.length > 0 ? (
            <div className="space-y-3">
              {fortunes.slice(0, 5).map((fortune, index) => (
                <motion.div
                  key={fortune.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(fortune.category)}`}
                    >
                      {fortune.category}
                    </span>
                    <span className="text-xs text-white/50">{formatDate(fortune.spin_date)}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{fortune.fortune_text}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No fortunes yet</p>
              <p className="text-white/40 text-sm">Try the lucky spin wheel to get your first fortune!</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
          >
            View All Fortunes
          </button>

          <button
            onClick={handleSignOut}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showModal && <ProfileModal fortunes={fortunes} onClose={() => setShowModal(false)} />}

      <BottomNav onOpenSavedReadings={toggleSavedReadings} savedReadingsCount={savedReadings.length} />
    </main>
  )
}
