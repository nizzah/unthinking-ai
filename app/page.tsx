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
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="/spark-logo-dark.svg" 
                alt="Spark" 
                className="h-24 md:h-32"
                onError={(e) => console.log('Logo failed to load:', e)}
                onLoad={() => console.log('Logo loaded successfully')}
              />
            </div>
            <p className="text-xl md:text-2xl text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
              Turn your scattered notes into meaningful actions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-16">
            <Link href="/flow?start=dump" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-7 text-lg rounded-full shadow-lg shadow-coral-600/20 font-medium w-full sm:w-48"
              >
                Begin mind-dump
              </Button>
            </Link>
            <Link href="/flow" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-coral-600 hover:bg-coral-700 text-white px-12 py-7 text-lg rounded-full shadow-lg shadow-coral-600/20 font-medium w-full sm:w-48"
              >
                Find me a spark
              </Button>
            </Link>
          </div>

          <p className="text-sm text-stone-300 pt-8">All reflections stay on your device. You control your data.</p>
        </div>
      </section>


      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/spark-icon.svg" alt="Spark" className="h-6" />
          <p className="text-sm text-stone-200">Spark — A Meaning-Tech product</p>
        </div>
      </footer>
    </main>
  )
}
