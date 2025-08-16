"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import StarBackground from "@/components/star-background"
import BottomNav from "@/components/bottom-nav"
import ProfileModal from "@/components/profile-modal"
import { User, Calendar, Sparkles, Trophy } from "lucide-react"

interface Fortune {
  id: string
  fortune_text: string
  category: string
  spin_date: string
}

export default function ProfilePage() {
  const [fortunes, setFortunes] = useState<Fortune[]>([])
  const [showModal, setShowModal] = useState(false)
  const [savedReadings, setSavedReadings] = useState([])

  useEffect(() => {
    // Load fortunes from localStorage
    const savedFortunes = localStorage.getItem("starboard_fortunes")
    if (savedFortunes) {
      setFortunes(JSON.parse(savedFortunes))
    }
  }, [])

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

  return (
    <main className="relative min-h-screen bg-black text-white pb-20">
      <StarBackground />

      <div className="relative z-10 px-4 py-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-light tracking-wide mb-2">Cosmic Traveler</h1>

          <div className="flex items-center justify-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>Level 1</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>0 points</span>
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
            <p className="text-2xl font-light text-white">0</p>
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
        </div>
      </div>

      {/* Profile Modal */}
      {showModal && <ProfileModal fortunes={fortunes} onClose={() => setShowModal(false)} />}

      <BottomNav onOpenSavedReadings={toggleSavedReadings} savedReadingsCount={savedReadings.length} />
    </main>
  )
}
