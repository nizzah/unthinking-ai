import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing Notion database queries...");
    
    const results: any = {};
    
    // Test each database
    const databases = {
      reading: process.env.NOTION_DB_READING,
      daily: process.env.NOTION_DB_DAILY,
      weekly: process.env.NOTION_DB_WEEKLY
    };
    
    console.log("Database IDs:", databases);
    
    for (const [name, dbId] of Object.entries(databases)) {
      if (!dbId) {
        results[name] = { error: "No database ID configured" };
        continue;
      }
      
      try {
        console.log(`Testing ${name} database: ${dbId}`);
        const queryResult = await callNotionMcp("API-post-database-query", {
          database_id: dbId,
          page_size: 5
        });
        
        results[name] = {
          success: true,
          count: queryResult?.results?.length || 0,
          firstPage: queryResult?.results?.[0]?.properties || null
        };
        
        console.log(`${name} database query successful:`, queryResult?.results?.length || 0, "pages");
      } catch (dbError) {
        console.error(`Error querying ${name} database:`, dbError);
        results[name] = {
          error: dbError instanceof Error ? dbError.message : "Unknown error"
        };
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      databases: results
    });
  } catch (error) {
    console.error("❌ Notion Database Test Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
