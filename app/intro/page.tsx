"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Play, Volume2, VolumeX } from "lucide-react"

const variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export default function Intro() {
  const [step, setStep] = useState(0)
  const [showContinue, setShowContinue] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const router = useRouter()

  // Reset and start 3-second timer on each step
  useEffect(() => {
    setShowContinue(false)
    const timer = setTimeout(() => setShowContinue(true), 3000)
    return () => clearTimeout(timer)
  }, [step])

  const advance = () => {
    if (step === 0) setStep(1)
    else router.push("/privacy")
  }

  const back = () => {
    if (step > 0) setStep((s) => s - 1)
    else router.back()
  }

  return (
    <main className="h-screen starry-night relative overflow-hidden select-none">
      {/* Green earth curvature */}
      <div className="painted-hills" />

      {/* Story-style pagination — bar 2 active */}
      <div className="absolute top-10 left-0 right-0 z-[3] flex gap-1.5 px-6">
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
      </div>

      {/* Back button */}
      <button
        onClick={back}
        className="absolute top-[62px] left-4 z-[4] w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        aria-label="Back"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Step 0: Video intro ── */}
        {step === 0 && (
          <motion.div
            key="video"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8 pb-32"
          >
            {/* Video placeholder */}
            <div className="relative w-full max-w-[320px] aspect-video rounded-2xl bg-[#041a2b] border border-[#1c4966] flex items-center justify-center mb-8 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: [
                    "radial-gradient(1.5px 1.5px at 15% 25%, rgba(255,255,255,0.5), transparent)",
                    "radial-gradient(1px 1px at 55% 65%, rgba(255,255,255,0.4), transparent)",
                    "radial-gradient(2px 2px at 80% 20%, rgba(255,255,255,0.3), transparent)",
                    "radial-gradient(1px 1px at 35% 75%, rgba(255,255,255,0.35), transparent)",
                    "radial-gradient(1.5px 1.5px at 70% 45%, rgba(255,255,255,0.25), transparent)",
                  ].join(", "),
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                }}
              />
              <div className="relative z-10 w-14 h-14 rounded-full bg-[#FF591F] flex items-center justify-center shadow-[0_0_24px_rgba(255,89,31,0.45)]">
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </div>
              <span className="absolute bottom-3 right-3 text-white/40 text-[11px] font-mono tracking-wide">
                2:14
              </span>
            </div>

            <h1 className="font-body font-normal text-white text-[1.55rem] leading-[1.3] text-center">
              Upload your notes, discover hidden patterns and take small steps forward
            </h1>
          </motion.div>
        )}

        {/* ── Step 1: How it works ── */}
        {step === 1 && (
          <motion.div
            key="how"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-[2] flex flex-col justify-center px-8 pb-32"
          >
            <h2 className="font-heading font-bold text-white text-2xl mb-10 text-center">
              How it works
            </h2>

            <div className="flex flex-col gap-8">
              {[
                {
                  n: "1",
                  title: "Dump your notes",
                  body: "Upload photos, voice memos, or connect Notion — everything scattered, in one place.",
                },
                {
                  n: "2",
                  title: "Spark finds patterns",
                  body: "Your ideas form a constellation — themes, connections, and insights you hadn't seen.",
                },
                {
                  n: "3",
                  title: "Take your first step",
                  body: "A courage ladder of three small actions, made just for where you are right now.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex gap-5 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#FF591F]/15 border border-[#FF591F]/35 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-heading font-bold text-[#FF591F] text-sm">{n}</span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-white text-base mb-1 leading-snug">
                      {title}
                    </p>
                    <p className="font-body text-white/55 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Continue button — fades in after 3 s */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            key="continue-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-10 left-6 right-6 z-[5]"
          >
            <button
              onClick={advance}
              className="w-full bg-[#FF591F] text-white font-heading font-semibold text-base py-4 rounded-full shadow-[0_4px_20px_rgba(255,89,31,0.35)] active:scale-[0.98] transition-transform"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
