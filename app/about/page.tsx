"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import StarBackground from "@/components/star-background"
import { HomeIcon, StarIcon, MoonIcon } from "@/components/cosmic-icons"
import { triggerWhisper } from "@/components/sound-effects"

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-black text-white pb-20">
      <StarBackground />

      <div className="container max-w-md mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">About Starboard</h1>
          <Link
            href="/"
            className="p-2 rounded-full bg-black/30 border-2 border-white/20 hover:border-white/40 transition-colors"
            onClick={() => triggerWhisper()}
          >
            <HomeIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-white/10 rounded-lg p-4 bg-black/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <StarIcon className="w-6 h-6 text-acid-green" />
              <h2 className="text-lg font-medium">What is Starboard?</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Starboard is an astrological divination app that combines the ancient wisdom of astrology with modern
              cosmic charm casting. It provides personalized guidance by analyzing the positions of charms within the
              astrological houses, offering insights into your questions and life situations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-white/10 rounded-lg p-4 bg-black/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <MoonIcon className="w-6 h-6 text-neon-pink" />
              <h2 className="text-lg font-medium">How It Works</h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">1. Ask a Question</strong>
                <br />
                Begin by focusing on a question or area of your life you'd like guidance on. The more specific your
                question, the more tailored your reading will be.
              </p>
              <p>
                <strong className="text-white">2. Cast the Charms</strong>
                <br />
                Shake your device or tap "Cast Charms" to initiate the divination process. Starboard will cast 12 cosmic
                charms onto the astrological wheel, with each charm landing in one of the 12 houses.
              </p>
              <p>
                <strong className="text-white">3. Interpret the Reading</strong>
                <br />
                The position of each charm within a specific house creates a unique pattern of meaning. Rare charms
                carry special significance, and the overall distribution reveals patterns relevant to your question.
              </p>
              <p>
                <strong className="text-white">4. Save Your Readings</strong>
                <br />
                Save meaningful readings to revisit later, or export them as PDFs to share or keep as reference. You can
                name your readings for easy identification.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-2 border-white/10 rounded-lg p-4 bg-black/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <StarIcon className="w-6 h-6 text-cosmic-blue" />
              <h2 className="text-lg font-medium">The Cosmic Elements</h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">Astrological Houses</strong>
                <br />
                The 12 houses represent different areas of life, from identity and resources to relationships and
                spirituality. The house where a charm lands contextualizes its meaning.
              </p>
              <p>
                <strong className="text-white">Cosmic Charms</strong>
                <br />
                Each charm carries a specific meaning or energy. There are common charms that appear frequently and rare
                charms that bring especially significant messages when they appear.
              </p>
              <p>
                <strong className="text-white">Charm Categories</strong>
                <br />
                Charms are divided into categories like Growth, Challenges, Opportunities, Transitions, and Insights.
                The dominant category in your reading reveals the overall theme.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
