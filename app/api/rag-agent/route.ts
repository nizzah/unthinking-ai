import { RAG_SYSTEM_INSTRUCTIONS } from "@/components/agent/rag-prompt";
import { retrieveKnowledgeBaseSimple } from "@/components/agent/tools";
import { openai } from "@ai-sdk/openai";
import { streamText, stepCountIs } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    const result = streamText({
      model: openai(process.env.MODEL_NAME || "gpt-4o-mini"),
      system: RAG_SYSTEM_INSTRUCTIONS,
      messages: messages,
      stopWhen: stepCountIs(10), // this is the part that makes this an agent!!!!
      tools: {
        retrieveKnowledgeBase: retrieveKnowledgeBaseSimple,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
