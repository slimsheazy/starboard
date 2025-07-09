"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { findCharmCombinations } from "@/lib/charm-combinations"
import CombinationDetails from "./combination-details"

// Safe keyword extractor – falls back to words in name + description
function getKeywords(charm: Charm): string[] {
  // @ts-ignore – legacy charms may not have a `keywords` field
  const explicit = (charm.keywords as string[] | undefined) ?? []
  if (explicit.length) return explicit.map((k) => k.toLowerCase())

  // derive keywords from name + description
  return `${charm.name} ${charm.description}`.toLowerCase().split(/\W+/).filter(Boolean)
}

interface ReadingSynopsisProps {
  charms: Charm[]
  houses: House[]
  question: string
}

export default function ReadingSynopsis({ charms, houses, question }: ReadingSynopsisProps) {
  const [synopsis, setSynopsis] = useState<string>("")
  const [synopsisStyle, setSynopsisStyle] = useState<"mystical" | "practical" | "poetic">("mystical")
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCombination, setSelectedCombination] = useState<any>(null)

  useEffect(() => {
    if (charms.length > 0) {
      const timer = setTimeout(() => {
        generateSynopsis()
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [charms, houses, question])

  const generateSynopsis = () => {
    if (charms.length === 0) return

    // Determine synopsis style based on question content and charm types
    const style = determineSynopsisStyle(question, charms)
    setSynopsisStyle(style)

    // Get dominant themes from charms
    const themes = extractThemes(charms)
    const houseInfluences = getHouseInfluences(charms, houses)

    // Enhanced context analysis
    const questionContext = analyzeQuestionContext(question)

    // Generate more nuanced synopsis
    const generatedSynopsis = createDetailedSynopsis(charms, themes, houseInfluences, questionContext, style)
    setSynopsis(generatedSynopsis)
  }

  const determineSynopsisStyle = (question: string, charms: Charm[]): "mystical" | "practical" | "poetic" => {
    const questionLower = question.toLowerCase()

    // Practical style for action-oriented questions
    if (/\b(should i|how do i|what steps|when will|can i|will i)\b/.test(questionLower)) {
      return "practical"
    }

    // Poetic style for emotional/spiritual questions
    if (/\b(feel|heart|soul|love|spirit|meaning|purpose)\b/.test(questionLower)) {
      return "poetic"
    }

    // Consider charm types
    const practicalCharms = charms.filter((c) =>
      getKeywords(c).some((k) => /action|work|decision|change|progress/.test(k)),
    ).length

    const emotionalCharms = charms.filter((c) =>
      getKeywords(c).some((k) => /love|heart|emotion|feeling|intuition/.test(k)),
    ).length

    if (practicalCharms > emotionalCharms) return "practical"
    if (emotionalCharms > practicalCharms) return "poetic"

    return "mystical"
  }

  const analyzeQuestionContext = (question: string) => {
    const context = {
      category: "general",
      urgency: "moderate",
      scope: "personal",
      timeframe: "present",
    }

    const questionLower = question.toLowerCase()

    // Determine category
    if (/\b(career|job|work|business)\b/.test(questionLower)) context.category = "career"
    else if (/\b(love|relationship|partner|romance)\b/.test(questionLower)) context.category = "relationships"
    else if (/\b(money|finance|wealth|income)\b/.test(questionLower)) context.category = "financial"
    else if (/\b(health|wellness|healing)\b/.test(questionLower)) context.category = "health"
    else if (/\b(family|home|parent|child)\b/.test(questionLower)) context.category = "family"
    else if (/\b(spirit|soul|meaning|purpose)\b/.test(questionLower)) context.category = "spiritual"

    // Determine urgency
    if (/\b(urgent|now|immediately|asap|quickly)\b/.test(questionLower)) context.urgency = "high"
    else if (/\b(future|eventually|someday|later)\b/.test(questionLower)) context.urgency = "low"

    // Determine scope
    if (/\b(we|us|our|together|family|group)\b/.test(questionLower)) context.scope = "collective"

    // Determine timeframe
    if (/\b(will|future|next|coming|ahead)\b/.test(questionLower)) context.timeframe = "future"
    else if (/\b(past|was|were|before|previous)\b/.test(questionLower)) context.timeframe = "past"

    return context
  }

  const extractThemes = (charms: Charm[]) => {
    const themeCount: Record<string, number> = {}

    charms.forEach((charm) => {
      getKeywords(charm).forEach((keyword) => {
        const theme = categorizeKeyword(keyword)
        themeCount[theme] = (themeCount[theme] || 0) + 1
      })
    })

    return Object.entries(themeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme)
  }

  const categorizeKeyword = (keyword: string): string => {
    const keywordLower = keyword.toLowerCase()

    if (/love|heart|emotion|feeling|passion|romance/.test(keywordLower)) return "emotional"
    if (/action|change|movement|progress|growth|transformation/.test(keywordLower)) return "action"
    if (/wisdom|knowledge|insight|understanding|clarity|truth/.test(keywordLower)) return "wisdom"
    if (/challenge|obstacle|difficulty|conflict|struggle/.test(keywordLower)) return "challenge"
    if (/opportunity|potential|possibility|chance|opening/.test(keywordLower)) return "opportunity"
    if (/balance|harmony|peace|stability|equilibrium/.test(keywordLower)) return "balance"
    if (/intuition|spirit|soul|divine|mystical|psychic/.test(keywordLower)) return "spiritual"
    if (/communication|expression|voice|message|connection/.test(keywordLower)) return "communication"
    if (/creativity|art|inspiration|imagination|innovation/.test(keywordLower)) return "creativity"
    if (/protection|safety|security|boundaries|defense/.test(keywordLower)) return "protection"

    return "general"
  }

  const getHouseInfluences = (charms: Charm[], houses: House[]) => {
    const houseCharms: Record<string, Charm[]> = {}

    charms.forEach((charm) => {
      const house = houses.find((h) => h.charms?.includes(charm.name as unknown as string))
      if (house) {
        if (!houseCharms[house.name]) houseCharms[house.name] = []
        houseCharms[house.name].push(charm)
      }
    })

    return Object.entries(houseCharms)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 3)
  }

  const createDetailedSynopsis = (
    charms: Charm[],
    themes: string[],
    houseInfluences: [string, Charm[]][],
    context: any,
    style: "mystical" | "practical" | "poetic",
  ): string => {
    const openings = getStyleOpenings(style)
    const opening = openings[Math.floor(Math.random() * openings.length)]

    let synopsis = opening + " "

    // Add context-specific insight
    synopsis += getContextualInsight(context, themes, style) + " "

    // Add house influences
    if (houseInfluences.length > 0) {
      synopsis += getHouseInsight(houseInfluences[0], style) + " "
    }

    // Add thematic analysis
    if (themes.length > 0) {
      synopsis += getThematicInsight(themes, charms, style) + " "
    }

    // Add guidance based on charm combinations
    const combinations = findCharmCombinations(charms)
    if (combinations.length > 0) {
      synopsis += getCombinationInsight(combinations[0], style) + " "
    }

    // Add closing guidance
    synopsis += getClosingGuidance(context, style)

    return synopsis
  }

  const getStyleOpenings = (style: "mystical" | "practical" | "poetic") => {
    switch (style) {
      case "mystical":
        return [
          "The cosmic currents reveal a tapestry of energies surrounding your inquiry.",
          "Ancient wisdom whispers through the alignment of these mystical symbols.",
          "The universe has woven a complex pattern of guidance for your path.",
          "Ethereal forces converge to illuminate the depths of your question.",
          "The celestial dance of energies unveils hidden truths within your situation.",
        ]
      case "practical":
        return [
          "Your reading reveals clear patterns that can guide your next steps.",
          "The charms present a roadmap for navigating your current situation.",
          "Practical wisdom emerges from this configuration of energies.",
          "The symbols align to offer concrete guidance for your path forward.",
          "This reading provides actionable insights for your circumstances.",
        ]
      case "poetic":
        return [
          "Like verses written in starlight, your reading speaks of deep currents flowing through your life.",
          "The heart of your question blooms like a flower in the garden of possibility.",
          "Your soul's inquiry dances with the rhythm of cosmic understanding.",
          "In the poetry of symbols, your story unfolds with grace and meaning.",
          "The language of the heart translates through these sacred signs.",
        ]
    }
  }

  const getContextualInsight = (context: any, themes: string[], style: "mystical" | "practical" | "poetic") => {
    const categoryInsights = {
      career: {
        mystical: "Professional energies swirl with potential for transformation and growth.",
        practical: "Your career path shows opportunities for strategic advancement.",
        poetic: "Your work life yearns for authentic expression and purposeful direction.",
      },
      relationships: {
        mystical: "The threads of connection weave through multiple dimensions of understanding.",
        practical: "Relationship dynamics indicate areas for clear communication and mutual growth.",
        poetic: "Love's tender wisdom flows through the chambers of your heart's deepest questions.",
      },
      financial: {
        mystical: "Material energies seek balance between abundance and spiritual values.",
        practical: "Financial patterns suggest practical steps toward greater stability.",
        poetic: "The river of prosperity flows when aligned with your soul's true purpose.",
      },
      spiritual: {
        mystical: "Sacred energies call for deeper communion with your inner wisdom.",
        practical: "Spiritual growth requires grounded practices and consistent dedication.",
        poetic: "Your spirit soars on wings of ancient knowing and divine connection.",
      },
      general: {
        mystical: "Universal energies converge to address the core of your inquiry.",
        practical: "The situation calls for balanced consideration of multiple factors.",
        poetic: "Life's grand symphony plays the notes of your heart's deepest longing.",
      },
    }

    return categoryInsights[context.category]?.[style] || categoryInsights.general[style]
  }

  const getHouseInsight = (houseInfluence: [string, Charm[]], style: "mystical" | "practical" | "poetic") => {
    const [houseName, houseCharms] = houseInfluence
    const charmCount = houseCharms.length

    switch (style) {
      case "mystical":
        return `The ${houseName} realm holds ${charmCount > 1 ? "multiple keys" : "a significant key"} to understanding your path.`
      case "practical":
        return `Focus on ${houseName.toLowerCase()} matters, as ${charmCount > 1 ? "several factors" : "an important factor"} emerges here.`
      case "poetic":
        return `In the house of ${houseName.toLowerCase()}, ${charmCount > 1 ? "many flowers bloom" : "a single flower blooms"} with meaning for your journey.`
    }
  }

  const getThematicInsight = (themes: string[], charms: Charm[], style: "mystical" | "practical" | "poetic") => {
    const primaryTheme = themes[0]
    const themeInsights = {
      emotional: {
        mystical: "Emotional currents run deep, requiring both courage and compassion to navigate.",
        practical: "Emotional intelligence and clear boundaries will serve you well in this situation.",
        poetic: "The heart's wisdom speaks in whispers that only stillness can hear.",
      },
      action: {
        mystical: "The time for movement approaches, guided by inner knowing and outer signs.",
        practical: "Decisive action is favored, but ensure your steps are well-considered.",
        poetic: "Your soul calls for movement, like a river seeking its destined sea.",
      },
      wisdom: {
        mystical: "Ancient knowledge surfaces to illuminate your present circumstances.",
        practical: "Learning and understanding are your greatest tools in this situation.",
        poetic: "Wisdom flows like honey from the comb of experience and insight.",
      },
      challenge: {
        mystical: "Obstacles serve as teachers, each one holding gifts of strength and understanding.",
        practical: "Challenges present opportunities for growth and skill development.",
        poetic: "Every mountain climbed reveals new vistas of possibility and strength.",
      },
      opportunity: {
        mystical: "Doorways of possibility shimmer with potential, awaiting your recognition.",
        practical: "Multiple opportunities are available; timing and preparation are key.",
        poetic: "Opportunity dances at the edge of vision, inviting bold and graceful steps.",
      },
    }

    return (
      themeInsights[primaryTheme]?.[style] || "The energies present offer both challenge and opportunity for growth."
    )
  }

  const getCombinationInsight = (combination: any, style: "mystical" | "practical" | "poetic") => {
    if (!combination) return ""

    switch (style) {
      case "mystical":
        return `The mystical union of ${combination.charms.join(" and ")} creates a powerful portal of transformation.`
      case "practical":
        return `The combination of ${combination.charms.join(" and ")} suggests a balanced approach to your situation.`
      case "poetic":
        return `Where ${combination.charms.join(" meets ")} in sacred dance, new possibilities are born.`
    }
  }

  const getClosingGuidance = (context: any, style: "mystical" | "practical" | "poetic") => {
    const urgencyGuidance = {
      high: {
        mystical: "Trust your intuition to guide swift but wise action.",
        practical: "Act decisively while remaining open to course corrections.",
        poetic: "Let urgency be tempered by the wisdom of your deepest knowing.",
      },
      moderate: {
        mystical: "Allow the natural rhythm of unfolding to guide your timing.",
        practical: "Take measured steps while remaining alert to changing circumstances.",
        poetic: "Move with the grace of seasons, neither rushing nor delaying what must come.",
      },
      low: {
        mystical: "Patience and contemplation will reveal the perfect moment for action.",
        practical: "Use this time for planning and preparation before moving forward.",
        poetic: "In the garden of time, some seeds need seasons of quiet growth before blooming.",
      },
    }

    return (
      urgencyGuidance[context.urgency]?.[style] ||
      "Trust in the wisdom of your journey and the guidance that surrounds you."
    )
  }

  const combinations = charms.length > 0 ? findCharmCombinations(charms) : []

  if (!isVisible || charms.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-md mx-auto px-4">
      <div className="bg-black/30 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-white/90 mb-3 text-center tracking-wide">Reading Synopsis</h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/80 leading-relaxed mb-4"
        >
          {synopsis}
        </motion.p>

        {combinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
                  <div className="text-xs text-white/60 mt-1">{combo.description.split(".")[0]}...</div>
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
