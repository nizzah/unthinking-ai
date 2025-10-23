Thought for 5s### Unthinking App - Project Documentation for Cursor Agent

## Project Overview

**Unthinking** is a Meaning-Tech application designed to help accomplished professionals break through moments of mental stuckness. It transforms overthinking into gentle action through a guided flow: Spark → Pause → Step → Relief.

**Core Promise:** Trust yourself again. One spark of clarity, one small step of courage, one moment of meaning.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion (planned, not yet implemented)
- **State Management:** React hooks (useState, useEffect)


## Design System

### Color Palette

- **Primary (Deep Space Blue):** `#052135` - Used for backgrounds and primary text
- **Accent (Warm Coral):** `#FF591F` - Used for CTAs and interactive elements
- **Neutrals:** Stone color scale (50-950) for secondary text and borders


### Typography

- **Font Family:** Geist (sans-serif) and Geist Mono (monospace)
- **Weights:** Light (300) for body, Medium (500) for emphasis, Semibold (600) for headings
- **Line Height:** Relaxed (1.625) for readability


### Design Tokens (in `app/globals.css`)

```css
--color-primary: #052135
--color-accent: #FF591F
--color-background: #052135
--color-foreground: #f5f5f4
--color-muted: #78716c
--color-muted-foreground: #a8a29e
--color-card: #0a2d45
--color-card-foreground: #f5f5f4
--color-border: #1c4966
--radius: 0.75rem
```

### CTA Button Styling

All primary CTA buttons use:

- Background: `bg-[#FF591F]` (Warm Coral)
- Text: `text-[#052135]` (Deep Space Blue)
- Shape: `rounded-full` (pill-shaped)
- Padding: `px-8 py-4`
- Font: `font-medium`


## Project Structure

```plaintext
app/
├── page.tsx                 # Homepage with hero and CTA
├── flow/
│   ├── page.tsx            # Main flow container (orchestrates all phases)
│   └── loading.tsx         # Loading state
├── api/
│   ├── spark/route.ts      # API endpoint to fetch sparks (mock data)
│   └── relief/route.ts     # API endpoint to save relief data (mock)
├── layout.tsx              # Root layout with fonts
└── globals.css             # Global styles and design tokens

components/flow/
├── mind-dump-screen.tsx              # Phase 1: Free-form text capture
├── breathing-transition-screen.tsx   # Phase 2: 3 breath cycles (BUGGY)
├── spark-screen.tsx                  # Phase 3: Show insight from notes
├── pause-screen.tsx                  # Phase 4: Grounding moment
├── step-screen.tsx                   # Phase 5: Choose action (2 cards)
├── timer-screen.tsx                  # Phase 6: Timed action with check-ins
├── reflection-screen.tsx             # Phase 7: Felt-lighter slider
├── celebrate-screen.tsx              # Phase 8: Celebration with confetti
└── direction-streak-footer.tsx       # Persistent streak indicator
```

## User Flow Phases

### Phase 1: Mind Dump Screen

**File:** `components/flow/mind-dump-screen.tsx`

**Purpose:** Capture user's current thoughts/feelings before showing them a spark

**Features:**

- Free-form textarea for writing
- Emotion tags (Stuck, Overwhelmed, Restless, Uncertain, Tired)
- 2-minute timer (optional, can skip)
- Primary CTA: "I'm ready" (coral button)


**State Management:**

- `mindDump` (string): User's written text
- `selectedEmotions` (string[]): Selected emotion tags
- `timeLeft` (number): Countdown timer


### Phase 2: Breathing Transition Screen ️ **CURRENTLY BUGGY**

**File:** `components/flow/breathing-transition-screen.tsx`

**Purpose:** Calm the user with 3 guided breath cycles before showing spark

**Intended Behavior:**

- Circle expands for 3 seconds → "Breathe in"
- Circle contracts for 3 seconds → "Breathe out"
- Repeat 3 times (18 seconds total)
- Auto-advance to spark screen


**Current Issues:**

1. Circle is not expanding/contracting properly
2. Text stays on "Breathe in" and doesn't change to "Breathe out"
3. Animation cycle is broken due to useEffect dependency issues


**Technical Problem:**
The `useEffect` has `breathCount` in its dependency array, causing it to re-run and reset the phase every time `breathCount` increments. This interrupts the breathing cycle.

**Debug Logs Added:**

- `console.log("[v0] Starting breath cycle...")` on mount
- `console.log("[v0] Breath phase:", phase)` on phase change
- `console.log("[v0] Breath count:", breathCount)` on count increment


**Suggested Fix:**
Remove `breathCount` from useEffect dependencies and manage the cycle with a single interval that tracks elapsed time, or use a state machine approach with proper cleanup.

### Phase 3: Spark Screen

**File:** `components/flow/spark-screen.tsx`

**Purpose:** Show user a meaningful insight from their own notes

**Features:**

- Display spark text (insight)
- "Why you're seeing this" context
- Source attribution (e.g., "From your note on Jan 15")
- View source button (expands to show full note)
- Primary CTA: "Continue" (coral button)


**Data Structure:**

```typescript
{
  text: string,
  context: string,
  source: string,
  fullSource?: string
}
```

### Phase 4: Pause Screen

**File:** `components/flow/pause-screen.tsx`

**Purpose:** Brief grounding moment before action

**Features:**

- Simple breathing circle (static or gentle pulse)
- Text: "Take a moment"
- Auto-advances after 5 seconds or user can skip
- Primary CTA: "I'm grounded" (coral button)


### Phase 5: Step Screen

**File:** `components/flow/step-screen.tsx`

**Purpose:** Present two action options (primary step and smaller step)

**Features:**

- Two cards side-by-side (desktop) or stacked (mobile)
- Each card shows:

- Step title
- Step description
- Estimated time (2-5 min)
- Two CTAs per card:

- Primary: "Start this" (coral button)
- Secondary: "Guide me through this" (text link)








**Data Structure:**

```typescript
{
  primaryStep: { title, description, duration },
  smallerStep: { title, description, duration }
}
```

### Phase 6: Timer Screen

**File:** `components/flow/timer-screen.tsx`

**Purpose:** Guide user through timed action with midpoint check-in

**Features:**

- Circular progress indicator
- Countdown timer
- Midpoint check-in: "Still with it?" with Yes/No options
- Primary CTA: "I'm done" (coral button)
- Secondary: "Need more time" (text link)


**State Management:**

- `timeLeft` (number): Remaining seconds
- `isPaused` (boolean): Timer pause state
- `showCheckIn` (boolean): Midpoint check-in visibility


### Phase 7: Reflection Screen

**File:** `components/flow/reflection-screen.tsx`

**Purpose:** Capture emotional relief and optional reflection

**Features:**

- "How do you feel?" prompt
- Felt-lighter slider (0-100)
- Optional text input: "What did you notice?"
- Primary CTA: "Continue" (coral button)


**Data Saved:**

- Relief score (number)
- Reflection text (string, optional)


### Phase 8: Celebrate Screen

**File:** `components/flow/celebrate-screen.tsx`

**Purpose:** Celebrate completion with gentle encouragement

**Features:**

- Confetti animation (subtle)
- Success message
- Streak update
- Primary CTA: "Done" (coral button) → Returns to homepage


### Persistent Component: Direction Streak Footer

**File:** `components/flow/direction-streak-footer.tsx`

**Purpose:** Show current streak across all flow screens

**Features:**

- Displays current streak count
- Minimal, non-intrusive design
- Positioned at bottom of screen


## API Endpoints

### GET `/api/spark`

**Purpose:** Fetch a spark (insight) from user's notes

**Current Implementation:** Mock data
**Intended Integration:** Vect vector database query

**Response:**

```typescript
{
  text: string,
  context: string,
  source: string,
  fullSource?: string
}
```

### POST `/api/relief`

**Purpose:** Save user's relief score and reflection

**Current Implementation:** Mock (logs to console)
**Intended Integration:** Database storage

**Request Body:**

```typescript
{
  reliefScore: number,
  reflection?: string,
  timestamp: string
}
```

## Environment Variables

The project has access to these environment variables (already configured):

- `VECT_BASE_URL` - Vect vector database URL
- `VECT_API_KEY` - Vect API key
- `UNTHINKING_INDEX` - Vect index name
- `MODEL_NAME` - AI model name
- `OPENAI_API_KEY` - OpenAI API key
- `VECTORIZE_ACCESS_TOKEN` - Vectorize access token
- `VECTORIZE_ORG_ID` - Vectorize organization ID
- `VECTORIZE_PIPELINE_ID` - Vectorize pipeline ID
- `NOTION_MCP_TOKEN` - Notion integration token
- `NOTION_MCP_SERVER_CMD` - Notion server command


## Current Issues & Bugs

### Critical: Breathing Animation Broken

**Location:** `components/flow/breathing-transition-screen.tsx`

**Problem:** Circle doesn't expand/contract, text doesn't alternate between "Breathe in" and "Breathe out"

**Root Cause:** useEffect dependency array includes `breathCount`, causing effect to re-run and reset phase mid-cycle

**Solution Needed:** Refactor to use single interval with elapsed time tracking, or implement proper state machine

### Minor: Mock Data

**Location:** `app/api/spark/route.ts` and `app/api/relief/route.ts`

**Problem:** Using hardcoded mock data instead of real database queries

**Solution Needed:** Integrate with Vect vector database for spark retrieval and implement proper data persistence

## Next Steps / Missing Features

1. **Fix breathing animation** (highest priority)
2. **Integrate Vect vector database** for real spark retrieval
3. **Add data persistence** for user sessions, relief tracking, and streaks
4. **Implement Notion sync** for note ingestion
5. **Add user authentication** (if multi-user)
6. **Implement streak logic** with proper storage
7. **Add Framer Motion** for smoother transitions between phases
8. **Mobile optimization** - test and refine responsive behavior
9. **Accessibility audit** - keyboard navigation, screen readers, ARIA labels
10. **Add sound effects** (optional breath sound, celebration sound)


## Key Design Principles

1. **One thing at a time** - Never show multiple actions simultaneously
2. **Whitespace as design** - Generous spacing, minimal UI
3. **No gamification** - Streaks for self-trust, not competition
4. **Escape hatches** - Always allow skip/exit without shame
5. **Felt sense** - Use emotional language ("lighter," "stuck," "relief")
6. **Calm over productivity** - No timers that create pressure
7. **Trust over control** - User-paced advancement (except auto-transitions)


## Code Patterns

### State Management

Uses React hooks (useState, useEffect) for local component state. No global state management library currently implemented.

### Styling Approach

- Tailwind utility classes for all styling
- Design tokens defined in globals.css
- No CSS modules or styled-components
- Responsive: mobile-first with `md:` and `lg:` breakpoints


### Component Structure

- Each phase is a separate component
- Main flow container (`app/flow/page.tsx`) orchestrates phase transitions
- Props passed down for callbacks (onNext, onComplete, etc.)


### Animation Pattern

- CSS transitions for simple animations
- Inline styles for dynamic values (transform, scale)
- Framer Motion planned but not yet implemented


## Testing the App

1. **Homepage** (`/`) - Hero with "Start your flow" CTA
2. **Flow** (`/flow`) - Complete user journey through all 8 phases
3. **Known Issue** - Breathing screen (phase 2) will not animate correctly


## Debug Mode

Debug logs are currently active in `breathing-transition-screen.tsx` with `[v0]` prefix. Check browser console for execution flow.

---

**Last Updated:** Current session
**Status:** In development, breathing animation needs fix before production-ready