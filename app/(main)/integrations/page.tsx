"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const INTEGRATIONS = [
  { id: "obsidian",     name: "Obsidian",       description: "Sync your vault markdown files",          emoji: "🟣" },
  { id: "notion",       name: "Notion",          description: "Import pages and databases",              emoji: "⬜" },
  { id: "roam",         name: "Roam Research",   description: "Pull in your daily notes and graph",      emoji: "🔵" },
  { id: "apple-notes",  name: "Apple Notes",     description: "Connect your iCloud notes library",       emoji: "🟡" },
  { id: "evernote",     name: "Evernote",        description: "Import notebooks and clippings",          emoji: "🟢" },
  { id: "google-drive", name: "Google Drive",    description: "Scan Docs and text files in your Drive",  emoji: "🔴" },
  { id: "bear",         name: "Bear",            description: "Import notes from your Bear library",     emoji: "🟤" },
  { id: "logseq",       name: "Logseq",          description: "Read your local graph and journal entries", emoji: "🔷" },
]

type Status = "idle" | "loading" | "connected"

export default function Integrations() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({})

  const handleConnect = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "loading" }))
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: "connected" }))
    }, 1500)
  }

  return (
    <main className="min-h-screen starry-night relative overflow-hidden">
      {/* Header — pt-14 clears the fixed top bar */}
      <div className="relative z-[3] pt-[72px] pb-6 px-6 text-center">
        <h1 className="font-heading font-bold text-white text-2xl mb-2">
          Connect your notes
        </h1>
        <p className="font-body text-white/70 text-base leading-relaxed">
          Spark reads your existing notes to find deeper patterns.
        </p>
      </div>

      {/* Integration list */}
      <div className="relative z-[3] px-4 pb-24 flex flex-col gap-3">
        {INTEGRATIONS.map((item) => {
          const status      = statuses[item.id] ?? "idle"
          const isConnected = status === "connected"
          const isLoading   = status === "loading"

          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 rounded-2xl px-4 py-4 border bg-white/5 transition-all duration-300 ${
                isConnected
                  ? "border-l-[3px] border-l-green-500 border-white/10"
                  : "border border-white/10"
              }`}
            >
              {/* Emoji logo */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {item.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-white text-sm leading-snug">
                  {item.name}
                </p>
                <p className="font-body text-white/55 text-xs leading-relaxed mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                <AnimatePresence mode="wait">
                  {isConnected ? (
                    <motion.div
                      key="connected"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-col items-end gap-1"
                    >
                      <span className="font-heading font-semibold text-[#47CF9C] text-xs">
                        Connected
                      </span>
                      <button
                        onClick={() => setStatuses((prev) => ({ ...prev, [item.id]: "idle" }))}
                        className="font-body text-white/35 text-[11px] underline underline-offset-2 hover:text-white/60 transition-colors"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="connect-btn"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => !isLoading && handleConnect(item.id)}
                      disabled={isLoading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading font-medium text-xs transition-colors ${
                        isLoading
                          ? "bg-white/15 text-white/40 cursor-not-allowed"
                          : "bg-[#FF591F] text-white active:scale-[0.96]"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={11} className="animate-spin" />
                          Connecting…
                        </>
                      ) : (
                        "Connect"
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
