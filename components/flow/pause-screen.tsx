"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface PauseScreenProps {
  onContinue: () => void
}

export function PauseScreen({ onContinue }: PauseScreenProps) {
  const [scale, setScale] = useState(1)

  // Breathing animation
  useEffect(() => {
    const breathingCycle = async () => {
      setScale(1.3)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setScale(1)
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    const interval = setInterval(breathingCycle, 6000)
    breathingCycle()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full space-y-16 text-center">
        {/* Breathing orb */}
        <div className="flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-coral-500/40 to-coral-600/40 backdrop-blur-sm transition-transform duration-[3000ms] ease-in-out"
            style={{ transform: `scale(${scale})` }}
          />
        </div>

        {/* Text */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-light text-white">Center yourself before acting</h1>
        </div>

        {/* Action */}
        <Button
          size="lg"
          onClick={onContinue}
          className="bg-coral-600 hover:bg-coral-700 text-ocean-deep px-12 py-6 text-lg rounded-full font-medium"
        >
          I'm ready
        </Button>
      </div>
    </div>
  )
}
