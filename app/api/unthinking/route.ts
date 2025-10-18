import { NextRequest, NextResponse } from "next/server";

type Compass = {
  spark: string;
  step: string;
  rationale: string;
  feltLighterPrompt: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userText = typeof body?.userText === "string" ? body.userText.trim() : "";
    if (!userText) {
      return NextResponse.json({ error: "Please describe what feels stuck." }, { status: 400 });
    }

    // Generate contextual response based on user input
    const lowerText = userText.toLowerCase();
    let data: Compass;
    
    if (lowerText.includes("overwhelm") || lowerText.includes("too much")) {
      data = {
        spark: "Break the mountain into small hills you can climb.",
        step: "Write down just 3 things you need to do today.",
        rationale: "Clarity reduces overwhelm and creates focus.",
        feltLighterPrompt: "How much clearer do you feel? (1-5)"
      };
    } else if (lowerText.includes("stuck") || lowerText.includes("block")) {
      data = {
        spark: "Movement creates momentum, even tiny steps.",
        step: "Set a 5-minute timer and take one small action.",
        rationale: "Micro-actions break through mental blocks.",
        feltLighterPrompt: "How much lighter do you feel? (1-5)"
      };
    } else if (lowerText.includes("procrastinat") || lowerText.includes("avoid")) {
      data = {
        spark: "Starting is often harder than continuing.",
        step: "Open the document or task for just 2 minutes.",
        rationale: "Starting removes the barrier of beginning.",
        feltLighterPrompt: "How much easier does it feel now? (1-5)"
      };
    } else if (lowerText.includes("anxious") || lowerText.includes("worry")) {
      data = {
        spark: "Anxiety is energy that needs direction.",
        step: "Take 3 deep breaths and name one thing you can control.",
        rationale: "Breathing grounds you in the present moment.",
        feltLighterPrompt: "How much calmer do you feel? (1-5)"
      };
    } else if (lowerText.includes("tired") || lowerText.includes("exhaust")) {
      data = {
        spark: "Rest is not laziness, it's restoration.",
        step: "Set a 10-minute timer and do nothing but rest.",
        rationale: "Micro-rests recharge your mental energy.",
        feltLighterPrompt: "How much more refreshed do you feel? (1-5)"
      };
    } else {
      data = {
        spark: "Small actions create momentum and reduce overwhelm.",
        step: "Set a 5-minute timer and take one tiny step forward.",
        rationale: "Micro-actions break through mental blocks.",
        feltLighterPrompt: "How much lighter do you feel after this step? (1-5)"
      };
    }

    return NextResponse.json(data satisfies Compass);
  } catch (error) {
    console.error("Unthinking API error:", error);
    return NextResponse.json({ error: "Failed to generate compass response." }, { status: 500 });
  }
}
