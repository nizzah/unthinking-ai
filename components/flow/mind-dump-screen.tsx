"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface MindDumpScreenProps {
  onComplete: (text: string) => void
}

export function MindDumpScreen({ onComplete }: MindDumpScreenProps) {
  const [text, setText] = useState("")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const emotions = ["Stuck", "Clear", "Inspired"]

  // Start timer on first keystroke
  useEffect(() => {
    if (text.length === 1 && timeLeft === null) {
      setTimeLeft(300) // 5 minutes
    }
  }, [text, timeLeft])

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative z-10">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-light text-white">Write freely. Don't think. Don't edit.</h1>
          {timeLeft !== null && <p className="text-lg text-stone-300 font-mono tabular-nums">{formatTime(timeLeft)}</p>}
        </div>

        {/* Textarea */}
        <div className="space-y-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            aria-label="Mind dump - write freely about what's on your mind"
            className="w-full min-h-[300px] bg-white border border-ocean-600 rounded-2xl p-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-600/50 resize-none text-lg leading-relaxed"
          />

          {/* Emotion tags */}
          <div className="flex gap-2 justify-center flex-wrap" role="group" aria-label="Select emotions you're feeling">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                aria-pressed={selectedEmotions.includes(emotion)}
                aria-label={`${emotion} emotion`}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedEmotions.includes(emotion)
                    ? "bg-coral-600 text-white"
                    : "bg-ocean-700/50 text-stone-300 hover:bg-ocean-700"
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={() => onComplete(text)}
            disabled={text.trim().length === 0}
            className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-6 text-lg rounded-full disabled:opacity-50 font-medium"
          >
            Done
          </Button>
          <button
            onClick={() => setText(text + "\n\n")}
            className="text-sm text-stone-400 hover:text-stone-300 transition-colors"
          >
            Add more
          </button>
        </div>
      </div>
    </div>
  )
}
