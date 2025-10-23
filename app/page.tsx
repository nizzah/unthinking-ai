"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [pulseScale, setPulseScale] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.05 : 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-ocean-deep via-ocean-800 to-ocean-600 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-radial from-coral-600/10 via-transparent to-transparent transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `scale(${pulseScale})` }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32 md:py-48 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white">Trust yourself again</h1>
            <p className="text-xl md:text-2xl text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
              One spark of clarity, one small step of courage, one moment of meaning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/flow">
              <Button
                size="lg"
                className="bg-coral-600 hover:bg-coral-700 text-ocean-deep px-12 py-7 text-lg rounded-full shadow-lg shadow-coral-600/20 font-medium"
              >
                Surprise me
              </Button>
            </Link>
            <Link href="/flow?start=dump">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:text-white/90 hover:bg-white/10 px-12 py-7 text-lg rounded-full"
              >
                Begin mind-dump
              </Button>
            </Link>
          </div>

          <p className="text-sm text-stone-300 pt-8">All reflections stay on your device. You control your data.</p>
        </div>
      </section>

      {/* Design System Showcase */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-light text-white">Design System</h2>
            <p className="text-stone-200">Calm, minimal, and human</p>
          </div>

          {/* Color Palette */}
          <Card className="p-8 space-y-6">
            <h3 className="text-2xl font-light text-white">Colors</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-200 mb-3">Primary - Deep Blue</p>
                <div className="flex gap-2 flex-wrap">
                  <div className="w-20 h-20 rounded-lg bg-ocean-deep flex items-end p-2">
                    <span className="text-xs text-white font-mono">Deep</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-ocean-800 flex items-end p-2">
                    <span className="text-xs text-white font-mono">800</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-ocean-600 flex items-end p-2">
                    <span className="text-xs text-white font-mono">600</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-ocean-400 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">400</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-ocean-200 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">200</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-ocean-50 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">50</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-stone-200 mb-3">Accent - Warm Coral</p>
                <div className="flex gap-2 flex-wrap">
                  <div className="w-20 h-20 rounded-lg bg-coral-900 flex items-end p-2">
                    <span className="text-xs text-white font-mono">900</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-coral-700 flex items-end p-2">
                    <span className="text-xs text-white font-mono">700</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-coral-600 flex items-end p-2">
                    <span className="text-xs text-white font-mono">600</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-coral-400 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">400</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-coral-200 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">200</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-coral-50 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">50</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-stone-200 mb-3">Neutrals - Stone</p>
                <div className="flex gap-2 flex-wrap">
                  <div className="w-20 h-20 rounded-lg bg-stone-900 flex items-end p-2">
                    <span className="text-xs text-white font-mono">900</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-stone-700 flex items-end p-2">
                    <span className="text-xs text-white font-mono">700</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-stone-500 flex items-end p-2">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-stone-300 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">300</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-stone-100 flex items-end p-2">
                    <span className="text-xs text-ocean-deep font-mono">100</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-stone-50 flex items-end p-2 border border-stone-200">
                    <span className="text-xs text-ocean-deep font-mono">50</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="p-8 space-y-6">
            <h3 className="text-2xl font-light text-white">Typography</h3>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-stone-200 mb-2">Heading 1</p>
                <h1 className="text-5xl font-light text-white">The quick brown fox</h1>
              </div>
              <div>
                <p className="text-sm text-stone-200 mb-2">Heading 2</p>
                <h2 className="text-4xl font-light text-white">The quick brown fox</h2>
              </div>
              <div>
                <p className="text-sm text-stone-200 mb-2">Heading 3</p>
                <h3 className="text-3xl font-light text-white">The quick brown fox</h3>
              </div>
              <div>
                <p className="text-sm text-stone-200 mb-2">Body Text</p>
                <p className="text-base text-white">
                  For people who've succeeded at playing the game—and are ready to start creating their own. This is a
                  calm, supportive space that helps you reconnect with your intuition and take small, meaningful steps
                  forward.
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-200 mb-2">Small Text</p>
                <p className="text-sm text-stone-200">Trust yourself again. One spark at a time.</p>
              </div>
            </div>
          </Card>

          {/* Buttons */}
          <Card className="p-8 space-y-6">
            <h3 className="text-2xl font-light text-white">Buttons</h3>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-coral-600 hover:bg-coral-700 text-ocean-deep px-8 py-6 text-lg rounded-full font-medium">
                Primary Action
              </Button>
              <Button
                variant="secondary"
                className="text-white hover:text-white/90 bg-stone-500 hover:bg-stone-600 px-8 py-6 text-lg rounded-full"
              >
                Secondary
              </Button>
              <Button
                variant="outline"
                className="text-white hover:text-white/90 border border-white px-8 py-6 text-lg rounded-full bg-transparent"
              >
                Outline
              </Button>
              <Button variant="ghost" className="text-white hover:text-white/90 px-8 py-6 text-lg rounded-full">
                Ghost
              </Button>
              <Button className="bg-coral-600 hover:bg-coral-700 text-ocean-deep px-8 py-6 text-lg rounded-full font-medium">
                Rounded
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <p className="text-sm text-stone-200">Unthinking — A Meaning-Tech product</p>
      </footer>
    </main>
  )
}
