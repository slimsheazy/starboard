"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { HomeIcon, BookIcon, StarIcon, MoonIcon, User } from "./cosmic-icons"
import { triggerWhisper } from "./sound-effects"

interface BottomNavProps {
  onOpenSavedReadings: () => void
  savedReadingsCount: number
}

export default function BottomNav({ onOpenSavedReadings, savedReadingsCount }: BottomNavProps) {
  const pathname = usePathname()

  const handleReadingsClick = () => {
    triggerWhisper()
    onOpenSavedReadings()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4">
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
          className="bg-black/40 backdrop-blur-md border-2 border-white/10 rounded-2xl p-2 bottom-nav"
        >
          <div className="flex justify-around">
            <Link href="/" onClick={() => triggerWhisper()}>
              <NavButton icon={<HomeIcon className="w-6 h-6" />} label="Home" isActive={pathname === "/"} />
            </Link>

            <button onClick={handleReadingsClick}>
              <NavButton
                icon={<BookIcon className="w-6 h-6" />}
                label="Readings"
                isActive={false}
                badge={savedReadingsCount > 0 ? savedReadingsCount : undefined}
              />
            </button>

            <Link href="/charms" onClick={() => triggerWhisper()}>
              <NavButton icon={<StarIcon className="w-6 h-6" />} label="Charms" isActive={pathname === "/charms"} />
            </Link>

            <Link href="/profile" onClick={() => triggerWhisper()}>
              <NavButton icon={<User className="w-6 h-6" />} label="Profile" isActive={pathname === "/profile"} />
            </Link>

            <Link href="/about" onClick={() => triggerWhisper()}>
              <NavButton icon={<MoonIcon className="w-6 h-6" />} label="About" isActive={pathname === "/about"} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick?: () => void
  badge?: number
}

function NavButton({ icon, label, isActive, onClick, badge }: NavButtonProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative ${
        isActive ? "text-white" : "text-white/50"
      }`}
      onClick={onClick}
    >
      <div className={`p-2 rounded-lg ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}>{icon}</div>
      <span className="text-xs mt-1">{label}</span>

      {badge !== undefined && (
        <div className="absolute top-0 right-0 bg-neon-pink text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {badge}
        </div>
      )}
    </div>
  )
}
