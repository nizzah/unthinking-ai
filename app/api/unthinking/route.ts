import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { SYSTEM } from "@/lib/prompt";
import { pickCats } from "@/lib/routing";
import { fetchVectorizeSmart } from "@/lib/retrieval";
import { fetchNotionSmart } from "@/lib/notion-mcp-retrieval";
import { rerank } from "@/lib/rerank";
import { callNotionMcp } from "@/lib/mcp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userText = body.q || body.userText;
    
    if (!userText || typeof userText !== "string" || !userText.trim()) {
      return new Response(
        JSON.stringify({ error: "Please describe what feels stuck." }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("🚀 Spark agent processing query:", userText);

    // Use the same retrieval logic as the original
    const { cats } = pickCats(userText);

    const [v, n] = await Promise.allSettled([
      Promise.race([
        fetchVectorizeSmart(userText, 6),
        new Promise((_, reject) => setTimeout(() => reject(new Error("RAG timeout")), 6000))
      ]).catch(() => []),
      Promise.race([
        fetchNotionSmart(callNotionMcp, userText, cats, 5),
        new Promise((_, reject) => setTimeout(() => reject(new Error("MCP timeout")), 6000))
      ]).catch(() => [])
    ]);

    const vres = v.status === "fulfilled" ? v.value : [];
    const nres = n.status === "fulfilled" ? n.value : [];
    const merged = rerank([...vres, ...nres], cats);

    if (!merged.length) {
      return new Response(
        JSON.stringify({ error: "NO_CONTEXT", message: "No usable context." }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const ctx = merged.map((c: any, i: number) => 
      `[[DOC ${i + 1}]]\nTitle: ${c.title}\nURL: ${c.url || ""}\n---\n${c.text}`
    ).join("\n\n");
    
    const userMsg = `USER QUERY:\n${userText}\n\nCONTEXT:\n${ctx}`;

    // Use AI SDK for the final generation
    const result = await streamText({
      model: openai(process.env.MODEL_NAME || "gpt-4o-mini"),
      system: SYSTEM,
      messages: [{ role: "user", content: userMsg }],
      temperature: 0,
      maxTokens: 350,
      providerOptions: {
        openai: {
          response_format: { type: "json_object" },
        },
      },
    });

    const text = await result.text;
    
    try {
      const parsedResponse = JSON.parse(text);
      
      if (parsedResponse.error === "NO_CONTEXT") {
        return new Response(
          JSON.stringify({ error: "NO_CONTEXT", message: "Model refused due to empty context." }), 
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      // Add sources
      parsedResponse.sources = merged.slice(0, 3).map((s: any) => ({
        title: s.title,
        url: s.url || null
      }));

      return new Response(
        JSON.stringify(parsedResponse), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to generate compass response." }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("💥 Spark agent API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate compass response." }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}