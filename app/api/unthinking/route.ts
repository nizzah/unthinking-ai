import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

type Compass = {
  spark: string;
  step: string;
  rationale: string;
  feltLighterPrompt: string;
};

const UNTHINKING_SYSTEM_PROMPT = `You are the Unthinking Compass, an AI that helps people transform stuck moments into micro-actions.

Your job is to analyze a user's stuck feeling and generate:
1. A SPARK (≤25 words) - a personally relevant insight that reframes their situation
2. A STEP (≤10 min, verb-first) - one tiny, verifiable micro-action they can take
3. A RATIONALE (≤20 words) - why this step connects to the spark
4. A FELT_LIGHTER_PROMPT (≤20 words) - a check-in question for after they complete the step

Guidelines:
- Keep steps small and achievable (5-10 minutes max)
- Focus on reducing friction and creating momentum
- Be encouraging but not therapeutic
- Draw from principles of momentum and small wins
- Make responses feel personal and relevant

Return ONLY a JSON object with these exact keys: spark, step, rationale, feltLighterPrompt`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userText = typeof body?.userText === "string" ? body.userText.trim() : "";
    if (!userText) {
      return NextResponse.json({ error: "Please describe what feels stuck." }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
    }

    // Generate AI response
    let data: Compass;
    try {
      const result = await generateText({
        model: openai("gpt-5"),
        system: UNTHINKING_SYSTEM_PROMPT,
        prompt: `User's stuck feeling: "${userText}"

Generate a compass response that helps them move forward with a small, actionable step.`,
        providerOptions: {
          openai: {
            reasoning_effort: "low",
            textVerbosity: "low",
            // Remove reasoningSummary until organization is verified
            // reasoningSummary: "detailed",
          },
        },
      });

      // Parse the AI response as JSON
      try {
        data = JSON.parse(result.text) as Compass;
        console.log("OpenAI response:", result.text);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", result.text);
        throw new Error("AI response parsing failed");
      }
    } catch (error) {
      console.error("OpenAI generation error:", error);
      // Fallback to contextual response based on user input
      const lowerText = userText.toLowerCase();
      
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
    }

    return NextResponse.json(data satisfies Compass);
  } catch (error) {
    console.error("Unthinking API error:", error);
    return NextResponse.json({ error: "Failed to generate compass response." }, { status: 500 });
  }
}
