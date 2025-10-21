import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN || process.env.NOTION_MCP_TOKEN || "";

export type NotionHit = { id: string; title: string; url?: string; snippet?: string };

export function getNotionClient() {
  if (!token) return null;
  return new Client({ auth: token });
}

export async function searchPages(query: string, limit = 3): Promise<NotionHit[]> {
  const client = getNotionClient();
  if (!client) return [];
  const res = await client.search({ query, page_size: limit });
  const hits: NotionHit[] = [];
  for (const r of res.results) {
    if (!("id" in r)) continue;
    const id = r.id;
    // title
    let title = "";
    if (r.object === "page" && "properties" in r && r.properties) {
      // try to find a title property
      const props: any = r.properties;
      const titleProp = Object.values(props).find((p: any) => p?.type === "title") as any;
      if (titleProp?.title?.length) title = titleProp.title.map((t: any) => t.plain_text).join("");
    }
    // url (works only if shared)
    const url = (r as any).url || undefined;
    hits.push({ id, title: title || "(untitled)", url });
  }
  return hits;
}

// Very lightweight page text extraction: pull first 500-800 chars of rich_text from top blocks
export async function getPageSnippet(pageId: string, maxChars = 800): Promise<string> {
  const client = getNotionClient();
  if (!client) return "";
  try {
    const children = await client.blocks.children.list({ block_id: pageId, page_size: 50 });
    let text = "";
    for (const b of children.results) {
      const t = (b as any)[(b as any).type]?.rich_text;
      if (Array.isArray(t) && t.length) {
        text += t.map((x: any) => x.plain_text).join("") + "\n\n";
        if (text.length > maxChars) break;
      }
    }
    return text.trim().slice(0, maxChars);
  } catch {
    return "";
  }
}

export async function findNotionContext(query: string): Promise<string> {
  const hits = await searchPages(query, 2);
  const snippets: string[] = [];
  for (const h of hits) {
    const snip = await getPageSnippet(h.id);
    if (snip) snippets.push(`TITLE: ${h.title}\n${snip}`);
  }
  return snippets.join("\n---\n");
}
