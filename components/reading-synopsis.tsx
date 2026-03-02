"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { findCharmCombinations } from "@/lib/charm-combinations"
import CombinationDetails from "./combination-details"

interface ReadingSynopsisProps {
  charms: Charm[]
  houses: House[]
  question: string
}

/* ------------------------------------------------------------------ */
/*  Helpers: classify the question & charms so the synopsis can speak  */
/*  directly to what the user asked                                    */
/* ------------------------------------------------------------------ */

type Category =
  | "career"
  | "relationships"
  | "financial"
  | "health"
  | "family"
  | "spiritual"
  | "decision"
  | "general"

type Tone = "cautionary" | "encouraging" | "transformative" | "mixed"

function detectCategory(q: string): Category {
  const l = q.toLowerCase()
  if (/\b(career|job|work|business|promotion|interview|boss|coworker|profession|employ)/i.test(l)) return "career"
  if (/\b(love|relationship|partner|romance|dating|marriage|breakup|ex |crush|soulmate)/i.test(l)) return "relationships"
  if (/\b(money|financ|wealth|income|debt|saving|invest|salary|budget)/i.test(l)) return "financial"
  if (/\b(health|wellness|healing|illness|fitness|diet|medical|mental|anxiety|depress)/i.test(l)) return "health"
  if (/\b(family|home|parent|child|mother|father|sibling|son|daughter)/i.test(l)) return "family"
  if (/\b(spirit|soul|meaning|purpose|faith|meditat|pray|divine|karma)/i.test(l)) return "spiritual"
  if (/\b(should i|decide|choice|choose|option|which|or )/i.test(l)) return "decision"
  return "general"
}

function classifyCharmTone(c: Charm): "positive" | "cautionary" | "neutral" {
  const words = `${c.name} ${c.description}`.toLowerCase()
  if (/stop|caution|obstacle|block|closed|wrong|thin ice|fog|interference|red light|locked|leak|friction|quicksand|undertow|shadow|mask|mirage|storm|void|dark night|shattered/.test(words))
    return "cautionary"
  if (/flow|shortcut|green|breakthrough|anchor|compass|sunrise|bridge|harvest|spark|oasis|key|second wind|jumpstart|cosmic align|golden thread|phoenix|synchronicity|stargate/.test(words))
    return "positive"
  return "neutral"
}

function overallTone(charms: Charm[]): Tone {
  let pos = 0
  let caut = 0
  charms.forEach((c) => {
    const t = classifyCharmTone(c)
    if (t === "positive") pos++
    if (t === "cautionary") caut++
  })
  if (pos >= 5 && caut <= 2) return "encouraging"
  if (caut >= 5 && pos <= 2) return "cautionary"
  if (pos >= 3 && caut >= 3) return "mixed"
  return "transformative"
}

/** Pick n random items from arr */
function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const result: T[] = []
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

/* ------------------------------------------------------------------ */
/*  Core synopsis builder - references the actual question & charms    */
/* ------------------------------------------------------------------ */

function buildSynopsis(question: string, charms: Charm[], houses: House[]): string {
  const category = detectCategory(question)
  const tone = overallTone(charms)
  const combinations = findCharmCombinations(charms)

  const positiveCharms = charms.filter((c) => classifyCharmTone(c) === "positive")
  const cautionaryCharms = charms.filter((c) => classifyCharmTone(c) === "cautionary")
  const neutralCharms = charms.filter((c) => classifyCharmTone(c) === "neutral")

  // Select featured charms to reference by name
  const featured = pick(charms, 4)
  const parts: string[] = []

  // 1. Opening - reference the question directly
  parts.push(buildOpening(question, category, tone))

  // 2. Highlight specific charms that appeared
  parts.push(buildCharmHighlights(featured, category, question))

  // 3. Address positive signals
  if (positiveCharms.length > 0) {
    const names = pick(positiveCharms, Math.min(3, positiveCharms.length)).map((c) => c.name)
    parts.push(buildPositiveSection(names, category))
  }

  // 4. Address warnings / caution
  if (cautionaryCharms.length > 0) {
    const names = pick(cautionaryCharms, Math.min(2, cautionaryCharms.length)).map((c) => c.name)
    parts.push(buildCautionSection(names, category))
  }

  // 5. Combination insight (use the rich interpretation from charm-combinations)
  if (combinations.length > 0) {
    const best = combinations[0]
    parts.push(
      `The ${best.name} combination (${best.charms.join(" + ")}) is especially significant: ${best.interpretation.split(".").slice(0, 2).join(".")}.`
    )
  }

  // 6. Closing guidance tied to the question
  parts.push(buildClosing(question, category, tone, charms))

  return parts.join(" ")
}

/* ---- Opening ---- */
function buildOpening(question: string, category: Category, tone: Tone): string {
  const hasQuestion = question.trim().length > 0

  if (!hasQuestion) {
    const general: Record<Tone, string> = {
      encouraging: "The charms cast a bright pattern today - the cosmos is signaling forward momentum in your life.",
      cautionary: "The charms carry a serious tone today - there are areas in your life calling for careful attention.",
      transformative: "A powerful shift is emerging in this reading - the charms point toward deep change ahead.",
      mixed: "Your reading holds both promise and caution - a nuanced picture is forming.",
    }
    return general[tone]
  }

  // With a question, reference it directly
  const categoryOpeners: Record<Category, Record<Tone, string>> = {
    career: {
      encouraging: `Regarding your question about your career - the charms are overwhelmingly supportive. The energy around your professional life is opening up.`,
      cautionary: `Your question about work draws a reading that urges caution. Not every opportunity in front of you is what it seems.`,
      transformative: `Your career question has summoned charms of deep transformation. The professional path you know may be giving way to something very different.`,
      mixed: `The charms give a complex answer to your career question - there are doors opening and doors closing simultaneously.`,
    },
    relationships: {
      encouraging: `In answer to your question about love - the charms are warm and affirming. Connection is favored right now.`,
      cautionary: `Your question about relationships draws a protective reading. The charms are asking you to look more carefully at the dynamics around you.`,
      transformative: `The charms answer your relationship question with a call for transformation. The way you connect with others is evolving.`,
      mixed: `Your love question receives a layered response - both tenderness and tension are present in the charms.`,
    },
    financial: {
      encouraging: `Regarding your financial question - the charms align favorably. Resources and opportunities are flowing in your direction.`,
      cautionary: `Your money question draws a cautious reading. The charms urge you to scrutinize the details before making moves.`,
      transformative: `The charms answer your financial question with signals of major change. Your relationship with resources is shifting.`,
      mixed: `Your financial question gets a nuanced answer - there is potential for growth, but also areas requiring vigilance.`,
    },
    health: {
      encouraging: `In response to your health question - the charms show healing energy and renewal. Your body and mind are moving toward balance.`,
      cautionary: `Your health question draws a reading that emphasizes awareness. The charms are asking you to pay closer attention to signals from your body.`,
      transformative: `The charms answer your health question with a theme of metamorphosis. A new chapter in your wellbeing is beginning.`,
      mixed: `Your health question receives a balanced reading - there are areas of strength and areas that need more care.`,
    },
    family: {
      encouraging: `Regarding your family question - the charms radiate warmth and connection. Bonds are strengthening around you.`,
      cautionary: `Your family question draws a reading that asks for patience. There are undercurrents within your household that need gentle attention.`,
      transformative: `The charms answer your family question with themes of deep change. Family dynamics are rearranging themselves.`,
      mixed: `Your question about family draws a complex picture - love is present but so are growing pains.`,
    },
    spiritual: {
      encouraging: `In answer to your spiritual question - the charms resonate with alignment. You are closer to your truth than you realize.`,
      cautionary: `Your spiritual question draws a grounding reading. The charms suggest the answers you seek require patience, not rushing.`,
      transformative: `The charms answer your spiritual question with deep intensity. A significant awakening or shift in understanding is at hand.`,
      mixed: `Your spiritual inquiry receives a multifaceted response - expansion and uncertainty coexist in this moment.`,
    },
    decision: {
      encouraging: `Regarding your decision - the charms lean in a clear direction. The energy supports forward movement.`,
      cautionary: `Your question about this choice draws a cautious reading. The charms suggest you don't have all the information yet.`,
      transformative: `The charms respond to your decision with a message of radical change. Whatever you choose, things will look very different after.`,
      mixed: `Your decision question draws a balanced reading - both paths have merit, but only one aligns with your deeper truth.`,
    },
    general: {
      encouraging: `The charms respond to your question with bright, forward energy. The path ahead looks open and supportive.`,
      cautionary: `Your question draws a cautious reading from the charms. There are factors you may not yet see that deserve attention.`,
      transformative: `The charms answer your question with transformative intensity. Something in your life is ready to change shape entirely.`,
      mixed: `Your question receives a layered reading - the charms hold both encouragement and important warnings.`,
    },
  }

  return categoryOpeners[category]?.[tone] ?? categoryOpeners.general[tone]
}

/* ---- Charm highlights - reference actual drawn charms ---- */
function buildCharmHighlights(featured: Charm[], category: Category, question: string): string {
  if (featured.length === 0) return ""

  const lines: string[] = []

  featured.forEach((charm) => {
    const tone = classifyCharmTone(charm)

    if (tone === "positive") {
      lines.push(
        `${charm.name} appeared in your spread - "${charm.description.toLowerCase()}" - reinforcing that things are moving in your favor.`
      )
    } else if (tone === "cautionary") {
      lines.push(
        `${charm.name} landed in your reading as well, a signal to "${charm.description.toLowerCase()}" before proceeding.`
      )
    } else {
      lines.push(
        `${charm.name} ("${charm.description.toLowerCase()}") adds depth and nuance to the picture.`
      )
    }
  })

  // Return 2-3 of them to keep it concise
  return lines.slice(0, 3).join(" ")
}

/* ---- Positive section ---- */
function buildPositiveSection(names: string[], category: Category): string {
  const list = names.join(", ")
  const categoryHints: Record<Category, string> = {
    career: `Charms like ${list} point toward professional momentum and recognition.`,
    relationships: `With ${list} in the reading, the energy around your connections is warm and receptive.`,
    financial: `${list} signal favorable conditions for financial growth and stability.`,
    health: `The presence of ${list} suggests your body and spirit are in a cycle of recovery and strength.`,
    family: `${list} bring a sense of harmony and deepening bonds within your family circle.`,
    spiritual: `${list} indicate you're entering a period of heightened intuition and inner clarity.`,
    decision: `${list} tip the scales toward a positive outcome if you trust the direction they suggest.`,
    general: `The encouraging presence of ${list} signals forward movement and support from the universe.`,
  }
  return categoryHints[category] ?? categoryHints.general
}

/* ---- Caution section ---- */
function buildCautionSection(names: string[], category: Category): string {
  const list = names.join(" and ")
  const categoryHints: Record<Category, string> = {
    career: `However, ${list} in your spread warn against rushing into professional commitments without due diligence.`,
    relationships: `But ${list} serve as a reminder - not everything is as it appears on the surface. Guard your boundaries.`,
    financial: `${list} urge caution with finances right now. Read the fine print and watch for hidden costs.`,
    health: `${list} are a gentle warning to not ignore what your body is telling you. Rest and reassessment are needed.`,
    family: `${list} suggest unresolved tension beneath the surface of family dynamics. Address it before it grows.`,
    spiritual: `${list} remind you that spiritual growth sometimes requires confronting uncomfortable truths.`,
    decision: `${list} caution that there may be information you're missing. Slow down and investigate further.`,
    general: `${list} introduce a note of caution - pay attention to what feels "off" and don't ignore your instincts.`,
  }
  return categoryHints[category] ?? categoryHints.general
}

/* ---- Closing guidance ---- */
function buildClosing(question: string, category: Category, tone: Tone, charms: Charm[]): string {
  const rareCharms = charms.filter((c) => c.rarity === "rare")
  const hasRare = rareCharms.length > 0

  let rareNote = ""
  if (hasRare) {
    const rareNames = rareCharms.map((c) => c.name).join(", ")
    rareNote = ` The rare appearance of ${rareNames} amplifies the power of this reading considerably.`
  }

  const closings: Record<Tone, string> = {
    encouraging: `Overall, the charms favor bold, confident action. Trust the momentum.${rareNote}`,
    cautionary: `The overarching message is to slow down, look closely, and protect yourself before making moves.${rareNote}`,
    transformative: `This reading signals a turning point - embrace the change rather than resisting it.${rareNote}`,
    mixed: `The charms ask you to hold both optimism and discernment at once - move forward, but with your eyes open.${rareNote}`,
  }

  return closings[tone]
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReadingSynopsis({ charms, houses, question }: ReadingSynopsisProps) {
  const [synopsis, setSynopsis] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCombination, setSelectedCombination] = useState<ReturnType<typeof findCharmCombinations>[number] | null>(null)

  useEffect(() => {
    if (charms.length > 0) {
      const timer = setTimeout(() => {
        setSynopsis(buildSynopsis(question, charms, houses))
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [charms, houses, question])

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
