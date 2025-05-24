import type { Charm } from "./types"

export interface CharmCombination {
  charms: string[]
  name: string
  description: string
  interpretation: string
  rarity: "common" | "uncommon" | "rare" | "legendary"
  category: "power" | "warning" | "transformation" | "insight" | "timing"
}

export const charmCombinations: CharmCombination[] = [
  // LEGENDARY COMBINATIONS (3+ charms)
  {
    charms: ["Catalyst", "Tipping Point", "Supernova"],
    name: "The Trinity of Destruction",
    description: "Complete system overhaul incoming",
    interpretation:
      "Your entire reality is about to explode and rebuild itself. This isn't a gentle transition—it's a controlled demolition of everything that no longer serves you. The old you dies here. What emerges will be unrecognizable but infinitely more powerful.",
    rarity: "legendary",
    category: "transformation",
  },
  {
    charms: ["Eclipse", "Stargate", "Quantum Leap"],
    name: "The Cosmic Portal",
    description: "Dimensional shift in progress",
    interpretation:
      "You're being pulled into a completely different timeline. This combination opens doorways that most people never even see. Reality is bending around you—step through the portal or spend your life wondering what could have been.",
    rarity: "legendary",
    category: "power",
  },
  {
    charms: ["Flow", "Synchronicity", "Wormhole"],
    name: "The Divine Current",
    description: "Perfect alignment with universal forces",
    interpretation:
      "You've tapped into the universe's operating system. Every door opens, every light turns green, every person you need appears. This is what it feels like when you're completely in sync with your destiny. Don't question it—ride it.",
    rarity: "legendary",
    category: "power",
  },
  {
    charms: ["Red Light", "Locked Door", "Thin Ice"],
    name: "The Wall of No",
    description: "Universe is protecting you from disaster",
    interpretation:
      "Every path forward is blocked because you're about to walk off a cliff. This isn't punishment—it's protection. The universe is literally saving you from yourself. Stop pushing and start listening.",
    rarity: "legendary",
    category: "warning",
  },

  // RARE COMBINATIONS (2-3 charms)
  {
    charms: ["Catalyst", "Tipping Point"],
    name: "The Breaking Point",
    description: "Critical mass achieved",
    interpretation:
      "You've reached the moment where small actions create massive results. One conversation, one decision, one bold move will trigger an avalanche of change. The pressure you've been feeling? It's about to release spectacularly.",
    rarity: "rare",
    category: "transformation",
  },
  {
    charms: ["Eclipse", "Supernova"],
    name: "Death and Rebirth",
    description: "Phoenix rising from ashes",
    interpretation:
      "Something in your life is dying a spectacular death so something infinitely better can be born. This isn't loss—it's metamorphosis. What's exploding needed to go anyway. Embrace the destruction.",
    rarity: "rare",
    category: "transformation",
  },
  {
    charms: ["Gut Check", "Gasp"],
    name: "The Truth Bomb",
    description: "Sudden realization shatters illusions",
    interpretation:
      "Your intuition is about to deliver a reality check that changes everything. That nagging feeling you've been ignoring? It's about to become impossible to deny. The truth will hit like lightning.",
    rarity: "rare",
    category: "insight",
  },
  {
    charms: ["Last Call", "Red Light"],
    name: "The Final Warning",
    description: "Last chance before consequences",
    interpretation:
      "This is your final opportunity to change course before the universe makes the decision for you. You've been given multiple chances—this is the last one. Act now or have action taken for you.",
    rarity: "rare",
    category: "warning",
  },
  {
    charms: ["Flow", "Shortcut"],
    name: "The Golden Path",
    description: "Effortless progress toward goals",
    interpretation:
      "You've found the secret passage. While others struggle uphill, you're gliding downstream toward your destination. This is what happens when you stop forcing and start flowing. Trust the current.",
    rarity: "rare",
    category: "power",
  },
  {
    charms: ["Rewind", "Quantum Leap"],
    name: "Time Paradox",
    description: "Past and future colliding",
    interpretation:
      "An old situation is returning with new possibilities. What felt like going backward is actually a quantum jump forward. You're getting a second chance to do it right this time—with everything you've learned.",
    rarity: "rare",
    category: "timing",
  },
  {
    charms: ["Mirror Check", "Exposed"],
    name: "The Naked Truth",
    description: "Self-deception ends now",
    interpretation:
      "You can't hide from yourself anymore. Every mask is coming off, every lie you've told yourself is being exposed. This brutal honesty is exactly what you need to finally become who you're meant to be.",
    rarity: "rare",
    category: "insight",
  },
  {
    charms: ["Synchronicity", "Stargate"],
    name: "The Cosmic Invitation",
    description: "Universe is actively recruiting you",
    interpretation:
      "The signs aren't coincidences—they're invitations. The universe is literally trying to get your attention and guide you toward something extraordinary. Stop dismissing the magic as luck.",
    rarity: "rare",
    category: "power",
  },
  {
    charms: ["Interference", "Fog"],
    name: "The Confusion Matrix",
    description: "External chaos clouding judgment",
    interpretation:
      "Someone or something is deliberately muddying the waters. The confusion you're feeling isn't natural—it's manufactured. Cut through the noise and trust what you knew before the chaos started.",
    rarity: "rare",
    category: "warning",
  },
  {
    charms: ["Second Wind", "Jumpstart"],
    name: "The Comeback",
    description: "Renewed energy after setback",
    interpretation:
      "Just when you thought you were down for the count, you're getting a surge of power that will surprise everyone—including yourself. This isn't just recovery—it's a complete comeback story.",
    rarity: "rare",
    category: "power",
  },

  // UNCOMMON COMBINATIONS
  {
    charms: ["Catalyst", "Jumpstart"],
    name: "The Ignition",
    description: "Sudden acceleration of plans",
    interpretation:
      "Something that's been stuck is about to move fast. The energy you've been building up is ready to explode into action. Buckle up—things are about to accelerate beyond your expectations.",
    rarity: "uncommon",
    category: "power",
  },
  {
    charms: ["Detour", "Shortcut"],
    name: "The Scenic Route",
    description: "Unexpected path leads to better destination",
    interpretation:
      "What looks like going the wrong way is actually the fastest route to where you need to be. The detour isn't delaying you—it's delivering you to something better than your original plan.",
    rarity: "uncommon",
    category: "timing",
  },
  {
    charms: ["Fine Print", "Exposed"],
    name: "The Devil's Details",
    description: "Hidden information comes to light",
    interpretation:
      "Someone's been hiding the fine print, but not anymore. The details that were conveniently omitted are about to surface. Read everything twice and trust nothing at face value.",
    rarity: "uncommon",
    category: "warning",
  },
  {
    charms: ["Overtime", "Last Call"],
    name: "The Final Push",
    description: "Extra effort required before deadline",
    interpretation:
      "You're in the final stretch, but it's going to take everything you've got. This is where champions are made—when you're exhausted but you push through anyway. The finish line is closer than it feels.",
    rarity: "uncommon",
    category: "timing",
  },
  {
    charms: ["Reminder", "Déjà Vu"],
    name: "The Pattern Recognition",
    description: "History repeating with new awareness",
    interpretation:
      "You've been here before, but this time you're awake to the pattern. The lesson you missed the first time is presenting itself again. Don't make the same mistake twice.",
    rarity: "uncommon",
    category: "insight",
  },
  {
    charms: ["Wrong Turn", "Wormhole"],
    name: "The Happy Accident",
    description: "Mistake becomes miraculous shortcut",
    interpretation:
      "That 'wrong' decision is about to prove itself brilliantly right. What felt like a mistake was actually a cosmic course correction. Sometimes the universe has to trick you into your destiny.",
    rarity: "uncommon",
    category: "timing",
  },
  {
    charms: ["Hiccup", "Flow"],
    name: "The Rhythm Breaker",
    description: "Minor disruption improves overall flow",
    interpretation:
      "This small interruption is actually recalibrating your rhythm. What feels like a setback is adjusting your timing to sync with something bigger. Let the hiccup reset your flow.",
    rarity: "uncommon",
    category: "timing",
  },
  {
    charms: ["Open Tab", "Reminder"],
    name: "The Unfinished Business",
    description: "Past obligations demanding attention",
    interpretation:
      "Something you left incomplete is demanding closure. This isn't about going backward—it's about clearing the deck so you can move forward without baggage. Finish what you started.",
    rarity: "uncommon",
    category: "insight",
  },
  {
    charms: ["Out of Context", "Gasp"],
    name: "The Missing Piece",
    description: "Crucial information suddenly makes sense",
    interpretation:
      "You've been trying to solve a puzzle with missing pieces. The context you've been lacking is about to click into place, and suddenly everything will make perfect sense. The 'aha' moment is coming.",
    rarity: "uncommon",
    category: "insight",
  },
  {
    charms: ["Missed Call", "Synchronicity"],
    name: "The Second Chance",
    description: "Opportunity returns in new form",
    interpretation:
      "That opportunity you thought you missed? It's circling back in a different package. The universe rarely gives up on a good match—it just changes the delivery method. Pay attention this time.",
    rarity: "uncommon",
    category: "timing",
  },

  // COMMON COMBINATIONS
  {
    charms: ["Flow", "Backdrop"],
    name: "The Perfect Setting",
    description: "Environment supports natural progress",
    interpretation:
      "Everything around you is aligned to support your success. The timing, the people, the circumstances—it's all working in your favor. Stop second-guessing and start moving.",
    rarity: "common",
    category: "power",
  },
  {
    charms: ["Rewind", "Reminder"],
    name: "The Lesson Replay",
    description: "Past wisdom resurfaces when needed",
    interpretation:
      "Something you learned before is exactly what you need now. The experience you thought was just history is actually your instruction manual for the present situation.",
    rarity: "common",
    category: "insight",
  },
  {
    charms: ["Interference", "Red Light"],
    name: "The Protective Block",
    description: "Obstacles preventing bigger problems",
    interpretation:
      "These frustrating delays are actually saving you from something worse. The interference isn't random—it's protective. Trust that being stopped now prevents a crash later.",
    rarity: "common",
    category: "warning",
  },
  {
    charms: ["Gut Check", "Fine Print"],
    name: "The Instinct Alert",
    description: "Intuition warns about hidden details",
    interpretation:
      "Your gut is picking up on something the details aren't revealing. That uneasy feeling isn't paranoia—it's your inner radar detecting what's not being said. Dig deeper.",
    rarity: "common",
    category: "warning",
  },
  {
    charms: ["Jumpstart", "Second Wind"],
    name: "The Energy Boost",
    description: "Renewed motivation after stagnation",
    interpretation:
      "The energy you've been missing is suddenly available again. This isn't just getting back to where you were—it's launching from a higher platform. Use this momentum wisely.",
    rarity: "common",
    category: "power",
  },
  {
    charms: ["Mirror Check", "Reminder"],
    name: "The Self-Awareness Moment",
    description: "Honest self-reflection reveals truth",
    interpretation:
      "It's time to look honestly at your role in your current situation. The reminder you need isn't external—it's internal. What you already know but haven't admitted is the key.",
    rarity: "common",
    category: "insight",
  },
  {
    charms: ["Overtime", "Fine Print"],
    name: "The Extra Mile",
    description: "Additional effort reveals hidden benefits",
    interpretation:
      "The extra work you're putting in has benefits you haven't discovered yet. Read the fine print of your efforts—there are rewards hidden in the details of your dedication.",
    rarity: "common",
    category: "insight",
  },
  {
    charms: ["Fog", "Gut Check"],
    name: "The Intuitive Navigation",
    description: "Inner guidance through confusion",
    interpretation:
      "When you can't see clearly, your instincts become your compass. The fog is external—your inner knowing is crystal clear. Trust what you feel over what you think you see.",
    rarity: "common",
    category: "insight",
  },
]

// Function to find all matching combinations in a reading
export function findCharmCombinations(charms: Charm[]): CharmCombination[] {
  const charmNames = charms.map((charm) => charm.name)
  const foundCombinations: CharmCombination[] = []

  // Sort combinations by rarity (legendary first) and number of charms (more charms first)
  const sortedCombinations = [...charmCombinations].sort((a, b) => {
    const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 }
    const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity]
    if (rarityDiff !== 0) return rarityDiff
    return b.charms.length - a.charms.length
  })

  for (const combination of sortedCombinations) {
    // Check if all charms in the combination are present
    const hasAllCharms = combination.charms.every((charmName) => charmNames.includes(charmName))

    if (hasAllCharms) {
      foundCombinations.push(combination)
    }
  }

  // Remove overlapping combinations (if a legendary combination is found, don't include its sub-combinations)
  const filteredCombinations: CharmCombination[] = []
  const usedCharms = new Set<string>()

  for (const combination of foundCombinations) {
    // Check if any of this combination's charms are already used in a higher-priority combination
    const hasOverlap = combination.charms.some((charm) => usedCharms.has(charm))

    if (!hasOverlap) {
      filteredCombinations.push(combination)
      combination.charms.forEach((charm) => usedCharms.add(charm))
    }
  }

  return filteredCombinations
}

// Function to get the most powerful combination
export function getMostPowerfulCombination(combinations: CharmCombination[]): CharmCombination | null {
  if (combinations.length === 0) return null

  const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 }

  return combinations.reduce((most, current) => {
    const mostPower = rarityOrder[most.rarity]
    const currentPower = rarityOrder[current.rarity]

    if (currentPower > mostPower) return current
    if (currentPower === mostPower && current.charms.length > most.charms.length) return current
    return most
  })
}

// Function to get combination insights for synopsis
export function getCombinationInsights(combinations: CharmCombination[]): string {
  if (combinations.length === 0) return ""

  const mostPowerful = getMostPowerfulCombination(combinations)
  if (!mostPowerful) return ""

  // Return the interpretation of the most powerful combination
  return mostPowerful.interpretation
}
