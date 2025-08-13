import {
  Sparkles,
  Zap,
  BookOpen,
  Sun,
  Moon,
  Key,
  Anchor,
  Feather,
  Gem,
  Lightbulb,
  Cloud,
  RefreshCw,
  AlertTriangle,
  Clock,
  Eye,
  Lock,
  MapPin,
  Compass,
  Sunrise,
  BracketsIcon as Bridge,
  Wheat,
  Flame,
  Droplet,
  Crosshair,
  CloudLightning,
  SandwichIcon as Sand,
  MessageSquare,
  VenetianMaskIcon as Mask,
  Droplets,
  Ghost,
  FingerprintIcon as Friction,
  Telescope,
  Waves,
  Pause,
  Shuffle,
  Scale,
  DoorOpen,
  Columns,
  Infinity,
  Egg,
  CircleDot,
  FlameKindling,
  Shield,
  Globe,
  MoonStar,
  MonitorIcon as Mirror,
  Recycle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Placeholder for PhoneMissed if not directly available in Lucide React
const PhoneMissed: LucideIcon = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2 2A16 16 0 0 1 2 4a2 2 0 0 1 2-2h3l2 5l-2 3a10 10 0 0 0 5 5l3-2l5 2z" />
    <line x1="18" y1="2" x2="22" y2="6" />
    <line x1="22" y1="2" x2="18" y2="6" />
  </svg>
)

// Placeholder for Stars if not directly available in Lucide React
const Stars: LucideIcon = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.25l-6.18 3.25L7 14.14l-5-4.87l8.91-1.27L12 2z" />
  </svg>
)

// Map charm names to Lucide icons
const charmIconMap: { [key: string]: LucideIcon } = {
  Flow: Waves,
  Catalyst: FlameKindling,
  Detour: RefreshCw,
  Shortcut: Zap,
  Backdrop: Cloud,
  Rewind: RefreshCw,
  "Gut Check": Eye,
  "Fine Print": BookOpen,
  "Last Call": Clock,
  Overtime: Infinity, // Aliasing Infinity for Overtime
  "Tipping Point": AlertTriangle,
  Reminder: MessageSquare,
  Interference: CloudLightning,
  "Missed Call": PhoneMissed, // Assuming PhoneMissed is available or a placeholder
  "Open Tab": BookOpen, // Reusing BookOpen for Open Tab
  "Out of Context": Telescope,
  "Déjà Vu": RefreshCw, // Reusing RefreshCw for Déjà Vu
  Jumpstart: Flame,
  "Red Light": AlertTriangle, // Reusing AlertTriangle for Red Light
  "Second Wind": Feather,
  Exposed: Eye, // Reusing Eye for Exposed
  Synchronicity: Sparkles,
  "Locked Door": Lock,
  "Wrong Turn": MapPin, // Reusing MapPin for Wrong Turn
  Hiccup: AlertTriangle, // Reusing AlertTriangle for Hiccup
  Fog: Cloud, // Reusing Cloud for Fog
  "Mirror Check": Mirror,
  Gasp: Sparkles, // Reusing Sparkles for Gasp
  "Thin Ice": AlertTriangle, // Reusing AlertTriangle for Thin Ice

  // NEW BALANCED CHARMS
  "Green Light": Shield,
  Breakthrough: Lightbulb,
  Anchor: Anchor,
  Compass: Compass,
  Sunrise: Sunrise,
  Bridge: Bridge,
  Harvest: Wheat,
  Spark: Sparkles,
  Oasis: Droplet,
  Key: Key,

  Crossroads: Crosshair,
  "Storm Warning": CloudLightning,
  Quicksand: Sand,
  Echo: MessageSquare,
  Mask: Mask,
  Leak: Droplets,
  Shadow: Ghost,
  Friction: Friction,
  Mirage: Telescope,
  Undertow: Waves,

  Pause: Pause,
  Shuffle: Shuffle,
  Pendulum: Scale,
  Threshold: DoorOpen,
  Tide: Waves,
  Prism: Columns,
  Spiral: Infinity, // Reusing Infinity for Spiral
  Metamorphosis: Egg,
  "Compass Rose": Compass, // Reusing Compass for Compass Rose
  Hourglass: Clock, // Reusing Clock for Hourglass

  // RARE CHARMS
  Eclipse: MoonStar,
  Supernova: Sun,
  Wormhole: CircleDot,
  "Quantum Leap": Zap,
  Stargate: Globe,

  "Phoenix Rising": Flame, // Reusing Flame for Phoenix Rising
  "Golden Thread": Sparkles, // Reusing Sparkles for Golden Thread
  "Cosmic Alignment": Stars, // Assuming Stars is available or a placeholder

  "Dark Night": Moon,
  Void: Cloud, // Reusing Cloud for Void
  "Shattered Mirror": Mirror, // Reusing Mirror for Shattered Mirror

  Ouroboros: Recycle,
  Singularity: Gem,
}

export function getCharmIcon(charmName: string): LucideIcon {
  return charmIconMap[charmName] || Sparkles // Default to Sparkles if not found
}
