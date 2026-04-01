"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Privacy() {
  const [showContinue, setShowContinue] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setShowContinue(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="h-screen starry-night relative overflow-hidden select-none">
      {/* Green earth curvature */}
      <div className="painted-hills" />

      {/* Constellation SVG — all lines converge downward to earth focal point */}
      <svg
        className="absolute inset-0 w-full h-full z-[2]"
        viewBox="0 0 375 812"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Converging lines — fan spreading upward from earth */}
        <g stroke="white" strokeOpacity="0.22" strokeWidth="0.9" fill="none">
          {/* Focal → inner diamond base */}
          <line x1="187" y1="636" x2="152" y2="566" />
          <line x1="187" y1="636" x2="222" y2="566" />
          {/* Inner diamond sides */}
          <line x1="152" y1="566" x2="187" y2="506" />
          <line x1="222" y1="566" x2="187" y2="506" />
          {/* Mid branches out from diamond base */}
          <line x1="152" y1="566" x2="108" y2="476" />
          <line x1="222" y1="566" x2="266" y2="476" />
          {/* Outer arms extending upward */}
          <line x1="108" y1="476" x2="64"  y2="366" />
          <line x1="266" y1="476" x2="310" y2="366" />
        </g>

        {/* Terminal star nodes — top of arms */}
        <circle cx="64"  cy="366" r="3"   fill="white" fillOpacity="0.80" />
        <circle cx="64"  cy="366" r="6"   fill="white" fillOpacity="0.10" />
        <circle cx="310" cy="366" r="3"   fill="white" fillOpacity="0.80" />
        <circle cx="310" cy="366" r="6"   fill="white" fillOpacity="0.10" />
        {/* Mid nodes */}
        <circle cx="108" cy="476" r="2.5" fill="white" fillOpacity="0.68" />
        <circle cx="266" cy="476" r="2.5" fill="white" fillOpacity="0.68" />
        {/* Diamond top */}
        <circle cx="187" cy="506" r="3"   fill="white" fillOpacity="0.82" />
        <circle cx="187" cy="506" r="6"   fill="white" fillOpacity="0.10" />
        {/* Diamond base nodes */}
        <circle cx="152" cy="566" r="2.5" fill="white" fillOpacity="0.72" />
        <circle cx="152" cy="566" r="5"   fill="white" fillOpacity="0.08" />
        <circle cx="222" cy="566" r="2.5" fill="white" fillOpacity="0.72" />
        <circle cx="222" cy="566" r="5"   fill="white" fillOpacity="0.08" />
        {/* Convergence focal — sits on earth horizon */}
        <circle cx="187" cy="636" r="44"  fill="white" fillOpacity="0.03" />
        <circle cx="187" cy="636" r="24"  fill="white" fillOpacity="0.07" />
        <circle cx="187" cy="636" r="12"  fill="white" fillOpacity="0.16" />
        <circle cx="187" cy="636" r="6"   fill="white" fillOpacity="0.65" />
        <circle cx="187" cy="636" r="3.5" fill="white" fillOpacity="1.0"  />
      </svg>

      {/* Story-style pagination — bar 3 active */}
      <div className="absolute top-10 left-0 right-0 z-[3] flex gap-1.5 px-6">
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
      </div>

      {/* Spark logo */}
      <div className="absolute top-0 left-0 right-0 z-[3] flex justify-center pt-[68px]">
        <img
          src="/spark-logo-dark.svg"
          alt="Spark"
          className="h-8 w-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
      </div>

      {/* Key message + read more — vertically centred like other onboarding screens */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-10 pb-16">
        <p className="font-heading font-bold text-white text-[1.5rem] leading-[1.35] text-center mb-4">
          Your data is hosted locally, only you will have access to it.
        </p>
        <a
          href="https://spark.app/privacy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-white/50 font-body text-sm hover:text-white/80 transition-colors underline underline-offset-2"
        >
          Read more here
        </a>
      </div>

      {/* Continue button — fades in after 3 s */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-10 left-6 right-6 z-[5]"
          >
            <button
              onClick={() => router.push("/mantra")}
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
