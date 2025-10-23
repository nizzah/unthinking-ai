"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SparkScreenProps {
  insight: string
  context: string
  source: string
  date: string
  onContinue: () => void
  onSkip: () => void
}

export function SparkScreen({ insight, context, source, date, onContinue, onSkip }: SparkScreenProps) {
  const [showSource, setShowSource] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl text-stone-300 font-light">One spark of clarity from your past</h2>
        </div>

        {/* Spark insight - quote block */}
        <div className="bg-ocean-800/30 border-l-4 border-coral-600 rounded-r-2xl p-8 space-y-4">
          <p className="text-2xl md:text-3xl text-white leading-relaxed font-light">{insight}</p>
          <p className="text-sm text-stone-400">From your reflection on {date}</p>
        </div>

        {/* Microcopy */}
        <div className="text-center">
          <p className="text-base text-stone-300 italic">You already said what you needed to hear.</p>
        </div>

        {/* Source toggle */}
        {showSource && (
          <div className="bg-ocean-800/20 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-sm text-stone-400 mb-2">Source</p>
            <p className="text-base text-stone-300">{source}</p>
            <p className="text-sm text-stone-500 mt-2">{context}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-coral-600 hover:bg-coral-700 text-ocean-deep px-12 py-6 text-lg rounded-full font-medium"
          >
            Continue
          </Button>
          <div className="flex gap-6">
            <button
              onClick={() => setShowSource(!showSource)}
              className="text-sm text-stone-400 hover:text-stone-300 transition-colors"
            >
              {showSource ? "Hide source" : "View source"}
            </button>
            <button onClick={onSkip} className="text-sm text-stone-400 hover:text-stone-300 transition-colors">
              Give me another spark
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
