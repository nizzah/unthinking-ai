import { NextResponse } from "next/server";
import { callNotionMcp } from "@/lib/mcp";

export async function GET() {
  try {
    console.log("🔍 Testing Notion token permissions...");
    
    // Test getting users to see what we have access to
    const usersResult = await callNotionMcp("API-get-users", {
      page_size: 10
    });
    
    console.log("Users result:", usersResult);
    
    // Test getting a specific user
    const selfResult = await callNotionMcp("API-get-self", {});
    
    return NextResponse.json({ 
      success: true,
      users: usersResult?.results || [],
      self: selfResult,
      message: "Check if the integration has access to the workspace"
    });
  } catch (error) {
    console.error("❌ Notion Permissions Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
