import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing corrected database query...");
    
    // Test the Reading + Listening database with correct sort property
    const readingDbId = process.env.NOTION_DB_READING;
    
    if (!readingDbId) {
      return NextResponse.json({ error: "No reading database ID configured" });
    }
    
    // Query with correct sort property
    const queryResult = await callNotionMcp("API-post-database-query", {
      database_id: readingDbId,
      page_size: 10,
      sorts: [{ property: "Created", direction: "descending" }]
    });
    
    console.log("Query result:", queryResult);
    
    const pages = queryResult?.results || [];
    
    return NextResponse.json({ 
      success: true,
      pageCount: pages.length,
      pages: pages.map((page: any) => ({
        id: page.id,
        title: page.properties?.Name?.title?.[0]?.plain_text || "Untitled",
        url: page.url,
        created: page.properties?.Created?.created_time,
        status: page.properties?.Status?.select?.name,
        type: page.properties?.Type?.select?.name
      }))
    });
  } catch (error) {
    console.error("❌ Corrected Database Query Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
