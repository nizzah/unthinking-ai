import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { pickCats } from "@/lib/routing";
import { fetchVectorizeSmart } from "@/lib/retrieval";
import { fetchNotionSmart } from "@/lib/notion-mcp-retrieval";
import { rerank } from "@/lib/rerank";
import { SYSTEM } from "@/lib/prompt";
import { callNotionMcp } from "@/lib/mcp";

type Compass = {
  spark: string;
  step: string;
  rationale: string;
  feltLighterPrompt: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const q = body.q || body.userText;
    if (!q || typeof q !== "string" || !q.trim()) {
      return NextResponse.json({ error: "Please describe what feels stuck." }, { status: 400 });
    }

    const { cats } = pickCats(q);

    const [v, n] = await Promise.allSettled([
      Promise.race([
        fetchVectorizeSmart(q, 6),
        new Promise((_, reject) => setTimeout(() => reject(new Error("RAG timeout")), 6000))
      ]).catch(() => []),
      Promise.race([
        fetchNotionSmart(callNotionMcp, q, cats, 5),
        new Promise((_, reject) => setTimeout(() => reject(new Error("MCP timeout")), 6000))
      ]).catch(() => [])
    ]);

    const vres = v.status === "fulfilled" ? v.value : [];
    const nres = n.status === "fulfilled" ? n.value : [];
    const merged = rerank([...vres, ...nres], cats);

    if (!merged.length) {
      return NextResponse.json({ error: "NO_CONTEXT", message: "No usable context." }, { status: 200 });
    }

    const ctx = merged.map((c:any,i:number)=>`[[DOC ${i+1}]]\nTitle: ${c.title}\nURL: ${c.url||""}\n---\n${c.text}`).join("\n\n");
    const userMsg = `USER QUERY:\n${q}\n\nCONTEXT:\n${ctx}`;

    console.log("🔍 Debug Info:", {
      query: q,
      categories: cats,
      vectorizeCount: vres.length,
      notionCount: nres.length,
      mergedCount: merged.length,
      contextLength: ctx.length,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let resp;
    try {
      resp = await Promise.race([
        client.chat.completions.create({
          model: process.env.MODEL_NAME || "gpt-4o-mini",
          temperature: 0,
          max_tokens: 350,
          response_format: { type: "json_object" },
          messages: [{ role:"system", content: SYSTEM }, { role:"user", content: userMsg }],
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("OpenAI timeout")), 10000))
      ]);
      console.log("✅ OpenAI response received");
    } catch (openaiError) {
      console.error("❌ OpenAI Error:", openaiError);
      throw openaiError;
    }

    let data:any = null;
    try { data = JSON.parse(resp.choices[0].message.content || "{}"); } catch {}
    if (!data || data.error === "NO_CONTEXT") {
      return NextResponse.json({ error: "NO_CONTEXT", message: "Model refused due to empty context." }, { status: 200 });
    }

    // add sources list
    data.sources = merged.slice(0,3).map((s:any)=>({ title: s.title, url: s.url || null }));
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unthinking API error:", error);
    return NextResponse.json({ error: "Failed to generate compass response." }, { status: 500 });
  }
}
