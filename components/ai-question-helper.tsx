"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { CloseIcon } from "./cosmic-icons"
import { triggerWhisper } from "./sound-effects"

interface AIQuestionHelperProps {
  initialQuestion: string
  onQuestionRefined: (refinedQuestion: string) => void
  onClose: () => void
}

export default function AIQuestionHelper({ initialQuestion, onQuestionRefined, onClose }: AIQuestionHelperProps) {
  const [step, setStep] = useState(0)
  const [refinedQuestion, setRefinedQuestion] = useState(initialQuestion)
  const [isThinking, setIsThinking] = useState(false)
  const [conversation, setConversation] = useState<Array<{ role: "ai" | "user"; content: string }>>([])
  const [userInput, setUserInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  // Determine question category and select appropriate follow-up questions
  useEffect(() => {
    const questionCategory = determineQuestionCategory(initialQuestion)
    const followUpQuestions = getFollowUpQuestions(questionCategory)

    if (initialQuestion.trim() === "") {
      // If no initial question, just add a generic AI greeting
      setConversation([
        {
          role: "ai",
          content: "I can help refine your question for a more accurate reading. What would you like guidance on?",
        },
      ])
    } else {
      // Start with the initial question and first follow-up from the appropriate category
      setConversation([
        { role: "user", content: initialQuestion },
        { role: "ai", content: followUpQuestions[0] },
      ])
    }
  }, [initialQuestion])

  const handleUserResponse = () => {
    if (!userInput.trim()) return

    // Add user response to conversation
    setConversation([...conversation, { role: "user", content: userInput }])

    // Clear input field
    setUserInput("")

    // Simulate AI thinking
    setIsThinking(true)

    // Get follow-up questions based on the initial question
    const questionCategory = determineQuestionCategory(initialQuestion)
    const followUpQuestions = getFollowUpQuestions(questionCategory)

    setTimeout(() => {
      setIsThinking(false)

      // If we have more follow-up questions, ask the next one
      if (step < followUpQuestions.length - 1) {
        setConversation((prev) => [...prev, { role: "ai", content: followUpQuestions[step + 1] }])
        setStep(step + 1)
      } else {
        // Final step - provide the refined question
        const refinedQuestionText = generateRefinedQuestion(conversation, userInput, initialQuestion)
        setRefinedQuestion(refinedQuestionText)

        setConversation((prev) => [
          ...prev,
          {
            role: "ai",
            content: `Thank you for sharing. Based on our conversation, I've refined your question to: "${refinedQuestionText}" Does this capture what you're asking?`,
          },
        ])
        setStep(followUpQuestions.length)
      }
    }, 1500)
  }

  const handleFinalConfirmation = (isAccepted: boolean) => {
    if (isAccepted) {
      onQuestionRefined(refinedQuestion)
    } else {
      // Let the user edit the refined question
      setConversation((prev) => [
        ...prev,
        { role: "ai", content: "Please edit the question to better reflect what you're seeking guidance on:" },
      ])
      setStep(getFollowUpQuestions("general").length + 1)
    }
  }

  const handleManualEdit = () => {
    onQuestionRefined(refinedQuestion)
  }

  const handleSkip = () => {
    triggerWhisper()
    onClose()
  }

  // Determine question category based on initial question
  function determineQuestionCategory(question: string): string {
    if (!question.trim()) return "general"

    const lowerQuestion = question.toLowerCase()

    if (/\b(career|job|work|business|profession|employment)\b/.test(lowerQuestion)) {
      return "career"
    }

    if (/\b(love|relationship|partner|marriage|dating|romance)\b/.test(lowerQuestion)) {
      return "relationships"
    }

    if (/\b(money|finance|wealth|income|debt|investment)\b/.test(lowerQuestion)) {
      return "financial"
    }

    if (/\b(health|wellness|illness|medical|fitness|diet)\b/.test(lowerQuestion)) {
      return "health"
    }

    if (/\b(family|home|parent|child|house|domestic)\b/.test(lowerQuestion)) {
      return "family"
    }

    if (/\b(spirit|soul|meaning|purpose|faith|belief)\b/.test(lowerQuestion)) {
      return "spiritual"
    }

    if (/\b(decision|choice|choose|option|path|direction)\b/.test(lowerQuestion)) {
      return "decision"
    }

    if (/\b(change|transition|transform|shift|move|new)\b/.test(lowerQuestion)) {
      return "change"
    }

    return "general"
  }

  // Get follow-up questions based on category
  function getFollowUpQuestions(category: string): string[] {
    const categoryQuestions: Record<string, string[]> = {
      career: [
        "What specific aspect of your career are you concerned about?",
        "Are you considering a change, advancement, or resolving a workplace issue?",
        "What would an ideal outcome look like in this situation?",
      ],
      relationships: [
        "Is this about a current relationship, a potential one, or healing from a past connection?",
        "What emotions are most present when thinking about this relationship?",
        "What would a positive resolution look like for you?",
      ],
      financial: [
        "Is this about current financial challenges, future planning, or a specific decision?",
        "What would financial success look like for you right now?",
        "How does this financial matter connect to your broader goals?",
      ],
      health: [
        "Is this related to physical health, mental wellbeing, or both?",
        "What improvements are you hoping to see?",
        "How has this health concern been affecting other areas of your life?",
      ],
      family: [
        "Which family relationships are most relevant to your question?",
        "What dynamics or patterns are you noticing in these relationships?",
        "What would an ideal family situation look like for you?",
      ],
      spiritual: [
        "What aspects of your spiritual journey are you focused on right now?",
        "Are you seeking deeper meaning, connection, or specific insights?",
        "How does your spiritual path relate to your daily life?",
      ],
      decision: [
        "What options are you considering?",
        "What factors feel most important in making this decision?",
        "What's holding you back from choosing one path?",
      ],
      change: [
        "Is this change something you're initiating or responding to?",
        "What aspects of this transition feel most challenging?",
        "What would successful navigation of this change look like?",
      ],
      general: [
        "Could you share more about what specific aspect you're seeking guidance on?",
        "Is there a particular timeframe or event that's relevant to your question?",
        "What would be most helpful for you to learn from this reading?",
      ],
    }

    return categoryQuestions[category] || categoryQuestions.general
  }

  // Improved function to generate a refined question
  function generateRefinedQuestion(
    convo: Array<{ role: "ai" | "user"; content: string }>,
    finalResponse: string,
    originalQuestion: string,
  ): string {
    // Get all user responses
    const userResponses = convo
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)
      .concat(finalResponse)

    // If we only have the initial question, return it with minor improvements
    if (userResponses.length <= 1 || !originalQuestion) {
      return improveQuestion(originalQuestion || finalResponse)
    }

    // Extract key insights from follow-up responses
    const insights = extractKeyInsights(userResponses.slice(1))

    // If no meaningful insights found, improve the original question
    if (insights.length === 0) {
      return improveQuestion(originalQuestion)
    }

    // Construct the refined question
    return constructRefinedQuestion(originalQuestion, insights[0])
  }

  // Extract key insights from user responses
  function extractKeyInsights(responses: string[]): string[] {
    const insights: string[] = []

    // Process each response
    for (const response of responses) {
      if (!response || response.length < 5) continue

      // Skip common filler responses
      if (/^(yes|no|maybe|not sure|i think so|i guess)$/i.test(response.trim())) {
        continue
      }

      // Split into sentences and filter out short ones
      const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 10)

      if (sentences.length > 0) {
        // Sort by length (assuming longer sentences have more information)
        sentences.sort((a, b) => b.length - a.length)
        insights.push(sentences[0].trim())
      } else if (response.length > 10) {
        // If no good sentences, use the whole response if it's substantial
        insights.push(response.trim())
      }
    }

    return insights
  }

  // Improve a question with better phrasing
  function improveQuestion(question: string): string {
    if (!question) return "What guidance do I need right now?"

    const q = question.trim()

    // Already ends with question mark
    if (q.endsWith("?")) return q

    // Convert statement to question if needed
    if (/^i am|^i'm/i.test(q)) {
      return `How can I navigate my situation where ${q.replace(/^i am |^i'm /i, "")}?`
    }

    if (/^i want|^i need/i.test(q)) {
      return `How can I achieve my goal to ${q.replace(/^i want to |^i want |^i need to |^i need /i, "")}?`
    }

    if (/^i feel/i.test(q)) {
      return `What guidance can I receive about my feelings of ${q.replace(/^i feel |^i'm feeling /i, "")}?`
    }

    // Add question mark to statements
    if (!q.includes("?")) {
      return `${q}?`
    }

    return q
  }

  // Construct a refined question combining original question and new insights
  function constructRefinedQuestion(originalQuestion: string, insight: string): string {
    const original = originalQuestion.trim()

    // Handle empty original question
    if (!original) {
      return `What guidance can I receive about ${insight}?`
    }

    // If original already ends with question mark
    if (original.endsWith("?")) {
      // Find where to insert the insight
      const insertPoint = original.lastIndexOf("?")

      // Check if the insight is already part of the question
      if (original.toLowerCase().includes(insight.toLowerCase())) {
        return original
      }

      return original.substring(0, insertPoint) + ` regarding ${insight}` + original.substring(insertPoint)
    }

    // If original doesn't have question words, convert to question
    if (!/(how|what|why|when|where|who|will|should|could|can|do|does|is|are)/i.test(original)) {
      return `What guidance can I receive about ${original} specifically regarding ${insight}?`
    }

    // Add insight and question mark
    return `${original} specifically regarding ${insight}?`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    >
      <div className="w-full max-w-md bg-black/90 border-2 border-white/20 rounded-lg p-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Question Refinement</h2>
          <button onClick={handleSkip} className="text-white/60 hover:text-white">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 mb-4 pr-2 charm-list">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 5) }}
                  className={`flex ${message.role === "ai" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "ai"
                        ? "bg-white/10 text-white/90 rounded-tr-lg"
                        : "bg-neon-pink/20 text-white rounded-tl-lg"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 p-3 rounded-lg rounded-tr-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-white/70 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/70 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto">
          {step < getFollowUpQuestions("general").length && !isThinking && (
            <div className="space-y-2">
              <Textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Your response..."
                className="bg-transparent border-white/20 focus:border-white/40 rounded-lg text-white min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleUserResponse()
                  }
                }}
              />
              <div className="flex justify-between">
                <button onClick={handleSkip} className="px-4 py-2 text-sm text-white/70 hover:text-white">
                  Skip
                </button>
                <button
                  onClick={handleUserResponse}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {step === getFollowUpQuestions("general").length && !isThinking && (
            <div className="space-y-3">
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleFinalConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-sm text-white hover:bg-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleFinalConfirmation(true)}
                  className="flex-1 px-4 py-2 bg-neon-pink/30 border border-neon-pink rounded-lg text-sm text-white hover:bg-neon-pink/40"
                >
                  Accept
                </button>
              </div>
              <button onClick={handleSkip} className="w-full px-4 py-2 text-sm text-white/70 hover:text-white">
                Skip
              </button>
            </div>
          )}

          {step > getFollowUpQuestions("general").length && !isThinking && (
            <div className="space-y-3">
              <Textarea
                value={refinedQuestion}
                onChange={(e) => setRefinedQuestion(e.target.value)}
                className="bg-transparent border-white/20 focus:border-white/40 rounded-lg text-white min-h-[80px] resize-none"
              />
              <div className="flex justify-between">
                <button onClick={handleSkip} className="px-4 py-2 text-sm text-white/70 hover:text-white">
                  Skip
                </button>
                <button
                  onClick={handleManualEdit}
                  className="px-4 py-2 bg-neon-pink/30 border border-neon-pink rounded-lg text-sm text-white hover:bg-neon-pink/40"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
