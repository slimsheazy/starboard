"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { findCharmCombinations } from "@/lib/charm-combinations"
import CombinationDetails from "./combination-details"
import type { HouseAssignment } from "./charm-board"

interface ReadingSynopsisProps {
  charms: Charm[]
  houses: House[]
  question: string
  houseAssignments?: HouseAssignment[]
}

export default function ReadingSynopsis({ charms, houses, question, houseAssignments }: ReadingSynopsisProps) {
  const [synopsis, setSynopsis] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCombination, setSelectedCombination] = useState<any>(null)

  useEffect(() => {
    if (charms.length > 0 && houseAssignments && houseAssignments.length > 0) {
      setIsVisible(false)
      setSynopsis([])
      const timer = setTimeout(() => {
        const generated = generatePersonalizedSynopsis()
        setSynopsis(generated)
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [charms, houses, question, houseAssignments])

  // Build a map of house -> charms for easy lookup
  const getHouseCharmMap = (): Map<number, Charm[]> => {
    const map = new Map<number, Charm[]>()
    if (!houseAssignments) return map

    for (const assignment of houseAssignments) {
      const charmsInHouse = assignment.charmIndices.map((i) => charms[i]).filter(Boolean)
      if (charmsInHouse.length > 0) {
        map.set(assignment.houseIndex, charmsInHouse)
      }
    }
    return map
  }

  // Classify charm sentiment
  const getCharmSentiment = (charm: Charm): "positive" | "cautionary" | "neutral" => {
    const positive = /flow|green light|breakthrough|anchor|compass|sunrise|bridge|harvest|spark|oasis|key|shortcut|second wind|jumpstart|synchronicity|cosmic alignment|golden thread|phoenix rising/i
    const cautionary = /red light|locked door|thin ice|fog|interference|exposed|storm warning|quicksand|undertow|mask|leak|shadow|friction|mirage|dark night|void|shattered mirror/i

    if (positive.test(charm.name)) return "positive"
    if (cautionary.test(charm.name)) return "cautionary"
    return "neutral"
  }

  const generatePersonalizedSynopsis = (): string[] => {
    const sections: string[] = []
    const houseCharmMap = getHouseCharmMap()
    const combinations = findCharmCombinations(charms)

    // Count sentiments
    const sentiments = charms.map(getCharmSentiment)
    const positiveCount = sentiments.filter((s) => s === "positive").length
    const cautionaryCount = sentiments.filter((s) => s === "cautionary").length
    const rareCharms = charms.filter((c) => c.rarity === "rare")

    // --- Section 1: Opening that addresses the question ---
    if (question.trim()) {
      sections.push(buildQuestionOpening(question, positiveCount, cautionaryCount))
    } else {
      sections.push(buildGeneralOpening(positiveCount, cautionaryCount))
    }

    // --- Section 2: Dominant house analysis ---
    const dominantHouses = [...houseCharmMap.entries()]
      .sort(([, a], [, b]) => b.length - a.length)
      .filter(([, charmsInHouse]) => charmsInHouse.length > 0)

    if (dominantHouses.length > 0) {
      const [topHouseIdx, topCharms] = dominantHouses[0]
      const house = houses[topHouseIdx]
      if (topCharms.length >= 2) {
        const keyword = house.contextKeyword || house.keyword
        const charmNames = topCharms.map((c) => c.name).join(" and ")
        sections.push(
          `The house of ${keyword} draws the most energy, with ${charmNames} converging there. ` +
            `This signals that ${house.description.toLowerCase()} is where the heart of your situation lies right now.`,
        )
      }
    }

    // --- Section 3: Key charm interpretations tied to houses ---
    const keyReadings: string[] = []
    for (const [houseIdx, charmsInHouse] of houseCharmMap) {
      const house = houses[houseIdx]
      const keyword = house.contextKeyword || house.keyword

      for (const charm of charmsInHouse) {
        keyReadings.push(buildCharmHouseReading(charm, keyword, question))
      }
    }
    // Pick the 3 most interesting readings
    if (keyReadings.length > 0) {
      const selected = keyReadings.slice(0, 3)
      sections.push(selected.join(" "))
    }

    // --- Section 4: Rare charms ---
    if (rareCharms.length > 0) {
      const rareNames = rareCharms.map((c) => c.name).join(", ")
      sections.push(
        `The appearance of ${rareCharms.length > 1 ? "rare charms" : "a rare charm"} -- ${rareNames} -- ` +
          `amplifies this reading significantly. ${rareCharms[0].description}. Do not overlook this energy.`,
      )
    }

    // --- Section 5: Combinations ---
    if (combinations.length > 0) {
      const top = combinations[0]
      sections.push(`${top.name}: ${top.interpretation}`)
    }

    // --- Section 6: Overall balance and closing ---
    sections.push(buildClosing(positiveCount, cautionaryCount, question))

    return sections
  }

  const buildQuestionOpening = (q: string, positive: number, cautionary: number): string => {
    const tone =
      positive > cautionary ? "The charms lean favorably" : cautionary > positive ? "The charms urge caution" : "The charms hold a complex balance of forces"

    return `Regarding "${q.length > 80 ? q.slice(0, 80) + "..." : q}" -- ${tone}. Here is what the cast reveals.`
  }

  const buildGeneralOpening = (positive: number, cautionary: number): string => {
    if (positive > cautionary + 2) {
      return "The charms align with strong forward momentum. The cast carries an optimistic charge."
    } else if (cautionary > positive + 2) {
      return "The charms carry a weight of warning. Careful reflection is called for before acting."
    }
    return "The charms present a nuanced picture -- neither purely favorable nor entirely cautionary. Read on."
  }

  const buildCharmHouseReading = (charm: Charm, houseKeyword: string, q: string): string => {
    const sentiment = getCharmSentiment(charm)
    const kwLower = houseKeyword.toLowerCase()

    if (sentiment === "positive") {
      return `${charm.name} in the house of ${kwLower} is encouraging: ${charm.description.toLowerCase()}, and this energy supports progress in your ${kwLower} matters.`
    } else if (sentiment === "cautionary") {
      return `${charm.name} appears in the house of ${kwLower}, a signal to be watchful: ${charm.description.toLowerCase()}. Tread carefully here.`
    }
    return `${charm.name} sits in the house of ${kwLower} -- ${charm.description.toLowerCase()}. Consider how this applies to the ${kwLower} dimension of your inquiry.`
  }

  const buildClosing = (positive: number, cautionary: number, q: string): string => {
    if (positive > cautionary + 3) {
      return "Overall, the reading carries a strong current of affirmation. The path is open -- step forward with intention."
    } else if (cautionary > positive + 3) {
      return "This reading leans heavily toward reflection and restraint. Pause, gather more information, and trust your instincts before committing."
    } else if (positive > cautionary) {
      return "The balance tips toward possibility, though a few charms counsel patience. Move forward, but stay alert to the details."
    } else if (cautionary > positive) {
      return "Caution threads through this reading. It does not mean stop -- but slow down, look closer, and honor what your gut is telling you."
    }
    return "This reading holds equal measures of opportunity and warning. The outcome depends on your choices from here. Let the charms illuminate, but you decide the path."
  }

  const combinations = charms.length > 0 ? findCharmCombinations(charms) : []

  // Build house distribution from real assignments
  const houseDistribution: { houseName: string; keyword: string; count: number }[] = []
  if (houseAssignments) {
    for (const assignment of houseAssignments) {
      if (assignment.charmIndices.length > 0) {
        const house = houses[assignment.houseIndex]
        houseDistribution.push({
          houseName: house.name,
          keyword: house.contextKeyword || house.keyword,
          count: assignment.charmIndices.length,
        })
      }
    }
    houseDistribution.sort((a, b) => b.count - a.count)
  }

  if (!isVisible || charms.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-md mx-auto px-4">
      <div className="bg-black/30 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-white/90 mb-3 text-center tracking-wide">Reading Synopsis</h3>

        {/* Personalized synopsis sections */}
        <div className="space-y-3 mb-4">
          {synopsis.map((section, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.4 }}
              className="text-sm text-white/80 leading-relaxed"
            >
              {section}
            </motion.p>
          ))}
        </div>

        {/* House Distribution Summary */}
        {houseDistribution.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + synopsis.length * 0.4 }}
            className="border-t border-white/10 pt-3 mb-4"
          >
            <h4 className="text-xs font-medium text-white/70 mb-2 tracking-wide">Energy Distribution</h4>
            <div className="flex flex-wrap gap-1">
              {houseDistribution.slice(0, 5).map(({ keyword, count }) => (
                <span key={keyword} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
                  {keyword}: {count}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {combinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + synopsis.length * 0.4 }}
            className="border-t border-white/10 pt-3"
          >
            <h4 className="text-xs font-medium text-white/70 mb-2 tracking-wide">Significant Combinations</h4>
            <div className="space-y-2">
              {combinations.slice(0, 2).map((combo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCombination(combo)}
                  className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="text-xs text-white/90 font-medium">{combo.charms.join(" + ")}</div>
                  <div className="text-xs text-white/60 mt-1">{combo.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedCombination && (
          <CombinationDetails combination={selectedCombination} onClose={() => setSelectedCombination(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
