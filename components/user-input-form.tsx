"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface UserInputFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function UserInputForm({ value, onChange, onSubmit, disabled }: UserInputFormProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-md mx-auto p-4 bg-black/90 border-2 border-white/20 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-medium text-white mb-4">What guidance do you seek?</h2>
      <Textarea
        placeholder="Type your question or intention here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-black/50 border-2 border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-white/40 resize-none h-32"
      />
      <Button
        onClick={onSubmit}
        disabled={disabled || value.trim().length < 5}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Generate Reading
      </Button>
      {value.trim().length < 5 && isFocused && (
        <p className="text-red-400 text-xs mt-2 text-center">Please enter at least 5 characters for your question.</p>
      )}
    </motion.div>
  )
}
