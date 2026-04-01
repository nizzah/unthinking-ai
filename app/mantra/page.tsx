"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Volume2, VolumeX } from "lucide-react"

export default function Mantra() {
  const [soundOn, setSoundOn] = useState(false)
  const router = useRouter()

  return (
    <main className="h-screen starry-night relative overflow-hidden select-none">
      {/* Green earth curvature */}
      <div className="painted-hills" />

      {/* Constellation SVG — fullest sky */}
      <svg
        className="absolute inset-0 w-full h-full z-[2]"
        viewBox="0 0 375 812"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g stroke="white" strokeOpacity="0.20" strokeWidth="0.8" fill="none">
          <line x1="222" y1="68"  x2="165" y2="128" />
          <line x1="222" y1="68"  x2="278" y2="108" />
          <line x1="165" y1="128" x2="132" y2="198" />
          <line x1="165" y1="128" x2="195" y2="248" />
          <line x1="278" y1="108" x2="252" y2="202" />
          <line x1="252" y1="202" x2="195" y2="248" />
          <line x1="252" y1="202" x2="305" y2="262" />
        </g>
        <circle cx="165" cy="128" r="3"   fill="white" fillOpacity="0.85" />
        <circle cx="165" cy="128" r="5.5" fill="white" fillOpacity="0.12" />
        <circle cx="278" cy="108" r="2.5" fill="white" fillOpacity="0.80" />
        <circle cx="278" cy="108" r="5"   fill="white" fillOpacity="0.10" />
        <circle cx="132" cy="198" r="2"   fill="white" fillOpacity="0.65" />
        <circle cx="252" cy="202" r="3"   fill="white" fillOpacity="0.80" />
        <circle cx="252" cy="202" r="5.5" fill="white" fillOpacity="0.10" />
        <circle cx="195" cy="248" r="2.5" fill="white" fillOpacity="0.70" />
        <circle cx="305" cy="262" r="2"   fill="white" fillOpacity="0.60" />
        {/* Coral focal star */}
        <circle cx="222" cy="68"  r="52"  fill="#FF591F" fillOpacity="0.04" />
        <circle cx="222" cy="68"  r="30"  fill="#FF591F" fillOpacity="0.08" />
        <circle cx="222" cy="68"  r="15"  fill="#FF591F" fillOpacity="0.18" />
        <circle cx="222" cy="68"  r="8"   fill="#FF591F" fillOpacity="0.65" />
        <circle cx="222" cy="68"  r="4.5" fill="#FF591F" />
      </svg>

      {/* Story-style pagination — bar 4 active */}
      <div className="absolute top-10 left-0 right-0 z-[3] flex gap-1.5 px-6">
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white" />
      </div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-[62px] left-4 z-[4] w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        aria-label="Back"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Content */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-8 pb-10">
        {/* Quote */}
        <blockquote className="font-body italic text-white text-[2.1rem] leading-[1.2] text-center mb-3">
          "I unthink, therefore I become."
        </blockquote>
        {/* Byline */}
        <p className="font-heading font-semibold text-white/40 text-[0.7rem] tracking-[0.2em] uppercase mb-8">
          Unthinking Space
        </p>
        {/* Supporting line */}
        <p className="font-body text-white/60 text-[0.95rem] leading-relaxed text-center max-w-[260px] mb-14">
          Your thinking is already in there. Let's find it.
        </p>

        {/* CTAs */}
        <div className="w-full flex flex-col items-center gap-4">
          <button
            onClick={() => router.push("/create-account")}
            className="w-full bg-[#FF591F] text-white font-heading font-semibold text-base py-4 rounded-full shadow-[0_4px_20px_rgba(255,89,31,0.35)] active:scale-[0.98] transition-transform"
          >
            Get started
          </button>
          <button
            onClick={() => router.push("/flow")}
            className="text-white/45 font-body text-sm py-2 hover:text-white/70 transition-colors"
          >
            Or continue as guest
          </button>
        </div>
      </div>

      {/* Audio toggle — bottom left */}
      <button
        onClick={() => setSoundOn((s) => !s)}
        className="absolute bottom-10 left-6 z-[5] text-white/35 hover:text-white/60 transition-colors duration-300"
        aria-label={soundOn ? "Mute sound" : "Enable sound"}
      >
        {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </main>
  )
}
