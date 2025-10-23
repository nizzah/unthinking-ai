"use client"

import { Button } from "@/components/ui/button"

interface SparkPhaseProps {
  insight: string
  context: string
  onContinue: () => void
  onSkip: () => void
}

export function SparkPhase({ insight, context, onContinue, onSkip }: SparkPhaseProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Spark insight */}
        <div className="space-y-6 text-center">
          <p className="text-2xl md:text-3xl text-foreground leading-relaxed font-light">{insight}</p>
        </div>

        {/* Context - why you're seeing this */}
        <div className="space-y-3 text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Why you're seeing this</p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">{context}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-lg rounded-full"
          >
            Continue
          </Button>
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Show me something else
          </button>
        </div>
      </div>
    </div>
  )
}
