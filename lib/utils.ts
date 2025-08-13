import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Charm } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomCharms(
  allCharms: Charm[],
  count: number,
  context?: { question?: string; lunarPhase?: number },
): Charm[] {
  const commonCharms = allCharms.filter((charm) => charm.rarity === "common")
  const rareCharms = allCharms.filter((charm) => charm.rarity === "rare")

  const selected: Charm[] = []
  const availableCommon = [...commonCharms]
  const availableRare = [...rareCharms]

  // Prioritize rare charms for a more exciting reading, but keep it balanced
  const numRare = Math.min(Math.floor(Math.random() * 2), availableRare.length) // 0 or 1 rare charm
  for (let i = 0; i < numRare; i++) {
    const randomIndex = Math.floor(Math.random() * availableRare.length)
    selected.push(availableRare.splice(randomIndex, 1)[0])
  }

  // Fill the rest with common charms
  while (selected.length < count && availableCommon.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCommon.length)
    selected.push(availableCommon.splice(randomIndex, 1)[0])
  }

  // Shuffle the final selection
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[selected[i], selected[j]] = [selected[j], selected[i]]
  }

  return selected
}
