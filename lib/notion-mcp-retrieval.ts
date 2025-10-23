type McpToolCall = (tool: string, args: any) => Promise<any>;
import { NOTION_DB, NOTION_PROPS } from "./notion-config";

async function notionTitleSearch(call: McpToolCall, query: string, limit = 5) {
  const res = await call("API-post-search", { query, page_size: limit }).catch(()=>null);
  
  // Parse MCP response format
  let results = [];
  if (res?.content?.[0]?.text) {
    try {
      const parsed = JSON.parse(res.content[0].text);
      results = parsed.results || [];
    } catch (e) {
      console.error("Failed to parse Notion search response:", e);
    }
  }
  
  return results.filter((r:any)=>r.object==="page").slice(0, limit);
}

async function notionPagePlainText(call: McpToolCall, pageId: string, cap = 2000) {
  const res = await call("API-get-block-children", { block_id: pageId }).catch(()=>null);
  
  // Parse MCP response format
  let blocks = [];
  if (res?.content?.[0]?.text) {
    try {
      const parsed = JSON.parse(res.content[0].text);
      blocks = parsed.results || [];
    } catch (e) {
      console.error("Failed to parse Notion blocks response:", e);
    }
  }
  
  const text = Array.isArray(blocks) ? blocks.map((b:any)=>{
    const rt = b[b.type]?.rich_text || [];
    return Array.isArray(rt) ? rt.map((t:any)=>t.plain_text).join("") : "";
  }).join("\n") : "";
  return (text || "").slice(0, cap);
}

export async function fetchNotionSmart(call: McpToolCall, q: string, cats: string[], topK=5) {
  const out: any[] = [];
  const wantLearn = cats.includes("learnings");
  const wantDaily = cats.includes("daily") || cats.includes("fears") || cats.includes("journals");
  const wantWeekly = cats.includes("weekly") || cats.includes("goals");

  const pullDb = async (dbId: string, category: string) => {
    try {
      const res = await call("API-post-database-query", {
        database_id: dbId,
        page_size: topK
      });
      
      // Parse MCP response format
      let results = [];
      if (res?.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(res.content[0].text);
          results = parsed.results || [];
        } catch (e) {
          console.error("Failed to parse Notion response:", e);
        }
      }
      
      for (const r of results) {
        const title = r.properties?.Name?.title?.[0]?.plain_text || "Untitled";
        const url = r.url;
        
        // Get page content
        let text = "";
        try {
          const blocksRes = await call("API-get-block-children", { block_id: r.id });
          if (blocksRes?.content?.[0]?.text) {
            const blocksParsed = JSON.parse(blocksRes.content[0].text);
            const blocks = blocksParsed.results || [];
            text = blocks.map((b:any) => {
              const rt = b[b.type]?.rich_text || [];
              return rt.map((t:any) => t.plain_text).join("");
            }).join("\n").slice(0, 2000);
          }
        } catch (e) {
          console.error("Block error:", e);
        }
        
        if (text.trim()) {
          out.push({
            id: r.id,
            title,
            url,
            text,
            score: 0,
            metadata: { source: "notion", category }
          });
        }
        
        if (out.length >= topK) break;
      }
    } catch (error) {
      console.error(`Error querying ${category} database:`, error);
    }
  };

  const plans: Promise<void>[] = [];
  
  if (wantLearn && NOTION_DB.readings) plans.push(pullDb(NOTION_DB.readings, "learnings"));
  if (wantDaily && NOTION_DB.daily) plans.push(pullDb(NOTION_DB.daily, "daily"));
  if (wantWeekly && NOTION_DB.weekly) plans.push(pullDb(NOTION_DB.weekly, "weekly"));

  await Promise.all(plans);

  return out.slice(0, topK);
}
