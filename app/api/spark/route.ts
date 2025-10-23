import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { SPARK_SYSTEM_INSTRUCTIONS } from "@/components/agent/spark-prompt"
import { VectorizeService } from "@/lib/retrieval/vectorize"
import { getNotionMCPClient } from "@/lib/mcp/client/notion-client"

export async function GET() {
  try {
    console.log("[Spark] Starting hybrid spark generation (Vectorize + Notion)...")

    // Initialize services
    const vectorize = new VectorizeService()
    let vectorizeDocs = []
    let notionContent = ""

    // 1. Retrieve from Vectorize (existing reflections)
    try {
      vectorizeDocs = await vectorize.retrieveDocuments(
        "What patterns, themes, or insights have I been reflecting on recently? What am I stuck on?",
        3
      )
      console.log(`[Spark] Retrieved ${vectorizeDocs.length} documents from Vectorize`)
    } catch (error) {
      console.log("[Spark] Vectorize retrieval failed:", error)
    }

    // 2. Retrieve from Notion MCP (recent notes/reflections)
    try {
      const notionClient = getNotionMCPClient()
      await notionClient.connect()
      const notionTools = await notionClient.getTools()
      
      console.log(`[Spark] Available Notion tools:`, Object.keys(notionTools))
      
      // Use Notion search to find recent pages/notes
      if (notionTools["API-post-search"]) {
        const searchResult = await notionTools["API-post-search"].execute({
          query: "reflection OR note OR journal OR stuck OR thinking",
          page_size: 5
        })
        
        if (searchResult && searchResult.content && searchResult.content[0]) {
          const searchData = JSON.parse(searchResult.content[0].text)
          console.log(`[Spark] Found ${searchData.results.length} Notion pages`)
          
          // Extract content from Notion pages
          const notionPages = searchData.results.slice(0, 3) // Limit to 3 pages
          for (const page of notionPages) {
            try {
              // Get page content using API-get-block-children
              if (notionTools["API-get-block-children"]) {
                const content = await notionTools["API-get-block-children"].execute({
                  block_id: page.id
                })
                
                if (content && content.results) {
                  // Extract text content from blocks
                  const pageText = content.results
                    .filter(block => block.type === 'paragraph' && block.paragraph?.rich_text)
                    .map(block => block.paragraph.rich_text.map(text => text.plain_text).join(''))
                    .join('\n')
                    
                  if (pageText.trim()) {
                    const pageTitle = page.properties?.Name?.title?.[0]?.plain_text || 
                                    page.properties?.title?.title?.[0]?.plain_text || 
                                    'Untitled'
                    notionContent += `\n\nNotion Page: ${pageTitle}\n${pageText}`
                  }
                }
              }
            } catch (pageError) {
              console.log(`[Spark] Error getting content for page ${page.id}:`, pageError)
            }
          }
        }
      }
      
      await notionClient.disconnect()
    } catch (notionError) {
      console.log("[Spark] Notion MCP failed:", notionError.message)
    }

    // 3. Combine all sources
    const vectorizeContext = vectorizeDocs.length > 0
      ? vectorize.formatDocumentsForContext(vectorizeDocs)
      : "No previous Vectorize reflections found."

    const combinedContext = `
## Vectorize Reflections (Past Data):
${vectorizeContext}

## Notion Notes (Recent):
${notionContent || "No Notion notes found or Notion not configured."}
    `.trim()

    console.log(`[Spark] Combined context length: ${combinedContext.length} characters`)

    // 4. Generate personalized spark using AI
    const prompt = `Based on the user's past reflections and recent notes below, generate a personalized spark that will help them take gentle action today.

## Retrieved Content:
${combinedContext}

## Instructions:
1. Identify patterns or themes across both sources
2. Create a spark that connects their past wisdom to present action
3. Generate two actionable steps (2-5 minutes each)
4. If Notion content is available, reference specific notes or themes

Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "insight": "one-sentence insight",
  "context": "why they're seeing this now",
  "source": "where this came from (mention both Vectorize and Notion if applicable)",
  "date": "timeframe",
  "primaryStep": "2-5 minute action",
  "smallerStep": "even lighter alternative"
}`

    console.log("[Spark] Calling OpenAI to generate hybrid spark...")
    const result = await generateText({
      model: openai(process.env.MODEL_NAME || "gpt-4o-mini"),
      system: SPARK_SYSTEM_INSTRUCTIONS,
      prompt: prompt,
      temperature: 0.8,
    })

    console.log("[Spark] Raw AI response:", result.text)

    // Parse the AI response
    let sparkData
    try {
      let cleanedText = result.text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\n?/g, "")
      }
      
      sparkData = JSON.parse(cleanedText)
      console.log("[Spark] Successfully parsed hybrid spark data")
    } catch (parseError) {
      console.error("[Spark] Failed to parse AI response:", parseError)
      // Fallback to mock data
      sparkData = {
        insight: "You've been collecting ideas but not acting on them. What if the next small step matters more than the perfect plan?",
        context: "This spark comes from observing common patterns of creative professionals.",
        source: "Unthinking wisdom",
        date: "Today",
        primaryStep: "Open one creative project you've been thinking about and write just the first sentence.",
        smallerStep: "Pick one idea you've saved and read it out loud to yourself.",
      }
    }

    // Format response for frontend
    const response = {
      spark: {
        insight: sparkData.insight,
        context: sparkData.context,
        source: sparkData.source,
        date: sparkData.date,
      },
      steps: {
        primary: sparkData.primaryStep,
        smaller: sparkData.smallerStep,
      },
    }

    console.log("[Spark] Successfully generated hybrid spark:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Spark] Error generating hybrid spark:", error)
    
    // Return fallback spark on error
    return NextResponse.json({
      spark: {
        insight: "Sometimes the most courageous thing you can do is take one small step before you feel ready.",
        context: "You're here, which means you're ready for gentle motion.",
        source: "Unthinking wisdom",
        date: "Today",
      },
      steps: {
        primary: "Write down one thing you've been overthinking and what the tiniest next step could be.",
        smaller: "Close your eyes and take three deep breaths, noticing what feels light.",
      },
    })
  }
}
