"use client"

import { useState } from "react"
import { Compass } from "lucide-react"

export function DirectionStreakFooter() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const streak = 3 // Mock data

  return (
    <>
      {/* Footer indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <button
            onClick={() => setShowModal(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="w-14 h-14 rounded-full bg-ocean-700 hover:bg-ocean-600 flex items-center justify-center shadow-lg transition-colors"
          >
            <Compass className="w-6 h-6 text-coral-400" />
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-ocean-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
              You've honored your direction {streak} days in a row
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-ocean-800 rounded-2xl p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <Compass className="w-8 h-8 text-coral-400" />
              <h2 className="text-2xl font-light text-white">Direction Map</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-ocean-700">
                <span className="text-stone-300">Current streak</span>
                <span className="text-2xl text-coral-400 font-light">{streak} days</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-stone-400">Recent sessions</p>
                <div className="flex gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg ${i < streak ? "bg-coral-600" : "bg-ocean-700"}`} />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-ocean-700 hover:bg-ocean-600 text-white rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
