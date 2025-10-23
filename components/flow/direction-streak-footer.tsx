"use client"

import { useState, useEffect } from "react"
import { Compass } from "lucide-react"

interface StreakData {
  currentStreak: number
  lastSession: string | null
  sessions: Array<{
    date: string
    feeling: number
    selectedStep: string
  }>
}

export function DirectionStreakFooter() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastSession: null,
    sessions: []
  })

  // Load streak data from localStorage on mount
  useEffect(() => {
    const loadStreakData = () => {
      try {
        const stored = localStorage.getItem('unthinking-streak')
        if (stored) {
          const data = JSON.parse(stored)
          setStreakData(data)
        }
      } catch (error) {
        console.error('Error loading streak data:', error)
      }
    }

    loadStreakData()

    // Listen for streak updates from other components
    const handleStreakUpdate = (event: CustomEvent) => {
      const newStreakData = event.detail
      setStreakData(newStreakData)
      localStorage.setItem('unthinking-streak', JSON.stringify(newStreakData))
    }

    window.addEventListener('streak-update', handleStreakUpdate as EventListener)
    
    return () => {
      window.removeEventListener('streak-update', handleStreakUpdate as EventListener)
    }
  }, [])

  const calculateStreak = (sessions: StreakData['sessions']): number => {
    if (sessions.length === 0) return 0
    
    // Sort sessions by date (most recent first)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date)
      sessionDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // If this is the first session and it's today or yesterday, start the streak
      if (i === 0 && daysDiff <= 1) {
        streak = 1
        continue
      }
      
      // If this session is consecutive with the previous one, increment streak
      if (i > 0) {
        const prevSessionDate = new Date(sortedSessions[i - 1].date)
        prevSessionDate.setHours(0, 0, 0, 0)
        const daysBetween = Math.floor((prevSessionDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysBetween === 1) {
          streak++
        } else {
          break
        }
      }
    }
    
    return streak
  }

  const currentStreak = calculateStreak(streakData.sessions)

  return (
    <>
      {/* Footer indicator */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
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
              You've honored your direction {currentStreak} {currentStreak === 1 ? 'day' : 'days'} in a row
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
                <span className="text-2xl text-coral-400 font-light">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-stone-400">Recent sessions</p>
                <div className="flex gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg ${i < currentStreak ? "bg-coral-600" : "bg-ocean-700"}`} />
                  ))}
                </div>
                {streakData.sessions.length > 0 && (
                  <div className="text-xs text-stone-500 mt-2">
                    Last session: {new Date(streakData.sessions[0]?.date).toLocaleDateString()}
                  </div>
                )}
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
