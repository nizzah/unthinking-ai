import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { VectorizeService } from "@/lib/retrieval/vectorize";

export async function GET() {
  try {
    console.log("Testing full unthinking flow...");
    
    // Get context from Vectorize
    const vectorizeService = new VectorizeService();
    const documents = await vectorizeService.retrieveDocuments("weekly goals", 3);
    const retrievedText = vectorizeService.formatDocumentsForContext(documents);
    
    console.log("Retrieved text length:", retrievedText.length);
    
    const requireContext = Boolean(retrievedText && retrievedText.trim().length > 50);
    console.log("Require context:", requireContext);
    
    const messages = [
      { role: "system" as const, content: "Return strict JSON with keys spark, step, rationale, feltLighterPrompt. Steps are 2–5 minutes." },
      ...(requireContext ? [
        { role: "system" as const, content: "Use ONLY the retrieved context below. If it is insufficient, say so briefly, then still return JSON." },
        { role: "system" as const, content: `RETRIEVED_CONTEXT:\n${retrievedText.slice(0, 2000)}` as any }
      ] : []),
      { role: "user" as const, content: "I feel stuck on my weekly goals" }
    ];
    
    console.log("Messages count:", messages.length);
    console.log("Message previews:", messages.map(m => ({ role: m.role, contentLength: m.content.length })));
    
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
    });

    console.log("Raw OpenAI response:", result.text);
    
    // Try to parse as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(result.text);
      console.log("Successfully parsed JSON:", parsedResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw text that failed to parse:", result.text);
    }
    
    return NextResponse.json({ 
      success: true,
      rawResponse: result.text,
      parsedResponse: parsedResponse,
      messageCount: messages.length
    });
  } catch (error) {
    console.error("Full flow test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
