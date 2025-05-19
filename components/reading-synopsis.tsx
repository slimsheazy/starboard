"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { getCharmColor } from "@/lib/charm-colors"

interface ReadingSynopsisProps {
  charms: Charm[]
  houses: House[]
  question: string
}

export default function ReadingSynopsis({ charms, houses, question }: ReadingSynopsisProps) {
  const [synopsis, setSynopsis] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    if (charms.length === 0) return

    setIsGenerating(true)

    // Generate the reading synopsis
    const generatedSynopsis = generateSynopsis(charms, houses, question)

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

  if (isGenerating) {
    return (
      <div className="w-full max-w-md mx-auto mt-6 px-4">
        <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-sm text-white/50 mt-2">Interpreting the stars...</p>
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
        <h3 className="text-sm font-medium text-white/80 mb-2 text-center">Reading Synopsis</h3>
        <p className="text-sm text-white/70 leading-relaxed">{synopsis}</p>

        {dominantCategory && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
              Dominant theme: {dominantCategory}
            </span>
            {rareCharmCount > 0 && (
              <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                {rareCharmCount} rare {rareCharmCount === 1 ? "charm" : "charms"}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Improved function to generate a reading synopsis based on the charms, houses, and question
function generateSynopsis(charms: Charm[], houses: House[], question: string): string {
  // Analyze the question to understand context and intent
  const questionContext = analyzeQuestion(question)

  // Count charms by category
  const categoryCounts: Record<string, number> = {}
  charms.forEach((charm) => {
    const { category } = getCharmColor(charm.name)
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  // Find the dominant and secondary categories
  let dominantCategory = ""
  let secondaryCategory = ""
  let maxCount = 0
  let secondMaxCount = 0

  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      secondMaxCount = maxCount
      secondaryCategory = dominantCategory
      maxCount = count
      dominantCategory = category
    } else if (count > secondMaxCount) {
      secondMaxCount = count
      secondaryCategory = category
    }
  })

  // Count rare charms
  const rareCharms = charms.filter((charm) => charm.rarity === "rare")
  const rareCharmCount = rareCharms.length

  // Find notable charm combinations
  const hasFlowAndObstacle =
    charms.some((c) => c.name === "Flow") && charms.some((c) => c.name === "Hiccup" || c.name === "Interference")
  const hasRewindAndFuture =
    charms.some((c) => c.name === "Rewind") && charms.some((c) => c.name === "Quantum Leap" || c.name === "Jumpstart")
  const hasInsightPair = charms.some((c) => c.name === "Mirror Check") && charms.some((c) => c.name === "Gasp")
  const hasTransformationTriad =
    charms.some((c) => c.name === "Catalyst") &&
    charms.some((c) => c.name === "Tipping Point") &&
    charms.some((c) => c.name === "Transformation")

  // Find the most relevant house based on the question
  const focusHouse = findRelevantHouse(houses, questionContext)

  // Generate the synopsis - more concise and direct
  let synopsis = ""

  // Start with a context-aware introduction
  synopsis += generateIntroduction(questionContext, dominantCategory)

  // Add core insight based on dominant theme - keep it concise
  synopsis += generateCoreInsight(dominantCategory, questionContext)

  // Add specific charm combination insights if present - only the most relevant ones
  if (hasFlowAndObstacle && (questionContext.topic === "challenges" || questionContext.topic === "general")) {
    synopsis += `Adapt to obstacles rather than forcing your way through. `
  }

  if (
    hasRewindAndFuture &&
    (questionContext.topic === "past" || questionContext.topic === "future" || questionContext.topic === "general")
  ) {
    synopsis += `A past situation connects directly to a future opportunity. `
  }

  if (
    hasInsightPair &&
    (questionContext.topic === "insight" || questionContext.topic === "decision" || questionContext.topic === "general")
  ) {
    synopsis += `Self-reflection will lead to a sudden realization that changes your perspective. `
  }

  if (
    hasTransformationTriad &&
    (questionContext.topic === "change" || questionContext.topic === "growth" || questionContext.topic === "general")
  ) {
    synopsis += `You're beginning a significant transformation that will unfold in stages. `
  }

  // Add rare charm insight if present - keep it brief but meaningful
  if (rareCharmCount > 0) {
    synopsis += generateRareCharmInsight(rareCharms, questionContext)
  }

  // Add house-specific guidance if a focus house was identified
  if (focusHouse) {
    synopsis += `The ${focusHouse.name} (${focusHouse.contextKeyword || focusHouse.keyword}) is particularly activated, suggesting ${generateHouseInsight(focusHouse, dominantCategory, questionContext)}. `
  }

  // Add a practical, concise conclusion
  synopsis += generateConclusion(dominantCategory, questionContext)

  return synopsis
}

// Analyze the question to understand context and intent
function analyzeQuestion(question: string): {
  topic: string
  tense: "past" | "present" | "future"
  type: "what" | "how" | "why" | "when" | "where" | "who" | "yes/no" | "general"
  intent: "guidance" | "prediction" | "understanding" | "decision" | "confirmation" | "general"
  sentiment: "positive" | "negative" | "neutral"
  keywords: string[]
} {
  if (!question) {
    return {
      topic: "general",
      tense: "present",
      type: "general",
      intent: "general",
      sentiment: "neutral",
      keywords: [],
    }
  }

  const lowerQuestion = question.toLowerCase()

  // Determine topic
  let topic = "general"

  // Career and work
  if (/\b(career|job|work|business|profession|employment)\b/.test(lowerQuestion)) {
    topic = "career"
  }
  // Relationships
  else if (/\b(love|relationship|partner|marriage|dating|romance|boyfriend|girlfriend)\b/.test(lowerQuestion)) {
    topic = "relationships"
  }
  // Money and finances
  else if (/\b(money|finance|wealth|income|debt|investment|financial)\b/.test(lowerQuestion)) {
    topic = "financial"
  }
  // Health
  else if (/\b(health|wellness|illness|medical|fitness|diet|sick|healing)\b/.test(lowerQuestion)) {
    topic = "health"
  }
  // Family and home
  else if (/\b(family|home|parent|child|house|domestic)\b/.test(lowerQuestion)) {
    topic = "family"
  }
  // Personal growth
  else if (/\b(growth|improve|develop|better|potential|progress)\b/.test(lowerQuestion)) {
    topic = "growth"
  }
  // Spiritual
  else if (/\b(spirit|soul|meaning|purpose|faith|belief)\b/.test(lowerQuestion)) {
    topic = "spiritual"
  }
  // Decision
  else if (/\b(decision|choice|choose|option|path|direction)\b/.test(lowerQuestion)) {
    topic = "decision"
  }
  // Change
  else if (/\b(change|transition|transform|shift|move|new)\b/.test(lowerQuestion)) {
    topic = "change"
  }
  // Challenges
  else if (/\b(challenge|problem|difficult|struggle|obstacle|issue)\b/.test(lowerQuestion)) {
    topic = "challenges"
  }
  // Insight
  else if (/\b(insight|understand|clarity|realize|see|perspective)\b/.test(lowerQuestion)) {
    topic = "insight"
  }
  // Past
  else if (/\b(past|history|before|previous|used to|regret)\b/.test(lowerQuestion)) {
    topic = "past"
  }
  // Future
  else if (/\b(future|will|going to|plan|expect|anticipate)\b/.test(lowerQuestion)) {
    topic = "future"
  }

  // Determine tense
  let tense: "past" | "present" | "future" = "present"
  if (/\b(will|going to|future|plan|next|soon|tomorrow|upcoming)\b/.test(lowerQuestion)) {
    tense = "future"
  } else if (/\b(did|was|had|past|before|previous|history|ago)\b/.test(lowerQuestion)) {
    tense = "past"
  } else if (/\b(now|current|today|present|happening|am|is|are)\b/.test(lowerQuestion)) {
    tense = "present"
  }

  // Determine question type
  let type: "what" | "how" | "why" | "when" | "where" | "who" | "yes/no" | "general" = "general"
  if (lowerQuestion.startsWith("what") || lowerQuestion.includes(" what ")) {
    type = "what"
  } else if (lowerQuestion.startsWith("how") || lowerQuestion.includes(" how ")) {
    type = "how"
  } else if (lowerQuestion.startsWith("why") || lowerQuestion.includes(" why ")) {
    type = "why"
  } else if (lowerQuestion.startsWith("when") || lowerQuestion.includes(" when ")) {
    type = "when"
  } else if (lowerQuestion.startsWith("where") || lowerQuestion.includes(" where ")) {
    type = "where"
  } else if (lowerQuestion.startsWith("who") || lowerQuestion.includes(" who ")) {
    type = "who"
  } else if (/\b(should|will|can|is|are|do|does|am|have|has)\b/.test(lowerQuestion)) {
    type = "yes/no"
  }

  // Determine intent
  let intent: "guidance" | "prediction" | "understanding" | "decision" | "confirmation" | "general" = "general"
  if (/\b(should|advice|help|guide|direction)\b/.test(lowerQuestion)) {
    intent = "guidance"
  } else if (/\b(will|future|happen|outcome|result)\b/.test(lowerQuestion)) {
    intent = "prediction"
  } else if (/\b(why|how|understand|meaning|reason)\b/.test(lowerQuestion)) {
    intent = "understanding"
  } else if (/\b(decide|choice|choose|option|path)\b/.test(lowerQuestion)) {
    intent = "decision"
  } else if (/\b(right|correct|true|confirm|validate)\b/.test(lowerQuestion)) {
    intent = "confirmation"
  }

  // Determine sentiment
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  const positiveWords = /\b(good|better|best|positive|success|improve|hope|happy|joy|love|opportunity|growth)\b/
  const negativeWords =
    /\b(bad|worse|worst|negative|fail|problem|trouble|difficult|challenge|struggle|pain|sad|fear|worry)\b/

  if (positiveWords.test(lowerQuestion)) {
    sentiment = "positive"
  } else if (negativeWords.test(lowerQuestion)) {
    sentiment = "negative"
  }

  // Extract meaningful keywords
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "if",
    "because",
    "as",
    "what",
    "when",
    "where",
    "how",
    "why",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
    "about",
    "for",
    "to",
    "in",
    "on",
    "with",
    "by",
    "at",
    "from",
    "of",
    "my",
    "mine",
    "your",
    "yours",
    "their",
    "theirs",
    "our",
    "ours",
    "his",
    "her",
    "hers",
    "its",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "us",
    "them",
  ]

  const words = lowerQuestion.split(/\s+/)
  const keywords = words
    .map((word) => word.replace(/[.,?!;:'"()]/g, ""))
    .filter((word) => !stopWords.includes(word) && word.length > 2)

  return {
    topic,
    tense,
    type,
    intent,
    sentiment,
    keywords,
  }
}

// Find the most relevant house based on the question context
function findRelevantHouse(houses: House[], context: ReturnType<typeof analyzeQuestion>): House | undefined {
  const topicToHouseMap: Record<string, number[]> = {
    career: [10, 6, 2],
    relationships: [7, 5, 8],
    financial: [2, 8, 10],
    health: [6, 1, 12],
    family: [4, 5, 7],
    growth: [1, 9, 5],
    spiritual: [12, 9, 8],
    decision: [3, 7, 9],
    change: [8, 1, 9],
    challenges: [6, 8, 12],
    insight: [3, 9, 12],
    past: [4, 8, 12],
    future: [9, 10, 11],
    general: [1, 10, 7],
  }

  // Get relevant house numbers for the topic
  const relevantHouseNumbers = topicToHouseMap[context.topic] || topicToHouseMap.general

  // Find the first matching house
  for (const houseNumber of relevantHouseNumbers) {
    const house = houses.find((h) => h.number === houseNumber)
    if (house) return house
  }

  // Fallback to a default house if none found
  return houses.find((h) => h.number === 1)
}

// Generate a context-aware introduction
function generateIntroduction(context: ReturnType<typeof analyzeQuestion>, dominantCategory: string): string {
  if (!context.keywords.length) {
    return "The celestial patterns reveal "
  }

  // Handle different question types and intents
  if (context.intent === "guidance") {
    return "For guidance on this matter, the stars suggest "
  }

  if (context.intent === "prediction") {
    return "Looking toward your future, the celestial patterns indicate "
  }

  if (context.intent === "understanding") {
    return "To understand this situation better, the reading reveals "
  }

  if (context.intent === "decision") {
    return "To help with your decision, the stars highlight "
  }

  if (context.intent === "confirmation") {
    return "To confirm your thoughts, the reading shows "
  }

  // Handle different tenses
  if (context.tense === "past") {
    return "Regarding your past experiences, the reading indicates "
  }

  if (context.tense === "present") {
    return "In your current situation, the stars reveal "
  }

  if (context.tense === "future") {
    return "Looking ahead, your reading suggests "
  }

  // Default introduction
  return "Your reading reveals "
}

// Generate core insight based on dominant theme
function generateCoreInsight(dominantCategory: string, context: ReturnType<typeof analyzeQuestion>): string {
  const insights: Record<string, Record<string, string>> = {
    Growth: {
      career: "significant professional development opportunities.",
      relationships: "potential for deeper emotional connections.",
      financial: "expanding resources and opportunities.",
      health: "improving vitality and wellbeing.",
      family: "strengthening family bonds.",
      spiritual: "expanding spiritual awareness.",
      decision: "evolving perspectives that inform your choices.",
      challenges: "learning experiences within current difficulties.",
      general: "a period of personal expansion and development.",
    },
    Challenges: {
      career: "obstacles that will strengthen your professional skills.",
      relationships: "tests that will clarify your true connections.",
      financial: "temporary setbacks leading to better strategies.",
      health: "issues requiring attention and lifestyle changes.",
      family: "family dynamics that need addressing.",
      spiritual: "spiritual tests that deepen your understanding.",
      decision: "difficult choices that lead to growth.",
      general: "important obstacles that build your resilience.",
    },
    Opportunities: {
      career: "promising professional openings.",
      relationships: "new connections or relationship potential.",
      financial: "favorable financial possibilities.",
      health: "chances to improve your wellbeing.",
      family: "positive family developments.",
      spiritual: "openings for spiritual advancement.",
      decision: "favorable options becoming available.",
      general: "new possibilities worth exploring.",
    },
    Transitions: {
      career: "a career shift or evolution.",
      relationships: "changing relationship dynamics.",
      financial: "a financial phase change.",
      health: "a health transformation process.",
      family: "evolving family structures.",
      spiritual: "spiritual metamorphosis.",
      decision: "a turning point in your path.",
      general: "significant life changes unfolding.",
    },
    Insights: {
      career: "important professional realizations.",
      relationships: "deeper understanding of your connections.",
      financial: "clarity about your financial patterns.",
      health: "awareness of health factors.",
      family: "understanding of family dynamics.",
      spiritual: "spiritual revelations.",
      decision: "clarity for decision-making.",
      general: "valuable realizations coming into focus.",
    },
  }

  // Get the insight for the specific category and topic
  const topicInsight = insights[dominantCategory]?.[context.topic]

  // If no specific insight, use the general one
  return topicInsight || insights[dominantCategory]?.general || "important energies affecting your situation."
}

// Generate insight for rare charms
function generateRareCharmInsight(rareCharms: Charm[], context: ReturnType<typeof analyzeQuestion>): string {
  if (rareCharms.length === 0) return ""

  if (rareCharms.length === 1) {
    const charm = rareCharms[0]
    const insights: Record<string, string> = {
      Eclipse: "a profound realignment in your path.",
      Supernova: "a dramatic transformation in a key area.",
      Wormhole: "an unexpected shortcut or solution.",
      "Quantum Leap": "a sudden advancement or opportunity.",
      Stargate: "access to new dimensions of understanding.",
    }

    return `The rare ${charm.name} charm indicates ${insights[charm.name] || "a significant moment or opportunity"}. `
  }

  return `The presence of multiple rare charms signals an extraordinary period of transformation. `
}

// Generate house-specific insight
function generateHouseInsight(
  house: House,
  dominantCategory: string,
  context: ReturnType<typeof analyzeQuestion>,
): string {
  const houseInsights: Record<number, string> = {
    1: "focus on your identity and self-expression",
    2: "attention to your resources and values",
    3: "emphasis on communication and learning",
    4: "importance of your emotional foundation",
    5: "creative expression and joy",
    6: "daily habits and practical matters",
    7: "significant relationships and partnerships",
    8: "transformation and shared resources",
    9: "expansion of your perspective",
    10: "career direction and public image",
    11: "community connections and future vision",
    12: "subconscious patterns and spiritual insights",
  }

  return houseInsights[house.number] || "important energies in this area of life"
}

// Generate a practical, concise conclusion
function generateConclusion(dominantCategory: string, context: ReturnType<typeof analyzeQuestion>): string {
  const conclusions: Record<string, Record<string, string>> = {
    guidance: {
      Growth: "Focus on learning opportunities and stepping outside your comfort zone.",
      Challenges: "Address obstacles directly rather than avoiding them.",
      Opportunities: "Stay alert to new possibilities that align with your values.",
      Transitions: "Embrace change while maintaining your core values.",
      Insights: "Trust your intuition and inner knowing.",
      general: "Remain open to the guidance appearing in unexpected ways.",
    },
    prediction: {
      Growth: "Expect significant personal development in the coming period.",
      Challenges: "Prepare for tests that will ultimately strengthen you.",
      Opportunities: "Watch for doors opening in unexpected areas.",
      Transitions: "Anticipate meaningful shifts in your circumstances.",
      Insights: "Look for revelations that will clarify your path.",
      general: "The future holds important developments that require your attention.",
    },
    understanding: {
      Growth: "Your situation contains valuable lessons for your development.",
      Challenges: "Current difficulties are revealing important patterns.",
      Opportunities: "Understanding the potential in your situation is key.",
      Transitions: "This change is part of a larger meaningful pattern.",
      Insights: "The clarity you seek is emerging through reflection.",
      general: "The deeper meaning of your situation is becoming clearer.",
    },
    decision: {
      Growth: "Choose the path that offers the greatest potential for development.",
      Challenges: "Consider which option builds your strength and resilience.",
      Opportunities: "Select the choice that keeps the most possibilities open.",
      Transitions: "Decide which direction best supports necessary life changes.",
      Insights: "Trust your inner knowing when making this choice.",
      general: "Align your decision with your authentic values.",
    },
    general: {
      Growth: "Embrace opportunities for learning and expansion.",
      Challenges: "Face difficulties with courage and creativity.",
      Opportunities: "Remain receptive to new possibilities.",
      Transitions: "Flow with the changes occurring in your life.",
      Insights: "Trust the wisdom emerging within you.",
      general: "Pay attention to the patterns unfolding in your experience.",
    },
  }

  // Get the conclusion for the specific intent and dominant category
  return (
    conclusions[context.intent]?.[dominantCategory] ||
    conclusions.general[dominantCategory] ||
    conclusions.general.general
  )
}
