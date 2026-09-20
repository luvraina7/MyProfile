# System Architecture & Agent Guidelines

This document serves as the technical blueprint and development guide for human developers and autonomous AI agents working in this repository.

---

## 1. Project Overview & Philosophy

**career-timeline-portfolio** is a high-performance, responsive, bilingual (English & Japanese) interactive career timeline and portfolio web application. 

### Core Tenets:
1. **Agent-Friendly Modularity:** Clean separation between presentation (`src/components`), content/data (`src/data`), domain types (`src/types`), and business hooks (`src/hooks`).
2. **First-Class Aesthetics:** Cyber/glassmorphic design with dark/light themes, subtle glow accents, fluid micro-interactions, and accessible typography.
3. **Dual Consumption:** Served as an interactive web UI as well as a programmatic API (`/api/v1/career`) documented via OpenAPI (`/api/v1/openapi.json`) with an embedded developer drawer (`ApiDrawer.tsx`).

---

## 2. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React Server Components by default; `'use client'` for interactive sections |
| **UI Library** | React 19 | Standard React 19 hooks and event model |
| **Language** | TypeScript 5 | Strict typing enabled (`tsconfig.json`) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) | CSS-variable backed theme system (`src/app/globals.css`) |
| **Icons** | Lucide React (`lucide-react`) | Consistent iconography across buttons, badges, and metrics |
| **Runtime / Dev** | Node.js 20+ / Next Dev | Continuous dev server with Hot Module Replacement |

---

## 3. Directory Layout & Roles

```
.
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── api/v1/             # Public REST API endpoints
│   │   │   ├── career/         # GET /api/v1/career (locale query param)
│   │   │   └── openapi.json/   # OpenAPI specification endpoint
│   │   ├── globals.css         # Tailwind v4 import, design tokens & theme variables
│   │   ├── layout.tsx          # Root HTML layout, font setup, theme initializer
│   │   └── page.tsx            # Main single-page interactive container
│   ├── components/             # Reusable UI presentation & container components
│   │   ├── Navbar.tsx          # Sticky glassmorphic navbar with theme & locale toggles
│   │   ├── Hero.tsx            # Impact metrics overview, headline, CTAs
│   │   ├── TimelineSection.tsx # Interactive timeline with category & tech filters
│   │   ├── TimelineItem.tsx    # Single milestone card with expandable details
│   │   ├── AgenticShowcase.tsx # AI & Agentic engineering capabilities showcase
│   │   ├── ProjectsSection.tsx # Featured project grid with tech badges
│   │   ├── SkillsSection.tsx   # Skill matrix grouped by proficiency & category
│   │   ├── ApiDrawer.tsx       # Live interactive API inspector drawer
│   │   ├── Modals...           # RuleModal, SkillModal, WebpModal, etc.
│   │   └── Footer.tsx          # Footer with social links and metadata
│   ├── data/                   # Content stores (source of truth for portfolio data)
│   │   ├── career.en.ts        # English profile, milestones, and skills
│   │   ├── career.ja.ts        # Japanese profile, milestones, and skills
│   │   └── index.ts            # Data accessor functions (getCareerData, getAllTechStacks)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useInView.ts        # IntersectionObserver hook for scroll animations
│   │   ├── useCountUp.ts       # Animated number counter for metrics
│   │   └── useScrollSpy.ts     # Active section tracking for navbar highlighting
│   └── types/
│       └── career.ts           # Central TypeScript interfaces (ProfileData, CareerMilestone, etc.)
├── public/                     # Static public assets (images, badges, icons)
├── AGENTS.md                   # Agent conventions & runtime directives
├── ARCHITECTURE.md             # This document
└── package.json                # Project dependencies and npm scripts
```

---

## 4. Data Flow & Content Management

1. **Source of Truth:**
   All portfolio content resides in `src/data/career.en.ts` and `src/data/career.ja.ts`.
2. **Schema Contract (`src/types/career.ts`):**
   - `ProfileData`: Top-level user details, bio, metrics, socials, education, skills, timeline.
   - `CareerMilestone`: Individual career roles with dates, category, tech stack, summary, highlights, and child projects.
   - `Locale`: `'en' | 'ja'`.
3. **Synchronized Updates:**
   When adding or modifying an experience, project, or skill, **both `career.en.ts` and `career.ja.ts` must be updated** to maintain parity.
4. **API Parity:**
   The route `src/app/api/v1/career/route.ts` imports from `@/data` directly, ensuring the web interface and REST API never drift.

---

## 5. Design System & Styling Conventions

### Theme Tokens (`globals.css`)
Themes are toggled via `document.documentElement.setAttribute('data-theme', 'light' | 'dark')`. 

Always use the defined semantic CSS variables instead of hardcoded hex values:
* **Backgrounds:** `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-card)`, `var(--bg-card-hover)`, `var(--bg-glass)`
* **Borders:** `var(--border-subtle)`, `var(--border-accent)`, `var(--border-glow)`
* **Text:** `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`, `var(--text-accent)`
* **Accents:** `var(--accent-cyan)`, `var(--accent-indigo)`, `var(--accent-emerald)`, `var(--accent-amber)`, `var(--accent-rose)`

### Component Styling Patterns
* Prefer Tailwind utility classes combined with existing CSS variables (`border-[var(--border-subtle)]`, `bg-[var(--bg-card)]`).
* Reusable utility classes defined in `globals.css`:
  * `.glass-panel`: Translucent blurred background with subtle border.
  * `.grid-pattern`: Ambient background grid.
  * `.timeline-connector`: Glowing gradient connector line.

---

## 6. Development Rules for AI Agents

When implementing features or bug fixes in this repository, follow these invariants:

1. **Preserve Bilingual Parity:**
   Never add hardcoded English strings to components if they represent portfolio data. Feed them through `src/data/career.*.ts` or accept a `locale: Locale` prop.
2. **Next.js 16 Conventions:**
   - Add `'use client'` at the top of components that use React hooks (`useState`, `useEffect`, `useRef`), event listeners, or browser APIs.
   - Do NOT use deprecated Next.js lifecycle methods or legacy router imports (use `next/navigation` if routing is needed).
3. **Maintain Accessibility:**
   - Modals and drawers (`ApiDrawer`, `SkillModal`) must support dismissal via `Escape` key and backdrop clicks.
   - Ensure interactive icons have meaningful `aria-label`s or descriptive tooltips.
4. **Verification Checklist:**
   Before declaring any task complete, agents must run the following checks:
   ```bash
   # 1. Type check
   npx tsc --noEmit

   # 2. Linter check
   npm run lint

   # 3. Production build verification
   npm run build
   ```
