import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function GET() {
  try {
    console.log("Testing OpenAI API...");
    console.log("OpenAI Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("Model name:", process.env.MODEL_NAME || "gpt-4o-mini");
    
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const resp = await client.chat.completions.create({
      model: process.env.MODEL_NAME || "gpt-4o-mini",
      temperature: 0,
      max_tokens: 50,
      messages: [{ role: "user", content: "Say hello" }],
    });
    
    console.log("OpenAI response:", resp.choices[0].message.content);
    
    return NextResponse.json({ 
      success: true, 
      response: resp.choices[0].message.content,
      model: process.env.MODEL_NAME || "gpt-4o-mini"
    });
  } catch (error) {
    console.error("OpenAI test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      model: process.env.MODEL_NAME || "gpt-4o-mini"
    });
  }
}