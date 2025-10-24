"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ReflectionScreenProps {
  onComplete: (feeling: number, reflection: string) => void
}

export function ReflectionScreen({ onComplete }: ReflectionScreenProps) {
  const [feeling, setFeeling] = useState(3)
  const [reflection, setReflection] = useState("")

  const feelings = [
    { value: 1, emoji: "☁️", label: "Heavy" },
    { value: 2, emoji: "🌥️", label: "Cloudy" },
    { value: 3, emoji: "⛅", label: "Mixed" },
    { value: 4, emoji: "🌤️", label: "Lighter" },
    { value: 5, emoji: "☀️", label: "Clear" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative z-10">
      <div className="max-w-2xl w-full space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-light text-white">How do you feel now?</h1>
        </div>

        {/* Felt-Lighter slider */}
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4" role="group" aria-label="Select how you feel now">
            {feelings.map((f) => (
              <button
                key={f.value}
                onClick={() => setFeeling(f.value)}
                aria-pressed={feeling === f.value}
                aria-label={`${f.label} feeling`}
                className={`flex flex-col items-center gap-2 transition-all ${
                  feeling === f.value ? "scale-125" : "scale-100 opacity-50"
                }`}
              >
                <span className="text-4xl" aria-hidden="true">{f.emoji}</span>
                <span className="text-xs text-stone-400">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min="1"
            max="5"
            value={feeling}
            onChange={(e) => setFeeling(Number(e.target.value))}
            aria-label="Feeling slider - adjust how you feel from heavy to clear"
            className="w-full h-2 bg-ocean-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-coral-600"
          />
        </div>

        {/* Reflection textarea */}
        <div className="space-y-4">
          <label className="block text-base text-stone-300">What did this spark reveal?</label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Optional reflection..."
            className="w-full min-h-[150px] bg-white border border-ocean-600 rounded-2xl p-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-600/50 resize-none leading-relaxed"
          />
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => onComplete(feeling, reflection)}
            className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-6 text-lg rounded-full font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
