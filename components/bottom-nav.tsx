"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { HomeIcon, BookIcon, StarIcon, MoonIcon } from "./cosmic-icons"
import { triggerWhisper } from "./sound-effects"

interface BottomNavProps {
  onOpenSavedReadings: () => void
  savedReadingsCount: number
}

export default function BottomNav({ onOpenSavedReadings, savedReadingsCount }: BottomNavProps) {
  const [activeTab, setActiveTab] = useState("home")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    triggerWhisper()

    if (tab === "readings") {
      onOpenSavedReadings()
    }
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
            <NavButton
              icon={<HomeIcon className="w-6 h-6" />}
              label="Home"
              isActive={activeTab === "home"}
              onClick={() => handleTabClick("home")}
            />
            <NavButton
              icon={<BookIcon className="w-6 h-6" />}
              label="Readings"
              isActive={activeTab === "readings"}
              onClick={() => handleTabClick("readings")}
              badge={savedReadingsCount > 0 ? savedReadingsCount : undefined}
            />
            <NavButton
              icon={<StarIcon className="w-6 h-6" />}
              label="Charms"
              isActive={activeTab === "charms"}
              onClick={() => handleTabClick("charms")}
            />
            <NavButton
              icon={<MoonIcon className="w-6 h-6" />}
              label="About"
              isActive={activeTab === "about"}
              onClick={() => handleTabClick("about")}
            />
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
  onClick: () => void
  badge?: number
}

function NavButton({ icon, label, isActive, onClick, badge }: NavButtonProps) {
  return (
    <button
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
    </button>
  )
}
