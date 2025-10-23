"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { MindDumpScreen } from "@/components/flow/mind-dump-screen"
import { BreathingTransitionScreen } from "@/components/flow/breathing-transition-screen"
import { SparkScreen } from "@/components/flow/spark-screen"
import { PauseScreen } from "@/components/flow/pause-screen"
import { StepScreen } from "@/components/flow/step-screen"
import { TimerScreen } from "@/components/flow/timer-screen"
import { ReflectionScreen } from "@/components/flow/reflection-screen"
import { CelebrateScreen } from "@/components/flow/celebrate-screen"
import { DirectionStreakFooter } from "@/components/flow/direction-streak-footer"

type FlowPhase =
  | "mind-dump"
  | "breathing-transition"
  | "spark"
  | "pause"
  | "step"
  | "timer"
  | "reflection"
  | "celebrate"

interface SparkData {
  insight: string
  context: string
  source: string
  date: string
}

interface StepData {
  primary: string
  smaller: string
}

export default function FlowPage() {
  const searchParams = useSearchParams()
  const startMode = searchParams.get("start")

  const [phase, setPhase] = useState<FlowPhase>(startMode === "dump" ? "mind-dump" : "breathing-transition")
  const [sparkData, setSparkData] = useState<SparkData | null>(null)
  const [stepData, setStepData] = useState<StepData | null>(null)
  const [selectedStep, setSelectedStep] = useState<"primary" | "smaller" | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(2)
  const [mindDumpText, setMindDumpText] = useState("")
  const [reflectionText, setReflectionText] = useState("")

  const fetchSpark = async () => {
    try {
      const response = await fetch("/api/spark")
      const data = await response.json()
      setSparkData(data.spark)
      setStepData(data.steps)
    } catch (error) {
      console.error("[v0] Error fetching spark:", error)
      // Fallback mock data
      setSparkData({
        insight:
          "You've been collecting ideas but not acting on them. What if the next small step matters more than the perfect plan?",
        context: "You've saved 12 notes about creative projects in the past month, but haven't started any of them.",
        source: "Your notes from the past 30 days",
        date: "Aug 2023",
      })
      setStepData({
        primary: "Open one of your saved project notes and write just the first sentence of what you'd create.",
        smaller: "Pick your favorite saved idea and read it out loud to yourself.",
      })
    }
  }

  const handleMindDumpComplete = (text: string) => {
    setMindDumpText(text)
    setPhase("breathing-transition")
  }

  const handleBreathingComplete = () => {
    setPhase("spark")
  }

  const handleSparkContinue = () => {
    setPhase("pause")
  }

  const handlePauseContinue = () => {
    setPhase("step")
  }

  const handleStepSelected = (step: "primary" | "smaller", duration: number) => {
    setSelectedStep(step)
    setSelectedDuration(duration)
    setPhase("timer")
  }

  const handleTimerComplete = () => {
    setPhase("reflection")
  }

  const handleReflectionComplete = (feeling: number, reflection: string) => {
    setReflectionText(reflection)
    setPhase("celebrate")

    // Submit to API
    submitSession(feeling, reflection)
  }

  const handleCelebrationComplete = () => {
    // Reset for next session
    setPhase("mind-dump")
    setSelectedStep(null)
    setMindDumpText("")
    setReflectionText("")
  }

  const submitSession = async (feeling: number, reflection: string) => {
    try {
      await fetch("/api/relief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sparkId: sparkData?.source,
          selectedStep,
          selectedDuration,
          feeling,
          reflection,
          mindDump: mindDumpText,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("[v0] Error submitting session:", error)
    }
  }

  const handleSkip = () => {
    fetchSpark()
  }

  return (
    <div className="min-h-screen bg-ocean-deep relative">
      {phase === "mind-dump" && <MindDumpScreen onComplete={handleMindDumpComplete} />}

      {phase === "breathing-transition" && (
        <BreathingTransitionScreen onComplete={handleBreathingComplete} onFetchSpark={fetchSpark} />
      )}

      {phase === "spark" && sparkData && (
        <SparkScreen
          insight={sparkData.insight}
          context={sparkData.context}
          source={sparkData.source}
          date={sparkData.date}
          onContinue={handleSparkContinue}
          onSkip={handleSkip}
        />
      )}

      {phase === "pause" && <PauseScreen onContinue={handlePauseContinue} />}

      {phase === "step" && stepData && (
        <StepScreen
          primaryStep={stepData.primary}
          smallerStep={stepData.smaller}
          onStepSelected={handleStepSelected}
          onSkip={handleSkip}
        />
      )}

      {phase === "timer" && selectedStep && stepData && (
        <TimerScreen
          duration={selectedDuration}
          stepText={selectedStep === "primary" ? stepData.primary : stepData.smaller}
          onComplete={handleTimerComplete}
        />
      )}

      {phase === "reflection" && <ReflectionScreen onComplete={handleReflectionComplete} />}

      {phase === "celebrate" && <CelebrateScreen onComplete={handleCelebrationComplete} />}

      <DirectionStreakFooter />
    </div>
  )
}
