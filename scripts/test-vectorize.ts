import { VectorizeService } from "@/lib/retrieval/vectorize";

async function testVectorizeConnection() {
  try {
    console.log("Testing Vectorize connection...");
    
    // Check environment variables
    const hasToken = !!process.env.VECTORIZE_ACCESS_TOKEN;
    const hasOrgId = !!process.env.VECTORIZE_ORG_ID;
    const hasPipelineId = !!process.env.VECTORIZE_PIPELINE_ID;
    
    console.log("Environment variables:");
    console.log("- VECTORIZE_ACCESS_TOKEN:", hasToken ? "SET" : "MISSING");
    console.log("- VECTORIZE_ORG_ID:", hasOrgId ? "SET" : "MISSING");
    console.log("- VECTORIZE_PIPELINE_ID:", hasPipelineId ? "SET" : "MISSING");
    
    if (!hasToken || !hasOrgId || !hasPipelineId) {
      console.log("❌ Missing required environment variables");
      return;
    }
    
    // Test connection
    const vectorizeService = new VectorizeService();
    const documents = await vectorizeService.retrieveDocuments("career goals", 3);
    
    console.log(`✅ Successfully retrieved ${documents.length} documents`);
    
    if (documents.length > 0) {
      console.log("Sample documents:");
      documents.forEach((doc, index) => {
        console.log(`\nDocument ${index + 1}:`);
        console.log(`- Source: ${doc.source_display_name || doc.source}`);
        console.log(`- Relevancy: ${doc.relevancy}`);
        console.log(`- Preview: ${doc.text.substring(0, 100)}...`);
      });
    } else {
      console.log("⚠️ No documents found - check your pipeline configuration");
    }
    
  } catch (error) {
    console.error("❌ Vectorize connection failed:", error);
  }
}

testVectorizeConnection();
