"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface MindDumpScreenProps {
  onComplete: (text: string, emotions: string[]) => void
}

export function MindDumpScreen({ onComplete }: MindDumpScreenProps) {
  const [text, setText] = useState("")
  const [timeLeft, setTimeLeft] = useState<number>(2 * 60) // Start with 2 minutes (120 seconds)
  const [selectedDuration, setSelectedDuration] = useState<number>(2) // Default to 2 minutes
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [isTimerActive, setIsTimerActive] = useState(true) // Start timer immediately
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const durations = [1, 2, 5, 10, 15] // minutes
  const emotions = ["stuck", "overwhelmed", "anxious", "excited", "tired", "grateful", "confused", "motivated"]

  // Update timer when duration changes
  useEffect(() => {
    setTimeLeft(selectedDuration * 60)
  }, [selectedDuration])

  // Countdown timer
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1
        }
        return 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerActive, timeLeft])

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  const addMinute = () => {
    setTimeLeft(timeLeft + 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleFindSpark = () => {
    onComplete(text, selectedEmotions)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 animate-in fade-in duration-700 relative z-10">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-light text-white">Write freely. Don't think. Don't stop.</h1>
          
          {/* Duration Selection */}
          <div className="flex gap-2 justify-center flex-wrap">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDuration === duration
                    ? "bg-coral-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>

          {/* Timer Display and Extension */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl font-mono tabular-nums text-white font-bold">
              {formatTime(timeLeft)}
            </span>
            <button
              onClick={addMinute}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              +1m
            </button>
          </div>
        </div>

        {/* Textarea and Feeling Selection */}
        <div className="space-y-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            aria-label="Mind dump - write freely about what's on your mind"
            className="w-full min-h-[300px] bg-white border border-gray-300 rounded-lg p-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-600/50 resize-none text-lg leading-relaxed"
          />
          
          {/* Feeling Selection */}
          <div className="text-center space-y-4">
          <p className="text-lg text-white">Or pick how you feel</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedEmotions.includes(emotion)
                    ? "bg-coral-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* Find My Spark Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleFindSpark}
            disabled={text.trim().length === 0}
            className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-6 text-lg rounded-full disabled:opacity-50 font-medium"
          >
            Find my spark
          </Button>
        </div>
      </div>
    </div>
  )
}
