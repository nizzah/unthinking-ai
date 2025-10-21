import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing Notion MCP connection...");
    
    // Test basic MCP connection
    const tools = await callNotionMcp("API-get-self", {});
    console.log("✅ MCP connection successful");
    console.log("Self info:", tools);
    
    return NextResponse.json({ 
      success: true, 
      message: "Notion MCP connection successful",
      selfInfo: tools
    });
  } catch (error) {
    console.error("❌ Notion MCP Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}