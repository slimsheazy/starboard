"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Sparkles } from "lucide-react"

interface Fortune {
  id: string
  fortune_text: string
  category: string
  spin_date: string
}

interface ProfileModalProps {
  fortunes: Fortune[]
  onClose: () => void
}

export default function ProfileModal({ fortunes, onClose }: ProfileModalProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      love: "text-pink-400 bg-pink-400/10 border-pink-400/20",
      career: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      health: "text-green-400 bg-green-400/10 border-green-400/20",
      wisdom: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      prosperity: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    }
    return colors[category as keyof typeof colors] || "text-white bg-white/10 border-white/20"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const groupFortunesByMonth = (fortunes: Fortune[]) => {
    const grouped: { [key: string]: Fortune[] } = {}

    fortunes.forEach((fortune) => {
      const date = new Date(fortune.spin_date)
      const monthKey = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(fortune)
    })

    return grouped
  }

  const groupedFortunes = groupFortunesByMonth(fortunes)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-black/90 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-light tracking-wide text-white">Fortune History</h2>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {fortunes.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedFortunes).map(([month, monthFortunes]) => (
                  <div key={month}>
                    <h3 className="text-lg font-medium text-white/80 mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {month}
                    </h3>

                    <div className="space-y-3">
                      {monthFortunes.map((fortune, index) => (
                        <motion.div
                          key={fortune.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getCategoryColor(fortune.category)}`}
                            >
                              {fortune.category}
                            </span>
                            <span className="text-xs text-white/50">{formatDate(fortune.spin_date)}</span>
                          </div>

                          <p className="text-white/90 leading-relaxed">{fortune.fortune_text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">No Fortunes Yet</h3>
                <p className="text-white/40">Start your cosmic journey by spinning the lucky wheel!</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
