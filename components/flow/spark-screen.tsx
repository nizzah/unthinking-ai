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
    <div className="min-h-screen flex items-center justify-center px-4 pt-8 pb-16 animate-in fade-in duration-700 relative z-10">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl text-stone-300 font-light">One spark of clarity from your past</h2>
        </div>

        {/* Spark insight - quote block */}
        <div className="bg-ocean-800/30 border-l-4 border-coral-600 rounded-r-2xl p-8 space-y-4">
          <p className="text-2xl md:text-3xl text-white leading-relaxed font-light">{insight}</p>
          <p className="text-sm text-stone-300">From your reflection on {date}</p>
        </div>

        {/* Links directly under spark text */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setShowSource(!showSource)}
            className="text-sm text-stone-200 hover:text-white transition-colors focus:outline-none rounded px-2 py-1"
            aria-expanded={showSource}
            aria-controls="source-content"
            aria-label={showSource ? "Hide source information" : "Show source information"}
          >
            {showSource ? "Hide source" : "View source"}
          </button>
          <button 
            onClick={onSkip} 
            className="text-sm text-stone-200 hover:text-white transition-colors focus:outline-none rounded px-2 py-1"
          >
            Give me another spark
          </button>
        </div>

        {/* Source toggle */}
        {showSource && (
          <div 
            id="source-content"
            className="bg-ocean-800/40 border border-ocean-700/50 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-500"
            role="region"
            aria-labelledby="source-heading"
            aria-live="polite"
          >
            <h3 id="source-heading" className="text-sm text-stone-200 mb-3 font-medium">Source</h3>
            <p className="text-base text-stone-100 leading-relaxed">{source}</p>
            <p className="text-sm text-stone-300 mt-3 leading-relaxed">{context}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-6 text-lg rounded-full font-medium"
          >
            Take a tiny action
          </Button>
        </div>
      </div>
    </div>
  )
}
