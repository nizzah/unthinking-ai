"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Camera, Mic, Link2, User } from "lucide-react"

const OPTIONS = [
  { id: "camera", label: "Camera",        Icon: Camera, x: -118, y:  10 },
  { id: "audio",  label: "Audio/\nvideo", Icon: Mic,    x:    0, y: -128 },
  { id: "links",  label: "Links",         Icon: Link2,  x:  118, y:  10 },
]

export default function Upload() {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  return (
    <main className="h-screen starry-night relative overflow-hidden select-none">
      {/* Logo row — logo centred, profile icon top-right */}
      <div className="absolute top-0 left-0 right-0 z-[3] flex items-center justify-between px-6 pt-14">
        <div className="w-9" />
        <img
          src="/spark-logo-dark.svg"
          alt="Spark"
          className="h-7 w-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
        <button
          className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/55 hover:border-white/45 hover:text-white/80 transition-colors"
          aria-label="Profile"
        >
          <User size={16} />
        </button>
      </div>

      {/* Heading */}
      <div className="absolute top-0 left-0 right-0 z-[3] flex justify-center pt-[108px] px-8">
        <h1 className="font-heading font-bold text-white text-xl leading-[1.35] text-center">
          Build your galaxy of ideas and notes
        </h1>
      </div>

      {/* Centre interaction zone */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center pb-8">

        {/* Hub: yellow FAB + orbiting options */}
        <div className="relative flex items-center justify-center" style={{ width: 288, height: 288 }}>

          {/* Dashed connecting lines */}
          <AnimatePresence>
            {expanded && (
              <motion.svg
                key="lines"
                className="absolute inset-0 pointer-events-none overflow-visible"
                width="288" height="288"
                viewBox="-144 -144 288 288"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {OPTIONS.map((o) => (
                  <line
                    key={o.id}
                    x1="0" y1="0" x2={o.x} y2={o.y}
                    stroke="white" strokeOpacity="0.22"
                    strokeWidth="1" strokeDasharray="5 4"
                  />
                ))}
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Orbiting option bubbles */}
          <AnimatePresence>
            {expanded && OPTIONS.map((o, i) => (
              <motion.button
                key={o.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                animate={{ x: o.x, y: o.y, opacity: 1, scale: 1 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                whileTap={{ scale: 0.92 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.07,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                onClick={() => router.push("/flow")}
                className="absolute flex flex-col items-center justify-center gap-1 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                style={{
                  width: 72, height: 72,
                  left: "calc(50% - 36px)",
                  top:  "calc(50% - 36px)",
                }}
              >
                <o.Icon size={15} className="text-[#052135]" strokeWidth={2} />
                <span className="font-heading font-semibold text-[#052135] text-[10px] leading-tight text-center whitespace-pre-line">
                  {o.label}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Yellow sun FAB */}
          <motion.button
            onClick={() => setExpanded((e) => !e)}
            whileTap={{ scale: 0.94 }}
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 w-20 h-20 rounded-full bg-[#FFB900] flex items-center justify-center shadow-[0_0_40px_rgba(255,185,0,0.50)]"
          >
            <Plus size={32} strokeWidth={2.5} className="text-[#052135]" />
          </motion.button>
        </div>

        {/* "Tap to add notes" hint — disappears when expanded */}
        <AnimatePresence>
          {!expanded && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="font-body text-white/50 text-sm mt-1 pointer-events-none"
            >
              Tap to add notes
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <div className="absolute bottom-10 left-6 right-6 z-[3]">
        <button
          onClick={() => router.push("/flow")}
          className="w-full py-4 rounded-full border border-white/25 text-white/55 font-heading font-semibold text-sm hover:border-white/40 hover:text-white/75 transition-colors"
        >
          Skip, and start without any notes
        </button>
      </div>
    </main>
  )
}
