import { NextResponse } from "next/server"

export async function GET() {
  try {
    // TODO: Connect to Vect vector database to fetch personalized spark
    // For now, return mock data

    const mockSpark = {
      insight:
        "You've been collecting ideas but not acting on them. What if the next small step matters more than the perfect plan?",
      context: "You've saved 12 notes about creative projects in the past month, but haven't started any of them.",
      source: "Your notes from the past 30 days",
    }

    const mockSteps = {
      primary: "Open one of your saved project notes and write just the first sentence of what you'd create.",
      smaller: "Pick your favorite saved idea and read it out loud to yourself.",
    }

    return NextResponse.json({
      spark: mockSpark,
      steps: mockSteps,
    })
  } catch (error) {
    console.error("[v0] Error fetching spark:", error)
    return NextResponse.json({ error: "Failed to fetch spark" }, { status: 500 })
  }
}
