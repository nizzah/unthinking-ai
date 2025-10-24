"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface BreathingTransitionScreenProps {
  onComplete: () => void
  isSparkReady: boolean
}

export function BreathingTransitionScreen({ onComplete, isSparkReady }: BreathingTransitionScreenProps) {
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale")
  const [isExpanded, setIsExpanded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Keep the ref up to date with the latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Main breathing cycle effect - starts immediately
  useEffect(() => {
    if (hasCompletedRef.current) return

    console.log("[v0] Starting breathing animation sequence")
    
    const startTime = Date.now()
    let currentBreath = 0
    let lastPhase: "inhale" | "exhale" = "inhale"
    const BREATH_DURATION = 8000 // 8 seconds per breath (4 in, 4 out)
    
    // Start with inhale
    setBreathPhase("inhale")
    setIsExpanded(true)
    setBreathCount(0)

    const breathingInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const currentCycleTime = elapsedTime % BREATH_DURATION
      const completedBreaths = Math.floor(elapsedTime / BREATH_DURATION)

      // Update breath count if it changed
      if (completedBreaths !== currentBreath) {
        currentBreath = completedBreaths
        setBreathCount(completedBreaths)
        console.log("[v0] Breath count updated to:", completedBreaths)
      }

      // Determine what phase we should be in based on time
      const shouldBeInhaling = currentCycleTime < 4000

      // Only update state if phase actually changed
      if (shouldBeInhaling && lastPhase !== "inhale") {
        console.log("[v0] Switching to inhale phase")
        setBreathPhase("inhale")
        setIsExpanded(true)
        lastPhase = "inhale"
      } else if (!shouldBeInhaling && lastPhase !== "exhale") {
        console.log("[v0] Switching to exhale phase")
        setBreathPhase("exhale")
        setIsExpanded(false)
        lastPhase = "exhale"
      }
    }, 100) // Check every 100ms for smooth transitions

    return () => {
      console.log("[v0] Cleaning up breathing animation")
      clearInterval(breathingInterval)
    }
  }, []) // Remove isLoading dependency so animation starts immediately

  // Effect to complete breathing when spark is ready
  useEffect(() => {
    if (isSparkReady && !hasCompletedRef.current) {
      console.log("[v0] Spark is ready, completing breathing animation")
      hasCompletedRef.current = true
      
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        onCompleteRef.current()
      }, 500)
    }
  }, [isSparkReady])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full space-y-16 text-center">
        {/* Breathing orb */}
        <div className="flex items-center justify-center px-8">
          <motion.div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-coral-600 to-coral-400 shadow-2xl shadow-coral-600/30"
            animate={{
              scale: isExpanded ? 1.4 : 1,
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Text */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-light text-white">Breathe in clarity, breathe out noise</h1>
          <motion.p
            key={breathPhase}
            className="text-lg text-stone-300 leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {breathPhase === "inhale" ? "Breathe in" : "Breathe out"}
          </motion.p>
          
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-sm text-stone-400 hover:text-stone-300 transition-colors"
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? "🔊 Sound on" : "🔇 Sound off"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < breathCount ? "bg-coral-500" : "bg-stone-600"
                }`}
                animate={{
                  scale: i < breathCount ? 1.2 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
