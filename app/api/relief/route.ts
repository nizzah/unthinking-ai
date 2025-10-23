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

    // Create session summary for future reference
    const sessionSummary = `
Session completed on ${timestamp}:

Mind dump: ${mindDump || "No mind dump provided"}

Action taken: ${selectedStep} (${selectedDuration} minutes)
- Selected step: ${selectedStep}
- Duration: ${selectedDuration} minutes

Reflection: ${reflection || "No reflection provided"}

Emotional outcome: Felt ${feeling}/100 lighter after completing the action

Key insights: This session shows the user took action on ${selectedStep} and felt ${feeling}% lighter. ${reflection ? `Their reflection: "${reflection}"` : ""}
    `.trim()

    // For now, we'll store session data in a simple format
    // In production, you'd want to:
    // 1. Store in a proper database (PostgreSQL, MongoDB, etc.)
    // 2. Use Vectorize or similar for semantic search of past sessions
    // 3. Implement proper user authentication and data isolation
    
    const sessionData = {
      id: `session_${Date.now()}`,
      timestamp,
      sparkId: sparkId || "unknown",
      mindDump: mindDump || "",
      selectedStep,
      selectedDuration,
      reflection: reflection || "",
      feeling,
      summary: sessionSummary,
    }

    // Log the session data (in production, this would go to a database)
    console.log("[Relief] Session data to be stored:", {
      id: sessionData.id,
      timestamp: sessionData.timestamp,
      feeling: sessionData.feeling,
      selectedStep: sessionData.selectedStep,
      hasReflection: !!sessionData.reflection,
      hasMindDump: !!sessionData.mindDump,
    })

    // Calculate streak data
    const streakData = {
      lastSession: timestamp,
      feeling,
      selectedStep,
      hasReflection: !!reflection,
      sessionId: sessionData.id,
    }

    console.log("[Relief] Streak data:", streakData)

    return NextResponse.json({ 
      success: true,
      message: "Session data processed successfully",
      streakData,
      sessionId: sessionData.id,
    })
  } catch (error) {
    console.error("[Relief] Error submitting relief:", error)
    return NextResponse.json({ error: "Failed to submit relief" }, { status: 500 })
  }
}
