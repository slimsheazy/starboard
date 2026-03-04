"use client"

import { useState, useEffect, useRef } from "react"
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

// ── Tension vocabulary keyed to charm + house domain collisions ──
// Each entry produces a sentence fragment that names the charm, the house keyword,
// and says something *specific* about what that collision means.
// The tone is deliberately uneven: some entries sting, some are neutral, some are warm.
const COLLISION_TEMPLATES: Record<string, (charm: string, kw: string, desc: string) => string> = {
  // Cautionary charms in vulnerable houses
  "red_light+intimacy": (c, kw) => `${c} fell in the house of ${kw}. Something you want to deepen is not ready to be deepened. Pressing harder here will break it.`,
  "fog+communication": (c, kw) => `${c} landed in the house of ${kw}. You think you're being clear. You are not. Re-read the last important message you sent.`,
  "thin_ice+resources": (c, kw) => `${c} in the house of ${kw}: a financial risk you're rationalizing. The ice will hold one more step, maybe two. Not three.`,
  "locked_door+partnership": (c, kw) => `${c} sits in the house of ${kw}. Someone has already made their decision, and it was not in your favor. Stop knocking.`,
  "mask+self": (c, kw) => `${c} in the house of ${kw}. The version of yourself you're presenting lately? Even you don't believe it.`,
  "interference+daily": (c, kw) => `${c} in the house of ${kw}. Your routines are being sabotaged -- possibly by your own habits, possibly by someone else's needs drowning yours out.`,
  "leak+security": (c, kw) => `${c} in the house of ${kw}. Something you depend on for stability is quietly losing pressure. Check the things you assume are fine.`,
  "storm_warning+home": (c, kw) => `${c} in the house of ${kw}. Domestic tension is building. It has not peaked yet.`,
  "quicksand+transformation": (c, kw) => `${c} in the house of ${kw}. You are trying to force a change that needs to happen on its own schedule. Let go or sink.`,
  "undertow+beliefs": (c, kw) => `${c} in the house of ${kw}. A belief you hold is pulling you somewhere you don't want to go. Name it.`,
  "shadow+self": (c, kw) => `${c} in the house of ${kw}. There is a part of yourself you've been refusing to look at. It is running the show anyway.`,
  "friction+partnership": (c, kw) => `${c} in the house of ${kw}. The tension between you and someone else is not creative -- it's erosive. Something has to give.`,
  "mirage+career": (c, kw) => `${c} in the house of ${kw}. That opportunity looks perfect from a distance. Walk closer and the details dissolve.`,
  "exposed+secrets": (c, kw) => `${c} in the house of ${kw}. Something private is about to become public. Decide now how you want to handle it, because the window for control is closing.`,

  // Positive charms in compatible houses
  "green_light+self": (c, kw) => `${c} in the house of ${kw}. Whatever you've been hesitating on -- you have permission. Not from anyone else. From yourself.`,
  "breakthrough+transformation": (c, kw) => `${c} in the house of ${kw}. The wall you've been pressing against is about to give. Do not mistake this for the wall pressing back.`,
  "anchor+home": (c, kw) => `${c} in the house of ${kw}. Your foundation is solid, even if everything above it feels shaky. Build from there.`,
  "compass+beliefs": (c, kw) => `${c} in the house of ${kw}. Your moral compass is accurate right now. Trust the direction it points even if it's inconvenient.`,
  "sunrise+self": (c, kw) => `${c} in the house of ${kw}. You are entering a new phase. The old version of you is not invited.`,
  "bridge+partnership": (c, kw) => `${c} in the house of ${kw}. A connection that seemed broken can be repaired -- but only if both sides walk to the middle.`,
  "harvest+career": (c, kw) => `${c} in the house of ${kw}. Results from old effort are arriving. This is not luck. This is compounding.`,
  "key+secrets": (c, kw) => `${c} in the house of ${kw}. You already have the answer. You've been looking at it for weeks without recognizing it.`,
  "spark+creation": (c, kw) => `${c} in the house of ${kw}. A small idea is more potent than it looks. Write it down before it dissipates.`,
  "oasis+service": (c, kw) => `${c} in the house of ${kw}. Relief is available in your daily work, not despite it. The task you dread least is the one that heals.`,
  "synchronicity+community": (c, kw) => `${c} in the house of ${kw}. The next important person you meet will seem like a coincidence. It is not.`,

  // Neutral / transitional charms -- pointed, not comforting
  "crossroads+career": (c, kw) => `${c} in the house of ${kw}. Two paths. Neither is wrong. But you cannot walk both, and the longer you straddle them the more you lose from each.`,
  "echo+home": (c, kw) => `${c} in the house of ${kw}. A family pattern is playing out again. You recognize it. The question is whether you'll interrupt it this time.`,
  "pause+transformation": (c, kw) => `${c} in the house of ${kw}. You are trying to change while running. Stop. The transformation requires stillness you haven't allowed yourself.`,
  "threshold+self": (c, kw) => `${c} in the house of ${kw}. You are standing in a doorway. Staying in the doorway is not a position -- it's avoidance.`,
  "pendulum+partnership": (c, kw) => `${c} in the house of ${kw}. The relationship swings between extremes. Neither extreme is the truth. The truth is in the stillness between.`,
  "hourglass+career": (c, kw) => `${c} in the house of ${kw}. A deadline you've been ignoring is real. It is closer than you think.`,
  "spiral+beliefs": (c, kw) => `${c} in the house of ${kw}. You have circled back to this lesson. It is not repetition -- you are deeper now and the stakes are higher.`,
  "metamorphosis+intimacy": (c, kw) => `${c} in the house of ${kw}. What you want from closeness is changing. The person beside you may or may not be able to change with it.`,
  "prism+communication": (c, kw) => `${c} in the house of ${kw}. There are at least three true versions of what happened. Yours is one of them. Not the only one.`,
  "tide+resources": (c, kw) => `${c} in the house of ${kw}. Money or energy will recede before it returns. Do not panic during the low. It is cyclical.`,
  "catalyst+secrets": (c, kw) => `${c} in the house of ${kw}. Something hidden is about to trigger a chain reaction. You may not control the trigger, but you can control what you do after.`,
  "detour+career": (c, kw) => `${c} in the house of ${kw}. The straight path to what you want is closed. The winding one is open and leads somewhere better -- but you won't believe that yet.`,
  "rewind+home": (c, kw) => `${c} in the house of ${kw}. An old domestic issue is resurfacing. Not to haunt you -- to be resolved properly this time.`,
  "gut_check+self": (c, kw) => `${c} in the house of ${kw}. Your body already knows the answer. The knot in your stomach or the lightness in your chest -- that is your reading.`,
  "fine_print+resources": (c, kw) => `${c} in the house of ${kw}. There is a clause, a condition, an asterisk somewhere in a financial arrangement you agreed to. Find it.`,
  "last_call+creation": (c, kw) => `${c} in the house of ${kw}. A creative window is closing. Ship it imperfect or don't ship it at all.`,
  "overtime+service": (c, kw) => `${c} in the house of ${kw}. You are giving more than you are receiving. This is not noble -- it is unsustainable.`,
  "tipping_point+transformation": (c, kw) => `${c} in the house of ${kw}. One more push and the entire structure shifts. This is not the time for half-measures.`,
  "deja_vu+partnership": (c, kw) => `${c} in the house of ${kw}. This dynamic has played out before with a different face. The face changed. Your pattern did not.`,
  "missed_call+community": (c, kw) => `${c} in the house of ${kw}. Someone reached out. You were distracted. The offer may still be open, but the warmth behind it has cooled.`,
  "open_tab+secrets": (c, kw) => `${c} in the house of ${kw}. There is unfinished emotional business you've been avoiding. It is not going away on its own.`,
  "wrong_turn+beliefs": (c, kw) => `${c} in the house of ${kw}. A mistake in judgment is not a character flaw -- unless you refuse to learn from it.`,
  "gasp+intimacy": (c, kw) => `${c} in the house of ${kw}. A revelation about someone close to you is coming. Brace for it, but do not pre-judge.`,
}

// House keyword normalization for template matching
function normalizeKeyword(kw: string): string {
  const k = kw.toLowerCase()
  if (/self|identity|genesis|image|body|physical|personal|soul|authentic/.test(k)) return "self"
  if (/partner|relationship|colleague|marriage|commit|romantic/.test(k)) return "partnership"
  if (/career|work|job|reputation|legacy|achievement|profession|public/.test(k)) return "career"
  if (/home|family|foundation|root|security|domestic|house|nurtur/.test(k)) return "home"
  if (/communication|learn|skill|idea|mental|thought|express|language/.test(k)) return "communication"
  if (/resource|money|income|asset|value|worth|financial|budget|salary/.test(k)) return "resources"
  if (/transform|death|rebirth|heal|power|change|depth/.test(k)) return "transformation"
  if (/creat|romance|pleasure|joy|passion|art|innovat/.test(k)) return "creation"
  if (/service|work|routine|habit|health|daily|task|practice|responsi/.test(k)) return "service"
  if (/belief|expan|philosophy|growth|travel|learn|vision|wisdom|spirit|perspective/.test(k)) return "beliefs"
  if (/community|friend|group|network|social|team|support|humanitarian/.test(k)) return "community"
  if (/secret|unconscious|spirit|dissol|hidden|intuit|subconscious|ending|rest|transcend|closure|unknown/.test(k)) return "secrets"
  if (/intima|shared|occult|vulner|depth|invest/.test(k)) return "intimacy"
  if (/daily|habit|routine|improve/.test(k)) return "daily"
  return "self" // fallback
}

function normalizeCharmName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "")
}

export default function ReadingSynopsis({ charms, houses, question, houseAssignments }: ReadingSynopsisProps) {
  const [synopsis, setSynopsis] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCombination, setSelectedCombination] = useState<any>(null)
  const assignmentsRef = useRef(houseAssignments)

  // Keep ref in sync so the generator always reads the latest assignments
  useEffect(() => {
    assignmentsRef.current = houseAssignments
  }, [houseAssignments])

  useEffect(() => {
    if (charms.length > 0 && houseAssignments && houseAssignments.length > 0) {
      setIsVisible(false)
      setSynopsis([])
      const timer = setTimeout(() => {
        const generated = generate(houseAssignments)
        setSynopsis(generated)
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [charms, houses, question, houseAssignments])

  // ── Build the house->charm map from ACTUAL board assignments ──
  function buildMap(assignments: HouseAssignment[]): Map<number, Charm[]> {
    const map = new Map<number, Charm[]>()
    for (const a of assignments) {
      const list = a.charmIndices.map((i) => charms[i]).filter(Boolean)
      if (list.length > 0) map.set(a.houseIndex, list)
    }
    return map
  }

  // ── Charm sentiment — expanded beyond just name matching ──
  function sentiment(charm: Charm): "positive" | "cautionary" | "neutral" {
    const blob = `${charm.name} ${charm.description}`.toLowerCase()
    const pos = /flow|green light|breakthrough|anchor|compass|sunrise|bridge|harvest|spark|oasis|key|shortcut|second wind|jumpstart|synchronicity|cosmic alignment|golden thread|phoenix rising|permission|renewed|clarity|connection|fresh|reward|solution|brilliant|momentum|confidence|effortless|fortune|favor/
    const neg = /red light|locked door|thin ice|fog|interference|exposed|storm warning|quicksand|undertow|mask|leak|shadow|friction|mirage|dark night|void|shattered mirror|stop|reconsider|disrupting|closed|caution|confusion|draining|struggle|illusion|hidden|off course|extreme|crisis|break|sabotage|erode|dissolve|sink|panic/
    if (pos.test(blob)) return "positive"
    if (neg.test(blob)) return "cautionary"
    return "neutral"
  }

  // ── Generate a specific charm+house reading line ──
  function readCharmInHouse(charm: Charm, house: House): string {
    const kw = house.contextKeyword || house.keyword
    const normalizedCharm = normalizeCharmName(charm.name)
    const normalizedHouse = normalizeKeyword(kw)
    const templateKey = `${normalizedCharm}+${normalizedHouse}`

    // Check for a hand-written collision template first
    const template = COLLISION_TEMPLATES[templateKey]
    if (template) {
      return template(charm.name, kw.toLowerCase(), charm.description.toLowerCase())
    }

    // Fallback: generate a specific sentence based on sentiment + house domain
    const s = sentiment(charm)
    const kwLow = kw.toLowerCase()
    const desc = charm.description.charAt(0).toLowerCase() + charm.description.slice(1)

    if (s === "cautionary") {
      const frames = [
        `${charm.name} landed in the house of ${kwLow}. In the context of ${house.description.toLowerCase()}, this is a warning: ${desc}. Do not ignore it.`,
        `${charm.name} in ${kwLow}: ${desc}. Applied to ${house.description.toLowerCase()}, this suggests something here is not what it seems.`,
        `The house of ${kwLow} received ${charm.name}. Regarding ${house.description.toLowerCase()}: ${desc}. Proceed with eyes open.`,
      ]
      return frames[charm.name.length % frames.length]
    }

    if (s === "positive") {
      const frames = [
        `${charm.name} in the house of ${kwLow}: ${desc}. As it applies to ${house.description.toLowerCase()} -- this is a genuine opening, not a false one.`,
        `The house of ${kwLow} caught ${charm.name}. In matters of ${house.description.toLowerCase()}, ${desc}. Trust this.`,
        `${charm.name} landed where ${kwLow} governs. ${desc}. The timing here is specific: act on ${house.description.toLowerCase().split(",")[0]} before the energy shifts.`,
      ]
      return frames[charm.name.length % frames.length]
    }

    // Neutral -- probing, not reassuring
    const frames = [
      `${charm.name} sits in the house of ${kwLow}. ${desc}. What this means for ${house.description.toLowerCase()} depends entirely on what you do next.`,
      `The house of ${kwLow} holds ${charm.name}: ${desc}. This is not good or bad news. It is a fact about your situation that demands honest assessment.`,
      `${charm.name} in ${kwLow}. ${desc}. Ask yourself how this applies to ${house.description.toLowerCase().split(",")[0]} -- the answer you resist is probably the right one.`,
    ]
    return frames[charm.name.length % frames.length]
  }

  // ── Main generation function ──
  function generate(assignments: HouseAssignment[]): string[] {
    const sections: string[] = []
    const map = buildMap(assignments)
    const combinations = findCharmCombinations(charms)

    const sentiments = charms.map(sentiment)
    const pos = sentiments.filter((s) => s === "positive").length
    const neg = sentiments.filter((s) => s === "cautionary").length
    const neu = sentiments.filter((s) => s === "neutral").length
    const rareCharms = charms.filter((c) => c.rarity === "rare")

    // Count empty houses
    const occupiedHouses = map.size
    const emptyHouses = 12 - occupiedHouses

    // ── Section 1: Opening ──
    if (question.trim()) {
      const q = question.length > 100 ? question.slice(0, 100) + "..." : question
      if (neg > pos + 2) {
        sections.push(`You asked: "${q}" -- The board answers with resistance. ${neg} of ${charms.length} charms carry caution. This does not mean "no." It means "not like this."`)
      } else if (pos > neg + 2) {
        sections.push(`You asked: "${q}" -- The cast leans forward, ${pos} of ${charms.length} charms carrying momentum. But ${neg > 0 ? `${neg} charm${neg > 1 ? "s" : ""} counsel${neg === 1 ? "s" : ""} restraint` : "none pull back"}, so check for blind optimism.`)
      } else {
        sections.push(`You asked: "${q}" -- The board is divided: ${pos} charms push forward, ${neg} pull back, ${neu} remain ambiguous. There is no clean answer here. Read the details.`)
      }
    } else {
      sections.push(`No question was posed. The charms cast a general map: ${pos} favorable, ${neg} cautionary, ${neu} neutral. ${emptyHouses > 4 ? `${emptyHouses} houses sit empty -- the energy is concentrated, not scattered.` : "The energy is broadly distributed."}`)
    }

    // ── Section 2: Structural observation (clustering, voids) ──
    const sorted = [...map.entries()].sort(([, a], [, b]) => b.length - a.length)
    const heaviest = sorted[0]
    if (heaviest && heaviest[1].length >= 2) {
      const house = houses[heaviest[0]]
      const kw = (house.contextKeyword || house.keyword).toLowerCase()
      const names = heaviest[1].map((c) => c.name)
      const sents = heaviest[1].map(sentiment)
      const allSame = sents.every((s) => s === sents[0])

      if (allSame && sents[0] === "cautionary") {
        sections.push(`${names.join(", ")} all landed in the house of ${kw} (${house.description.toLowerCase()}). That is ${heaviest[1].length} warnings concentrated in one area. This is not subtle. Something about ${kw} requires your immediate and honest attention.`)
      } else if (allSame && sents[0] === "positive") {
        sections.push(`${names.join(" and ")} converge in the house of ${kw}. Heavy support in one area can also mean you're over-investing there. Consider whether ${house.description.toLowerCase()} is getting attention at the expense of something else.`)
      } else {
        sections.push(`The house of ${kw} is crowded: ${names.join(", ")}. Mixed signals in ${house.description.toLowerCase()} -- the situation there is genuinely complicated, not simply good or bad.`)
      }
    }

    // Note empty quadrants
    const emptyKeywords: string[] = []
    for (let i = 0; i < houses.length; i++) {
      if (!map.has(i)) {
        emptyKeywords.push((houses[i].contextKeyword || houses[i].keyword).toLowerCase())
      }
    }
    if (emptyKeywords.length >= 4) {
      sections.push(`Notable silence in: ${emptyKeywords.slice(0, 4).join(", ")}. The absence of charms in these houses is itself information -- these areas are not where the action is right now.`)
    }

    // ── Section 3: Per-charm readings (ALL of them, in house order) ──
    const charmReadings: string[] = []
    for (const [houseIdx, charmsInHouse] of sorted) {
      const house = houses[houseIdx]
      for (const charm of charmsInHouse) {
        charmReadings.push(readCharmInHouse(charm, house))
      }
    }
    // Include all readings, split into groups for readability
    if (charmReadings.length > 0) {
      const mid = Math.ceil(charmReadings.length / 2)
      sections.push(charmReadings.slice(0, mid).join(" "))
      if (charmReadings.length > mid) {
        sections.push(charmReadings.slice(mid).join(" "))
      }
    }

    // ── Section 4: Rare charms ──
    if (rareCharms.length > 0) {
      for (const rare of rareCharms) {
        const assignment = assignments.find((a) => a.charmIndices.some((i) => charms[i]?.name === rare.name))
        if (assignment) {
          const house = houses[assignment.houseIndex]
          const kw = (house.contextKeyword || house.keyword).toLowerCase()
          sections.push(`Rare: ${rare.name} appeared in the house of ${kw}. ${rare.description}. Rare charms do not appear often and they do not appear randomly -- pay disproportionate attention to ${kw}.`)
        }
      }
    }

    // ── Section 5: Combinations ──
    if (combinations.length > 0) {
      for (const combo of combinations.slice(0, 2)) {
        sections.push(`[${combo.name}] ${combo.interpretation}`)
      }
    }

    // ── Section 6: Closing -- honest, not uplifting ──
    const ratio = charms.length > 0 ? neg / charms.length : 0
    if (ratio > 0.5) {
      sections.push("The weight of this reading is cautionary. That does not mean the situation is hopeless -- it means the current trajectory has problems. Adjust course.")
    } else if (ratio < 0.2 && pos > 5) {
      sections.push("The reading is unusually favorable. Be suspicious of easy answers. Look for the one thing this reading did NOT address -- that is likely where the real work is.")
    } else {
      sections.push("This reading is neither permission nor prohibition. It is a map. Maps do not walk for you.")
    }

    return sections
  }

  const combinations = charms.length > 0 ? findCharmCombinations(charms) : []

  // Build house distribution from real assignments for the tag display
  const houseDistribution: { keyword: string; count: number }[] = []
  if (houseAssignments) {
    for (const assignment of houseAssignments) {
      if (assignment.charmIndices.length > 0) {
        const house = houses[assignment.houseIndex]
        houseDistribution.push({
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

        <div className="space-y-3 mb-4">
          {synopsis.map((section, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.3 }}
              className="text-sm text-white/80 leading-relaxed"
            >
              {section}
            </motion.p>
          ))}
        </div>

        {houseDistribution.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + synopsis.length * 0.3 }}
            className="border-t border-white/10 pt-3 mb-4"
          >
            <h4 className="text-xs font-medium text-white/70 mb-2 tracking-wide">Board Layout</h4>
            <div className="flex flex-wrap gap-1">
              {houseDistribution.map(({ keyword, count }) => (
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
            transition={{ delay: 0.6 + synopsis.length * 0.3 }}
            className="border-t border-white/10 pt-3"
          >
            <h4 className="text-xs font-medium text-white/70 mb-2 tracking-wide">Active Combinations</h4>
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
