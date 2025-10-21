import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing Notion search...");
    
    // Test general search
    const searchResult = await callNotionMcp("API-post-search", {
      query: "",
      page_size: 10
    });
    
    console.log("Search result:", searchResult);
    
    const pages = searchResult?.results || [];
    const databases = searchResult?.results?.filter((r: any) => r.object === "database") || [];
    
    return NextResponse.json({ 
      success: true,
      totalPages: pages.length,
      totalDatabases: databases.length,
      pages: pages.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.properties?.title?.title?.[0]?.plain_text || p.title || "Untitled",
        url: p.url,
        object: p.object
      })),
      databases: databases.map((d: any) => ({
        id: d.id,
        title: d.title?.[0]?.plain_text || "Untitled",
        url: d.url
      }))
    });
  } catch (error) {
    console.error("❌ Notion Search Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
