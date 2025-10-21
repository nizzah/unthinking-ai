import { NextRequest, NextResponse } from "next/server";
import { VectorizeService } from "@/lib/retrieval/vectorize";

export async function GET() {
  try {
    console.log("Testing Vectorize connection...");
    
    const vectorizeService = new VectorizeService();
    const documents = await vectorizeService.retrieveDocuments("weekly goals", 3);
    
    console.log("Documents found:", documents.length);
    console.log("Documents:", documents);
    
    const retrievedText = vectorizeService.formatDocumentsForContext(documents);
    console.log("Formatted text length:", retrievedText.length);
    console.log("Formatted text preview:", retrievedText.slice(0, 500));
    
    return NextResponse.json({ 
      success: true,
      documentCount: documents.length,
      retrievedTextLength: retrievedText.length,
      retrievedTextPreview: retrievedText.slice(0, 500),
      documents: documents.map(d => ({
        id: d.id,
        text: d.text?.slice(0, 200),
        relevancy: d.relevancy,
        similarity: d.similarity
      }))
    });
  } catch (error) {
    console.error("Vectorize test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
