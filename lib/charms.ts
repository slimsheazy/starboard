import type { Charm } from "./types"

export const charms: Charm[] = [
  // Existing charms (kept as-is)
  {
    id: "flow",
    name: "Flow",
    description: "Go with the natural rhythm of events",
    rarity: "common",
  },
  {
    id: "catalyst",
    name: "Catalyst",
    description: "A trigger for significant change",
    rarity: "common",
  },
  {
    id: "detour",
    name: "Detour",
    description: "An unexpected but necessary path",
    rarity: "common",
  },
  {
    id: "shortcut",
    name: "Shortcut",
    description: "A faster way to your destination",
    rarity: "common",
  },
  {
    id: "backdrop",
    name: "Backdrop",
    description: "The setting or environment matters",
    rarity: "common",
  },
  {
    id: "rewind",
    name: "Rewind",
    description: "Return to a previous point",
    rarity: "common",
  },
  {
    id: "gut-check",
    name: "Gut Check",
    description: "Trust your intuition here",
    rarity: "common",
  },
  {
    id: "fine-print",
    name: "Fine Print",
    description: "Pay attention to details",
    rarity: "common",
  },
  {
    id: "last-call",
    name: "Last Call",
    description: "A final opportunity",
    rarity: "common",
  },
  {
    id: "overtime",
    name: "Overtime",
    description: "Extra effort is required",
    rarity: "common",
  },
  {
    id: "tipping-point",
    name: "Tipping Point",
    description: "A moment of critical change",
    rarity: "common",
  },
  {
    id: "reminder",
    name: "Reminder",
    description: "Something you already know but forgot",
    rarity: "common",
  },
  {
    id: "interference",
    name: "Interference",
    description: "External factors disrupting progress",
    rarity: "common",
  },
  {
    id: "missed-call",
    name: "Missed Call",
    description: "An opportunity you didn't notice",
    rarity: "common",
  },
  {
    id: "open-tab",
    name: "Open Tab",
    description: "Unfinished business to address",
    rarity: "common",
  },
  {
    id: "out-of-context",
    name: "Out of Context",
    description: "You're missing important information",
    rarity: "common",
  },
  {
    id: "deja-vu",
    name: "Déjà Vu",
    description: "A pattern repeating itself",
    rarity: "common",
  },
  {
    id: "jumpstart",
    name: "Jumpstart",
    description: "A boost of energy or motivation",
    rarity: "common",
  },
  {
    id: "red-light",
    name: "Red Light",
    description: "Stop and reconsider",
    rarity: "common",
  },
  {
    id: "second-wind",
    name: "Second Wind",
    description: "Renewed strength after difficulty",
    rarity: "common",
  },
  {
    id: "exposed",
    name: "Exposed",
    description: "Hidden truths coming to light",
    rarity: "common",
  },
  {
    id: "synchronicity",
    name: "Synchronicity",
    description: "Meaningful coincidences",
    rarity: "common",
  },
  {
    id: "locked-door",
    name: "Locked Door",
    description: "A path that's currently closed",
    rarity: "common",
  },
  {
    id: "wrong-turn",
    name: "Wrong Turn",
    description: "A mistake that leads somewhere unexpected",
    rarity: "common",
  },
  {
    id: "hiccup",
    name: "Hiccup",
    description: "A minor but annoying obstacle",
    rarity: "common",
  },
  {
    id: "fog",
    name: "Fog",
    description: "Unclear vision or confusion",
    rarity: "common",
  },
  {
    id: "mirror-check",
    name: "Mirror Check",
    description: "Time for self-reflection",
    rarity: "common",
  },
  {
    id: "gasp",
    name: "Gasp",
    description: "A sudden realization",
    rarity: "common",
  },
  {
    id: "thin-ice",
    name: "Thin Ice",
    description: "Proceed with extreme caution",
    rarity: "common",
  },

  // NEW BALANCED CHARMS - Adding emotional nuance and balance

  // Positive/Uplifting Common Charms
  {
    id: "green-light",
    name: "Green Light",
    description: "Permission to proceed with confidence",
    rarity: "common",
  },
  {
    id: "breakthrough",
    name: "Breakthrough",
    description: "A moment of clarity that changes everything",
    rarity: "common",
  },
  {
    id: "anchor",
    name: "Anchor",
    description: "Stability in turbulent times",
    rarity: "common",
  },
  {
    id: "compass",
    name: "Compass",
    description: "Inner guidance pointing true north",
    rarity: "common",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    description: "A fresh beginning after darkness",
    rarity: "common",
  },
  {
    id: "bridge",
    name: "Bridge",
    description: "Connection across a divide",
    rarity: "common",
  },
  {
    id: "harvest",
    name: "Harvest",
    description: "Reaping the rewards of past efforts",
    rarity: "common",
  },
  {
    id: "spark",
    name: "Spark",
    description: "The beginning of something brilliant",
    rarity: "common",
  },
  {
    id: "oasis",
    name: "Oasis",
    description: "Refreshment in a challenging journey",
    rarity: "common",
  },
  {
    id: "key",
    name: "Key",
    description: "The solution you've been seeking",
    rarity: "common",
  },

  // Challenging/Cautionary Common Charms
  {
    id: "crossroads",
    name: "Crossroads",
    description: "A difficult choice must be made",
    rarity: "common",
  },
  {
    id: "storm-warning",
    name: "Storm Warning",
    description: "Turbulence ahead, prepare accordingly",
    rarity: "common",
  },
  {
    id: "quicksand",
    name: "Quicksand",
    description: "The more you struggle, the deeper you sink",
    rarity: "common",
  },
  {
    id: "echo",
    name: "Echo",
    description: "Past actions returning with consequences",
    rarity: "common",
  },
  {
    id: "mask",
    name: "Mask",
    description: "Someone is not showing their true self",
    rarity: "common",
  },
  {
    id: "leak",
    name: "Leak",
    description: "Energy or resources slowly draining away",
    rarity: "common",
  },
  {
    id: "shadow",
    name: "Shadow",
    description: "Hidden aspects demanding attention",
    rarity: "common",
  },
  {
    id: "friction",
    name: "Friction",
    description: "Resistance that slows progress",
    rarity: "common",
  },
  {
    id: "mirage",
    name: "Mirage",
    description: "What appears real may be illusion",
    rarity: "common",
  },
  {
    id: "undertow",
    name: "Undertow",
    description: "Hidden currents pulling you off course",
    rarity: "common",
  },

  // Neutral/Transitional Common Charms
  {
    id: "pause",
    name: "Pause",
    description: "A moment to breathe and reassess",
    rarity: "common",
  },
  {
    id: "shuffle",
    name: "Shuffle",
    description: "Rearranging elements for better alignment",
    rarity: "common",
  },
  {
    id: "pendulum",
    name: "Pendulum",
    description: "Natural swing between opposing forces",
    rarity: "common",
  },
  {
    id: "threshold",
    name: "Threshold",
    description: "Standing at the edge of transformation",
    rarity: "common",
  },
  {
    id: "tide",
    name: "Tide",
    description: "Natural ebb and flow of circumstances",
    rarity: "common",
  },
  {
    id: "prism",
    name: "Prism",
    description: "Multiple perspectives revealing truth",
    rarity: "common",
  },
  {
    id: "spiral",
    name: "Spiral",
    description: "Circular progress with deeper understanding",
    rarity: "common",
  },
  {
    id: "metamorphosis",
    name: "Metamorphosis",
    description: "Gradual transformation in progress",
    rarity: "common",
  },
  {
    id: "compass-rose",
    name: "Compass Rose",
    description: "All directions hold potential",
    rarity: "common",
  },
  {
    id: "hourglass",
    name: "Hourglass",
    description: "Time is both limited and cyclical",
    rarity: "common",
  },

  // Existing rare charms (kept as-is)
  {
    id: "eclipse",
    name: "Eclipse",
    description: "A rare alignment bringing profound change",
    rarity: "rare",
  },
  {
    id: "supernova",
    name: "Supernova",
    description: "Explosive transformation",
    rarity: "rare",
  },
  {
    id: "wormhole",
    name: "Wormhole",
    description: "A shortcut through space and time",
    rarity: "rare",
  },
  {
    id: "quantum-leap",
    name: "Quantum Leap",
    description: "An inexplicable jump forward",
    rarity: "rare",
  },
  {
    id: "stargate",
    name: "Stargate",
    description: "A portal to new dimensions",
    rarity: "rare",
  },

  // NEW BALANCED RARE CHARMS

  // Positive Rare Charms
  {
    id: "phoenix-rising",
    name: "Phoenix Rising",
    description: "Rebirth from complete destruction into something magnificent",
    rarity: "rare",
  },
  {
    id: "golden-thread",
    name: "Golden Thread",
    description: "Divine connection weaving through all circumstances",
    rarity: "rare",
  },
  {
    id: "cosmic-alignment",
    name: "Cosmic Alignment",
    description: "Universal forces conspiring in your favor",
    rarity: "rare",
  },

  // Challenging Rare Charms
  {
    id: "dark-night",
    name: "Dark Night",
    description: "A profound spiritual crisis that precedes awakening",
    rarity: "rare",
  },
  {
    id: "void",
    name: "Void",
    description: "Complete emptiness that contains infinite potential",
    rarity: "rare",
  },
  {
    id: "shattered-mirror",
    name: "Shattered Mirror",
    description: "Illusions breaking apart to reveal deeper truth",
    rarity: "rare",
  },

  // Neutral/Transformative Rare Charms
  {
    id: "ouroboros",
    name: "Ouroboros",
    description: "The eternal cycle of endings becoming beginnings",
    rarity: "rare",
  },
  {
    id: "singularity",
    name: "Singularity",
    description: "A point where all possibilities converge",
    rarity: "rare",
  },
]
