import type { House } from "./types"
import { houses as defaultHouses } from "./houses"

/**
 * This file contains the logic for contextual house interpretations based on the user's question.
 *
 * The system works by:
 * 1. Analyzing the question for specific keywords
 * 2. Mapping those keywords to specialized house interpretations
 * 3. Returning a modified set of houses with contextual keywords
 *
 * Each category (career, love, health, etc.) has its own set of house interpretations
 * that make the reading more relevant to the specific question domain.
 */

// Keywords that might appear in questions, mapped to house contexts
const questionKeywords: Record<string, Record<number, string>> = {
  // ======== CAREER & WORK RELATED KEYWORDS ========
  // These keywords trigger career-focused house interpretations
  career: {
    1: "Self-Image",
    2: "Income",
    3: "Skills",
    4: "Work Environment",
    5: "Creativity",
    6: "Daily Tasks",
    7: "Colleagues",
    8: "Transformation",
    9: "Growth",
    10: "Reputation",
    11: "Network",
    12: "Hidden Obstacles",
  },
  job: {
    1: "Self-Image",
    2: "Income",
    3: "Skills",
    4: "Work Environment",
    5: "Creativity",
    6: "Daily Tasks",
    7: "Colleagues",
    8: "Transformation",
    9: "Growth",
    10: "Reputation",
    11: "Network",
    12: "Hidden Obstacles",
  },
  work: {
    1: "Self-Image",
    2: "Income",
    3: "Skills",
    4: "Work Environment",
    5: "Creativity",
    6: "Daily Tasks",
    7: "Colleagues",
    8: "Transformation",
    9: "Growth",
    10: "Reputation",
    11: "Network",
    12: "Hidden Obstacles",
  },
  business: {
    1: "Leadership",
    2: "Resources",
    3: "Communication",
    4: "Foundation",
    5: "Innovation",
    6: "Operations",
    7: "Partnerships",
    8: "Investments",
    9: "Expansion",
    10: "Achievement",
    11: "Team",
    12: "Unseen Factors",
  },
  promotion: {
    1: "Self-Presentation",
    2: "Value",
    3: "Skills",
    4: "Stability",
    5: "Recognition",
    6: "Performance",
    7: "Superiors",
    8: "Power Dynamics",
    9: "Advancement",
    10: "Status",
    11: "Supporters",
    12: "Competition",
  },
  interview: {
    1: "First Impression",
    2: "Compensation",
    3: "Communication",
    4: "Fit",
    5: "Standout Qualities",
    6: "Responsibilities",
    7: "Interviewer",
    8: "Hidden Factors",
    9: "Potential",
    10: "Outcome",
    11: "Team Dynamics",
    12: "Blind Spots",
  },

  // ======== RELATIONSHIP RELATED KEYWORDS ========
  // These keywords trigger relationship-focused house interpretations
  love: {
    1: "Self-Love",
    2: "Values",
    3: "Communication",
    4: "Emotional Needs",
    5: "Romance",
    6: "Habits",
    7: "Partnership",
    8: "Intimacy",
    9: "Shared Beliefs",
    10: "Commitment",
    11: "Friendship",
    12: "Subconscious Patterns",
  },
  relationship: {
    1: "Self-Image",
    2: "Values",
    3: "Communication",
    4: "Emotional Foundation",
    5: "Romance",
    6: "Daily Interaction",
    7: "Partnership",
    8: "Intimacy",
    9: "Shared Experiences",
    10: "Public Image",
    11: "Social Circle",
    12: "Hidden Dynamics",
  },
  partner: {
    1: "Self-Image",
    2: "Values",
    3: "Communication",
    4: "Emotional Foundation",
    5: "Romance",
    6: "Daily Interaction",
    7: "Partnership",
    8: "Intimacy",
    9: "Shared Experiences",
    10: "Public Image",
    11: "Social Circle",
    12: "Hidden Dynamics",
  },
  marriage: {
    1: "Identity",
    2: "Shared Resources",
    3: "Communication",
    4: "Home Life",
    5: "Joy",
    6: "Responsibilities",
    7: "Commitment",
    8: "Transformation",
    9: "Growth Together",
    10: "Social Status",
    11: "Community",
    12: "Spiritual Bond",
  },
  dating: {
    1: "Attraction",
    2: "Priorities",
    3: "Connection",
    4: "Comfort",
    5: "Chemistry",
    6: "Compatibility",
    7: "Relationship",
    8: "Vulnerability",
    9: "Experiences",
    10: "Direction",
    11: "Social Life",
    12: "Intuition",
  },
  breakup: {
    1: "Self-Recovery",
    2: "Self-Worth",
    3: "Processing",
    4: "Emotional Healing",
    5: "Joy After Pain",
    6: "New Routines",
    7: "Future Partners",
    8: "Transformation",
    9: "New Perspective",
    10: "New Path",
    11: "Support System",
    12: "Closure",
  },

  // ======== HEALTH RELATED KEYWORDS ========
  // These keywords trigger health-focused house interpretations
  health: {
    1: "Physical Body",
    2: "Resources",
    3: "Mental Health",
    4: "Emotional Health",
    5: "Vitality",
    6: "Daily Habits",
    7: "Balance",
    8: "Healing",
    9: "Beliefs",
    10: "Structure",
    11: "Support System",
    12: "Rest",
  },
  wellness: {
    1: "Physical Body",
    2: "Resources",
    3: "Mental Health",
    4: "Emotional Health",
    5: "Vitality",
    6: "Daily Habits",
    7: "Balance",
    8: "Healing",
    9: "Beliefs",
    10: "Structure",
    11: "Support System",
    12: "Rest",
  },
  illness: {
    1: "Body",
    2: "Treatment",
    3: "Diagnosis",
    4: "Emotional Impact",
    5: "Recovery",
    6: "Care Routine",
    7: "Healthcare",
    8: "Transformation",
    9: "Outlook",
    10: "Management",
    11: "Support",
    12: "Hidden Factors",
  },
  fitness: {
    1: "Physical Form",
    2: "Energy",
    3: "Plan",
    4: "Motivation",
    5: "Enjoyment",
    6: "Routine",
    7: "Guidance",
    8: "Transformation",
    9: "Goals",
    10: "Achievement",
    11: "Community",
    12: "Rest",
  },
  diet: {
    1: "Body Needs",
    2: "Nutrition",
    3: "Knowledge",
    4: "Emotional Eating",
    5: "Enjoyment",
    6: "Habits",
    7: "Balance",
    8: "Transformation",
    9: "Philosophy",
    10: "Discipline",
    11: "Support",
    12: "Cravings",
  },

  // ======== FINANCIAL RELATED KEYWORDS ========
  // These keywords trigger finance-focused house interpretations
  money: {
    1: "Self-Worth",
    2: "Assets",
    3: "Financial Planning",
    4: "Security",
    5: "Investments",
    6: "Budget",
    7: "Partnerships",
    8: "Shared Resources",
    9: "Expansion",
    10: "Career",
    11: "Financial Network",
    12: "Hidden Costs",
  },
  financial: {
    1: "Self-Worth",
    2: "Assets",
    3: "Financial Planning",
    4: "Security",
    5: "Investments",
    6: "Budget",
    7: "Partnerships",
    8: "Shared Resources",
    9: "Expansion",
    10: "Career",
    11: "Financial Network",
    12: "Hidden Costs",
  },
  invest: {
    1: "Risk Tolerance",
    2: "Capital",
    3: "Research",
    4: "Security",
    5: "Growth",
    6: "Strategy",
    7: "Advisors",
    8: "Returns",
    9: "Long-term Vision",
    10: "Goals",
    11: "Market Trends",
    12: "Unknown Factors",
  },
  debt: {
    1: "Attitude",
    2: "Resources",
    3: "Plan",
    4: "Emotional Impact",
    5: "Creative Solutions",
    6: "Management",
    7: "Agreements",
    8: "Transformation",
    9: "Learning",
    10: "Responsibility",
    11: "Support",
    12: "Hidden Factors",
  },
  savings: {
    1: "Discipline",
    2: "Assets",
    3: "Strategy",
    4: "Security",
    5: "Growth",
    6: "Habits",
    7: "Advice",
    8: "Compound Growth",
    9: "Future Plans",
    10: "Goals",
    11: "Influences",
    12: "Unexpected Expenses",
  },

  // ======== PERSONAL GROWTH RELATED KEYWORDS ========
  // These keywords trigger personal development-focused house interpretations
  growth: {
    1: "Identity",
    2: "Resources",
    3: "Learning",
    4: "Foundations",
    5: "Self-Expression",
    6: "Improvement",
    7: "Relationships",
    8: "Transformation",
    9: "Expansion",
    10: "Achievement",
    11: "Community",
    12: "Reflection",
  },
  purpose: {
    1: "Identity",
    2: "Values",
    3: "Ideas",
    4: "Roots",
    5: "Passion",
    6: "Service",
    7: "Connections",
    8: "Transformation",
    9: "Beliefs",
    10: "Calling",
    11: "Contribution",
    12: "Intuition",
  },
  spiritual: {
    1: "Soul",
    2: "Values",
    3: "Learning",
    4: "Inner Peace",
    5: "Creative Expression",
    6: "Practice",
    7: "Teachers",
    8: "Transformation",
    9: "Beliefs",
    10: "Path",
    11: "Community",
    12: "Transcendence",
  },
  learn: {
    1: "Aptitude",
    2: "Resources",
    3: "Information",
    4: "Foundation",
    5: "Creativity",
    6: "Practice",
    7: "Teachers",
    8: "Mastery",
    9: "Wisdom",
    10: "Expertise",
    11: "Peers",
    12: "Self-Sabotage",
  },
  change: {
    1: "New Identity",
    2: "Resources",
    3: "Decisions",
    4: "Emotional Impact",
    5: "New Possibilities",
    6: "Adjustments",
    7: "Support",
    8: "Transformation",
    9: "New Perspective",
    10: "Direction",
    11: "Community",
    12: "Letting Go",
  },

  // ======== TRAVEL RELATED KEYWORDS ========
  // These keywords trigger travel-focused house interpretations
  travel: {
    1: "Self-Discovery",
    2: "Budget",
    3: "Local Travel",
    4: "Home Base",
    5: "Adventure",
    6: "Itinerary",
    7: "Companions",
    8: "Transformation",
    9: "Distant Travel",
    10: "Destination",
    11: "Groups",
    12: "Retreat",
  },
  journey: {
    1: "Self-Discovery",
    2: "Resources",
    3: "Routes",
    4: "Origins",
    5: "Adventure",
    6: "Planning",
    7: "Companions",
    8: "Transformation",
    9: "Exploration",
    10: "Destination",
    11: "Community",
    12: "Reflection",
  },
  move: {
    1: "New Beginning",
    2: "Finances",
    3: "Neighborhood",
    4: "New Home",
    5: "New Experiences",
    6: "Logistics",
    7: "Relationships",
    8: "Life Change",
    9: "Distance",
    10: "Direction",
    11: "Community",
    12: "Letting Go",
  },
  vacation: {
    1: "Relaxation",
    2: "Budget",
    3: "Planning",
    4: "Comfort",
    5: "Enjoyment",
    6: "Itinerary",
    7: "Companions",
    8: "Experiences",
    9: "Exploration",
    10: "Destination",
    11: "Group Activities",
    12: "Retreat",
  },

  // ======== DECISION RELATED KEYWORDS ========
  // These keywords trigger decision-focused house interpretations
  decision: {
    1: "Self-Interest",
    2: "Resources",
    3: "Information",
    4: "Security",
    5: "Risks",
    6: "Practicality",
    7: "Others Affected",
    8: "Consequences",
    9: "Long-term View",
    10: "Goals",
    11: "Community Impact",
    12: "Intuition",
  },
  choice: {
    1: "Self-Interest",
    2: "Resources",
    3: "Information",
    4: "Security",
    5: "Risks",
    6: "Practicality",
    7: "Others Affected",
    8: "Consequences",
    9: "Long-term View",
    10: "Goals",
    11: "Community Impact",
    12: "Intuition",
  },
  should: {
    1: "Authentic Self",
    2: "Values",
    3: "Options",
    4: "Emotional Needs",
    5: "Desires",
    6: "Practicality",
    7: "Relationships",
    8: "Transformation",
    9: "Principles",
    10: "Goals",
    11: "Social Factors",
    12: "Inner Wisdom",
  },
}

/**
 * Gets contextual house interpretations based on the user's question.
 *
 * @param question - The user's question text
 * @returns An array of House objects with contextual keywords
 */
export function getContextualHouses(question: string): House[] {
  if (!question) return defaultHouses

  const lowercaseQuestion = question.toLowerCase()
  let contextMap: Record<number, string> | null = null

  // Check for keywords in the question
  for (const [keyword, houseMap] of Object.entries(questionKeywords)) {
    if (lowercaseQuestion.includes(keyword)) {
      contextMap = houseMap
      break
    }
  }

  // If no specific context was found, try to determine a general theme
  if (!contextMap) {
    // Emotional/feeling questions
    if (
      lowercaseQuestion.includes("feel") ||
      lowercaseQuestion.includes("emotion") ||
      lowercaseQuestion.includes("happy") ||
      lowercaseQuestion.includes("sad")
    ) {
      contextMap = questionKeywords.relationship
    }
    // Decision questions
    else if (
      lowercaseQuestion.includes("should") ||
      lowercaseQuestion.includes("decide") ||
      lowercaseQuestion.includes("right choice")
    ) {
      contextMap = questionKeywords.decision
    }
    // Future questions
    else if (
      lowercaseQuestion.includes("will i") ||
      lowercaseQuestion.includes("future") ||
      lowercaseQuestion.includes("going to")
    ) {
      contextMap = questionKeywords.growth
    }
    // Timing questions
    else if (
      lowercaseQuestion.includes("when") ||
      lowercaseQuestion.includes("how long") ||
      lowercaseQuestion.includes("time")
    ) {
      contextMap = {
        1: "Readiness",
        2: "Resources",
        3: "Signs",
        4: "Foundation",
        5: "Opportunity",
        6: "Preparation",
        7: "Alignment",
        8: "Transition",
        9: "Timing",
        10: "Manifestation",
        11: "External Factors",
        12: "Divine Timing",
      }
    }
  }

  // If still no context, return default houses
  if (!contextMap) return defaultHouses

  // Create new houses with contextual keywords
  return defaultHouses.map((house) => ({
    ...house,
    contextKeyword: contextMap![house.number] || house.keyword,
  }))
}
