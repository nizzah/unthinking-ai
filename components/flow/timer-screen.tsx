"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface TimerScreenProps {
  duration: number // in minutes
  stepText: string
  onComplete: () => void
}

export function TimerScreen({ duration, stepText, onComplete }: TimerScreenProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // convert to seconds
  const [totalTime] = useState(duration * 60)
  const [midpointChecked, setMidpointChecked] = useState(false)
  const [feeling, setFeeling] = useState<"lighter" | "same" | "heavier" | null>(null)

  const progress = ((totalTime - timeLeft) / totalTime) * 100
  const isMidpoint = timeLeft <= totalTime / 2 && !midpointChecked

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const addTime = (minutes: number) => {
    setTimeLeft((prev) => prev + minutes * 60)
  }

  const handleMidpointCheck = (selectedFeeling: "lighter" | "same" | "heavier") => {
    setFeeling(selectedFeeling)
    setMidpointChecked(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full space-y-12 text-center">
        {/* Circular timer */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto" role="timer" aria-label={`Timer: ${formatTime(timeLeft)} remaining`}>
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
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="text-coral-600 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-3xl md:text-5xl font-light text-white font-mono tabular-nums" aria-live="polite">{formatTime(timeLeft)}</p>
          </div>
        </div>

        {/* Step text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-white">Stay with this moment</h2>
          <p className="text-lg text-stone-300 leading-relaxed">{stepText}</p>
        </div>

        {/* Midpoint check */}
        {isMidpoint && !feeling && (
          <div className="bg-ocean-800/30 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-base text-white">How are you feeling?</p>
            <div className="flex gap-3 justify-center">
              {(["lighter", "same", "heavier"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleMidpointCheck(f)}
                  className="px-6 py-3 rounded-full text-sm bg-ocean-700/50 text-stone-300 hover:bg-ocean-700 transition-colors capitalize"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => addTime(1)}
            variant="outline"
            className="border-ocean-600 text-stone-300 hover:bg-ocean-700/50"
          >
            +1 min
          </Button>
          <Button
            onClick={() => addTime(5)}
            variant="outline"
            className="border-ocean-600 text-stone-300 hover:bg-ocean-700/50"
          >
            +5 min
          </Button>
          <Button onClick={onComplete} className="bg-coral-600 hover:bg-coral-700 text-ocean-deep font-medium">
            I'm done
          </Button>
        </div>
      </div>
    </div>
  )
}
