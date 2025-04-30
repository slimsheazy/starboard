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

// Function to generate a reading synopsis based on the charms, houses, and question
function generateSynopsis(charms: Charm[], houses: House[], question: string): string {
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

  // Get notable charms (rare ones or ones with significant meanings)
  const notableCharms = charms.filter(
    (charm) =>
      charm.rarity === "rare" ||
      charm.name === "Eclipse" ||
      charm.name === "Catalyst" ||
      charm.name === "Synchronicity" ||
      charm.name === "Tipping Point",
  )

  // Find specific charm combinations that have special meanings
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
  let focusHouse: House | undefined
  if (question) {
    const lowerQuestion = question.toLowerCase()
    if (lowerQuestion.includes("career") || lowerQuestion.includes("work") || lowerQuestion.includes("job"))
      focusHouse = houses.find((h) => h.number === 10 || h.number === 6)
    else if (
      lowerQuestion.includes("love") ||
      lowerQuestion.includes("relationship") ||
      lowerQuestion.includes("partner")
    )
      focusHouse = houses.find((h) => h.number === 7 || h.number === 5)
    else if (lowerQuestion.includes("money") || lowerQuestion.includes("finance"))
      focusHouse = houses.find((h) => h.number === 2 || h.number === 8)
    else if (lowerQuestion.includes("health") || lowerQuestion.includes("wellness"))
      focusHouse = houses.find((h) => h.number === 6 || h.number === 1)
    else if (lowerQuestion.includes("family") || lowerQuestion.includes("home"))
      focusHouse = houses.find((h) => h.number === 4)
    else if (lowerQuestion.includes("learn") || lowerQuestion.includes("study") || lowerQuestion.includes("education"))
      focusHouse = houses.find((h) => h.number === 3 || h.number === 9)
  }

  // Generate the synopsis
  let synopsis = ""

  // Start with a question-based intro if available
  if (question) {
    const lowerQuestion = question.toLowerCase()
    if (lowerQuestion.includes("should")) {
      synopsis += `Your question about ${lowerQuestion.includes("i") ? "what you should do" : "what action to take"} reveals `
    } else if (lowerQuestion.includes("when")) {
      synopsis += `Your timing question about ${lowerQuestion.substring(lowerQuestion.indexOf("when") + 5, lowerQuestion.indexOf("?") > 0 ? lowerQuestion.indexOf("?") : lowerQuestion.length).trim()} suggests `
    } else if (lowerQuestion.includes("why")) {
      synopsis += `Your search to understand ${lowerQuestion.substring(lowerQuestion.indexOf("why") + 4, lowerQuestion.indexOf("?") > 0 ? lowerQuestion.indexOf("?") : lowerQuestion.length).trim()} shows `
    } else if (lowerQuestion.includes("how")) {
      synopsis += `Your question about how to ${lowerQuestion.substring(lowerQuestion.indexOf("how") + 7, lowerQuestion.indexOf("?") > 0 ? lowerQuestion.indexOf("?") : lowerQuestion.length).trim()} indicates `
    } else if (lowerQuestion.includes("who")) {
      synopsis += `Your inquiry about ${lowerQuestion.substring(lowerQuestion.indexOf("who") + 4, lowerQuestion.indexOf("?") > 0 ? lowerQuestion.indexOf("?") : lowerQuestion.length).trim()} reveals `
    } else if (lowerQuestion.includes("where")) {
      synopsis += `Your location question about ${lowerQuestion.substring(lowerQuestion.indexOf("where") + 6, lowerQuestion.indexOf("?") > 0 ? lowerQuestion.indexOf("?") : lowerQuestion.length).trim()} points to `
    } else {
      // Extract key nouns from the question
      const words = lowerQuestion.split(" ")
      const keyNouns = words.filter(
        (word) =>
          word.length > 3 &&
          ![
            "what",
            "when",
            "where",
            "which",
            "will",
            "would",
            "could",
            "should",
            "about",
            "with",
            "from",
            "that",
            "this",
            "these",
            "those",
            "have",
            "does",
            "your",
          ].includes(word),
      )

      if (keyNouns.length > 0) {
        const randomNoun = keyNouns[Math.floor(Math.random() * keyNouns.length)]
        synopsis += `Your question about ${randomNoun} reveals `
      } else {
        synopsis += "Your inquiry reveals "
      }
    }
  } else {
    // Generic intros if no question
    const intros = [
      "The celestial alignment today reveals ",
      "The current astral pattern shows ",
      "Today's cosmic configuration indicates ",
      "The present stellar arrangement suggests ",
      "The astrological wheel currently presents ",
    ]
    synopsis += intros[Math.floor(Math.random() * intros.length)]
  }

  // Add dominant theme interpretation with more specificity
  if (dominantCategory === "Growth") {
    synopsis += `a significant period of personal development${maxCount > 4 ? ", particularly in your spiritual and intellectual dimensions" : ""}. `
    synopsis += `You're entering a phase where ${maxCount > 5 ? "profound" : "important"} inner expansion is not only possible but likely inevitable. `
  } else if (dominantCategory === "Challenges") {
    synopsis += `a series of ${maxCount > 5 ? "substantial" : "notable"} obstacles that require your focused attention and perseverance. `
    synopsis += `These challenges aren't meant to defeat you but to ${maxCount > 4 ? "fundamentally transform" : "strengthen"} your resolve and capabilities. `
  } else if (dominantCategory === "Opportunities") {
    synopsis += `${maxCount > 5 ? "exceptional" : "promising"} new possibilities that are emerging in your path. `
    synopsis += `These opportunities may appear ${maxCount > 4 ? "suddenly and require quick action" : "gradually but will require your recognition"}. `
  } else if (dominantCategory === "Transitions") {
    synopsis += `a period of ${maxCount > 5 ? "profound" : "significant"} change and transformation in your life. `
    synopsis += `You're standing at a threshold between what was and what will be, with ${maxCount > 4 ? "major shifts in your fundamental circumstances" : "important changes in your daily reality"}. `
  } else if (dominantCategory === "Relationships") {
    synopsis += `important dynamics in your connections with ${maxCount > 5 ? "someone deeply significant to you" : "others around you"}. `
    synopsis += `These relationships are ${maxCount > 4 ? "at a critical juncture that requires careful attention" : "highlighting important lessons for your personal growth"}. `
  } else if (dominantCategory === "Insights") {
    synopsis += `crucial realizations that are ${maxCount > 5 ? "about to dramatically shift your perspective" : "gradually coming into your awareness"}. `
    synopsis += `Your intuition is especially heightened now, offering ${maxCount > 4 ? "profound wisdom if you're willing to listen" : "valuable guidance for your current situation"}. `
  } else {
    synopsis += "a complex interplay of energies in your current situation. "
  }

  // Add secondary theme with more detail if available
  if (secondaryCategory && secondMaxCount > 1) {
    if (secondaryCategory === "Growth") {
      synopsis += `There's also significant potential for personal growth through ${secondMaxCount > 3 ? "deep inner work and self-reflection" : "learning from your experiences"}. `
    } else if (secondaryCategory === "Challenges") {
      synopsis += `Be prepared to navigate ${secondMaxCount > 3 ? "some particularly testing obstacles" : "challenges that will strengthen your resolve"}. `
    } else if (secondaryCategory === "Opportunities") {
      synopsis += `Look for ${secondMaxCount > 3 ? "unexpected doors opening in surprising areas of your life" : "new possibilities that may not be immediately obvious"}. `
    } else if (secondaryCategory === "Transitions") {
      synopsis += `Embrace the ${secondMaxCount > 3 ? "profound transformations" : "changes"} that are unfolding, as they're leading you to necessary evolution. `
    } else if (secondaryCategory === "Relationships") {
      synopsis += `Your connections with ${secondMaxCount > 3 ? "specific key people" : "others"} will play a ${secondMaxCount > 3 ? "crucial" : "significant"} role in this process. `
    } else if (secondaryCategory === "Insights") {
      synopsis += `Trust your ${secondMaxCount > 3 ? "deepest intuitive knowing" : "intuition"} to guide you through the uncertainties you face. `
    }
  }

  // Add specific charm combination interpretations
  if (hasFlowAndObstacle) {
    synopsis +=
      "You're facing obstacles that require you to adapt rather than force your way through. The path of least resistance may seem counterintuitive but will ultimately be most effective. "
  }

  if (hasRewindAndFuture) {
    synopsis +=
      "A situation from your past is directly connected to an opportunity in your future. Resolving old patterns will unlock new potential. "
  }

  if (hasInsightPair) {
    synopsis +=
      "A moment of self-reflection will lead to a sudden realization that changes your perspective on a current situation. Pay attention to subtle insights. "
  }

  if (hasTransformationTriad) {
    synopsis +=
      "You're at the beginning of a profound three-part transformation process. What begins as a small catalyst will reach a tipping point before leading to complete metamorphosis. "
  }

  // Add interpretation for rare charms if present with more specificity
  if (rareCharmCount > 0) {
    if (rareCharmCount === 1) {
      const rareCharm = rareCharms[0]
      synopsis += `The rare ${rareCharm.name} charm appearing in your reading is highly significant—it suggests ${
        rareCharm.name === "Eclipse"
          ? "a profound realignment of your priorities and path"
          : rareCharm.name === "Supernova"
            ? "a dramatic and possibly sudden transformation in a key area of your life"
            : rareCharm.name === "Wormhole"
              ? "an unexpected shortcut or solution that defies conventional approaches"
              : rareCharm.name === "Quantum Leap"
                ? "a sudden advancement or opportunity that seems to appear from nowhere"
                : "a particularly significant moment or opportunity"
      }. `
    } else if (rareCharmCount === 2) {
      synopsis += `The presence of multiple rare charms (${rareCharms[0].name}, ${rareCharms[1].name}) indicates an extraordinarily powerful period of potential transformation. These energies rarely appear together and suggest you're at a crucial crossroads with far-reaching implications. `
    } else {
      synopsis += `With ${rareCharmCount} rare charms present, this reading reveals one of the most significant periods you'll experience. The convergence of these powerful energies suggests a cosmic alignment that may only occur once in many years. Pay extremely close attention to synchronicities and unusual opportunities. `
    }
  }

  // Add a notable charm interpretation if available with more detail
  if (notableCharms.length > 0 && notableCharms[0].name !== rareCharms[0]?.name) {
    const notableCharm = notableCharms[0]
    synopsis += `The ${notableCharm.name} charm in your reading specifically points to ${getDetailedCharmInterpretation(notableCharm.name)}. `
  }

  // Add house-specific guidance if a focus house was identified
  if (focusHouse) {
    synopsis += `The ${focusHouse.name} (${focusHouse.keyword}) is particularly activated in this reading, suggesting that ${getHouseInterpretation(focusHouse, dominantCategory)}. `
  }

  // Add a conclusion based on the overall reading with specific advice
  const conclusions = [
    `Consider how these specific energies are manifesting in your ${
      dominantCategory === "Relationships"
        ? "connections with others"
        : dominantCategory === "Growth"
          ? "personal development"
          : dominantCategory === "Challenges"
            ? "current obstacles"
            : dominantCategory === "Opportunities"
              ? "potential paths forward"
              : dominantCategory === "Transitions"
                ? "life changes"
                : dominantCategory === "Insights"
                  ? "thought patterns"
                  : "daily experience"
    }.`,

    `To best navigate this period, focus on ${
      dominantCategory === "Relationships"
        ? "authentic communication and emotional honesty"
        : dominantCategory === "Growth"
          ? "learning opportunities and self-improvement"
          : dominantCategory === "Challenges"
            ? "resilience and creative problem-solving"
            : dominantCategory === "Opportunities"
              ? "remaining open and responsive to new possibilities"
              : dominantCategory === "Transitions"
                ? "accepting change while maintaining your core values"
                : dominantCategory === "Insights"
                  ? "meditation and reflective practices"
                  : "balance and mindfulness"
    }.`,

    `The most important action you can take now is to ${
      dominantCategory === "Relationships"
        ? "invest time in the connections that truly matter"
        : dominantCategory === "Growth"
          ? "step outside your comfort zone deliberately"
          : dominantCategory === "Challenges"
            ? "face difficulties directly rather than avoiding them"
            : dominantCategory === "Opportunities"
              ? "say yes to experiences that align with your values"
              : dominantCategory === "Transitions"
                ? "release what no longer serves your evolution"
                : dominantCategory === "Insights"
                  ? "trust your inner knowing above external opinions"
                  : "create harmony between your actions and your intentions"
    }.`,

    `Pay special attention to ${
      dominantCategory === "Relationships"
        ? "how you respond to others' needs and boundaries"
        : dominantCategory === "Growth"
          ? "subtle lessons hidden in everyday experiences"
          : dominantCategory === "Challenges"
            ? "the wisdom each obstacle contains"
            : dominantCategory === "Opportunities"
              ? "synchronicities and unexpected connections"
              : dominantCategory === "Transitions"
                ? "the emotions that arise during periods of change"
                : dominantCategory === "Insights"
                  ? "dreams, intuitive flashes, and gut feelings"
                  : "the patterns emerging in your experience"
    }.`,

    `This is a powerful time to ${
      dominantCategory === "Relationships"
        ? "heal old wounds in your connections"
        : dominantCategory === "Growth"
          ? "invest in your personal development"
          : dominantCategory === "Challenges"
            ? "develop new strengths through adversity"
            : dominantCategory === "Opportunities"
              ? "expand your horizons in meaningful ways"
              : dominantCategory === "Transitions"
                ? "embrace transformation wholeheartedly"
                : dominantCategory === "Insights"
                  ? "deepen your spiritual practices"
                  : "align your actions with your highest values"
    }.`,
  ]

  synopsis += conclusions[Math.floor(Math.random() * conclusions.length)]

  return synopsis
}

// Helper function to get detailed interpretations for specific charms
function getDetailedCharmInterpretation(charmName: string): string {
  const interpretations: Record<string, string> = {
    Flow: "a need to surrender to natural rhythms rather than forcing outcomes—specifically, the situation you're concerned about requires adaptability and patience rather than direct action",
    Catalyst:
      "a specific trigger event that will set larger changes in motion—be particularly attentive to seemingly small but unusual occurrences in the coming days",
    Detour:
      "an unexpected path that initially seems to take you away from your goal but will ultimately lead you to a better destination than your original route",
    Shortcut:
      "an opportunity to accelerate your progress through unconventional means—look for solutions that others might overlook",
    Backdrop:
      "the environment or context of your situation being more significant than the specific details—pay attention to the setting and underlying conditions",
    Rewind:
      "the need to revisit a specific past situation or decision that contains unresolved elements crucial to your current progress",
    "Gut Check":
      "a situation where your intuition will be more reliable than logical analysis—particularly when making an important decision in the near future",
    "Fine Print":
      "crucial details that are easy to miss but will significantly impact outcomes—take extra time to examine all aspects of any agreements",
    "Last Call":
      "a final opportunity that's about to expire—something you've been considering but delaying requires immediate action",
    Overtime:
      "a situation requiring additional effort beyond what you initially expected—the extra investment will yield proportionally greater results",
    "Tipping Point":
      "a delicate balance that's about to shift dramatically—small actions now will have amplified consequences",
    Reminder:
      "knowledge you already possess but have forgotten or overlooked—the solution you seek is already within your awareness",
    Interference:
      "external factors actively disrupting your plans—identify specific sources of opposition and adjust your approach accordingly",
    "Missed Call":
      "an opportunity you didn't recognize when it first appeared—look back at recent offers or ideas you dismissed",
    "Open Tab":
      "unfinished business that must be addressed before you can progress—specifically, an incomplete project or conversation",
    "Out of Context":
      "a situation where you lack crucial information—suspend judgment until you understand the complete picture",
    "Déjà Vu":
      "a recurring pattern in your life that contains an important lesson—this cycle will continue until you address its root cause",
    Jumpstart:
      "a sudden infusion of energy or motivation coming soon—prepare to capitalize on this burst of productivity",
    "Red Light":
      "a clear warning to stop your current approach—continuing on your present path leads to unfavorable outcomes",
    "Second Wind":
      "renewed strength arriving after a period of difficulty—perseverance through your current challenges will be rewarded",
    Exposed:
      "hidden truths coming to light in a specific situation—prepare for revelations that may initially be uncomfortable but ultimately liberating",
    Synchronicity:
      "meaningful coincidences guiding your path—pay special attention to unusual patterns, repeated numbers, or chance encounters",
    "Locked Door":
      "a path that's currently inaccessible for good reason—this obstacle is protecting you from a premature or misaligned direction",
    "Wrong Turn":
      "a mistake that will lead to unexpected positive outcomes—what initially seems like an error contains a hidden opportunity",
    Hiccup:
      "minor obstacles that are more annoying than significant—maintain perspective rather than allowing small problems to derail your focus",
    Fog: "temporary confusion or uncertainty that will eventually clear—avoid making major decisions until visibility improves",
    "Mirror Check": "the need for honest self-reflection about your motivations and behaviors in a specific situation",
    Gasp: "a sudden realization or insight that will change your perspective—remain open to surprising information",
    "Thin Ice": "a precarious situation requiring extreme caution—proceed carefully and be mindful of warning signs",
    Eclipse:
      "a rare alignment bringing profound change to your fundamental circumstances—what seems like an ending is actually a powerful new beginning",
    Supernova:
      "an explosive transformation that will completely reshape a key area of your life—prepare for dramatic but ultimately positive change",
    Wormhole:
      "an unexpected shortcut through what seemed like insurmountable challenges—an unusual solution will present itself",
    "Quantum Leap":
      "an inexplicable jump forward in your journey—progress that normally would take months or years may happen very rapidly",
    Stargate:
      "access to entirely new dimensions of understanding—your perspective is about to expand in ways you cannot currently imagine",
  }

  return interpretations[charmName] || "an important influence in your current situation that requires your attention"
}

// Helper function to get house-specific interpretations
function getHouseInterpretation(house: House, dominantCategory: string): string {
  const houseInterpretations: Record<number, Record<string, string>> = {
    1: {
      Growth: "your personal identity and self-image are evolving in significant ways",
      Challenges: "you're facing important tests of your self-confidence and personal direction",
      Opportunities: "new possibilities for self-expression and authentic living are emerging",
      Transitions: "your sense of self is undergoing important transformation",
      Relationships: "how you present yourself to others is particularly significant now",
      Insights: "deeper understanding of your true self is becoming available",
      default: "your personal identity and how you project yourself are key themes",
    },
    2: {
      Growth: "your relationship with material resources and self-worth is developing",
      Challenges: "financial or value-based issues require your attention",
      Opportunities: "new resources or income sources may become available",
      Transitions: "your financial situation or value system is changing",
      Relationships: "shared resources or differing values in relationships are highlighted",
      Insights: "new understanding about what truly matters to you is emerging",
      default: "your resources, values, and sense of self-worth are key themes",
    },
    3: {
      Growth: "your communication skills and mental processes are developing",
      Challenges: "difficulties in expressing yourself or processing information need addressing",
      Opportunities: "new learning opportunities or connections with siblings/neighbors are appearing",
      Transitions: "your communication style or thinking patterns are changing",
      Relationships: "how you communicate within relationships is highlighted",
      Insights: "new mental connections and ideas are becoming available",
      default: "communication, learning, and your immediate environment are key themes",
    },
    4: {
      Growth: "your sense of home, family, and emotional security is developing",
      Challenges: "family matters or issues related to your foundations require attention",
      Opportunities: "new possibilities for creating security and belonging are emerging",
      Transitions: "your home situation or family dynamics are changing",
      Relationships: "family connections or your emotional foundations in relationships are highlighted",
      Insights: "deeper understanding of your emotional needs is becoming available",
      default: "your home, family, and emotional foundations are key themes",
    },
    5: {
      Growth: "your creative expression and capacity for joy are expanding",
      Challenges: "obstacles to self-expression or pleasure need addressing",
      Opportunities: "new avenues for creativity, romance, or joy are appearing",
      Transitions: "your relationship with pleasure and self-expression is changing",
      Relationships: "romantic connections or creative collaborations are highlighted",
      Insights: "new understanding about what brings you joy is emerging",
      default: "creativity, pleasure, and self-expression are key themes",
    },
    6: {
      Growth: "your work habits, health practices, and service to others are developing",
      Challenges: "health matters or work-related issues require attention",
      Opportunities: "new possibilities for improving your daily life or work are emerging",
      Transitions: "your daily routines or approach to service is changing",
      Relationships: "working relationships or how you care for others are highlighted",
      Insights: "new understanding about effective habits and routines is becoming available",
      default: "your health, daily routines, and service to others are key themes",
    },
    7: {
      Growth: "your approach to partnerships and one-on-one relationships is developing",
      Challenges: "relationship difficulties or contractual matters need addressing",
      Opportunities: "new partnerships or deeper connection in existing relationships are possible",
      Transitions: "your relationship dynamics or partnership status is changing",
      Relationships: "the balance of give and take in your close relationships is highlighted",
      Insights: "new understanding about what you need in partnerships is emerging",
      default: "partnerships, contracts, and one-on-one relationships are key themes",
    },
    8: {
      Growth: "your relationship with transformation, shared resources, and intimacy is developing",
      Challenges: "issues related to shared finances, intimacy, or letting go need addressing",
      Opportunities: "powerful transformative experiences or financial benefits are possible",
      Transitions: "your approach to intimacy or shared resources is fundamentally changing",
      Relationships: "the deeper, more intimate aspects of your relationships are highlighted",
      Insights: "profound realizations about your fears and desires are becoming available",
      default: "transformation, shared resources, and intimacy are key themes",
    },
    9: {
      Growth: "your worldview, beliefs, and higher learning are expanding",
      Challenges: "philosophical questions or issues related to your beliefs need addressing",
      Opportunities: "travel, education, or spiritual advancement are becoming possible",
      Transitions: "your belief system or life philosophy is changing",
      Relationships: "connections with people from different backgrounds are highlighted",
      Insights: "new understanding about your place in the larger world is emerging",
      default: "higher learning, travel, and your belief systems are key themes",
    },
    10: {
      Growth: "your career path, public image, and life direction are developing",
      Challenges: "professional obstacles or reputation issues need addressing",
      Opportunities: "advancement in your career or public recognition is possible",
      Transitions: "your professional identity or life direction is changing",
      Relationships: "professional connections or your public persona in relationships are highlighted",
      Insights: "clearer vision of your life's work is becoming available",
      default: "your career, reputation, and life direction are key themes",
    },
    11: {
      Growth: "your social networks, group affiliations, and future vision are developing",
      Challenges: "issues with friends, groups, or your long-term goals need addressing",
      Opportunities: "new social connections or progress toward your aspirations are possible",
      Transitions: "your social circle or approach to achieving your hopes is changing",
      Relationships: "friendships and community connections are highlighted",
      Insights: "clearer understanding of your ideal future is becoming available",
      default: "friendships, group activities, and your hopes for the future are key themes",
    },
    12: {
      Growth: "your spiritual awareness and subconscious patterns are developing",
      Challenges: "hidden issues or self-limiting patterns need addressing",
      Opportunities: "spiritual insights or release from old limitations are possible",
      Transitions: "your relationship with your inner world is changing",
      Relationships: "unconscious patterns in your relationships are highlighted",
      Insights: "access to your deeper wisdom and intuition is becoming available",
      default: "your spiritual life, unconscious patterns, and hidden strengths are key themes",
    },
  }

  return (
    houseInterpretations[house.number]?.[dominantCategory] ||
    houseInterpretations[house.number]?.default ||
    `the themes of ${house.keyword} are particularly important right now`
  )
}
