"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface StepScreenProps {
  primaryStep: string
  smallerStep: string
  onStepSelected: (step: "primary" | "smaller", duration: number) => void
  onSkip: () => void
}

export function StepScreen({ primaryStep, smallerStep, onStepSelected }: StepScreenProps) {
  const [selectedDuration, setSelectedDuration] = useState(2)
  const durations = [2, 5, 15]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative z-10">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-light text-white">Let's make this real — one small move</h1>

          {/* Time selection */}
          <div className="flex gap-3 justify-center" role="group" aria-label="Select duration for your action">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                aria-pressed={selectedDuration === duration}
                aria-label={`${duration} minutes`}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedDuration === duration
                    ? "bg-coral-600 text-white shadow-lg shadow-coral-600/30"
                    : "bg-ocean-700/50 text-stone-300 hover:bg-ocean-700"
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>

        {/* Step cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary step */}
          <Card className="bg-ocean-800/30 border-ocean-600 p-8 space-y-6 hover:bg-ocean-800/40 transition-colors" role="article" aria-labelledby="primary-step-title">
            <div className="space-y-4">
              <p className="text-sm text-coral-400 uppercase tracking-wider">Recommended</p>
              <p id="primary-step-title" className="text-xl text-white leading-relaxed">{primaryStep}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => onStepSelected("primary", selectedDuration)}
                aria-label={`Start primary step: ${primaryStep}`}
                className="w-full bg-[#FF591F] hover:bg-[#FF591F]/90 text-white py-6 rounded-full font-medium"
              >
                Start this
              </Button>
              <button
                onClick={() => onStepSelected("primary", selectedDuration)}
                aria-label={`Get guidance for primary step: ${primaryStep}`}
                className="w-full text-stone-400 hover:text-white text-sm transition-colors"
              >
                Guide me through this
              </button>
            </div>
          </Card>

          {/* Smaller step */}
          <Card className="bg-ocean-800/20 border-ocean-700 p-8 space-y-6 hover:bg-ocean-800/30 transition-colors" role="article" aria-labelledby="smaller-step-title">
            <div className="space-y-4">
              <p className="text-sm text-stone-400 uppercase tracking-wider">Smaller step</p>
              <p id="smaller-step-title" className="text-xl text-stone-300 leading-relaxed">{smallerStep}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => onStepSelected("smaller", selectedDuration)}
                aria-label={`Start smaller step: ${smallerStep}`}
                className="w-full bg-[#FF591F] hover:bg-[#FF591F]/90 text-white py-6 rounded-full font-medium"
              >
                Start this
              </Button>
              <button
                onClick={() => onStepSelected("smaller", selectedDuration)}
                aria-label={`Get guidance for smaller step: ${smallerStep}`}
                className="w-full text-stone-400 hover:text-white text-sm transition-colors"
              >
                Guide me through this
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
