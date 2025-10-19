import { Configuration, PipelinesApi } from "@vectorize-io/vectorize-client";
import type { VectorizeDocument } from "@/types/vectorize";
import type { ChatSource } from "@/types/chat";

export class VectorizeService {
  private pipelinesApi: any;
  private organizationId: string;
  private pipelineId: string;

  constructor() {
    // Only initialize if environment variables are available
    if (process.env.VECTORIZE_ACCESS_TOKEN && process.env.VECTORIZE_ORG_ID && process.env.VECTORIZE_PIPELINE_ID) {
      const config = new Configuration({
        accessToken: process.env.VECTORIZE_ACCESS_TOKEN,
        basePath: "https://api.vectorize.io/v1",
      });

      this.pipelinesApi = new PipelinesApi(config);
      this.organizationId = process.env.VECTORIZE_ORG_ID;
      this.pipelineId = process.env.VECTORIZE_PIPELINE_ID;
    } else {
      this.pipelinesApi = null;
      this.organizationId = "";
      this.pipelineId = "";
    }
  }

  async retrieveDocuments(
    question: string,
    numResults: number = 2
  ): Promise<VectorizeDocument[]> {
    // Return empty array if not initialized
    if (!this.pipelinesApi) {
      console.log("Vectorize not configured - returning empty results");
      return [];
    }

    try {
      const response = await this.pipelinesApi.retrieveDocuments({
        organizationId: this.organizationId,
        pipelineId: this.pipelineId,
        retrieveDocumentsRequest: {
          question,
          numResults,
        },
      });

      return response.documents || [];
    } catch (error: any) {
      console.error("Vectorize API Error:", error);
      console.error("Error response:", error?.response);
      if (error?.response?.text) {
        console.error("Error details:", await error.response.text());
      }
      console.error(
        "Using env vars - Org:",
        this.organizationId,
        "Pipeline:",
        this.pipelineId
      );
      throw new Error(
        `Failed to retrieve documents from Vectorize: ${
          error?.message || "Unknown error"
        }`
      );
    }
  }

  formatDocumentsForContext(documents: VectorizeDocument[]): string {
    if (!documents.length) {
      return "No relevant documents found.";
    }

    return documents
      .map((doc, index) => `Document ${index + 1}:\n${doc.text}`)
      .join("\n\n---\n\n");
  }

  convertDocumentsToChatSources(documents: VectorizeDocument[]): ChatSource[] {
    return documents.map((doc) => ({
      id: doc.id,
      title: doc.source_display_name || doc.source,
      url: doc.source,
      snippet: doc.text,
      relevancy: doc.relevancy,
      similarity: doc.similarity,
    }));
  }
}
