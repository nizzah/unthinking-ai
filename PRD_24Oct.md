# Product Requirements Document (PRD)
## Spark - A Meaning-Tech Application

**Version:** 1.0  
**Date:** October 24, 2025  
**Product:** Spark (formerly Unthinking)  
**Category:** Meaning-Tech / Personal Development  

---

## Executive Summary

Spark is a Meaning-Tech application designed to help accomplished professionals break through moments of mental stuckness and transform overthinking into gentle action. Unlike traditional productivity tools that focus on efficiency, Spark prioritizes meaning, self-trust restoration, and gentle progress through personalized insights and guided micro-actions.

**Core Promise:** Trust yourself again. One spark of clarity, one small step of courage, one moment of meaning.

---

## Product Vision & Mission

### Vision
To become the leading Meaning-Tech platform that helps high-achievers reconnect with their authentic selves and take meaningful action without burning out.

### Mission
Transform moments of mental stuckness into gentle, self-led movement by surfacing personalized insights from users' own wisdom and guiding them through micro-actions that restore self-trust.

### Core Philosophy
- **Meaning over productivity:** Focus on alignment and purpose rather than efficiency
- **Gentle action over overwhelming transformation:** Small, sustainable steps
- **Self-trust restoration:** Reconnecting users with their own wisdom and intuition
- **Calm design:** Minimal, humane, non-addictive interface

---

## Target Audience

### Primary Persona: "The Awakening Achiever"

**Demographics:**
- Mid-career professionals and creatives (ages 28-45)
- Successful outside, stuck inside
- Annual income: $75K-$200K+
- Urban/suburban, tech-savvy

**Psychographics:**
- Outwardly confident but inwardly restless
- Main conflict: "I've built the life I was supposed to—but it no longer feels like mine"
- Avoidance loop: overthink → over-research → paralysis → busyness
- Desire: To feel alive, courageous, and creative again without blowing everything up

**Pain Points:**
- Overthinking and analysis paralysis
- Decision fatigue and information overload
- Creative fear and perfectionism
- Emotional exhaustion despite external success
- Loss of self-trust and authentic direction

**Goals:**
- Break through mental stuckness
- Take meaningful action without overwhelming pressure
- Reconnect with personal wisdom and intuition
- Build sustainable habits of gentle progress

---

## Product Overview

### What Spark Does
Spark transforms scattered thoughts and overthinking into personalized insights and actionable micro-steps through an 8-phase guided flow:

1. **Mind Dump** - Users express current thoughts/emotions
2. **Breathing Transition** - Guided breathing to center and prepare
3. **Spark Generation** - AI-powered personalized insight from user's notes/reflections
4. **Pause** - Brief grounding moment before action
5. **Step Selection** - Choose between primary or smaller action (2-15 minutes)
6. **Timer** - Focused execution with optional midpoint check-in
7. **Reflection** - Capture how the experience felt
8. **Celebration** - Acknowledge progress and choose celebration activity

### Key Differentiators
- **Personalized insights** from user's own notes, readings, and reflections
- **Time-aware personalization** based on time of day and day of week
- **Hybrid AI system** combining Vectorize, Notion MCP, and OpenAI
- **Calm, non-addictive design** with generous whitespace and gentle animations
- **Meaning-focused** rather than productivity-focused approach

---

## Technical Architecture

### Technology Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v3.4.0, shadcn/ui components
- **Animations:** Framer Motion
- **AI Integration:** OpenAI GPT-4o-mini, AI SDK 5
- **Vector Search:** Vectorize
- **Note Integration:** Notion MCP (Model Context Protocol)
- **State Management:** React hooks (useState, useEffect)
- **Deployment:** Vercel

### Data Sources & Integration
1. **Vectorize:** Past reflections and session data
2. **Notion MCP:** Recent notes, journal entries, and learning materials
3. **Local Storage:** Session data, streak tracking, user preferences
4. **OpenAI:** Spark generation and step creation

### API Architecture
- **Spark Generation API** (`/api/spark`): Hybrid system combining multiple data sources
- **Relief API** (`/api/relief`): Session completion and data storage
- **Celebrate API** (`/api/celebrate`): Celebration activity management
- **Agent APIs**: Various specialized AI agents for different functions

---

## Core Features & Functionality

### 1. Mind Dump Phase
**Purpose:** Capture current mental state and emotions
- **Text input:** Free-form writing area (300px minimum height)
- **Emotion tags:** Pre-defined emotional states (Stuck, Overwhelmed, Restless, Uncertain, Tired)
- **Optional timer:** 2-minute guided writing session
- **Skip option:** Can proceed without writing

**User Experience:**
- Clean, distraction-free interface
- Gentle placeholder text: "Start typing..."
- Emotion buttons for quick selection
- "Find my spark" CTA when ready

### 2. Breathing Transition Phase
**Purpose:** Center the user and prepare for insight
- **Guided breathing:** 3 cycles (18 seconds total)
- **Visual animation:** Expanding/contracting circle
- **Background processing:** Spark generation happens during breathing
- **Auto-advance:** Proceeds when spark is ready

**User Experience:**
- Smooth Framer Motion animations
- Non-blocking spark generation
- Calm, meditative atmosphere

### 3. Spark Generation System
**Purpose:** Deliver personalized insights from user's own wisdom

**Data Sources (Priority Order):**
1. **Learning materials** (books, articles, podcasts) from Notion
2. **Past reflections** from Vectorize
3. **Recent journal entries** from Notion
4. **Context-aware search** based on mind dump themes

**Personalization Factors:**
- **Time context:** Early morning, morning, lunch, afternoon, evening, night
- **Day context:** Monday, Friday, weekday, weekend
- **Emotional state:** From mind dump and emotion tags
- **Historical patterns:** From past reflections

**Output Format:**
- **Insight:** One-sentence actionable insight
- **Context:** Why this insight is relevant now
- **Source:** Specific attribution (book titles, themes, dates)
- **Date:** Timeframe reference

### 4. Step Selection Phase
**Purpose:** Choose appropriate action based on current capacity
- **Two options:** Primary step (more substantial) and smaller step (lighter)
- **Duration selection:** 2, 5, or 15 minutes
- **Side-by-side cards** (desktop) or stacked (mobile)
- **Skip option:** Can request different spark

**User Experience:**
- Clear step descriptions
- Duration badges
- Visual hierarchy emphasizing choice
- Gentle pressure, no guilt for choosing smaller option

### 5. Timer Phase
**Purpose:** Focused execution of chosen action
- **Circular progress indicator:** Visual countdown
- **Step reminder:** Displays chosen action
- **Midpoint check-in:** Optional "How are you feeling?" at halfway point
- **Time addition:** +1 min and +5 min buttons
- **Mobile-optimized:** Responsive sizing

**User Experience:**
- Calm, non-pressured timer
- Optional midpoint reflection
- Flexible time management
- Clear completion state

### 6. Reflection Phase
**Purpose:** Capture the experience and emotional impact
- **"Felt-lighter" slider:** 1-5 scale with emoji indicators
- **Optional reflection:** Free-form text area
- **Emotion-based UI:** Visual feedback based on feeling level
- **Gentle completion:** No pressure to write extensively

**User Experience:**
- Intuitive slider with visual feedback
- Optional text input
- Emotion-based color coding
- Celebration preparation

### 7. Celebration Phase
**Purpose:** Acknowledge progress and reinforce positive behavior
- **Confetti animation:** Framer Motion celebration
- **Activity options:** Various celebration activities
- **Streak display:** Shows progress over time
- **Optional celebration timer:** Extended celebration period

**User Experience:**
- Joyful, rewarding interface
- Multiple celebration options
- Progress visualization
- Positive reinforcement

### 8. Data Storage & Learning
**Purpose:** Improve future spark generation and track progress
- **Session data:** Mind dump, selected step, duration, feeling, reflection
- **Streak tracking:** Local storage of session history
- **Pattern recognition:** AI learns from user preferences
- **Privacy-first:** Data stays on device when possible

---

## Design System

### Visual Identity
**Color Palette:**
- **Primary (Deep Space Blue):** `#052135` - Backgrounds and primary text
- **Accent (Warm Coral):** `#FF591F` - CTAs and interactive elements
- **Neutrals:** Stone color scale (50-950) for secondary text and borders
- **Background:** Custom starry night gradient with painted hills and sun

**Typography:**
- **Font Family:** Geist (sans-serif) and Geist Mono (monospace)
- **Weights:** Light (300) for body, Medium (500) for emphasis, Semibold (600) for headings
- **Line Height:** Relaxed (1.625) for readability

**Design Tokens:**
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

### Design Principles
1. **One thing at a time:** Never show multiple actions simultaneously
2. **Whitespace as design:** Generous spacing, minimal UI
3. **No gamification:** Streaks for self-trust, not competition
4. **Escape hatches:** Always allow skip/exit without shame
5. **Felt sense:** Use emotional language ("lighter," "stuck," "relief")
6. **Calm over productivity:** No timers that create pressure
7. **Trust over control:** User-paced advancement

### Component Library
- **Buttons:** Pill-shaped CTAs with coral accent color
- **Cards:** Rounded corners with subtle borders
- **Inputs:** Clean, accessible form elements
- **Animations:** Smooth transitions with Framer Motion
- **Typography:** Balanced, readable text hierarchy

---

## User Experience Flow

### Entry Points
1. **"Begin mind-dump"** - Start with emotional expression
2. **"Find me a spark"** - Skip directly to insight generation

### Complete User Journey
```
Homepage → Entry Point → Mind Dump (optional) → Breathing → Spark → Pause → Step Selection → Timer → Reflection → Celebration → Homepage
```

### Key UX Principles
- **Progressive disclosure:** One phase at a time
- **Gentle guidance:** No pressure or guilt
- **Personalization:** Context-aware insights
- **Accessibility:** Screen reader support, keyboard navigation
- **Mobile-first:** Responsive design for all devices

---

## Success Metrics

### Primary KPIs
- **Session completion rate:** % of users who complete full flow
- **Return usage:** Users who return within 7 days
- **Feeling improvement:** Average "felt-lighter" score
- **Step completion:** % of users who complete chosen action

### Secondary Metrics
- **Time to insight:** Speed of spark generation
- **Source relevance:** User engagement with source attribution
- **Celebration engagement:** Participation in celebration activities
- **Streak maintenance:** Long-term usage patterns

### User Satisfaction
- **Net Promoter Score (NPS):** Likelihood to recommend
- **User feedback:** Qualitative insights from reflections
- **Retention rates:** 7-day, 30-day, 90-day retention
- **Feature usage:** Most/least used phases

---

## Competitive Analysis

### Direct Competitors
- **Headspace:** Meditation and mindfulness
- **Calm:** Sleep and meditation
- **Day One:** Journaling and reflection

### Indirect Competitors
- **Notion:** Note-taking and organization
- **Todoist:** Task management
- **Habitica:** Gamified habit tracking

### Competitive Advantages
1. **Personalized insights** from user's own data
2. **Meaning-focused** rather than productivity-focused
3. **Gentle action** rather than overwhelming transformation
4. **Time-aware personalization**
5. **Non-addictive design** philosophy

---

## Technical Requirements

### Performance
- **Page load time:** < 2 seconds
- **Spark generation:** < 5 seconds
- **Animation smoothness:** 60fps transitions
- **Mobile responsiveness:** All screen sizes

### Security & Privacy
- **Data encryption:** All user data encrypted
- **Local storage:** Sensitive data stays on device
- **API security:** Secure authentication and authorization
- **GDPR compliance:** User data control and deletion

### Scalability
- **Concurrent users:** Support 10,000+ simultaneous users
- **API rate limits:** Graceful handling of service limits
- **Database performance:** Optimized queries and indexing
- **CDN integration:** Global content delivery

### Browser Support
- **Modern browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile browsers:** iOS Safari, Chrome Mobile
- **Accessibility:** WCAG 2.1 AA compliance

---

## Future Roadmap

### Phase 1 (Current - Q4 2025)
- ✅ Complete 8-phase flow implementation
- ✅ Hybrid AI system with Vectorize + Notion MCP
- ✅ Responsive design and animations
- ✅ Basic streak tracking

### Phase 2 (Q1 2026)
- **User Authentication:** Multi-user support with proper data isolation
- **Database Integration:** PostgreSQL/MongoDB for production data storage
- **Advanced Personalization:** Machine learning for better spark generation
- **Export Functionality:** Session data export for user portability

### Phase 3 (Q2 2026)
- **Analytics Dashboard:** Usage insights and user behavior tracking
- **Custom Sound Uploads:** Personal audio for breathing and celebration
- **Social Features:** Optional sharing and community features
- **Mobile App:** Native iOS and Android applications

### Phase 4 (Q3-Q4 2026)
- **AI Coaching:** Advanced AI-powered personal coaching
- **Integration Ecosystem:** Connect with other productivity and wellness tools
- **Enterprise Features:** Team and organization support
- **Advanced Analytics:** Predictive insights and recommendations

---

## Risk Assessment

### Technical Risks
- **AI Service Dependencies:** Reliance on OpenAI, Vectorize, Notion APIs
- **Data Privacy:** User data handling and storage
- **Performance:** Real-time AI processing requirements
- **Scalability:** Growing user base and data volume

### Business Risks
- **Market Competition:** Established players in wellness/meditation space
- **User Adoption:** Niche target audience
- **Monetization:** Free vs. paid feature balance
- **Retention:** Ensuring long-term user engagement

### Mitigation Strategies
- **Fallback Systems:** Graceful degradation when services unavailable
- **Privacy-First Design:** Minimal data collection, local storage
- **Performance Optimization:** Caching, CDN, efficient algorithms
- **User Research:** Continuous feedback and iteration

---

## Launch Strategy

### Pre-Launch (Current)
- **Beta Testing:** Internal team and select users
- **Performance Optimization:** Load testing and optimization
- **Content Creation:** Documentation and user guides
- **Marketing Preparation:** Brand assets and messaging

### Launch (Q4 2025)
- **Soft Launch:** Limited user base for feedback
- **Content Marketing:** Blog posts, social media, thought leadership
- **Community Building:** Early adopter program
- **Feedback Collection:** User interviews and surveys

### Post-Launch (Q1 2026)
- **Feature Iteration:** Based on user feedback
- **Scale Marketing:** Paid advertising and partnerships
- **Community Growth:** User-generated content and testimonials
- **Product Expansion:** Additional features and integrations

---

## Conclusion

Spark represents a new category of Meaning-Tech applications that prioritize personal alignment and gentle progress over traditional productivity metrics. By combining personalized AI insights with a calm, non-addictive user experience, Spark addresses the unique needs of high-achieving professionals who feel stuck despite external success.

The product's success will be measured not by traditional engagement metrics, but by its ability to help users reconnect with their authentic selves and take meaningful action. With its strong technical foundation, thoughtful design philosophy, and clear roadmap for growth, Spark is positioned to become the leading platform for meaning-driven personal development.

---

**Document Status:** Draft v1.0  
**Last Updated:** October 24, 2025  
**Next Review:** November 1, 2025  
**Stakeholders:** Product Team, Engineering Team, Design Team, Marketing Team
