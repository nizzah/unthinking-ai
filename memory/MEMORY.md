# Spark Prototype — Session Memory

## Project Context
- **Repo:** /Users/Nirish/Documents/GitHub/spark-prototype
- **Branch:** spark-v0.2
- **Purpose:** Usability testing prototype for Spark v2.0 (Meaning-Tech app)
- **PRD:** `Product Requirement Document v2.1.md` (March 2026) — source of truth
- **Key distinction:** v2.1 PRD is a different design direction from v1.0 (the existing codebase). v1 was "Unthinking" with an 8-phase flow. v2 is "Spark" with onboarding, source connection, constellation home, and Courage Ladder.

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS v3.4, Framer Motion, shadcn/ui
- Fonts: Manrope (--font-heading) + Spectral (--font-body) added in layout.tsx; Geist still present for legacy flow screens
- AI: OpenAI GPT-4o-mini via direct API (NOT AI Gateway — no Vercel link set up)
- Data: Vectorize + Notion MCP for spark generation

## Design System (PRD-spec)
- Deep Space Blue `#052135` — primary background (all screens)
- Warm Sand `#F5F0E6` — light "arrival" screens only
- Warm Coral `#FF591F` — all primary CTAs (use `bg-[#FF591F]` directly, NOT coral-600)
- Lush Growth Green `#47CF9C` — earth curvature only
- Warm Yellow Sun `#FFB900` — illustration accent only
- Headlines: Manrope 700 (`font-heading`)
- Body/insight copy: Spectral 400/600 (`font-body`) — use Spectral italic for display quotes too; **never use Playfair Display**
- Cards: `#0a2d45` bg, `1px #1c4966` border

## Scoped Build Plan (4 steps for usability test)
1. ✅ **DONE** — Redesign `app/page.tsx` as new landing screen (PRD Screen 1)
2. ⏳ **PENDING** — Add "Does this feel true?" confirmation to `spark-screen.tsx`
3. ⏳ **PENDING** — Build `components/flow/courage-ladder-screen.tsx` (simple vertical list, no SVG figure)
4. ⏳ **PENDING** — Wire courage-ladder into `app/flow/page.tsx` after spark confirmation

**Skipped (not needed for usability test):** auth, onboarding route group, source connection, constellation home, bottom nav, /api/ladder endpoint (mock steps from spark API response instead).

## What Was Changed in This Session
- `app/layout.tsx` — added Manrope + Spectral fonts, updated title to "Spark"
- `tailwind.config.js` — added `font-heading` and `font-body` families
- `app/globals.css` — fixed `.starry-night` gradient to use `#052135`
- `app/page.tsx` — complete redesign: pagination dots, logo, inline SVG illustration (coral star + white figure), Manrope headline, Spectral sub-line, coral CTA, sound toggle

## Key Files
- `app/page.tsx` — landing screen (redesigned ✅)
- `app/flow/page.tsx` — flow orchestrator (8-phase, needs steps 3-4 wired in)
- `components/flow/spark-screen.tsx` — needs "Does this feel true?" (step 2)
- `app/api/spark/route.ts` — POST endpoint, mind-dump-driven spark generation
- `lib/mcp/client/notion-client.ts` — Notion integration

## Tomorrow
User will upload full user flow diagrams and inspiration images before continuing steps 2-4. Wait for those before building further.
