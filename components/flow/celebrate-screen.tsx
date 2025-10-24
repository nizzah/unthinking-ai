"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface CelebrateScreenProps {
  onComplete: () => void
  onStartCelebration: (activity: string, duration: number) => void
  mindDump?: string
  sparkInsight?: string
  selectedStep?: string
  selectedDuration?: number
}

interface Celebration {
  duration: number
  activity: string
}

export function CelebrateScreen({ 
  onComplete, 
  onStartCelebration,
  mindDump, 
  sparkInsight, 
  selectedStep, 
  selectedDuration 
}: CelebrateScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedCelebration, setSelectedCelebration] = useState<number | null>(null)
  const [celebrations, setCelebrations] = useState<Celebration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fallback celebrations - more fun and personalized
  const fallbackCelebrations: Celebration[] = [
    { duration: 1, activity: "🎉 Do a victory dance like you just conquered the world" },
    { duration: 2, activity: "🌟 Strike a superhero pose and whisper 'I am unstoppable'" },
    { duration: 5, activity: "✨ Write a love letter to your future self" },
  ]

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Fetch personalized celebrations
  useEffect(() => {
    const fetchCelebrations = async () => {
      console.log("Fetching celebrations with:", { mindDump, sparkInsight, selectedStep, selectedDuration })
      
      if (!mindDump || !sparkInsight) {
        console.log("Missing data, using fallback celebrations")
        setCelebrations(fallbackCelebrations)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/celebrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mindDump,
            sparkInsight,
            selectedStep,
            selectedDuration,
          }),
        })

        console.log("Celebrate API response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("Celebrate API response data:", data)
          setCelebrations(data.celebrations || fallbackCelebrations)
        } else {
          console.log("Celebrate API failed, using fallback")
          setCelebrations(fallbackCelebrations)
        }
      } catch (error) {
        console.error("Error fetching celebrations:", error)
        setCelebrations(fallbackCelebrations)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCelebrations()
  }, [mindDump, sparkInsight, selectedStep, selectedDuration])

  const handleCelebrate = (celebration: Celebration) => {
    setSelectedCelebration(celebration.duration)
    onStartCelebration(celebration.activity, celebration.duration)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-coral-400 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
                scale: 1
              }}
              animate={{ 
                y: window.innerHeight + 10,
                rotate: 360,
                scale: 0
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "easeOut"
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
          <p className="text-lg text-stone-300">Take some time to celebrate however small the step</p>
          <div className="grid gap-4">
            {isLoading ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-ocean-800/30 border-ocean-600 p-6">
                    <div className="flex items-start justify-between">
                      <div className="h-6 bg-stone-600 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-stone-600 rounded animate-pulse w-12 ml-4 flex-shrink-0"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              celebrations.map((celebration) => (
                <Card
                  key={celebration.duration}
                  className="bg-ocean-800/30 border-ocean-600 p-6 hover:bg-ocean-800/40 transition-colors cursor-pointer"
                  onClick={() => handleCelebrate(celebration)}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-white text-lg text-left">{celebration.activity}</p>
                    <span className="text-sm text-stone-400 ml-4 flex-shrink-0">{celebration.duration} min</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Skip option */}
        <button onClick={onComplete} className="text-sm text-ocean-800 hover:text-ocean-700 transition-colors">
          I'll celebrate later
        </button>
      </div>
    </div>
  )
}
