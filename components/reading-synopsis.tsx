"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { getCharmColor } from "@/lib/charm-colors"
import { findCharmCombinations, getMostPowerfulCombination } from "@/lib/charm-combinations"
import { triggerCombination } from "./sound-effects"

interface ReadingSynopsisProps {
  charms: Charm[]
  houses: House[]
  question: string
}

export default function ReadingSynopsis({ charms, houses, question }: ReadingSynopsisProps) {
  const [synopsis, setSynopsis] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [combinations, setCombinations] = useState<ReturnType<typeof findCharmCombinations>>([])

  useEffect(() => {
    if (charms.length === 0) return

    setIsGenerating(true)

    // Find charm combinations
    const foundCombinations = findCharmCombinations(charms)
    setCombinations(foundCombinations)

    if (foundCombinations.length > 0) {
      // Trigger combination sound after a brief delay
      setTimeout(() => {
        triggerCombination()
      }, 2000) // Play after the synopsis appears
    }

    // Generate the reading synopsis
    const generatedSynopsis = generateSynopsis(charms, houses, question, foundCombinations)

    // Simulate a brief delay to make it feel like the app is "thinking"
    const timer = setTimeout(() => {
      setSynopsis(generatedSynopsis)
      setIsGenerating(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [charms, houses, question])

  // Count charms by category
  const categoryCounts: Record<string, number> = {}
  charms.forEach((charm) => {
    const { category } = getCharmColor(charm.name)
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  // Find the dominant category
  let dominantCategory = ""
  let maxCount = 0
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominantCategory = category
    }
  })

  // Count rare charms
  const rareCharmCount = charms.filter((charm) => charm.rarity === "rare").length
  const mostPowerfulCombination = getMostPowerfulCombination(combinations)

  if (isGenerating) {
    return (
      <div className="w-full max-w-md mx-auto mt-6 px-4">
        <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-sm text-white/50 mt-2">Reading the cosmic patterns...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-6 px-4"
    >
      <div className="bg-black/60 border border-white/10 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white/80 mb-2 text-center">Your Reading</h3>
        <p className="text-sm text-white/90 leading-relaxed font-medium">{synopsis}</p>

        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {dominantCategory && (
            <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
              Primary energy: {dominantCategory}
            </span>
          )}
          {rareCharmCount > 0 && (
            <span className="text-xs px-2 py-1 bg-yellow-600/20 border border-yellow-600/40 rounded-full text-yellow-400">
              {rareCharmCount} rare {rareCharmCount === 1 ? "charm" : "charms"}
            </span>
          )}
          {mostPowerfulCombination && (
            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                mostPowerfulCombination.rarity === "legendary"
                  ? "bg-purple-600/20 border-purple-400/40 text-purple-300"
                  : mostPowerfulCombination.rarity === "rare"
                    ? "bg-red-600/20 border-red-400/40 text-red-300"
                    : mostPowerfulCombination.rarity === "uncommon"
                      ? "bg-blue-600/20 border-blue-400/40 text-blue-300"
                      : "bg-green-600/20 border-green-400/40 text-green-300"
              }`}
            >
              {mostPowerfulCombination.name}
            </span>
          )}
        </div>

        {/* Show combination details if present */}
        {mostPowerfulCombination && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/70 italic">"{mostPowerfulCombination.description}"</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Enhanced synopsis generation with combination insights
function generateSynopsis(
  charms: Charm[],
  houses: House[],
  question: string,
  combinations: ReturnType<typeof findCharmCombinations>,
): string {
  // Get the most powerful combination
  const mostPowerfulCombination = getMostPowerfulCombination(combinations)

  // If we have a powerful combination, lead with that
  if (
    mostPowerfulCombination &&
    (mostPowerfulCombination.rarity === "legendary" || mostPowerfulCombination.rarity === "rare")
  ) {
    return mostPowerfulCombination.interpretation
  }

  // Otherwise, use the original synopsis logic but incorporate combination insights
  const questionContext = analyzeQuestion(question)

  // Count charms by category
  const categoryCounts: Record<string, number> = {}
  charms.forEach((charm) => {
    const { category } = getCharmColor(charm.name)
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  // Find dominant category
  let dominantCategory = ""
  let maxCount = 0
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominantCategory = category
    }
  })

  // Count rare charms and get their names
  const rareCharms = charms.filter((charm) => charm.rarity === "rare")

  // Find specific charms for targeted insights
  const hasFlowAndObstacle =
    charms.some((c) => c.name === "Flow") && charms.some((c) => c.name === "Hiccup" || c.name === "Interference")
  const hasCatalyst = charms.some((c) => c.name === "Catalyst")
  const hasTippingPoint = charms.some((c) => c.name === "Tipping Point")
  const hasEclipse = charms.some((c) => c.name === "Eclipse")
  const hasSupernova = charms.some((c) => c.name === "Supernova")
  const hasRedLight = charms.some((c) => c.name === "Red Light")
  const hasLastCall = charms.some((c) => c.name === "Last Call")
  const hasGutCheck = charms.some((c) => c.name === "Gut Check")

  let synopsis = ""

  // Start with hard-hitting reality check based on dominant energy
  if (dominantCategory === "Challenges") {
    synopsis += "You're in the thick of it. "
    if (hasRedLight) {
      synopsis += "Stop pushing—you're forcing the wrong door. "
    } else if (hasFlowAndObstacle) {
      synopsis += "Stop fighting the current and start swimming with it. "
    } else {
      synopsis += "These obstacles aren't random—they're showing you where you need to grow. "
    }
  } else if (dominantCategory === "Opportunities") {
    synopsis += "The universe is handing you options. "
    if (hasLastCall) {
      synopsis += "This window won't stay open forever—move now or watch it close. "
    } else if (hasCatalyst) {
      synopsis += "One small action will trigger a chain reaction. "
    } else {
      synopsis += "But opportunities without action are just pretty daydreams. "
    }
  } else if (dominantCategory === "Transitions") {
    synopsis += "You're shedding an old skin. "
    if (hasEclipse) {
      synopsis += "This transformation will redefine who you are at your core. "
    } else if (hasSupernova) {
      synopsis += "What's exploding needed to die anyway. "
    } else {
      synopsis += "Stop clinging to what's already gone. "
    }
  } else if (dominantCategory === "Growth") {
    synopsis += "You're being stretched beyond your comfort zone. "
    if (hasTippingPoint) {
      synopsis += "You're closer to breakthrough than you realize. "
    } else {
      synopsis += "Embrace the discomfort—it's where real change happens. "
    }
  } else if (dominantCategory === "Insights") {
    synopsis += "The answers you need are already inside you. "
    if (hasGutCheck) {
      synopsis += "Your instincts are screaming—listen to them. "
    } else {
      synopsis += "Stop looking outside for validation you can only give yourself. "
    }
  } else {
    synopsis += "Your energy is scattered across multiple fronts. "
  }

  // Add combination insight if we have one
  if (mostPowerfulCombination && mostPowerfulCombination.rarity === "uncommon") {
    synopsis += mostPowerfulCombination.interpretation.split(".")[0] + ". "
  }

  // Add specific action based on question context
  if (questionContext.topic === "career") {
    if (dominantCategory === "Challenges") {
      synopsis += "Your professional path is being redirected, not destroyed."
    } else if (dominantCategory === "Opportunities") {
      synopsis += "Network aggressively and pitch boldly—mediocrity won't cut it."
    } else {
      synopsis += "Your career needs the same energy you'd put into saving your life."
    }
  } else if (questionContext.topic === "relationships") {
    if (dominantCategory === "Challenges") {
      synopsis += "This relationship is mirroring your unhealed wounds."
    } else if (dominantCategory === "Transitions") {
      synopsis += "Someone's leaving your story—let them go gracefully."
    } else {
      synopsis += "Stop trying to fix people and start choosing better."
    }
  } else {
    // General advice
    if (dominantCategory === "Challenges") {
      synopsis += "Face what you've been avoiding—it's smaller than your fear of it."
    } else if (dominantCategory === "Opportunities") {
      synopsis += "Say yes to what scares you and no to what drains you."
    } else {
      synopsis += "Stop overthinking and start doing."
    }
  }

  return synopsis.trim()
}

// Simplified question analysis for bold readings
function analyzeQuestion(question: string): {
  topic: string
  urgency: "high" | "medium" | "low"
  sentiment: "positive" | "negative" | "neutral"
} {
  if (!question) {
    return { topic: "general", urgency: "medium", sentiment: "neutral" }
  }

  const lowerQuestion = question.toLowerCase()

  // Determine topic
  let topic = "general"
  if (/\b(career|job|work|business|profession)\b/.test(lowerQuestion)) {
    topic = "career"
  } else if (/\b(love|relationship|partner|marriage|dating)\b/.test(lowerQuestion)) {
    topic = "relationships"
  } else if (/\b(money|finance|wealth|income|debt)\b/.test(lowerQuestion)) {
    topic = "financial"
  } else if (/\b(health|wellness|illness|medical)\b/.test(lowerQuestion)) {
    topic = "health"
  } else if (/\b(family|home|parent|child)\b/.test(lowerQuestion)) {
    topic = "family"
  }

  // Determine urgency
  let urgency: "high" | "medium" | "low" = "medium"
  if (/\b(urgent|emergency|crisis|desperate|help|stuck|lost)\b/.test(lowerQuestion)) {
    urgency = "high"
  } else if (/\b(someday|eventually|future|planning|considering)\b/.test(lowerQuestion)) {
    urgency = "low"
  }

  // Determine sentiment
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  if (/\b(problem|trouble|difficult|struggle|pain|fear|worry|bad)\b/.test(lowerQuestion)) {
    sentiment = "negative"
  } else if (/\b(good|better|success|improve|hope|opportunity|growth)\b/.test(lowerQuestion)) {
    sentiment = "positive"
  }

  return { topic, urgency, sentiment }
}
