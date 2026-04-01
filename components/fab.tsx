"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Camera, Mic, Link2, Plug, PenLine, X } from "lucide-react"

const NODES = [
  { id: "integrations", label: "Integrations", Icon: Plug,    route: "/integrations", action: null  },
  { id: "links",        label: "Links",         Icon: Link2,   route: "/flow",          action: null  },
  { id: "camera",       label: "Camera",        Icon: Camera,  route: "/flow",          action: null  },
  { id: "audio",        label: "Audio/video",   Icon: Mic,     route: "/flow",          action: null  },
  { id: "write",        label: "Write",         Icon: PenLine, route: null,             action: "write" },
]

// Rendered top-to-bottom as [...NODES].reverse()
// renderedIndex 0 = Write (top), renderedIndex 4 = Integrations (bottom)
const nodeVariants = {
  initial: { opacity: 0, y: 10 },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      delay: (NODES.length - 1 - i) * 0.05,
      ease: "easeOut" as const,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.15,
      delay: i * 0.05,
      ease: "easeIn" as const,
    },
  }),
}

export function FAB() {
  const [open, setOpen]           = useState(false)
  const [writeOpen, setWriteOpen] = useState(false)
  const [text, setText]           = useState("")
  const router  = useRouter()
  const fabRef  = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  // Close FAB on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [open])

  // Auto-focus textarea when write sheet opens
  useEffect(() => {
    if (writeOpen) {
      setTimeout(() => textRef.current?.focus(), 50)
    }
  }, [writeOpen])

  const handleNodeTap = (node: typeof NODES[0]) => {
    setOpen(false)
    if (node.action === "write") {
      setWriteOpen(true)
    } else if (node.route) {
      router.push(node.route)
    }
  }

  const handleSave = () => {
    // Prototype: just close — no real persistence needed
    setText("")
    setWriteOpen(false)
  }

  return (
    <>
      {/* ── Write bottom sheet ── */}
      <AnimatePresence>
        {writeOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setWriteOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-[#0a2d45] border-t border-white/10 px-5 pt-5 pb-8"
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-semibold text-white text-base">
                  Write a note
                </span>
                <button
                  onClick={() => setWriteOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={textRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                rows={6}
                className="w-full bg-white/[0.06] border border-white/15 rounded-2xl px-4 py-3.5 text-white font-body text-base placeholder:text-white/30 focus:outline-none focus:border-white/35 resize-none transition-colors"
              />

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={text.trim().length === 0}
                className={`mt-4 w-full py-4 rounded-full font-heading font-semibold text-base transition-all duration-200 ${
                  text.trim().length > 0
                    ? "bg-[#FF591F] text-white shadow-[0_4px_20px_rgba(255,89,31,0.35)] active:scale-[0.98]"
                    : "bg-white/10 text-white/35 cursor-not-allowed"
                }`}
              >
                Save note
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Speed dial FAB ── */}
      <div
        ref={fabRef}
        className="fixed bottom-20 right-5 z-50 flex flex-col items-end gap-3"
      >
        {/* Mini FABs */}
        <AnimatePresence>
          {open &&
            [...NODES].reverse().map((node, i) => (
              <motion.div
                key={node.id}
                custom={i}
                variants={nodeVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="flex items-center gap-3"
              >
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-heading font-medium text-white text-sm whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
                <button
                  onClick={() => handleNodeTap(node)}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-95 transition-transform"
                >
                  <node.Icon size={18} className="text-[#052135]" strokeWidth={2} />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.93 }}
          className="w-16 h-16 rounded-full bg-[#FFB900] flex items-center justify-center shadow-[0_0_32px_rgba(255,185,0,0.45)]"
          aria-label={open ? "Close menu" : "Add notes"}
        >
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Plus size={28} strokeWidth={2.5} className="text-[#052135]" />
          </motion.div>
        </motion.button>
      </div>
    </>
  )
}
