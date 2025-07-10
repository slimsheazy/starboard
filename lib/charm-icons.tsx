/**
 * Charm-to-icon lookup table.
 * --------------------------------------------------
 * • Legacy charms  → IonIcons (react-icons/io5)  ✅
 * • New 2025 charms → Lucide icons               ✅
 * • Any unmapped charm falls back to a “?” glyph.
 */

import type React from "react"

// ①  IonIcons (existing symbols)
import {
  IoColorPalette,
  IoFlash,
  IoWarning,
  IoStar,
  IoSparkles,
  IoRocket,
  IoEye,
  IoHourglass,
  IoInfinite,
  IoKeypad,
  IoLockClosed,
  IoMap,
  IoNavigate,
  IoPlanet,
  IoPulse,
  IoRefresh,
  IoReload,
  IoScale,
  IoScan,
  IoShapes,
  IoSnow,
  IoTimeOutline,
  IoTimer,
  IoTrendingUp,
  IoWarningOutline,
  IoDocument,
  IoEyeOff, // Added for IoEyeOff
} from "react-icons/io5"
import { BsExclamationCircle, BsQuestionCircle, BsHeartFill, BsTelephoneX, BsCloud, BsMoon } from "react-icons/bs"

// ✓ Valid Lucide icons (tested v0.292+)
import {
  Anchor,
  AlertTriangle,
  ArrowLeftRight,
  Atom,
  Ban,
  FlowerIcon as Butterfly,
  CheckCircle,
  Circle,
  Compass,
  CornerDownRight,
  Droplet,
  Flame,
  Footprints,
  GitBranch,
  Glasses,
  Infinity,
  CrossIcon as Intersect,
  Key,
  Landmark,
  Leaf,
  Pause,
  Play,
  RainbowIcon as Prism,
  RotateCcw,
  Shuffle,
  Sun,
  Volume2,
  Waves,
} from "lucide-react"

/* -------------------------------------------------- */
/*  Icon map                                          */
/* -------------------------------------------------- */

const iconMap: Record<string, React.ComponentType<any>> = {
  // ===== Legacy charms (unchanged) =====
  Flow: IoTrendingUp,
  Catalyst: IoFlash,
  Detour: IoMap,
  Shortcut: IoRocket,
  Backdrop: IoColorPalette,
  Rewind: IoReload,
  "Gut Check": BsHeartFill,
  "Fine Print": IoDocument,
  "Last Call": IoHourglass,
  Overtime: IoTimer,
  "Tipping Point": IoScale,
  Reminder: IoTimeOutline,
  Interference: IoWarningOutline,
  "Missed Call": BsTelephoneX,
  "Open Tab": IoKeypad,
  "Out of Context": IoShapes,
  "Déjà Vu": IoRefresh,
  Jumpstart: IoFlash,
  "Red Light": IoWarning,
  "Second Wind": IoPulse,
  Exposed: IoEye,
  Synchronicity: IoInfinite,
  "Locked Door": IoLockClosed,
  "Wrong Turn": IoNavigate,
  Hiccup: IoWarningOutline,
  Fog: BsCloud,
  "Mirror Check": IoScan,
  Gasp: BsExclamationCircle,
  "Thin Ice": IoSnow,
  Eclipse: BsMoon,
  Supernova: IoStar,
  Wormhole: IoSparkles,
  "Quantum Leap": IoRocket,
  Stargate: IoPlanet,

  // ===== New common – Positive =====
  "Green Light": CheckCircle,
  Breakthrough: Play,
  Anchor: Anchor,
  Compass: Compass,
  Sunrise: Sun,
  Bridge: Landmark,
  Harvest: Leaf,
  Spark: Flame, // fiery spark feel
  Oasis: Droplet,
  Key: Key,

  // ===== New common – Challenging =====
  Crossroads: GitBranch,
  "Storm Warning": AlertTriangle,
  Quicksand: Footprints,
  Echo: Volume2,
  Mask: IoEye, // show an eye for “mask”
  Leak: Droplet,
  Shadow: IoEyeOff, // fallback to crossed-eye
  Friction: Flame,
  Mirage: Glasses,
  Undertow: Waves,

  // ===== New common – Neutral =====
  Pause: Pause,
  Shuffle: Shuffle,
  Pendulum: ArrowLeftRight,
  Threshold: CornerDownRight,
  Tide: Waves,
  Prism: Prism,
  Spiral: RotateCcw,
  Metamorphosis: Butterfly,
  "Compass Rose": Compass,
  Hourglass: IoHourglass,

  // ===== New rare – Positive =====
  "Phoenix Rising": Flame,
  "Golden Thread": Infinity,
  "Cosmic Alignment": Intersect,

  // ===== New rare – Challenging =====
  "Dark Night": BsMoon,
  Void: Circle,
  "Shattered Mirror": Ban,

  // ===== New rare – Neutral/Transformative =====
  Ouroboros: RotateCcw,
  Singularity: Atom,
}

// Generic fallback
const FallbackIcon = BsQuestionCircle

export function getCharmIcon(charmName: string): React.ComponentType<any> {
  return iconMap[charmName] || FallbackIcon
}
