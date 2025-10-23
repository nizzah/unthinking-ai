"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReliefPhaseProps {
  onComplete: (feeling: string, reflection?: string) => void
}

export function ReliefPhase({ onComplete }: ReliefPhaseProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [reflection, setReflection] = useState("")
  const [showReflection, setShowReflection] = useState(false)

  const feelings = [
    { value: "lighter", label: "Lighter", emoji: "✨" },
    { value: "same", label: "Same", emoji: "—" },
    { value: "heavier", label: "Heavier", emoji: "🌧️" },
  ]

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling)
    setTimeout(() => setShowReflection(true), 500)
  }

  const handleComplete = () => {
    if (selectedFeeling) {
      onComplete(selectedFeeling, reflection || undefined)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full space-y-12">
        {/* Feeling check */}
        {!showReflection && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-light text-primary">How do you feel?</h2>
              <p className="text-muted-foreground">No judgment, just noticing</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {feelings.map((feeling) => (
                <Card
                  key={feeling.value}
                  onClick={() => handleFeelingSelect(feeling.value)}
                  className={`p-6 text-center cursor-pointer transition-all hover:border-accent ${
                    selectedFeeling === feeling.value ? "border-accent bg-accent/5" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="text-4xl">{feeling.emoji}</div>
                    <p className="text-lg text-foreground">{feeling.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Optional reflection */}
        {showReflection && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-light text-primary">What did you notice?</h2>
              <p className="text-muted-foreground text-sm">Optional — only if you want to</p>
            </div>

            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Any thoughts, feelings, or insights..."
              className="w-full min-h-32 p-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={handleComplete}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-lg rounded-full"
              >
                Complete
              </Button>
              <p className="text-xs text-muted-foreground">You'll see your next spark in a moment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
