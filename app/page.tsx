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
    <main className="h-screen starry-night relative overflow-hidden">
      {/* Painted Sun */}
      <div className="painted-sun" />
      
      {/* Painted Hills */}
      <div className="painted-hills" />

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
            <Link href="/flow?start=dump">
              <Button
                size="lg"
                className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-7 text-lg rounded-full shadow-lg shadow-coral-600/20 font-medium"
              >
                Begin mind-dump
              </Button>
            </Link>
            <Link href="/flow">
              <Button
                size="lg"
                className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-7 text-lg rounded-full shadow-lg shadow-coral-600/20 font-medium"
              >
                Surprise me
              </Button>
            </Link>
          </div>

          <p className="text-sm text-stone-300 pt-8">All reflections stay on your device. You control your data.</p>
        </div>
      </section>


      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <p className="text-sm text-stone-200">Unthinking — A Meaning-Tech product</p>
      </footer>
    </main>
  )
}
