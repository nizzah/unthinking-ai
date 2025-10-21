type McpToolCall = (tool: string, args: any) => Promise<any>;
import { NOTION_DB, NOTION_PROPS } from "./notion-config";

async function notionTitleSearch(call: McpToolCall, query: string, limit = 5) {
  const body = { query, page_size: limit, sort: { direction: "descending", timestamp: "last_edited_time" } };
  const res = await call("API-post-search", { body }).catch(()=>null);
  return (res?.results ?? []).filter((r:any)=>r.object==="page").slice(0, limit);
}

async function notionPagePlainText(call: McpToolCall, pageId: string, cap = 2000) {
  const res = await call("API-get-block-children", { path: { block_id: pageId } }).catch(()=>null);
  const blocks = res?.results ?? [];
  const text = blocks.map((b:any)=>{
    const rt = b[b.type]?.rich_text ?? [];
    return rt.map((t:any)=>t.plain_text).join("");
  }).join("\n");
  return (text || "").slice(0, cap);
}

export async function fetchNotionSmart(call: McpToolCall, q: string, cats: string[], topK=5) {
  const out: any[] = [];
  const wantLearn = cats.includes("learnings");
  const wantDaily = cats.includes("daily") || cats.includes("fears") || cats.includes("journals");
  const wantWeekly = cats.includes("weekly") || cats.includes("goals");

  const plans: Promise<void>[] = [];

  const pullDb = (dbId: string, category: string) => plans.push((async ()=>{
    const res = await call("API-post-databases-query", {
      path: { database_id: dbId },
      body: { page_size: topK, sorts: [{ timestamp: "last_edited_time", direction: "descending" }] }
    }).catch(()=>null);
    for (const r of res?.results ?? []) {
      const title = (r.properties?.[NOTION_PROPS.title]?.title ?? []).map((t:any)=>t.plain_text).join("") || "Untitled";
      const text = await notionPagePlainText(call, r.id, 2000);
      if (text.trim()) out.push({ id:r.id, title, url:r.url, text, score:0, metadata:{ source:"notion", category }});
      if (out.length >= topK) break;
    }
  })());

  if (wantLearn && NOTION_DB.readings) pullDb(NOTION_DB.readings, "learnings");
  if (wantDaily && NOTION_DB.daily)     pullDb(NOTION_DB.daily,    "daily");
  if (wantWeekly && NOTION_DB.weekly)   pullDb(NOTION_DB.weekly,   "weekly");

  await Promise.all(plans);

  if (out.length === 0) {
    const pages = await notionTitleSearch(call, q, topK).catch(()=>[]);
    for (const p of pages) {
      const title = (p.properties?.[NOTION_PROPS.title]?.title ?? p.properties?.title ?? [])
        .map((t:any)=>t.plain_text).join("") || p?.title || "Untitled";
      const text = await notionPagePlainText(call, p.id, 2000);
      if (text.trim()) out.push({ id:p.id, title, url:p.url, text, score:0, metadata:{ source:"notion", match:"title" }});
      if (out.length >= topK) break;
    }
  }

  return out.slice(0, topK);
}
