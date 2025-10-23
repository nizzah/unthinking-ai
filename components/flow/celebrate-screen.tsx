"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface CelebrateScreenProps {
  onComplete: () => void
}

export function CelebrateScreen({ onComplete }: CelebrateScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedCelebration, setSelectedCelebration] = useState<number | null>(null)

  const celebrations = [
    { duration: 2, activity: "Take a mindful walk" },
    { duration: 5, activity: "Play your favorite song" },
    { duration: 15, activity: "Make yourself tea and sit quietly" },
  ]

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleCelebrate = (duration: number) => {
    setSelectedCelebration(duration)
    setTimeout(onComplete, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-coral-400 rounded-full animate-[fall_3s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random(),
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full space-y-12 text-center relative z-10">
        {/* Header */}
        <div className="space-y-6">
          <div className="text-6xl">✨</div>
          <h1 className="text-3xl md:text-4xl font-light text-white">Lightness grows when you honor your direction</h1>
        </div>

        {/* Celebration options */}
        <div className="space-y-4">
          <p className="text-lg text-stone-300">Celebrate now</p>
          <div className="grid gap-4">
            {celebrations.map((celebration) => (
              <Card
                key={celebration.duration}
                className="bg-ocean-800/30 border-ocean-600 p-6 hover:bg-ocean-800/40 transition-colors cursor-pointer"
                onClick={() => handleCelebrate(celebration.duration)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-white text-lg">{celebration.activity}</p>
                  <span className="text-sm text-stone-400">{celebration.duration} min</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Skip option */}
        <button onClick={onComplete} className="text-sm text-stone-400 hover:text-stone-300 transition-colors">
          I'll celebrate later
        </button>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
