import { getNotionMCPClient } from "./mcp/client/notion-client";
import { getFirecrawlMCPClient } from "./mcp/client/firecrawl-client";

export async function callNotionMcp(tool: string, args: any) {
  const client = getNotionMCPClient();
  await client.connect();
  const tools = await client.getTools();
  
  if (!tools[tool]) {
    throw new Error(`Tool ${tool} not available`);
  }
  
  return await tools[tool].execute(args);
}

export { getFirecrawlMCPClient };
