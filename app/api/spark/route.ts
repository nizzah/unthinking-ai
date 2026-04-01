import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { SPARK_SYSTEM_INSTRUCTIONS } from "@/components/agent/spark-prompt"

// TESTING MODE: Notion/Vectorize imports disabled
// import { VectorizeService } from "@/lib/retrieval/vectorize"
// import { getNotionClient, getPageSnippet } from "@/lib/notion"
// import { NOTION_DB } from "@/lib/notion-config"

const TESTING_SYSTEM_PROMPT = `You are Spark — a reflective AI that reads a person's raw thought and surfaces one honest, specific insight they might not have seen themselves.

Your response is a single spark: 2–4 sentences maximum. It should feel like a trusted friend who sees clearly, not a therapist or a life coach.

Do not give advice. Do not ask questions. Do not use bullet points or headers. Just name the pattern, tension, or truth you notice in what they've written.

Be specific to what they wrote. Never be generic. Never use phrases like "it sounds like" or "it seems". Speak directly.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mindDump } = body

    console.log("[Spark] TESTING MODE — direct OpenAI call, no Notion/Vectorize")

    /* TESTING MODE: disabled
    // Get current time context for personalization
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    let timeContext = ""
    if (hour >= 5 && hour < 9) { timeContext = "early morning" }
    else if (hour >= 9 && hour < 12) { timeContext = "morning" }
    else if (hour >= 12 && hour < 14) { timeContext = "lunch time" }
    else if (hour >= 14 && hour < 17) { timeContext = "afternoon" }
    else if (hour >= 17 && hour < 20) { timeContext = "evening" }
    else { timeContext = "night" }

    let dayContext = ""
    if (isWeekend) { dayContext = "weekend" }
    else if (dayOfWeek === 1) { dayContext = "Monday" }
    else if (dayOfWeek === 5) { dayContext = "Friday" }
    else { dayContext = "weekday" }

    const vectorize = new VectorizeService()
    let vectorizeDocs = []
    let notionContent = ""

    try {
      vectorizeDocs = await vectorize.retrieveDocuments(
        "What patterns, themes, or insights have I been reflecting on recently? What am I stuck on?",
        3
      )
    } catch (error) {
      console.log("[Spark] Vectorize retrieval failed:", error)
    }

    // ... Notion retrieval and context-building code omitted for brevity
    // Re-enable by removing this comment block and restoring full route
    */

    // Direct generation — user input only
    const result = await generateText({
      model: openai(process.env.MODEL_NAME || "gpt-4o-mini"),
      system: TESTING_SYSTEM_PROMPT,
      prompt: mindDump || "",
      temperature: 0.8,
    })

    console.log("[Spark] Raw AI response:", result.text)

    return NextResponse.json({
      spark: {
        insight: result.text.trim(),
        context: "",
        source: "",
        date: "Today",
      },
      steps: {
        primary: "",
        smaller: "",
      },
    })
  } catch (error) {
    console.error("[Spark] Error generating spark:", error)

    return NextResponse.json({
      spark: {
        insight: "Sometimes the most courageous thing you can do is take one small step before you feel ready.",
        context: "You're here, which means you're ready for gentle motion.",
        source: "Unthinking wisdom",
        date: "Today",
      },
      steps: {
        primary: "Write down one thing you've been overthinking and what the tiniest next step could be.",
        smaller: "Close your eyes and take three deep breaths, noticing what feels light.",
      },
    })
  }
}

// Fallback GET method for backward compatibility
export async function GET() {
  try {
    console.log("[Spark] GET request - no mind dump provided, using time-aware fallback")

    /* TESTING MODE: disabled — full time-aware GET logic preserved below
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    let timeContext = ""
    if (hour >= 5 && hour < 9) { timeContext = "early morning" }
    else if (hour >= 9 && hour < 12) { timeContext = "morning" }
    else if (hour >= 12 && hour < 14) { timeContext = "lunch time" }
    else if (hour >= 14 && hour < 17) { timeContext = "afternoon" }
    else if (hour >= 17 && hour < 20) { timeContext = "evening" }
    else { timeContext = "night" }

    let dayContext = ""
    if (isWeekend) { dayContext = "weekend" }
    else if (dayOfWeek === 1) { dayContext = "Monday" }
    else if (dayOfWeek === 5) { dayContext = "Friday" }
    else { dayContext = "weekday" }

    // ... full time/day-aware insight logic (see git history)
    */

    return NextResponse.json({
      spark: {
        insight: "Sometimes the most courageous thing you can do is take one small step before you feel ready.",
        context: "You're here, which means you're ready for gentle motion.",
        source: "Unthinking wisdom",
        date: "Today",
      },
      steps: {
        primary: "Write down one thing you've been overthinking and what the tiniest next step could be.",
        smaller: "Close your eyes and take three deep breaths, noticing what feels light.",
      },
    })
  } catch (error) {
    console.error("[Spark] Error in GET method:", error)

    return NextResponse.json({
      spark: {
        insight: "Sometimes the most courageous thing you can do is take one small step before you feel ready.",
        context: "You're here, which means you're ready for gentle motion.",
        source: "Unthinking wisdom",
        date: "Today",
      },
      steps: {
        primary: "Write down one thing you've been overthinking and what the tiniest next step could be.",
        smaller: "Close your eyes and take three deep breaths, noticing what feels light.",
      },
    })
  }
}
