import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = body.q || "test";

  const token = process.env.NOTION_MCP_TOKEN || process.env.NOTION_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing NOTION_MCP_TOKEN or NOTION_TOKEN" }, { status: 500 });
  }

  // Test by sending a simple MCP request to the server
  const proc = spawn("npx", ["-y", "@notionhq/notion-mcp-server"], {
    env: { ...process.env, NOTION_TOKEN: token },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let output = "";
  let error = "";
  proc.stdout.on("data", (d) => (output += d.toString()));
  proc.stderr.on("data", (d) => (error += d.toString()));

  // Send a simple MCP initialization request
  const initRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-client", version: "1.0.0" }
    }
  };

  proc.stdin.write(JSON.stringify(initRequest) + "\n");

  const timeout = new Promise((_r, rej) =>
    setTimeout(() => rej(new Error("Timeout after 3s")), 3000)
  );

  try {
    await Promise.race([
      new Promise((res, rej) => {
        proc.stdout.once("data", () => {
          proc.kill();
          res(true);
        });
        proc.on("error", (err) => rej(err));
      }),
      timeout,
    ]);
  } catch (e) {
    proc.kill();
    return NextResponse.json({ error: "Server failed to start", details: String(e) }, { status: 500 });
  }

  return NextResponse.json({
    message: "Notion MCP server reachable",
    note: "Server responded to initialization request successfully.",
    output: output.substring(0, 200) + (output.length > 200 ? "..." : ""),
  });
}
