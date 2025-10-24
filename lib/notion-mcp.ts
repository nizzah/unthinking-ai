import { getNotionMCPClient } from "@/lib/mcp/client/notion-client";
import { sanitizeUrl } from "@/lib/url-utils";

export type NotionHit = { id: string; title: string; url?: string; snippet?: string };

/**
 * Find Notion context using MCP client
 * This replaces the REST API approach with proper MCP integration
 */
export async function findNotionContext(query: string): Promise<string> {
  try {
    console.log("🔍 Searching Notion using MCP client...");
    
    const notionClient = getNotionMCPClient();
    await notionClient.connect();
    
    const tools = await notionClient.getTools();
    console.log("Available Notion tools:", Object.keys(tools));
    
    // Use the search tool if available
    if (tools["API-post-search"]) {
      console.log("Using Notion search tool...");
      const searchResult = await tools["API-post-search"].execute({ query });
      console.log("Search result:", searchResult);
      
      // Extract context from search results
      // The response format is: { content: [{ type: "text", text: "JSON_STRING" }] }
      if (searchResult && searchResult.content && searchResult.content[0]) {
        try {
          const jsonResponse = JSON.parse(searchResult.content[0].text);
          console.log("Parsed search response:", jsonResponse);
          
          if (jsonResponse.results && Array.isArray(jsonResponse.results)) {
            const snippets: string[] = [];
            
            for (const result of jsonResponse.results.slice(0, 2)) { // Limit to top 2 results
              if (result.object === "page" && result.properties) {
                // Extract title from page properties
                const titleProp = Object.values(result.properties).find((prop: any) => 
                  prop?.type === "title" && prop?.title?.length > 0
                ) as any;
                
                const title = titleProp?.title?.map((t: any) => t.plain_text).join("") || "Untitled";
                
                // For now, just use the title since we'd need to fetch page content separately
                snippets.push(`TITLE: ${title}\nID: ${result.id}`);
              }
            }
            
            const context = snippets.join("\n---\n");
            console.log(`Found ${snippets.length} Notion snippets, total length: ${context.length}`);
            return context;
          }
        } catch (parseError) {
          console.error("Failed to parse Notion search response:", parseError);
        }
      }
    }
    
    console.log("No search tool available or no results found");
    return "";
    
  } catch (error) {
    console.error("Notion MCP search error:", error);
    return "";
  }
}

/**
 * Get Notion client (for backward compatibility)
 * @deprecated Use findNotionContext instead
 */
export function getNotionClient() {
  console.warn("getNotionClient is deprecated, use findNotionContext instead");
  return null;
}

/**
 * Search pages (for backward compatibility)
 * @deprecated Use findNotionContext instead
 */
export async function searchPages(query: string, limit = 3): Promise<NotionHit[]> {
  console.warn("searchPages is deprecated, use findNotionContext instead");
  return [];
}

/**
 * Get page snippet (for backward compatibility)
 * @deprecated Use findNotionContext instead
 */
export async function getPageSnippet(pageId: string, maxChars = 800): Promise<string> {
  console.warn("getPageSnippet is deprecated, use findNotionContext instead");
  return "";
}
