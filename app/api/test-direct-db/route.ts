import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing direct database query...");
    
    // Test the Reading + Listening database directly
    const readingDbId = process.env.NOTION_DB_READING;
    console.log("Reading DB ID:", readingDbId);
    
    if (!readingDbId) {
      return NextResponse.json({ error: "No reading database ID configured" });
    }
    
    // Try to get the database info first
    const dbInfo = await callNotionMcp("API-retrieve-a-database", {
      database_id: readingDbId
    });
    
    console.log("Database info:", dbInfo);
    
    // Then try to query it
    const queryResult = await callNotionMcp("API-post-database-query", {
      database_id: readingDbId,
      page_size: 10,
      sorts: [{ property: "last_edited_time", direction: "descending" }]
    });
    
    console.log("Query result:", queryResult);
    
    return NextResponse.json({ 
      success: true,
      databaseInfo: dbInfo,
      queryResult: queryResult,
      pageCount: queryResult?.results?.length || 0
    });
  } catch (error) {
    console.error("❌ Direct Database Query Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
