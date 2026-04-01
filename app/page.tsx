"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Volume2, VolumeX } from "lucide-react"

export default function Home() {
  const [soundOn, setSoundOn] = useState(false)
  const router = useRouter()

  return (
    <main
      className="h-screen starry-night relative overflow-hidden select-none"
    >
      {/* Green earth curvature */}
      <div className="painted-hills" />

      {/* Illustration: constellation SVG — full bleed background */}
      <svg
        className="absolute inset-0 w-full h-full z-[2]"
        viewBox="0 0 375 812"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Constellation lines */}
        <g stroke="white" strokeOpacity="0.22" strokeWidth="0.8" fill="none">
          <line x1="222" y1="68"  x2="165" y2="128" />
          <line x1="222" y1="68"  x2="278" y2="108" />
          <line x1="165" y1="128" x2="132" y2="198" />
          <line x1="165" y1="128" x2="195" y2="248" />
          <line x1="278" y1="108" x2="252" y2="202" />
          <line x1="252" y1="202" x2="195" y2="248" />
          <line x1="252" y1="202" x2="305" y2="262" />
        </g>
        {/* Constellation star nodes */}
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
        {/* Ambient stars */}
        <circle cx="45"  cy="95"  r="1.5" fill="white" fillOpacity="0.50" />
        <circle cx="320" cy="82"  r="1"   fill="white" fillOpacity="0.65" />
        <circle cx="72"  cy="200" r="1"   fill="white" fillOpacity="0.40" />
        <circle cx="348" cy="175" r="1.5" fill="white" fillOpacity="0.55" />
        <circle cx="55"  cy="310" r="1"   fill="white" fillOpacity="0.35" />
        <circle cx="338" cy="265" r="1"   fill="white" fillOpacity="0.45" />
        <circle cx="105" cy="145" r="1"   fill="white" fillOpacity="0.50" />
        <circle cx="358" cy="340" r="1.5" fill="white" fillOpacity="0.40" />
        <circle cx="30"  cy="375" r="1"   fill="white" fillOpacity="0.30" />
      </svg>

      {/* Pagination — 4 equal story bars */}
      <div className="absolute top-10 left-0 right-0 z-[3] flex gap-1.5 px-6">
        <div className="h-1 flex-1 rounded-full bg-white" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
        <div className="h-1 flex-1 rounded-full bg-white/30" />
      </div>

      {/* Centre content: logo + strapline + CTA */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-8 text-center">
        <img
          src="/spark-logo-dark.svg"
          alt="Spark"
          className="w-[85%] max-w-[320px] h-auto mb-8"
          onError={(e) => {
            const el = e.target as HTMLImageElement
            el.style.display = "none"
            const fallback = el.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = "block"
          }}
        />
        <span className="font-heading font-bold text-white text-3xl tracking-wide hidden mb-8">
          Spark
        </span>

        <h1 className="font-body font-normal text-white text-[2rem] leading-[1.2] mb-10">
          Turn your scattered notes into meaningful action
        </h1>

        <button
          onClick={() => router.push("/intro")}
          className="w-full max-w-[320px] bg-[#FF591F] text-white font-heading font-semibold text-base py-4 rounded-full shadow-[0_4px_20px_rgba(255,89,31,0.35)] active:scale-[0.98] transition-transform"
        >
          Begin your journey
        </button>
      </div>

      {/* Audio toggle — bottom LEFT per wireframe */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setSoundOn((s) => !s)
        }}
        className="absolute bottom-10 left-6 z-[4] text-white/35 hover:text-white/60 transition-colors duration-300"
        aria-label={soundOn ? "Mute sound" : "Enable sound"}
      >
        {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </main>
  )
}
