"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { triggerFlintStrike } from "./sound-effects"

interface UserInputFormProps {
  question: string
  setQuestion: (question: string) => void
  onSubmit: () => void
}

export default function UserInputForm({ question, setQuestion, onSubmit }: UserInputFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with question:", question)

    setIsSubmitting(true)
    triggerFlintStrike()

    // Small delay for UX
    setTimeout(() => {
      console.log("Calling onSubmit")
      onSubmit()
      setIsSubmitting(false)
    }, 500)
  }

  // Allow submission even without a question (question is optional)
  const canSubmit = !isSubmitting

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-2">
        <label htmlFor="question" className="text-sm font-light tracking-wide text-white/80">
          What guidance do you seek? (optional)
        </label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question to the cosmos... or leave blank for general guidance"
          className="min-h-[100px] bg-black/30 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 resize-none"
          disabled={isSubmitting}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-3 px-6 rounded-full text-sm font-light tracking-wide transition-all duration-300 ${
          canSubmit
            ? "cosmic-glow bg-black/30 border-2 border-white/30 hover:border-white/50 hover:bg-white/5 cursor-pointer"
            : "opacity-50 cursor-not-allowed bg-black/30 border-2 border-white/20"
        }`}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? "Consulting the stars..." : "begin divination"}
      </motion.button>

      {/* Debug info */}
      <div className="text-xs text-white/30 text-center">
        Debug: canSubmit={String(canSubmit)}, isSubmitting={String(isSubmitting)}
      </div>
    </motion.form>
  )
}
