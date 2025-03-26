import type React from "react"
import { BsExclamationCircle, BsQuestionCircle, BsHeartFill, BsTelephoneX, BsCloud, BsMoon } from "react-icons/bs"

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
} from "react-icons/io5"

// Map charm names to React Icons
const iconMap: Record<string, React.ComponentType<any>> = {
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
}

// Fallback icon for charms without a specific icon
const FallbackIcon = BsQuestionCircle

// Function to get the icon component for a charm
export function getCharmIcon(charmName: string): React.ComponentType<any> {
  return iconMap[charmName] || FallbackIcon
}

