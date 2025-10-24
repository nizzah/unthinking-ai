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
    
    // Get current time context for personalization
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Determine time context
    let timeContext = ""
    if (hour >= 5 && hour < 9) {
      timeContext = "early morning"
    } else if (hour >= 9 && hour < 12) {
      timeContext = "morning"
    } else if (hour >= 12 && hour < 14) {
      timeContext = "lunch time"
    } else if (hour >= 14 && hour < 17) {
      timeContext = "afternoon"
    } else if (hour >= 17 && hour < 20) {
      timeContext = "evening"
    } else {
      timeContext = "night"
    }
    
    // Determine day context
    let dayContext = ""
    if (isWeekend) {
      dayContext = "weekend"
    } else if (dayOfWeek === 1) {
      dayContext = "Monday"
    } else if (dayOfWeek === 5) {
      dayContext = "Friday"
    } else {
      dayContext = "weekday"
    }
    
    console.log("[Spark] Starting hybrid spark generation with mind dump:", mindDump)
    console.log("[Spark] Time context:", timeContext, "Day context:", dayContext)

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
                    const entryDate = entry.properties?.Created?.created_time || 
                                    entry.properties?.Date?.date?.start || 
                                    'recent';
                    notionContent += `\n\n**Daily Journal: ${title}** (${entryDate}):\n${text.slice(0, 300)}`;
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

      // Get recent learnings from readings database with enhanced content extraction
      if (NOTION_DB.readings && notionTools["API-post-database-query"]) {
        try {
          const readingsResult = await notionTools["API-post-database-query"].execute({
            database_id: NOTION_DB.readings,
            page_size: 3, // Increased from 2 to get more content
            sorts: [{ property: "Created", direction: "descending" }]
          });
          
          if (readingsResult?.content?.[0]?.text) {
            const parsed = JSON.parse(readingsResult.content[0].text);
            console.log(`[Spark] Found ${parsed.results.length} reading entries`);
            
            for (const entry of parsed.results || []) {
              const title = entry.properties?.Name?.title?.[0]?.plain_text || "Untitled";
              const summary = entry.properties?.Summary?.rich_text?.[0]?.plain_text || "";
              const author = entry.properties?.Author?.rich_text?.[0]?.plain_text || "";
              const type = entry.properties?.Type?.select?.name || "";
              const tags = entry.properties?.Tags?.multi_select?.map((tag: any) => tag.name).join(', ') || "";
              
              // Get full page content, not just summary
              try {
                const contentResult = await notionTools["API-get-block-children"].execute({
                  block_id: entry.id
                });
                
                let fullContent = summary;
                if (contentResult?.content?.[0]?.text) {
                  const blocksParsed = JSON.parse(contentResult.content[0].text);
                  const pageText = blocksParsed.results
                    ?.filter((b: any) => b.type === 'paragraph' && b.paragraph?.rich_text)
                    ?.map((b: any) => b.paragraph.rich_text.map((t: any) => t.plain_text).join(''))
                    ?.join('\n') || '';
                  
                  if (pageText.trim()) {
                    fullContent = pageText.slice(0, 500); // Get more content
                  }
                }
                
                if (fullContent.trim()) {
                  const entryDate = entry.properties?.Created?.created_time || 
                                  entry.properties?.Date?.date?.start || 
                                  'recent';
                  const sourceInfo = [type, author].filter(Boolean).join(' - ');
                  notionContent += `\n\n**${title}**${sourceInfo ? ` (${sourceInfo})` : ''} (${entryDate}):\n${fullContent}`;
                  if (tags) {
                    notionContent += `\nTags: ${tags}`;
                  }
                }
              } catch (contentError) {
                console.log(`[Spark] Error getting content for reading ${entry.id}:`, contentError);
                // Fallback to summary only
                if (summary.trim()) {
                  const entryDate = entry.properties?.Created?.created_time || 'recent';
                  notionContent += `\n\n**${title}** (${entryDate}):\n${summary}`;
                }
              }
            }
          }
        } catch (error) {
          console.log("[Spark] Readings query failed:", error);
        }
      }

      // Context-aware search for relevant learnings based on mind dump
      if (notionTools["API-post-search"]) {
        // Extract key themes from mind dump for targeted search
        const mindDumpWords = mindDump.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        const keyThemes = mindDumpWords.slice(0, 3); // Use first 3 meaningful words
        
        // Search for relevant learnings that might help with current situation
        const learningSearchQueries = [
          // Direct search using mind dump themes
          keyThemes.join(' OR '),
          // Broader emotional/psychological themes
          'fear OR failure OR courage OR action OR perfection',
          'overthinking OR analysis OR paralysis OR decision',
          'learning OR insight OR wisdom OR growth'
        ];
        
        for (const searchQuery of learningSearchQueries.slice(0, 2)) { // Limit to 2 searches
          try {
            const searchResult = await notionTools["API-post-search"].execute({
              query: searchQuery,
              page_size: 2,
              filter: {
                property: "object",
                value: "page"
              }
            });
            
            if (searchResult?.content?.[0]?.text) {
              const searchData = JSON.parse(searchResult.content[0].text);
              console.log(`[Spark] Found ${searchData.results.length} relevant pages for query: ${searchQuery}`);
              
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
                      const pageDate = page.properties?.Created?.created_time || 
                                     page.properties?.Date?.date?.start || 
                                     'recent';
                      notionContent += `\n\n**Relevant Learning: ${pageTitle}** (${pageDate}):\n${pageText.slice(0, 300)}`;
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
      }
      
      await notionClient.disconnect()
    } catch (notionError) {
      console.log("[Spark] Enhanced Notion MCP failed:", notionError.message)
    }

    // 3. Combine all sources with specific attribution
    const vectorizeContext = vectorizeDocs.length > 0
      ? vectorize.formatDocumentsForContext(vectorizeDocs)
      : "No previous Vectorize reflections found."

    // Create specific source attribution with focus on learnings
    const sources = []
    if (vectorizeDocs.length > 0) {
      sources.push(`${vectorizeDocs.length} past reflection${vectorizeDocs.length > 1 ? 's' : ''} from your journal`)
    }
    if (notionContent.trim()) {
      const notionEntries = notionContent.split('\n\n').filter(entry => entry.trim())
      const learningEntries = notionEntries.filter(entry => 
        entry.includes('**') && !entry.includes('Daily Journal') && !entry.includes('Relevant Learning')
      )
      const journalEntries = notionEntries.filter(entry => entry.includes('Daily Journal'))
      const searchEntries = notionEntries.filter(entry => entry.includes('Relevant Learning'))
      
      if (learningEntries.length > 0) {
        sources.push(`${learningEntries.length} learning${learningEntries.length > 1 ? 's' : ''} from books/articles/podcasts`)
      }
      if (journalEntries.length > 0) {
        sources.push(`${journalEntries.length} recent journal entr${journalEntries.length > 1 ? 'ies' : 'y'}`)
      }
      if (searchEntries.length > 0) {
        sources.push(`${searchEntries.length} relevant insight${searchEntries.length > 1 ? 's' : ''} from your notes`)
      }
    }
    if (sources.length === 0) {
      sources.push("your current thoughts")
    }

    const combinedContext = `
## Current Mind Dump (What's on their mind right now):
${mindDump || "No mind dump provided"}

## Vectorize Reflections (Past Data):
${vectorizeContext}

## Notion Notes (Recent):
${notionContent || "No Notion notes found or Notion not configured."}
    `.trim()

    console.log(`[Spark] Combined context length: ${combinedContext.length} characters`)

    // 4. Generate personalized spark using AI with enhanced focus on learnings and time context
    const prompt = `Based on the user's current mind dump, their past reflections AND learnings below, and the current time context, generate a personalized spark that will help them take gentle action today.

## Current Context:
- **Time**: ${timeContext} (${hour}:${now.getMinutes().toString().padStart(2, '0')})
- **Day**: ${dayContext}
- **Mind Dump**: ${mindDump || "No specific thoughts shared"}

## Retrieved Content:
${combinedContext}

## Instructions:
1. PRIORITIZE learnings from books, articles, podcasts - these contain external wisdom that can provide fresh perspectives
2. Connect their current emotional state/concerns to actionable insights from their learnings
3. Use past reflections to provide context, but lead with insights from their reading/learning
4. **TIME-AWARE PERSONALIZATION**: Consider what they might be going through at this time:
   - Early morning (5-9am): Starting the day, planning, energy building
   - Morning (9-12pm): Peak productivity, focus, decision-making
   - Lunch time (12-2pm): Midday pause, reflection, energy dip
   - Afternoon (2-5pm): Afternoon slump, motivation challenges, winding down work
   - Evening (5-8pm): Transition from work, family time, relaxation
   - Night (8pm-5am): Reflection, winding down, or late-night productivity
   - Weekend: Rest, personal projects, social time, different energy
   - Monday: Fresh start, motivation, planning
   - Friday: Week wrap-up, anticipation, celebration
5. Generate two actionable steps (2-5 minutes each) that address their current state AND time context
6. Make the spark feel personally relevant by connecting learnings to their current situation and time
7. For source attribution, be SPECIFIC about what you found:
   - If using learnings, mention the specific book/article/podcast title and author
   - If using Vectorize docs, mention specific themes or patterns you noticed
   - If using Notion notes, reference specific titles or topics
   - Avoid generic phrases like "Document 1" or vague dates
   - Make it clear WHY this insight is relevant to them right now

## Available Sources:
${sources.join(', ')}

## Priority Order for Spark Generation:
1. **First**: Insights from books/articles/podcasts that relate to their current situation AND time context
2. **Second**: Patterns from their own reflections that connect to the learnings and current time
3. **Third**: General wisdom that applies to their current state and time of day

Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "insight": "one-sentence insight that draws from their learnings and directly addresses their current mind dump - be specific and actionable, not generic",
  "context": "specific reason why they're seeing this now - reference actual learnings, books, or patterns from their data",
  "source": "specific attribution: mention actual book/article titles, authors, or themes from their learnings and reflections",
  "date": "specific timeframe when relevant (e.g., 'from your recent reading', 'from your journal entries this month')",
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
    console.log("[Spark] GET request - no mind dump provided, using time-aware fallback")

    // Get current time context for personalization
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Determine time context
    let timeContext = ""
    if (hour >= 5 && hour < 9) {
      timeContext = "early morning"
    } else if (hour >= 9 && hour < 12) {
      timeContext = "morning"
    } else if (hour >= 12 && hour < 14) {
      timeContext = "lunch time"
    } else if (hour >= 14 && hour < 17) {
      timeContext = "afternoon"
    } else if (hour >= 17 && hour < 20) {
      timeContext = "evening"
    } else {
      timeContext = "night"
    }
    
    // Determine day context
    let dayContext = ""
    if (isWeekend) {
      dayContext = "weekend"
    } else if (dayOfWeek === 1) {
      dayContext = "Monday"
    } else if (dayOfWeek === 5) {
      dayContext = "Friday"
    } else {
      dayContext = "weekday"
    }

    // Time-aware insights
    let insight = "Sometimes the most courageous thing you can do is take one small step before you feel ready."
    let context = "You're here, which means you're ready for gentle motion."
    let primaryStep = "Write down one thing you've been overthinking and what the tiniest next step could be."
    let smallerStep = "Close your eyes and take three deep breaths, noticing what feels light."

    // Customize based on time context
    if (timeContext === "early morning") {
      insight = "The morning holds fresh possibilities. What if today you focused on just one thing that would make you feel accomplished?"
      context = "Early morning energy is perfect for setting intentions."
      primaryStep = "Write down one thing you'd like to feel proud of by the end of today."
      smallerStep = "Take three deep breaths and visualize how you'll feel when you complete that one thing."
    } else if (timeContext === "morning") {
      insight = "Your peak energy hours are here. What's the most important thing you could move forward on right now?"
      context = "Morning focus is at its strongest - use it wisely."
      primaryStep = "Pick one task that's been on your mind and spend 5 minutes on it."
      smallerStep = "Write down what's been distracting you and set it aside for later."
    } else if (timeContext === "lunch time") {
      insight = "Midday pause is perfect for reflection. What's been working well today, and what needs gentle adjustment?"
      context = "Lunch time offers a natural break for perspective."
      primaryStep = "Reflect on one thing that went well this morning and one small adjustment for the afternoon."
      smallerStep = "Take a moment to appreciate something you've already accomplished today."
    } else if (timeContext === "afternoon") {
      insight = "Afternoon energy can dip, but small wins can reignite momentum. What's one tiny thing you could complete?"
      context = "Afternoon slumps are normal - gentle action helps."
      primaryStep = "Choose one small task that would give you a sense of completion."
      smallerStep = "Stand up, stretch, and take three deep breaths to reset your energy."
    } else if (timeContext === "evening") {
      insight = "Evening is for winding down and reflection. What did today teach you about yourself?"
      context = "Evening offers space for gentle reflection and planning."
      primaryStep = "Write down one thing you learned about yourself today."
      smallerStep = "Take a moment to appreciate how you've grown or what you've accomplished."
    } else if (timeContext === "night") {
      insight = "Night time brings quiet reflection. What's one thing you're grateful for from today?"
      context = "Night offers peaceful space for gratitude and gentle planning."
      primaryStep = "Write down three things you're grateful for from today."
      smallerStep = "Take three deep breaths and let go of any tension from the day."
    }

    // Customize based on day context
    if (dayContext === "Monday") {
      insight = "Monday brings fresh energy and new possibilities. What's one thing you'd like to focus on this week?"
      context = "Monday motivation is perfect for setting weekly intentions."
      primaryStep = "Write down one thing you'd like to accomplish this week."
      smallerStep = "Take three deep breaths and visualize how you'll feel when you complete it."
    } else if (dayContext === "Friday") {
      insight = "Friday energy is about completion and celebration. What's one thing you can finish or celebrate today?"
      context = "Friday is perfect for wrapping up and appreciating progress."
      primaryStep = "Choose one thing to complete or celebrate from this week."
      smallerStep = "Take a moment to appreciate what you've accomplished this week."
    } else if (dayContext === "weekend") {
      insight = "Weekend time is precious - for rest, creativity, or gentle progress. What would feel most nourishing right now?"
      context = "Weekend energy is different - honor what you need."
      primaryStep = "Choose one thing that would feel nourishing or fulfilling for you right now."
      smallerStep = "Take three deep breaths and check in with what your body and mind need."
    }

    return NextResponse.json({
      spark: {
        insight,
        context,
        source: "Unthinking wisdom",
        date: "Today",
      },
      steps: {
        primary: primaryStep,
        smaller: smallerStep,
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
