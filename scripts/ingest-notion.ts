import fs from "fs";
import path from "path";
import { OpenAI } from "openai";

const INDEX = process.env.UNTHINKING_INDEX || "unthinking";

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

const categoryFromDb = (dbId?: string) => {
  if (!dbId) return "journals";
  if (dbId === process.env.NOTION_DB_READING) return "learnings";
  if (dbId === process.env.NOTION_DB_DAILY)   return "daily";
  if (dbId === process.env.NOTION_DB_WEEKLY)  return "weekly";
  return "journals";
};

async function main() {
  const apiKey = assertEnv("VECT_API_KEY");
  const baseURL = assertEnv("VECT_BASE_URL");

  const client = new OpenAI({ apiKey, baseURL });

  console.log(`Ingesting Notion pages into index "${INDEX}"...`);
  
  // This is a placeholder - you'll need to implement the actual Notion data fetching
  // For now, we'll show the structure for upserting with category metadata
  
  const notionPages = [
    // Example structure - replace with actual Notion page fetching
    {
      id: "notion-page-1",
      title: "Sample Notion Page",
      url: "https://notion.so/sample-page",
      content: "Sample content from Notion page",
      dbId: process.env.NOTION_DB_READING
    }
  ];

  for (const item of notionPages) {
    const id = `${INDEX}:notion:${item.id}`;
    const res = await (client as any).resources?.upsert?.({
      id,
      type: "text",
      index: INDEX,
      metadata: {
        title: item.title,
        url: item.url,
        source: "notion",
        source_db: item.dbId,
        category: categoryFromDb(item.dbId),
      },
      content: item.content,
    });
    
    if (!res) {
      // Fallback to responses.create with createResource tool if needed by this SDK
      await client.responses.create({
        model: process.env.MODEL_NAME || "gpt-5.1",
        tools: [{ type: "createResource" } as any],
        tool_choice: "auto",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: `Upsert resource ${id} into index ${INDEX}` },
              { type: "input_text", text: item.content },
            ],
          },
        ],
      } as any);
    }
    console.log("Upserted", id, "with category:", categoryFromDb(item.dbId));
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
