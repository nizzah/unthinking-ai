import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing all databases for content...");
    
    const results: any = {};
    
    const databases = {
      reading: process.env.NOTION_DB_READING,
      daily: process.env.NOTION_DB_DAILY,
      weekly: process.env.NOTION_DB_WEEKLY
    };
    
    for (const [name, dbId] of Object.entries(databases)) {
      if (!dbId) {
        results[name] = { error: "No database ID configured" };
        continue;
      }
      
      try {
        console.log(`Testing ${name} database: ${dbId}`);
        
        // Try different sort properties for each database
        const sortProperty = name === 'reading' ? 'Created' : 'last_edited_time';
        
        const queryResult = await callNotionMcp("API-post-database-query", {
          database_id: dbId,
          page_size: 5
        });
        
        const pages = queryResult?.results || [];
        
        results[name] = {
          success: true,
          pageCount: pages.length,
          pages: pages.map((page: any) => ({
            id: page.id,
            title: page.properties?.Name?.title?.[0]?.plain_text || 
                   page.properties?.title?.title?.[0]?.plain_text || 
                   "Untitled",
            url: page.url
          }))
        };
        
        console.log(`${name} database: ${pages.length} pages`);
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
    console.error("❌ All Databases Test Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
