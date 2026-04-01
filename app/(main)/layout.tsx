import type React from "react"
import { Search, User } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { FAB } from "@/components/fab"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ── Top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#052135] border-b border-white/10 flex items-center px-4">
        {/* Left: reserved */}
        <div className="flex-1" />

        {/* Centre: wordmark */}
        <span className="font-heading font-bold text-white text-[18px] tracking-tight">
          Spark
        </span>

        {/* Right: search + profile */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <button aria-label="Search" className="text-white/70 hover:text-white transition-colors">
            <Search size={22} />
          </button>
          <button
            aria-label="Profile"
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white/80 transition-colors"
          >
            <User size={15} />
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      {children}

      {/* ── Bottom nav ── */}
      <BottomNav />

      {/* ── FAB ── */}
      <FAB />
    </>
  )
}
