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
  const [readingStyle, setReadingStyle] = useState<"direct" | "mystical" | "practical">("direct")

  useEffect(() => {
    if (charms.length === 0) return

    setIsGenerating(true)

    // Determine reading style based on question and charms
    const style = determineReadingStyle(question, charms)
    setReadingStyle(style)

    const foundCombinations = findCharmCombinations(charms)
    setCombinations(foundCombinations)

    if (foundCombinations.length > 0) {
      setTimeout(() => {
        triggerCombination()
      }, 2000)
    }

    const generatedSynopsis = generateVariedSynopsis(charms, houses, question, foundCombinations, style)

    const timer = setTimeout(
      () => {
        setSynopsis(generatedSynopsis)
        setIsGenerating(false)
      },
      1200 + Math.random() * 800,
    ) // Variable timing

    return () => clearTimeout(timer)
  }, [charms, houses, question])

  // Count charms by category
  const categoryCounts: Record<string, number> = {}
  charms.forEach((charm) => {
    const { category } = getCharmColor(charm.name)
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  let dominantCategory = ""
  let maxCount = 0
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominantCategory = category
    }
  })

  const rareCharmCount = charms.filter((charm) => charm.rarity === "rare").length
  const mostPowerfulCombination = getMostPowerfulCombination(combinations)

  if (isGenerating) {
    const loadingMessages = [
      "Reading the cosmic patterns...",
      "Interpreting the stellar alignments...",
      "Consulting the astral currents...",
      "Decoding the celestial messages...",
      "Analyzing the cosmic convergence...",
    ]

    return (
      <div className="w-full max-w-md mx-auto mt-6 px-4">
        <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-sm text-white/50 mt-2">
            {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
          </p>
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

        {mostPowerfulCombination && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/70 italic">"{mostPowerfulCombination.description}"</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Determine reading style based on question and charm energy
function determineReadingStyle(question: string, charms: Charm[]): "direct" | "mystical" | "practical" {
  const rareCount = charms.filter((c) => c.rarity === "rare").length

  // Mystical style for rare charms or spiritual questions
  if (rareCount >= 2 || /\b(spirit|soul|universe|cosmic|divine|sacred)\b/i.test(question)) {
    return "mystical"
  }

  // Practical style for work/money questions
  if (/\b(work|job|money|career|business|practical|should i)\b/i.test(question)) {
    return "practical"
  }

  return "direct"
}

// Generate varied synopsis with different styles and approaches
function generateVariedSynopsis(
  charms: Charm[],
  houses: House[],
  question: string,
  combinations: ReturnType<typeof findCharmCombinations>,
  style: "direct" | "mystical" | "practical",
): string {
  const mostPowerfulCombination = getMostPowerfulCombination(combinations)

  // If we have a powerful combination, sometimes lead with that
  if (
    mostPowerfulCombination &&
    (mostPowerfulCombination.rarity === "legendary" || mostPowerfulCombination.rarity === "rare")
  ) {
    if (Math.random() > 0.3) {
      // 70% chance to use combination
      return adaptCombinationToStyle(mostPowerfulCombination.interpretation, style)
    }
  }

  // Count charms by category
  const categoryCounts: Record<string, number> = {}
  charms.forEach((charm) => {
    const { category } = getCharmColor(charm.name)
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  let dominantCategory = ""
  let maxCount = 0
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominantCategory = category
    }
  })

  const rareCharms = charms.filter((charm) => charm.rarity === "rare")
  const questionContext = analyzeQuestion(question)

  // Generate style-specific synopsis
  switch (style) {
    case "mystical":
      return generateMysticalSynopsis(dominantCategory, rareCharms, questionContext, charms)
    case "practical":
      return generatePracticalSynopsis(dominantCategory, questionContext, charms)
    default:
      return generateDirectSynopsis(dominantCategory, questionContext, charms, mostPowerfulCombination)
  }
}

function adaptCombinationToStyle(interpretation: string, style: "direct" | "mystical" | "practical"): string {
  const sentences = interpretation.split(". ")
  const firstSentence = sentences[0]

  switch (style) {
    case "mystical":
      return `The cosmos speaks clearly: ${firstSentence.toLowerCase()}. ${sentences.slice(1).join(". ")}`
    case "practical":
      return `Here's what you need to know: ${firstSentence.toLowerCase()}. ${sentences.slice(1).join(". ")}`
    default:
      return interpretation
  }
}

function generateMysticalSynopsis(
  dominantCategory: string,
  rareCharms: Charm[],
  questionContext: any,
  allCharms: Charm[],
): string {
  const mysticalOpeners = [
    "The universe whispers through these charms:",
    "Your soul's journey reveals itself:",
    "The cosmic tapestry shows:",
    "Ancient wisdom flows through this reading:",
    "The stars have aligned to tell you:",
  ]

  const opener = mysticalOpeners[Math.floor(Math.random() * mysticalOpeners.length)]

  let message = opener + " "

  if (rareCharms.length > 0) {
    message += `Sacred energies surround you—${rareCharms.length} rare ${rareCharms.length === 1 ? "charm has" : "charms have"} appeared to guide your path. `
  }

  switch (dominantCategory) {
    case "Challenges":
      message +=
        "You're walking through the fire of transformation. These trials aren't punishments—they're initiations into your next level of being."
      break
    case "Opportunities":
      message +=
        "The universe is opening doorways for you. Trust the synchronicities and step boldly into your destiny."
      break
    case "Transitions":
      message += "You're in the sacred space between who you were and who you're becoming. Honor this metamorphosis."
      break
    case "Growth":
      message +=
        "Your soul is expanding beyond its current container. Embrace the growing pains—they herald your evolution."
      break
    case "Insights":
      message += "Divine wisdom seeks to illuminate your path. The answers you seek are already written in your heart."
      break
    default:
      message += "Multiple energies swirl around you, creating a powerful vortex of possibility and change."
  }

  return message
}

function generatePracticalSynopsis(dominantCategory: string, questionContext: any, allCharms: Charm[]): string {
  const practicalOpeners = [
    "Here's the practical reality:",
    "Bottom line:",
    "The situation breaks down like this:",
    "What you need to know:",
    "The facts are:",
  ]

  const opener = practicalOpeners[Math.floor(Math.random() * practicalOpeners.length)]

  let message = opener + " "

  switch (dominantCategory) {
    case "Challenges":
      message +=
        "You're facing obstacles that require strategic thinking. Don't just push harder—find the leverage point and work smarter."
      break
    case "Opportunities":
      message +=
        "There are real chances for advancement here, but they won't wait forever. Make your move while the window is open."
      break
    case "Transitions":
      message +=
        "Change is inevitable, so focus on managing it rather than resisting it. Plan your next steps carefully."
      break
    case "Growth":
      message +=
        "You're ready for the next level, but it requires stepping outside your comfort zone. Invest in yourself now."
      break
    case "Insights":
      message += "You have more information than you think. Stop second-guessing and trust your analysis."
      break
    default:
      message += "Multiple factors are at play. Prioritize what matters most and tackle issues one at a time."
  }

  // Add context-specific advice
  if (questionContext.topic === "career") {
    message += " Focus on building valuable skills and relationships."
  } else if (questionContext.topic === "relationships") {
    message += " Clear communication and boundaries are essential."
  } else if (questionContext.topic === "financial") {
    message += " Make decisions based on long-term value, not short-term comfort."
  }

  return message
}

function generateDirectSynopsis(
  dominantCategory: string,
  questionContext: any,
  allCharms: Charm[],
  mostPowerfulCombination: any,
): string {
  const directOpeners = [
    "Your reading reveals:",
    "The charms are telling you:",
    "This is what's happening:",
    "The energy shows:",
    "Your situation indicates:",
  ]

  const opener = directOpeners[Math.floor(Math.random() * directOpeners.length)]

  let message = opener + " "

  // Add some variety to the core message
  const variations = {
    Challenges: [
      "You're in a testing phase. These difficulties are revealing your true strength.",
      "Resistance is showing you where growth is needed. Lean into the discomfort.",
      "What feels like setbacks are actually course corrections guiding you toward something better.",
    ],
    Opportunities: [
      "Doors are opening, but you need to walk through them. Hesitation will cost you.",
      "The timing is right for bold moves. Trust your instincts and take action.",
      "Multiple paths forward are available. Choose the one that excites and challenges you.",
    ],
    Transitions: [
      "You're shedding an old version of yourself. Let go of what no longer serves you.",
      "This ending is making space for a new beginning. Trust the process.",
      "Change is accelerating around you. Adapt quickly and stay flexible.",
    ],
    Growth: [
      "You're being stretched beyond your current limits. This expansion is necessary for your evolution.",
      "Your potential is calling you forward. Answer with courage and commitment.",
      "The next level requires a new version of you. Start becoming that person now.",
    ],
    Insights: [
      "The answers you seek are already within you. Stop looking outside for validation.",
      "Your intuition is stronger than you realize. Trust those subtle inner nudges.",
      "Clarity is coming through reflection and honest self-assessment.",
    ],
  }

  const categoryMessages = variations[dominantCategory as keyof typeof variations] || [
    "Multiple energies are converging in your life. Pay attention to the patterns.",
  ]

  message += categoryMessages[Math.floor(Math.random() * categoryMessages.length)]

  // Sometimes add a combination insight
  if (mostPowerfulCombination && Math.random() > 0.6) {
    const combinationSentence = mostPowerfulCombination.interpretation.split(".")[0]
    message += ` ${combinationSentence}.`
  }

  return message
}

function analyzeQuestion(question: string): {
  topic: string
  urgency: "high" | "medium" | "low"
  sentiment: "positive" | "negative" | "neutral"
} {
  if (!question) {
    return { topic: "general", urgency: "medium", sentiment: "neutral" }
  }

  const lowerQuestion = question.toLowerCase()

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

  let urgency: "high" | "medium" | "low" = "medium"
  if (/\b(urgent|emergency|crisis|desperate|help|stuck|lost)\b/.test(lowerQuestion)) {
    urgency = "high"
  } else if (/\b(someday|eventually|future|planning|considering)\b/.test(lowerQuestion)) {
    urgency = "low"
  }

  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  if (/\b(problem|trouble|difficult|struggle|pain|fear|worry|bad)\b/.test(lowerQuestion)) {
    sentiment = "negative"
  } else if (/\b(good|better|success|improve|hope|opportunity|growth)\b/.test(lowerQuestion)) {
    sentiment = "positive"
  }

  return { topic, urgency, sentiment }
}
