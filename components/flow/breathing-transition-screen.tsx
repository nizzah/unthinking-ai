"use client"

import { useEffect, useState } from "react"

interface BreathingTransitionScreenProps {
  onComplete: () => void
  onFetchSpark: () => Promise<void>
}

export function BreathingTransitionScreen({ onComplete, onFetchSpark }: BreathingTransitionScreenProps) {
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale")
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch spark on mount
  useEffect(() => {
    const fetchData = async () => {
      await onFetchSpark()
      setIsLoading(false)
    }
    fetchData()
  }, [onFetchSpark])

  useEffect(() => {
    if (isLoading) return

    console.log("[v0] Starting breathing cycle, breathCount:", breathCount)

    // Complete after 3 breaths
    if (breathCount >= 3) {
      console.log("[v0] Completed 3 breaths, advancing to spark")
      onComplete()
      return
    }

    // Start with inhale phase
    console.log("[v0] Starting inhale phase")
    setBreathPhase("inhale")
    setIsExpanded(true)

    // Switch to exhale after 3 seconds
    const exhaleTimer = setTimeout(() => {
      console.log("[v0] Switching to exhale phase")
      setBreathPhase("exhale")
      setIsExpanded(false)
    }, 3000)

    // Complete breath cycle after 6 seconds and start next breath
    const nextBreathTimer = setTimeout(() => {
      console.log("[v0] Completing breath cycle, incrementing count")
      setBreathCount((prev) => prev + 1)
    }, 6000)

    return () => {
      clearTimeout(exhaleTimer)
      clearTimeout(nextBreathTimer)
    }
  }, [breathCount, isLoading, onComplete])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full space-y-16 text-center">
        {/* Breathing orb */}
        <div className="flex items-center justify-center px-8">
          <div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-coral-600 to-coral-400 shadow-2xl shadow-coral-600/30"
            style={{
              transform: isExpanded ? "scale(1.4)" : "scale(1)",
              transition: "transform 3000ms ease-in-out",
            }}
          />
        </div>

        {/* Text */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-light text-white">Breathe in clarity, breathe out noise</h1>
          <p
            key={breathPhase}
            className="text-lg text-stone-300 leading-relaxed max-w-xl mx-auto animate-in fade-in duration-300"
          >
            {breathPhase === "inhale" ? "Breathe in" : "Breathe out"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <p className="text-sm text-stone-400">Finding your spark...</p>
          ) : (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i < breathCount ? "bg-coral-500" : "bg-stone-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
