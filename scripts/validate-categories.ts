import { config } from "dotenv";
import { VectorizeService } from "../lib/retrieval/vectorize";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function validateCategories() {
  console.log("🔍 Validating categories in Vectorize index...");
  
  // Check if environment variables are loaded
  console.log("Environment check:", {
    hasVectorizeToken: !!process.env.VECTORIZE_ACCESS_TOKEN,
    hasVectorizeOrg: !!process.env.VECTORIZE_ORG_ID,
    hasVectorizePipeline: !!process.env.VECTORIZE_PIPELINE_ID,
    tokenLength: process.env.VECTORIZE_ACCESS_TOKEN?.length || 0
  });
  
  const service = new VectorizeService();
  
  try {
    // Fetch a large number of documents to get a good sample
    const documents = await service.retrieveDocuments("test query", 100); // Use a test query to get documents
    
    if (!documents.length) {
      console.log("❌ No documents found in index");
      return;
    }
    
    console.log(`📊 Analyzing ${documents.length} documents...`);
    
    // Count documents by metadata.category
    const categoryCounts: Record<string, number> = {};
    const noCategoryCount = 0;
    
    documents.forEach((doc: any) => {
      const category = doc.metadata?.category || "no_category";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Sort categories by count (descending)
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a);
    
    console.log("\n📈 Category Distribution:");
    console.log("=" .repeat(40));
    
    sortedCategories.forEach(([category, count]) => {
      const percentage = ((count / documents.length) * 100).toFixed(1);
      const bar = "█".repeat(Math.floor((count / documents.length) * 20));
      console.log(`${category.padEnd(15)} ${count.toString().padStart(4)} (${percentage}%) ${bar}`);
    });
    
    console.log("=" .repeat(40));
    console.log(`Total documents: ${documents.length}`);
    
    // Check for expected categories
    const expectedCategories = ["learnings", "daily", "weekly", "goals", "profiles", "ideas", "fears", "journals"];
    const missingCategories = expectedCategories.filter(cat => !categoryCounts[cat]);
    
    if (missingCategories.length > 0) {
      console.log(`\n⚠️  Missing expected categories: ${missingCategories.join(", ")}`);
    } else {
      console.log("\n✅ All expected categories found");
    }
    
  } catch (error) {
    console.error("❌ Error validating categories:", error);
    process.exit(1);
  }
}

validateCategories().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
