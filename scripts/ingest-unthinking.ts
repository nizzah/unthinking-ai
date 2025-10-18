import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const INDEX = process.env.UNTHINKING_INDEX || "unthinking-md";
const DIR = path.join(process.cwd(), "data/unthinking");

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

async function main() {
  const apiKey = assertEnv("VECT_API_KEY");
  const baseURL = assertEnv("VECT_BASE_URL");

  if (!fs.existsSync(DIR)) throw new Error(`Folder not found: ${DIR}`);
  const files = fs.readdirSync(DIR).filter(f => f.endsWith(".md"));
  if (files.length === 0) throw new Error(`No .md files in ${DIR}`);

  const client = new OpenAI({ apiKey, baseURL });

  console.log(`Ingesting ${files.length} files into index "${INDEX}"...`);
  for (const f of files) {
    const id = `${INDEX}:${f}`;
    const content = fs.readFileSync(path.join(DIR, f), "utf8");
    const res = await (client as any).resources?.upsert?.({
      id,
      type: "text",
      index: INDEX,
      metadata: { filename: f, source: "unthinking" },
      content,
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
              { type: "input_text", text: content },
            ],
          },
        ],
      } as any);
    }
    console.log("Upserted", id);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
