import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mindDump, sparkInsight, selectedStep, selectedDuration } = await request.json()

    console.log("Celebrate API called with:", { mindDump, sparkInsight, selectedStep, selectedDuration })

    if (!mindDump || !sparkInsight) {
      console.log("Missing required data, using fallback")
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const prompt = `You are a celebration expert! Generate 3 wildly personalized, fun, and exciting celebration activities based on this user's unique journey:

**USER'S JOURNEY:**
Mind dump: "${mindDump}"
Spark insight: "${sparkInsight}"
Tiny action they took: "${selectedStep}" (${selectedDuration} minutes)

**REQUIREMENTS:**
- Make each celebration SPECIFICALLY about their journey, emotions, and insights
- Use their exact words, themes, and emotional state from their mind dump
- Reference their spark insight and tiny action in creative ways
- Make them feel like a personal party just for them
- Be playful, quirky, and unexpected - avoid generic advice
- Each should feel like a mini-adventure tailored to their story
- Use fun, energetic language that matches their vibe
- Include specific details from their session

**EXAMPLES OF PERSONALIZATION:**
- If they wrote about work stress → "Do a power pose and declare 'I'm unstoppable!' like the boss you are"
- If they mentioned creativity → "Sketch a tiny doodle of your spark insight on your hand"
- If they felt overwhelmed → "Do a silly dance that shakes off all that mental clutter"
- If they wrote about relationships → "Send yourself a love text with your own phone number"

**FORMAT:**
Return ONLY a JSON array:
[
  { "duration": 1, "activity": "🎉 [wildly personalized 1-minute celebration]" },
  { "duration": 2, "activity": "🌟 [quirky 2-minute celebration]" },
  { "duration": 5, "activity": "✨ [epic 5-minute celebration]" }
]

Make these celebrations feel like they were created specifically for this person's unique story!`

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("No Anthropic API key found, using fallback celebrations")
      const fallbackCelebrations = [
        { duration: 1, activity: "🎉 Do a victory dance like you just conquered the world" },
        { duration: 2, activity: "🌟 Strike a superhero pose and whisper 'I am unstoppable'" },
        { duration: 5, activity: "✨ Write a love letter to your future self" },
      ]
      return NextResponse.json({ celebrations: fallbackCelebrations })
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      console.log(`Anthropic API error: ${response.status}`)
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content[0].text

    console.log("AI Response:", content)

    // Parse the JSON response
    let celebrations
    try {
      celebrations = JSON.parse(content)
      console.log("Successfully parsed celebrations:", celebrations)
    } catch (parseError) {
      console.error("Failed to parse celebrations JSON:", content)
      // Fallback celebrations - more fun and personalized
      celebrations = [
        { duration: 1, activity: "🎉 Do a victory dance like you just conquered the world" },
        { duration: 2, activity: "🌟 Strike a superhero pose and whisper 'I am unstoppable'" },
        { duration: 5, activity: "✨ Write a love letter to your future self" },
      ]
    }

    return NextResponse.json({ celebrations })
  } catch (error) {
    console.error("Error generating celebrations:", error)
    
    // Fallback celebrations - more fun and personalized
    const fallbackCelebrations = [
      { duration: 1, activity: "🎉 Do a victory dance like you just conquered the world" },
      { duration: 2, activity: "🌟 Strike a superhero pose and whisper 'I am unstoppable'" },
      { duration: 5, activity: "✨ Write a love letter to your future self" },
    ]

    return NextResponse.json({ celebrations: fallbackCelebrations })
  }
}
