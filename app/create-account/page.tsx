"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Volume2, VolumeX } from "lucide-react"

export default function CreateAccount() {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [soundOn, setSoundOn] = useState(false)
  const router = useRouter()

  const canContinue = name.trim().length > 0

  return (
    <main className="h-screen starry-night relative overflow-hidden">
      {/* Green earth curvature */}
      <div className="painted-hills" />

      {/* All 4 bars filled — onboarding complete */}
      <div className="absolute top-10 left-0 right-0 z-[3] flex gap-1.5 px-6">
        <div className="h-1 flex-1 rounded-full bg-white" />
        <div className="h-1 flex-1 rounded-full bg-white" />
        <div className="h-1 flex-1 rounded-full bg-white" />
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

      {/* Spark logo */}
      <div className="absolute top-0 left-0 right-0 z-[3] flex justify-center pt-[68px]">
        <img
          src="/spark-logo-dark.svg"
          alt="Spark"
          className="h-8 w-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
      </div>

      {/* Form — vertically centred */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-center px-6 pb-14">
        <h1 className="font-heading font-bold text-white text-xl leading-[1.35] text-center mb-8">
          Create your Spark account to start connecting the dots
        </h1>

        <div className="flex flex-col gap-4 mb-8">
          {/* Name — required */}
          <div className="flex flex-col gap-2">
            <label className="font-heading font-semibold text-white/55 text-[0.7rem] tracking-[0.15em] uppercase">
              Name <span className="text-[#FF591F]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/[0.07] border border-white/20 rounded-xl px-4 py-3.5 text-white font-body text-base placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-heading font-semibold text-white/55 text-[0.7rem] tracking-[0.15em] uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/[0.07] border border-white/20 rounded-xl px-4 py-3.5 text-white font-body text-base placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />
            <p className="font-body text-white/38 text-xs pl-1">
              You will be sent a verification link
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => canContinue && router.push("/upload")}
            className={`w-full py-4 rounded-full font-heading font-semibold text-base transition-all duration-200 ${
              canContinue
                ? "bg-[#FF591F] text-white shadow-[0_4px_20px_rgba(255,89,31,0.35)] active:scale-[0.98]"
                : "bg-white/10 text-white/35 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
          <button
            onClick={() => router.push("/upload")}
            className="text-white/45 font-body text-sm py-2 hover:text-white/70 transition-colors"
          >
            Or continue as <strong className="font-semibold text-white/65">guest</strong>
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
