import { NextRequest, NextResponse } from "next/server";
import { findNotionContext } from "@/lib/notion";

export async function GET() {
  try {
    console.log("Testing Notion MCP connection...");
    console.log("NOTION_TOKEN exists:", !!process.env.NOTION_TOKEN);
    console.log("NOTION_MCP_TOKEN exists:", !!process.env.NOTION_MCP_TOKEN);
    
    const notionContext = await findNotionContext("weekly goals");
    
    console.log("Notion context length:", notionContext.length);
    console.log("Notion context preview:", notionContext.slice(0, 500));
    
    return NextResponse.json({ 
      success: true,
      contextLength: notionContext.length,
      contextPreview: notionContext.slice(0, 500),
      hasToken: !!(process.env.NOTION_TOKEN || process.env.NOTION_MCP_TOKEN)
    });
  } catch (error) {
    console.error("Notion MCP test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      hasToken: !!(process.env.NOTION_TOKEN || process.env.NOTION_MCP_TOKEN)
    }, { status: 500 });
  }
}
