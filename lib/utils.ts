import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Charm, ReadingContext } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get random charms based on context
export function getRandomCharms(allCharms: Charm[], count: number, context: Partial<ReadingContext>): Charm[] {
  // Create a weighted copy of charms
  const weightedCharms = allCharms.map((charm) => {
    let weight = 1

    // Adjust weights based on context
    if (charm.rarity === "rare") {
      // Rare charms have a lower chance of appearing
      weight = 0.2

      // Increase chance of rare charms during full moon (day 15) or new moon (day 0)
      if (context.lunarPhase === 0 || context.lunarPhase === 15) {
        weight = 0.5
      }
    }

    // If question is provided, use it to influence charm selection
    if (context.question) {
      const question = context.question.toLowerCase()

      // Example: If question contains words related to love or relationships
      if (question.includes("love") || question.includes("relationship") || question.includes("partner")) {
        // Increase weight for relationship-related charms (those with charCode % 5 === 0)
        if (charm.name.charCodeAt(0) % 5 === 0) {
          weight *= 1.5
        }
      }

      // Example: If question contains words related to career or work
      if (question.includes("career") || question.includes("job") || question.includes("work")) {
        // Increase weight for opportunity-related charms (those with charCode % 5 === 2)
        if (charm.name.charCodeAt(0) % 5 === 2) {
          weight *= 1.5
        }
      }

      // Example: If question contains words related to challenges or problems
      if (question.includes("problem") || question.includes("challenge") || question.includes("difficult")) {
        // Increase weight for challenge-related charms (those with charCode % 5 === 1)
        if (charm.name.charCodeAt(0) % 5 === 1) {
          weight *= 1.5
        }
      }
    }

    return {
      ...charm,
      weight,
    }
  })

  // Weighted random selection
  const selectedCharms: Charm[] = []
  const totalWeight = weightedCharms.reduce((sum, charm) => sum + (charm.weight || 1), 0)

  while (selectedCharms.length < count) {
    let randomValue = Math.random() * totalWeight
    let charmIndex = 0

    // Find the charm that corresponds to the random value
    for (let i = 0; i < weightedCharms.length; i++) {
      randomValue -= weightedCharms[i].weight || 1
      if (randomValue <= 0) {
        charmIndex = i
        break
      }
    }

    // Add the selected charm and remove it from the pool
    const selectedCharm = weightedCharms[charmIndex]
    if (selectedCharm) {
      selectedCharms.push({
        name: selectedCharm.name,
        description: selectedCharm.description,
        rarity: selectedCharm.rarity,
      })

      // Remove the selected charm to avoid duplicates
      weightedCharms.splice(charmIndex, 1)
    }
  }

  return selectedCharms
}

// Helper function to format date for astrological calculations
export function formatDateForAstrology(dateString: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

// Function to get current lunar phase (simplified)
export function getLunarPhase(): number {
  const date = new Date()
  // Simplified calculation - returns a value between 0-29
  // 0 = new moon, 15 = full moon
  return date.getDate() % 30
}
