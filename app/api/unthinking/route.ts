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

    const data: Compass = {
      spark: "Name a tiny 5 minute move that reduces the friction.",
      step: "Start a 5 minute timer and draft the first sentence or outline.",
      rationale: "Small wins lower anxiety and create momentum.",
      feltLighterPrompt: "On a scale of 1-5, how much lighter do you feel after this step?"
    };

    return NextResponse.json(data satisfies Compass);
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
