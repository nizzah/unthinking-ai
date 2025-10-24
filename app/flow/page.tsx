"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
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

// Animation variants for phase transitions
const phaseVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const transition = {
  duration: 0.5,
  ease: "easeInOut"
}

export default function FlowPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const startMode = searchParams.get("start")

  const [phase, setPhase] = useState<FlowPhase>(startMode === "dump" ? "mind-dump" : "breathing-transition")
  const [sparkData, setSparkData] = useState<SparkData | null>(null)
  const [stepData, setStepData] = useState<StepData | null>(null)
  const [selectedStep, setSelectedStep] = useState<"primary" | "smaller" | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(2)
  const [mindDumpText, setMindDumpText] = useState("")
  const [reflectionText, setReflectionText] = useState("")
  const [isLoadingSpark, setIsLoadingSpark] = useState(false)

  const fetchSpark = async () => {
    setIsLoadingSpark(true)
    try {
      const response = await fetch("/api/spark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mindDump: mindDumpText })
      })
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
    } finally {
      setIsLoadingSpark(false)
    }
  }

  const handleMindDumpComplete = (text: string) => {
    setMindDumpText(text)
    setPhase("breathing-transition")
  }

  const handleBreathingComplete = async () => {
    await fetchSpark()
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
    // Navigate back to home screen
    router.push("/")
  }

  const submitSession = async (feeling: number, reflection: string) => {
    try {
      const response = await fetch("/api/relief", {
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

      if (response.ok) {
        const result = await response.json()
        
        // Update streak data in localStorage
        updateStreakData({
          feeling,
          selectedStep: selectedStep || "unknown",
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting session:", error)
    }
  }

  const updateStreakData = (newSession: { feeling: number; selectedStep: string; timestamp: string }) => {
    try {
      // Get existing streak data
      const existingData = localStorage.getItem('unthinking-streak')
      let streakData = existingData ? JSON.parse(existingData) : { sessions: [] }
      
      // Add new session
      streakData.sessions.unshift({
        date: newSession.timestamp,
        feeling: newSession.feeling,
        selectedStep: newSession.selectedStep,
      })
      
      // Keep only last 30 sessions to avoid localStorage bloat
      streakData.sessions = streakData.sessions.slice(0, 30)
      
      // Update last session
      streakData.lastSession = newSession.timestamp
      
      // Save to localStorage
      localStorage.setItem('unthinking-streak', JSON.stringify(streakData))
      
      // Dispatch custom event for streak footer to update
      window.dispatchEvent(new CustomEvent('streak-update', { detail: streakData }))
      
      console.log("[v0] Streak data updated:", streakData)
    } catch (error) {
      console.error("[v0] Error updating streak data:", error)
    }
  }

  const handleSkip = () => {
    // Skip to next spark - for now, just regenerate with same mind dump
    fetchSpark()
  }

  return (
    <div className="min-h-screen starry-night relative overflow-hidden">
      {/* Painted Sun */}
      <div className="painted-sun" />
      
      {/* Painted Hills */}
      <div className="painted-hills" />
      <AnimatePresence mode="wait">
        {phase === "mind-dump" && (
          <motion.div
            key="mind-dump"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <MindDumpScreen onComplete={handleMindDumpComplete} />
          </motion.div>
        )}

        {phase === "breathing-transition" && (
          <motion.div
            key="breathing-transition"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <BreathingTransitionScreen onComplete={handleBreathingComplete} />
          </motion.div>
        )}

        {phase === "spark" && sparkData && (
          <motion.div
            key="spark"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <SparkScreen
              insight={sparkData.insight}
              context={sparkData.context}
              source={sparkData.source}
              date={sparkData.date}
              onContinue={handleSparkContinue}
              onSkip={handleSkip}
            />
          </motion.div>
        )}

        {phase === "pause" && (
          <motion.div
            key="pause"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <PauseScreen onContinue={handlePauseContinue} />
          </motion.div>
        )}

        {phase === "step" && stepData && (
          <motion.div
            key="step"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <StepScreen
              primaryStep={stepData.primary}
              smallerStep={stepData.smaller}
              onStepSelected={handleStepSelected}
              onSkip={handleSkip}
            />
          </motion.div>
        )}

        {phase === "timer" && selectedStep && stepData && (
          <motion.div
            key="timer"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <TimerScreen
              duration={selectedDuration}
              stepText={selectedStep === "primary" ? stepData.primary : stepData.smaller}
              onComplete={handleTimerComplete}
            />
          </motion.div>
        )}

        {phase === "reflection" && (
          <motion.div
            key="reflection"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <ReflectionScreen onComplete={handleReflectionComplete} />
          </motion.div>
        )}

        {phase === "celebrate" && (
          <motion.div
            key="celebrate"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <CelebrateScreen onComplete={handleCelebrationComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <DirectionStreakFooter />
    </div>
  )
}
