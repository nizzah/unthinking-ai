"use client"

import { useEffect, useState } from "react"

interface PausePhaseProps {
  onComplete: () => void
}

export function PausePhase({ onComplete }: PausePhaseProps) {
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in")
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // 4-7-8 breathing pattern
    const breathIn = setTimeout(() => {
      setBreathPhase("in")
      setScale(1.5)
    }, 100)

    const hold = setTimeout(() => {
      setBreathPhase("hold")
    }, 4100)

    const breathOut = setTimeout(() => {
      setBreathPhase("out")
      setScale(1)
    }, 11100)

    const complete = setTimeout(() => {
      onComplete()
    }, 19100)

    return () => {
      clearTimeout(breathIn)
      clearTimeout(hold)
      clearTimeout(breathOut)
      clearTimeout(complete)
    }
  }, [onComplete])

  const getInstruction = () => {
    switch (breathPhase) {
      case "in":
        return "Breathe in"
      case "hold":
        return "Hold"
      case "out":
        return "Breathe out"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-16">
        {/* Breathing circle */}
        <div className="relative w-64 h-64 mx-auto">
          <div
            className="absolute inset-0 rounded-full bg-accent/20 transition-transform duration-[4000ms] ease-in-out"
            style={{
              transform: `scale(${scale})`,
              transitionDuration: breathPhase === "in" ? "4000ms" : breathPhase === "out" ? "8000ms" : "0ms",
            }}
          />
          <div
            className="absolute inset-8 rounded-full bg-accent/40 transition-transform duration-[4000ms] ease-in-out"
            style={{
              transform: `scale(${scale})`,
              transitionDuration: breathPhase === "in" ? "4000ms" : breathPhase === "out" ? "8000ms" : "0ms",
            }}
          />
          <div
            className="absolute inset-16 rounded-full bg-accent transition-transform duration-[4000ms] ease-in-out"
            style={{
              transform: `scale(${scale})`,
              transitionDuration: breathPhase === "in" ? "4000ms" : breathPhase === "out" ? "8000ms" : "0ms",
            }}
          />
        </div>

        {/* Instruction */}
        <p className="text-2xl text-foreground font-light animate-in fade-in duration-500">{getInstruction()}</p>
      </div>
    </div>
  )
}
