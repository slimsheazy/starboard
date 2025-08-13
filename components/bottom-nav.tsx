"use client"

import { HomeIcon, BookOpenIcon, Dice5Icon, UserIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface BottomNavProps {
  onOpenSavedReadings: () => void
  savedReadingsCount: number
  onOpenLuckySpin: () => void
}

export function BottomNav({ onOpenSavedReadings, savedReadingsCount, onOpenLuckySpin }: BottomNavProps) {
  const { isAuthenticated } = useAuth()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 17 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/20 p-3 shadow-lg"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <button
          onClick={onOpenSavedReadings}
          className="relative flex flex-col items-center text-white/70 hover:text-white transition-colors"
          disabled={!isAuthenticated}
        >
          <BookOpenIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Readings</span>
          {isAuthenticated && savedReadingsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {savedReadingsCount}
            </span>
          )}
        </button>
        <button
          onClick={onOpenLuckySpin}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
          disabled={!isAuthenticated}
        >
          <Dice5Icon className="w-6 h-6" />
          <span className="text-xs mt-1">Spin</span>
        </button>
        <Link
          href="/profile"
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
          aria-disabled={!isAuthenticated}
        >
          <UserIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </motion.nav>
  )
}
