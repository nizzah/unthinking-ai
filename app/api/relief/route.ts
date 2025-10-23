import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sparkId, selectedStep, selectedDuration, feeling, reflection, mindDump, timestamp } = body

    console.log("[Relief] Relief submitted:", { 
      sparkId, 
      selectedStep, 
      feeling, 
      hasReflection: !!reflection,
      hasMindDump: !!mindDump,
      timestamp 
    })

    // TODO: Store in Vectorize for future spark generation
    // For now, we'll implement a simple storage approach
    // In production, you'd want to:
    // 1. Store the full session data (mind dump + spark + step + reflection + feeling)
    // 2. Use Vectorize to embed and index the reflections
    // 3. Track streak and felt-lighter metrics in a database

    // Example of what storage would look like:
    /*
    const vectorize = new VectorizeService()
    const sessionSummary = `
Session on ${timestamp}:
Mind dump: ${mindDump || "N/A"}
Action taken: ${selectedStep} (${selectedDuration} min)
Reflection: ${reflection || "No reflection"}
Felt lighter: ${feeling}/100
    `.trim()

    // Store in Vectorize for future retrieval
    await vectorize.storeDocument({
      text: sessionSummary,
      metadata: {
        type: "session",
        timestamp,
        feeling,
        selectedStep,
      }
    })
    */

    // For now, just log for debugging
    if (reflection || mindDump) {
      console.log("[Relief] Content to be stored for future sparks:")
      if (mindDump) console.log("  Mind dump:", mindDump.substring(0, 100) + "...")
      if (reflection) console.log("  Reflection:", reflection.substring(0, 100) + "...")
    }

    return NextResponse.json({ 
      success: true,
      message: "Relief data received. In production, this would be stored for personalized sparks."
    })
  } catch (error) {
    console.error("[Relief] Error submitting relief:", error)
    return NextResponse.json({ error: "Failed to submit relief" }, { status: 500 })
  }
}
