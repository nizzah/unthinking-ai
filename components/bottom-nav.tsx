"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, BookOpen, Sparkles, ListChecks, MessageCircle } from "lucide-react"

const NAV_ITEMS = [
  { label: "Home",    Icon: Home,          href: "/upload"  },
  { label: "Library", Icon: BookOpen,      href: "/library" },
  { label: "Sparks",  Icon: Sparkles,      href: "/sparks"  },
  { label: "Steps",   Icon: ListChecks,    href: "/steps"   },
  { label: "Chat",    Icon: MessageCircle, href: "/chat"    },
]

export function BottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#052135] border-t border-white/10 flex items-stretch">
      {NAV_ITEMS.map(({ label, Icon, href }) => {
        const active = pathname === href

        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          >
            {/* Active indicator — coral bar at top */}
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#FF591F]" />
            )}

            <Icon
              size={20}
              strokeWidth={active ? 2 : 1.5}
              className={active ? "text-[#FF591F]" : "text-white/40"}
            />
            <span
              className={`font-heading font-medium text-[11px] ${
                active ? "text-[#FF591F]" : "text-white/40"
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
