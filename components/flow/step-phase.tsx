"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface StepPhaseProps {
  primaryStep: string
  smallerStep: string
  onStepSelected: (step: "primary" | "smaller") => void
  onSkip: () => void
}

export function StepPhase({ primaryStep, smallerStep, onStepSelected, onSkip }: StepPhaseProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-light text-primary">Choose your step</h2>
          <p className="text-muted-foreground">Pick the one that feels right, right now</p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary step */}
          <Card className="p-8 space-y-6 hover:border-accent transition-colors cursor-pointer group">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <p className="text-sm text-muted-foreground uppercase tracking-wider">2-5 minutes</p>
              </div>
              <p className="text-lg text-foreground leading-relaxed">{primaryStep}</p>
            </div>
            <Button
              onClick={() => onStepSelected("primary")}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              I'll try this
            </Button>
          </Card>

          {/* Smaller step */}
          <Card className="p-8 space-y-6 hover:border-accent transition-colors cursor-pointer group opacity-90">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Smaller step</p>
              </div>
              <p className="text-lg text-foreground leading-relaxed">{smallerStep}</p>
            </div>
            <Button
              onClick={() => onStepSelected("smaller")}
              variant="outline"
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Start here instead
            </Button>
          </Card>
        </div>

        {/* Skip option */}
        <div className="text-center">
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Show me something else
          </button>
        </div>
      </div>
    </div>
  )
}
