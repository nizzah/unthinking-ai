import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { SPARK_SYSTEM_INSTRUCTIONS } from "@/components/agent/spark-prompt"
import { VectorizeService } from "@/lib/retrieval/vectorize"
import { getNotionMCPClient } from "@/lib/mcp/client/notion-client"
import { NOTION_DB } from "@/lib/notion-config"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mindDump } = body
    
    console.log("[Spark] Starting hybrid spark generation with mind dump:", mindDump)

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

    // 2. Enhanced Notion MCP retrieval (database-specific + context-aware)
    try {
      const notionClient = getNotionMCPClient()
      await notionClient.connect()
      const notionTools = await notionClient.getTools()
      
      console.log(`[Spark] Available Notion tools:`, Object.keys(notionTools))
      
      // Get recent daily journal entries (most relevant for current state)
      if (NOTION_DB.daily && notionTools["API-post-database-query"]) {
        try {
          const dailyResult = await notionTools["API-post-database-query"].execute({
            database_id: NOTION_DB.daily,
            page_size: 2,
            sorts: [{ property: "Created", direction: "descending" }]
          });
          
          if (dailyResult?.content?.[0]?.text) {
            const parsed = JSON.parse(dailyResult.content[0].text);
            console.log(`[Spark] Found ${parsed.results.length} daily journal entries`);
            
            for (const entry of parsed.results || []) {
              const title = entry.properties?.Name?.title?.[0]?.plain_text || "Untitled";
              
              // Get page content
              try {
                const contentResult = await notionTools["API-get-block-children"].execute({
                  block_id: entry.id
                });
                
                if (contentResult?.content?.[0]?.text) {
                  const blocksParsed = JSON.parse(contentResult.content[0].text);
                  const text = blocksParsed.results
                    ?.filter((b: any) => b.type === 'paragraph' && b.paragraph?.rich_text)
                    ?.map((b: any) => b.paragraph.rich_text.map((t: any) => t.plain_text).join(''))
                    ?.join('\n') || '';
                  
                  if (text.trim()) {
                    notionContent += `\n\nDaily Journal: ${title}\n${text.slice(0, 300)}`;
                  }
                }
              } catch (contentError) {
                console.log(`[Spark] Error getting content for ${entry.id}:`, contentError);
              }
            }
          }
        } catch (error) {
          console.log("[Spark] Daily journal query failed:", error);
        }
      }

      // Get recent learnings from readings database
      if (NOTION_DB.readings && notionTools["API-post-database-query"]) {
        try {
          const readingsResult = await notionTools["API-post-database-query"].execute({
            database_id: NOTION_DB.readings,
            page_size: 2,
            sorts: [{ property: "Created", direction: "descending" }]
          });
          
          if (readingsResult?.content?.[0]?.text) {
            const parsed = JSON.parse(readingsResult.content[0].text);
            console.log(`[Spark] Found ${parsed.results.length} reading entries`);
            
            for (const entry of parsed.results || []) {
              const title = entry.properties?.Name?.title?.[0]?.plain_text || "Untitled";
              const summary = entry.properties?.Summary?.rich_text?.[0]?.plain_text || "";
              
              if (summary.trim()) {
                notionContent += `\n\nLearning: ${title}\n${summary}`;
              }
            }
          }
        } catch (error) {
          console.log("[Spark] Readings query failed:", error);
        }
      }

      // Context-aware search based on mind dump emotional keywords
      if (notionTools["API-post-search"]) {
        const emotionalKeywords = {
          stress: ['overwhelmed', 'stressed', 'anxious', 'worried', 'pressure'],
          energy: ['tired', 'exhausted', 'energized', 'motivated', 'drained'],
          clarity: ['confused', 'stuck', 'clear', 'focused', 'unclear'],
          progress: ['stuck', 'progress', 'breakthrough', 'insight', 'blocked']
        };
        
        // Find relevant emotional keywords in mind dump
        const relevantEmotions = [];
        for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
          if (keywords.some(keyword => mindDump.toLowerCase().includes(keyword))) {
            relevantEmotions.push(keywords.join(' OR '));
          }
        }
        
        // Use relevant emotions or default search
        const searchQuery = relevantEmotions.length > 0 
          ? relevantEmotions[0] 
          : "reflection OR insight OR learning OR pattern";
        
        try {
          const searchResult = await notionTools["API-post-search"].execute({
            query: searchQuery,
            page_size: 2
          });
          
          if (searchResult?.content?.[0]?.text) {
            const searchData = JSON.parse(searchResult.content[0].text);
            console.log(`[Spark] Found ${searchData.results.length} relevant Notion pages for query: ${searchQuery}`);
            
            for (const page of searchData.results.slice(0, 2)) {
              const pageTitle = page.properties?.Name?.title?.[0]?.plain_text || 
                              page.properties?.title?.title?.[0]?.plain_text || 
                              'Untitled';
              
              // Get page content
              try {
                const content = await notionTools["API-get-block-children"].execute({
                  block_id: page.id
                });
                
                if (content?.content?.[0]?.text) {
                  const blocksParsed = JSON.parse(content.content[0].text);
                  const pageText = blocksParsed.results
                    ?.filter((b: any) => b.type === 'paragraph' && b.paragraph?.rich_text)
                    ?.map((b: any) => b.paragraph.rich_text.map((t: any) => t.plain_text).join(''))
                    ?.join('\n') || '';
                    
                  if (pageText.trim()) {
                    notionContent += `\n\nRelevant Insight: ${pageTitle}\n${pageText.slice(0, 200)}`;
                  }
                }
              } catch (pageError) {
                console.log(`[Spark] Error getting content for page ${page.id}:`, pageError);
              }
            }
          }
        } catch (searchError) {
          console.log(`[Spark] Search query "${searchQuery}" failed:`, searchError);
        }
      }
      
      await notionClient.disconnect()
    } catch (notionError) {
      console.log("[Spark] Enhanced Notion MCP failed:", notionError.message)
    }

    // 3. Combine all sources
    const vectorizeContext = vectorizeDocs.length > 0
      ? vectorize.formatDocumentsForContext(vectorizeDocs)
      : "No previous Vectorize reflections found."

    const combinedContext = `
## Current Mind Dump (What's on their mind right now):
${mindDump || "No mind dump provided"}

## Vectorize Reflections (Past Data):
${vectorizeContext}

## Notion Notes (Recent):
${notionContent || "No Notion notes found or Notion not configured."}
    `.trim()

    console.log(`[Spark] Combined context length: ${combinedContext.length} characters`)

    // 4. Generate personalized spark using AI
    const prompt = `Based on the user's current mind dump and their past reflections below, generate a personalized spark that will help them take gentle action today.

## Retrieved Content:
${combinedContext}

## Instructions:
1. PRIORITIZE the current mind dump - this is what's most relevant to them right now
2. Connect their current emotional state/concerns to gentle action
3. Use past reflections only to provide context or patterns, not as the primary focus
4. Generate two actionable steps (2-5 minutes each) that address their current state
5. Make the spark feel personally relevant to what they just wrote

Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "insight": "one-sentence insight that directly addresses their current mind dump",
  "context": "why they're seeing this now - connect to their current state",
  "source": "where this came from (current mind dump + any relevant past reflections)",
  "date": "timeframe",
  "primaryStep": "2-5 minute action that addresses their current concern",
  "smallerStep": "even lighter alternative that still helps with their current state"
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

// Fallback GET method for backward compatibility
export async function GET() {
  try {
    console.log("[Spark] GET request - no mind dump provided, using fallback")

    // Return a generic spark when no mind dump is provided
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
  } catch (error) {
    console.error("[Spark] Error in GET method:", error)
    
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
