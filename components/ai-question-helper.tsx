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
  const [questionStyle, setQuestionStyle] = useState<"direct" | "exploratory" | "intuitive">("direct")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  useEffect(() => {
    const category = determineQuestionCategory(initialQuestion)
    const style = determineQuestionStyle(initialQuestion)
    setQuestionStyle(style)

    if (initialQuestion.trim() === "") {
      setConversation([
        {
          role: "ai",
          content: getRandomGreeting(),
        },
      ])
    } else {
      const followUp = getContextualFollowUp(category, style, 0)
      setConversation([
        { role: "user", content: initialQuestion },
        { role: "ai", content: followUp },
      ])
    }
  }, [initialQuestion])

  const handleUserResponse = () => {
    if (!userInput.trim()) return

    setConversation([...conversation, { role: "user", content: userInput }])
    setUserInput("")
    setIsThinking(true)

    const category = determineQuestionCategory(initialQuestion)

    setTimeout(
      () => {
        setIsThinking(false)

        if (step < 2) {
          const followUp = getContextualFollowUp(category, questionStyle, step + 1)
          setConversation((prev) => [...prev, { role: "ai", content: followUp }])
          setStep(step + 1)
        } else {
          const refinedQuestionText = generateRefinedQuestion(conversation, userInput, initialQuestion, questionStyle)
          setRefinedQuestion(refinedQuestionText)

          setConversation((prev) => [
            ...prev,
            {
              role: "ai",
              content: getRandomConfirmation(refinedQuestionText),
            },
          ])
          setStep(3)
        }
      },
      1000 + Math.random() * 1000,
    ) // Variable delay for more natural feel
  }

  const handleFinalConfirmation = (isAccepted: boolean) => {
    if (isAccepted) {
      onQuestionRefined(refinedQuestion)
    } else {
      setConversation((prev) => [...prev, { role: "ai", content: getRandomEditPrompt() }])
      setStep(4)
    }
  }

  const handleManualEdit = () => {
    onQuestionRefined(refinedQuestion)
  }

  const handleSkip = () => {
    triggerWhisper()
    onClose()
  }

  // Random greetings for variety
  const getRandomGreeting = () => {
    const greetings = [
      "What's weighing on your mind? I can help you focus your question for a clearer reading.",
      "Let's explore what you're seeking guidance on. What situation would you like insight into?",
      "I'm here to help refine your question. What area of your life needs some cosmic clarity?",
      "What's calling for your attention right now? Share what you'd like to understand better.",
      "Tell me what's on your heart. I'll help you ask the right question for your reading.",
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  // Random confirmation messages
  const getRandomConfirmation = (question: string) => {
    const confirmations = [
      `I've refined your question to: "${question}" Does this capture what you're seeking?`,
      `Here's a focused version: "${question}" Does this feel right to you?`,
      `I've distilled your question to: "${question}" Is this what you want to explore?`,
      `Your refined question: "${question}" Does this resonate with your intention?`,
      `I've crafted this for you: "${question}" Does it align with what you're asking?`,
    ]
    return confirmations[Math.floor(Math.random() * confirmations.length)]
  }

  // Random edit prompts
  const getRandomEditPrompt = () => {
    const prompts = [
      "No worries! Please adjust the question to better reflect what you're seeking:",
      "Let's refine it further. Edit the question to match your true intention:",
      "I understand. Please modify the question to capture what you really want to know:",
      "Of course! Please reshape the question to better serve your needs:",
      "Absolutely. Please rewrite the question in your own words:",
    ]
    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  // Determine question style for more personalized responses
  function determineQuestionStyle(question: string): "direct" | "exploratory" | "intuitive" {
    if (!question.trim()) return "exploratory"

    const lowerQuestion = question.toLowerCase()

    // Direct style - specific, action-oriented questions
    if (/\b(should i|will i|when will|how do i|what should|can i)\b/.test(lowerQuestion)) {
      return "direct"
    }

    // Intuitive style - feeling-based, emotional questions
    if (/\b(feel|heart|soul|spirit|energy|vibe|sense|intuition)\b/.test(lowerQuestion)) {
      return "intuitive"
    }

    // Default to exploratory
    return "exploratory"
  }

  // More varied and contextual follow-up questions
  function getContextualFollowUp(
    category: string,
    style: "direct" | "exploratory" | "intuitive",
    stepIndex: number,
  ): string {
    const followUps: Record<string, Record<string, string[]>> = {
      career: {
        direct: [
          "What specific outcome are you hoping to achieve in your career?",
          "What's the main obstacle you're facing in your professional life?",
          "What would success look like for you in this situation?",
        ],
        exploratory: [
          "What aspects of your work life feel most uncertain right now?",
          "How is this career situation affecting other areas of your life?",
          "What patterns do you notice in your professional relationships?",
        ],
        intuitive: [
          "What does your gut tell you about this career path?",
          "How does this work situation make you feel in your body?",
          "What would your ideal work environment feel like?",
        ],
      },
      relationships: {
        direct: [
          "What specific change do you want to see in this relationship?",
          "What's the main challenge you're facing with this person?",
          "What outcome would feel most healing for you?",
        ],
        exploratory: [
          "What patterns keep showing up in your relationships?",
          "How has this relationship dynamic affected your sense of self?",
          "What role do you play in this relationship pattern?",
        ],
        intuitive: [
          "What does your heart know about this connection?",
          "How does this relationship feel in your energy field?",
          "What is this relationship teaching you about yourself?",
        ],
      },
      general: {
        direct: [
          "What specific guidance would be most helpful right now?",
          "What decision or action are you contemplating?",
          "What outcome are you hoping to understand better?",
        ],
        exploratory: [
          "What themes or patterns are you noticing in your life?",
          "How is this situation connected to your larger life journey?",
          "What aspects of this situation feel most unclear?",
        ],
        intuitive: [
          "What is your inner wisdom telling you about this?",
          "How does this situation resonate in your heart space?",
          "What feels most important for your soul's growth right now?",
        ],
      },
    }

    const categoryQuestions = followUps[category] || followUps.general
    const styleQuestions = categoryQuestions[style]

    return styleQuestions[stepIndex] || styleQuestions[0]
  }

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
    if (/\b(health|wellness|illness|medical|fitness)\b/.test(lowerQuestion)) {
      return "health"
    }
    if (/\b(family|home|parent|child|house)\b/.test(lowerQuestion)) {
      return "family"
    }
    if (/\b(spirit|soul|meaning|purpose|faith|belief)\b/.test(lowerQuestion)) {
      return "spiritual"
    }

    return "general"
  }

  function generateRefinedQuestion(
    convo: Array<{ role: "ai" | "user"; content: string }>,
    finalResponse: string,
    originalQuestion: string,
    style: "direct" | "exploratory" | "intuitive",
  ): string {
    const userResponses = convo
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)
      .concat(finalResponse)

    if (userResponses.length <= 1 || !originalQuestion) {
      return improveQuestion(originalQuestion || finalResponse, style)
    }

    const insights = extractKeyInsights(userResponses.slice(1))
    if (insights.length === 0) {
      return improveQuestion(originalQuestion, style)
    }

    return constructRefinedQuestion(originalQuestion, insights[0], style)
  }

  function extractKeyInsights(responses: string[]): string[] {
    const insights: string[] = []

    for (const response of responses) {
      if (!response || response.length < 5) continue
      if (/^(yes|no|maybe|not sure|i think so|i guess)$/i.test(response.trim())) continue

      const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 10)
      if (sentences.length > 0) {
        sentences.sort((a, b) => b.length - a.length)
        insights.push(sentences[0].trim())
      } else if (response.length > 10) {
        insights.push(response.trim())
      }
    }

    return insights
  }

  function improveQuestion(question: string, style: "direct" | "exploratory" | "intuitive"): string {
    if (!question) return "What guidance do I need right now?"

    const q = question.trim()
    if (q.endsWith("?")) return q

    // Style-specific improvements
    switch (style) {
      case "direct":
        if (/^i want|^i need/i.test(q)) {
          return `How can I ${q.replace(/^i want to |^i want |^i need to |^i need /i, "")}?`
        }
        return `${q}?`

      case "intuitive":
        if (/^i feel/i.test(q)) {
          return `What guidance can help me understand my feelings about ${q.replace(/^i feel |^i'm feeling /i, "")}?`
        }
        return `What does my inner wisdom need to know about ${q}?`

      case "exploratory":
        return `What patterns and insights can help me understand ${q}?`

      default:
        return `${q}?`
    }
  }

  function constructRefinedQuestion(
    originalQuestion: string,
    insight: string,
    style: "direct" | "exploratory" | "intuitive",
  ): string {
    const original = originalQuestion.trim()

    if (!original) {
      switch (style) {
        case "direct":
          return `What specific guidance can help me with ${insight}?`
        case "intuitive":
          return `What does my heart need to know about ${insight}?`
        case "exploratory":
          return `What deeper understanding can I gain about ${insight}?`
      }
    }

    if (original.endsWith("?")) {
      const insertPoint = original.lastIndexOf("?")
      if (original.toLowerCase().includes(insight.toLowerCase())) {
        return original
      }
      return original.substring(0, insertPoint) + ` regarding ${insight}` + original.substring(insertPoint)
    }

    switch (style) {
      case "direct":
        return `${original} - specifically, how can I navigate ${insight}?`
      case "intuitive":
        return `${original} - what does my intuition need to know about ${insight}?`
      case "exploratory":
        return `${original} - what deeper patterns can I understand about ${insight}?`
      default:
        return `${original} regarding ${insight}?`
    }
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
          {step < 3 && !isThinking && (
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

          {step === 3 && !isThinking && (
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
                  Perfect
                </button>
              </div>
              <button onClick={handleSkip} className="w-full px-4 py-2 text-sm text-white/70 hover:text-white">
                Skip
              </button>
            </div>
          )}

          {step === 4 && !isThinking && (
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
                  Use This
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
