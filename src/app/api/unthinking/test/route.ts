import { NextResponse } from "next/server";
import { pickCats } from "@/lib/routing";
import { fetchVectorizeSmart } from "@/lib/retrieval";
import { fetchNotionSmart } from "@/lib/notion-mcp-retrieval";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  const q = "weekly goals from readings about courage";
  const { cats } = pickCats(q);
  const [v, n] = await Promise.all([
    fetchVectorizeSmart(q, 6).catch(()=>[]),
    fetchNotionSmart(callNotionMcp, q, cats, 5).catch(()=>[]),
  ]);
  return NextResponse.json({ q, cats, vCount: v.length, nCount: n.length, titles: [...v,...n].map(x=>x.title).slice(0,6) });
}
