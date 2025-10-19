import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasVectorizeToken: !!process.env.VECTORIZE_ACCESS_TOKEN,
    hasVectorizeOrg: !!process.env.VECTORIZE_ORG_ID,
    hasVectorizePipeline: !!process.env.VECTORIZE_PIPELINE_ID,
    timestamp: new Date().toISOString()
  });
}
