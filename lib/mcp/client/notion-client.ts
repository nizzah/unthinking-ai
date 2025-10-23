/**
 * Notion MCP Client using stdio Transport
 * Documentation: https://github.com/notionhq/notion-mcp-server
 * AI SDK MCP Integration: https://ai-sdk.dev/cookbook/node/mcp-tools
 */

import { experimental_createMCPClient } from "ai";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { MCPClientConfig } from "./types";

export class NotionMCPClient {
  private client: Awaited<
    ReturnType<typeof experimental_createMCPClient>
  > | null = null;
  private token: string;
  private isConnected: boolean = false;

  constructor(config: MCPClientConfig) {
    this.token = config.apiKey; // Using apiKey field for token
  }

  /**
   * Initialize the MCP client connection
   */
  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      console.log("🔗 Notion MCP client already connected");
      return;
    }

    try {
      console.log("🚀 Connecting to Notion MCP server via stdio...");

      const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@notionhq/notion-mcp-server"],
        env: {
          ...process.env,
          NOTION_TOKEN: this.token,
        },
      });

      this.client = await experimental_createMCPClient({
        transport,
      });

      this.isConnected = true;
      console.log("✅ Notion MCP client connected successfully");
    } catch (error) {
      console.error("💥 Failed to connect to Notion MCP server:", error);
      throw new Error(
        `Failed to connect to Notion MCP server: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Disconnect the MCP client
   */
  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      console.log("🔌 Disconnecting Notion MCP client...");
      await this.client.close();
      this.client = null;
      this.isConnected = false;
      console.log("✅ Notion MCP client disconnected");
    } catch (error) {
      console.error("💥 Error disconnecting Notion MCP client:", error);
    }
  }

  /**
   * Get all available Notion tools
   * Returns tools that can be used with AI SDK's generateText/streamText
   */
  async getTools(): Promise<Record<string, any>> {
    if (!this.isConnected || !this.client) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error("MCP client not initialized");
    }

    try {
      console.log("🔧 Retrieving Notion MCP tools...");
      const tools = await this.client.tools();
      console.log(`✅ Retrieved ${Object.keys(tools).length} Notion tools`);
      return tools;
    } catch (error) {
      console.error("💥 Failed to retrieve Notion tools:", error);
      throw new Error(
        `Failed to retrieve Notion tools: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get the connection status
   */
  isClientConnected(): boolean {
    return this.isConnected;
  }
}

/**
 * Singleton instance for Notion MCP client
 */
let notionClientInstance: NotionMCPClient | null = null;

/**
 * Get or create a Notion MCP client instance
 */
export function getNotionMCPClient(token?: string): NotionMCPClient {
  if (!notionClientInstance) {
    const notionToken = token || process.env.NOTION_TOKEN || process.env.NOTION_MCP_TOKEN;

    if (!notionToken) {
      throw new Error(
        "NOTION_TOKEN or NOTION_MCP_TOKEN not found. Please set it in .env.local or pass it to getNotionMCPClient()"
      );
    }

    notionClientInstance = new NotionMCPClient({ apiKey: notionToken });
  }

  return notionClientInstance;
}

/**
 * Reset the singleton instance (useful for testing or reconfiguration)
 */
export function resetNotionMCPClient(): void {
  if (notionClientInstance) {
    notionClientInstance.disconnect();
    notionClientInstance = null;
  }
}
