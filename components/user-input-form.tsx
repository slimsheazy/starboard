"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface UserInputFormProps {
  question: string
  setQuestion: (question: string) => void
  onSubmit: () => void
}

export default function UserInputForm({ question, setQuestion, onSubmit }: UserInputFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question" className="text-sm text-white/90 tracking-wide">
          your question (optional)
        </Label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like guidance on?"
          className="bg-transparent border-white/20 focus:border-white/40 rounded-lg text-white min-h-[100px] resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white tracking-wide"
      >
        begin divination
      </button>
    </form>
  )
}
