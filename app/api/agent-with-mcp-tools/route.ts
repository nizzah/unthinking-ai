import { WEB_SCRAPER_SYSTEM_INSTRUCTIONS } from "@/components/agent/web-scraper-prompt";
import { getFirecrawlMCPClient } from "@/lib/mcp";
import { openai } from "@ai-sdk/openai";
import { streamText, stepCountIs } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    // Initialize Firecrawl MCP client
    console.log("🚀 Initializing Firecrawl MCP client...");
    const firecrawlClient = getFirecrawlMCPClient();
    await firecrawlClient.connect();

    // Retrieve Firecrawl tools
    const tools = await firecrawlClient.getTools();

    console.log(
      `🔧 Agent has access to ${Object.keys(tools).length} Firecrawl MCP tools`
    );

    // Wrap tools to log when they are called
    const wrappedTools = Object.fromEntries(
      Object.entries(tools).map(([toolName, toolDef]) => [
        toolName,
        {
          ...toolDef,
          execute: async (args: any) => {
            console.log(`\n🔧 Tool called: ${toolName}`);
            console.log(`   Input:`, JSON.stringify(args, null, 2));
            const result = await toolDef.execute(args);
            console.log(`   Output:`, JSON.stringify(result, null, 2));
            return result;
          },
        },
      ])
    );

    const result = streamText({
      model: openai(process.env.MODEL_NAME || "gpt-4o-mini"),
      system: WEB_SCRAPER_SYSTEM_INSTRUCTIONS,
      messages: messages,
      tools: wrappedTools,
      stopWhen: stepCountIs(10),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("💥 Agent API error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
