"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface CelebrationTimerScreenProps {
  activity: string
  duration: number
  onComplete: () => void
  onReturnToApp: () => void
}

export function CelebrationTimerScreen({ 
  activity, 
  duration, 
  onComplete, 
  onReturnToApp 
}: CelebrationTimerScreenProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // convert to seconds
  const [isActive, setIsActive] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  // Auto-complete when timer reaches zero
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false)
      setShowCompletion(true)
      // Auto-return to app after 3 seconds
      setTimeout(() => {
        onReturnToApp()
      }, 3000)
    }
  }, [timeLeft, isActive, onReturnToApp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startCelebration = () => {
    setIsActive(true)
  }

  const skipCelebration = () => {
    onReturnToApp()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative z-10">
      <div className="max-w-2xl w-full space-y-12 text-center">
        {/* Celebration Activity */}
        <div className="space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl md:text-4xl font-light text-white">Time to celebrate!</h1>
          <p className="text-xl text-stone-300">{activity}</p>
        </div>

        {/* Timer Display */}
        <div className="space-y-8">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256" aria-hidden="true">
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-ocean-700"
              />
              {/* Progress circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - ((duration * 60 - timeLeft) / (duration * 60)))}`}
                className="text-coral-600 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-3xl md:text-5xl font-light text-white font-mono tabular-nums">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-6xl">✨</div>
            <h2 className="text-2xl font-light text-white">Celebration complete!</h2>
            <p className="text-lg text-stone-300">Returning to your journey...</p>
          </motion.div>
        )}

        {/* Controls */}
        {!showCompletion && (
          <div className="space-y-4">
            {!isActive ? (
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={startCelebration}
                  className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-6 text-lg rounded-full font-medium"
                >
                  Start celebrating
                </Button>
                <Button
                  variant="outline"
                  onClick={skipCelebration}
                  className="border-ocean-600 text-ocean-300 hover:bg-ocean-700/50 px-8 py-4 rounded-full"
                >
                  Skip
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-stone-300">Enjoy your celebration!</p>
                <Button
                  variant="outline"
                  onClick={skipCelebration}
                  className="border-ocean-600 text-ocean-300 hover:bg-ocean-700/50 px-6 py-3 rounded-full"
                >
                  Finish early
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
