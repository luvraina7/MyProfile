# Leftover: recruiter-audit product follow-ups

**Date:** 2026-08-25
**Repo:** `/Users/raina-lu/MyProfile`
**Live site:** `https://my-profile-coral-ten.vercel.app/`
**Parent audit:** `.cursor/projects/Users-raina-lu-MyProfile/canvases/portfolio-recruiter-audit.canvas.tsx`
**Parent theme plan:** `.cursor/plans/theme-tokenization-a11y_069b2e3e.plan.md`
**Status:** theme tokenization, a11y, credibility, and no-flash theme init are done. This file is only the **product** work that was out of scope for that pass.

This is the implement-later spec. A later session should follow it section by section and **not** re-open theme-init.

---

## How to use this file

Suggested waves (each can be its own PR):

| Wave | Leftovers | Why this grouping |
|------|-----------|-------------------|
| 1 — Hire path | 1, 2, 7 | Recruiters never see Resume; ATS want PDF; timeline is too long to scan |
| 2 — Proof | 3 | Needs a real photo and (ideally) a case screenshot from you |
| 3 — Architecture | 4, 6 | RSC split + API cache; do not mix with CTA layout |
| 4 — Safety net | 5 | `error.tsx` + Playwright smoke + CI |

Do **not** implement all seven in one PR. Wave 2 is blocked on assets you must supply (photo, PDFs, optional screenshot). Copy decisions in leftover 2 (`#contact` “what I’m looking for” / work authorization) also need your wording — do not invent visa status.

---

## Already done (do not redo)

Theme / a11y / credibility (from `leftover-theme-persistence.md` plus the theme-init follow-up):

- `src/app/globals.css` — semantic tokens, `.text-gradient-accent`, base `.status-pill`, `:focus-visible` on `a, button, [role='button'], summary`, `scroll-margin-top: 6rem` on `#hero #timeline #agentic #projects #skills`, theme-scoped `color-scheme`, collapsed duplicate light-theme CSS
- `src/components/ThemeInit.tsx` — blocking head script via `useServerInsertedHTML` (not `next/script beforeInteractive`; that only queued at start of `<body>` on Next 16)
- `src/app/layout.tsx` — no `className="dark"`; `suppressHydrationWarning` on `<html>`; `<ThemeInit />` first in `<body>`
- `Navbar.tsx` — tokenized header; SSR-safe `useState('dark')` + first-effect **read** of `data-theme` (do not restore a `document`-reading initializer; that hydrates `'dark'` for light users and overwrites `localStorage`)
- `Hero.tsx` — gradient title/metrics; real `mailto:luvraina7@gmail.com`
- `ApiDrawer.tsx` — real `res.status`, locale-synced endpoint, close `aria-label`, no Zod claim
- `Footer.tsx` — email is already `luvraina7@gmail.com` (the original `contact@example.com` bug is fixed)
- `MobileNav.tsx` — Home uses `House`, Timeline uses `Briefcase`
- `public/resumes/` — both `.docx` files are committed. Do not “re-add” them or treat them as missing.

Do **not** revert theme persistence, contrast tokens, or the ThemeInit / Navbar sync pattern.

---

## Current architecture (read this first)

- Next.js **16.3.2** App Router, React **19.2.8**. Read `node_modules/next/dist/docs/` before inventing APIs. Do **not** set `runtime = 'edge'`.
- Homepage is a **client** tree: `src/app/page.tsx` is `'use client'` and imports Navbar, Hero, Timeline, Agentic, Projects, Skills, Footer, ApiDrawer plus `getCareerData()` — so **both** `career.en.ts` and `career.ja.ts` ship to the browser.
- Locale is React state defaulting to `'en'`. `<html lang>` stays `"en"` after a JA toggle (leftover 4 should fix that when the page becomes a Server Component; leftover 1 should not).
- Sticky header is `h-20` (~80px) inside `max-w-6xl`. Sections are `max-w-5xl`.
- Hero action row (Explore / Download Resume / API) sits **below the fold** on 13″ laptops and phones. Resume dropdown exists **only** in `Hero.tsx`. Header has cURL/API, locale, theme, hamburger — **no Resume**.
- Timeline: five IBJ roles; each `TimelineItem` starts with `useState(true)` so Key Deliverables are all open (~6300px of timeline).
- Projects: four icon cards hardcoded in `ProjectsSection.tsx` (not `career.*.ts`). First card is this portfolio (`liveUrl: '#hero'`). Three cards have no GitHub/live links. No screenshots. Tech chips are inert `<span>`s.
- `ProfileData.bio` and `education` exist in data and **never render**.
- API: `GET /api/v1/career` is uncached (`max-age=0`), embeds `timestamp: new Date().toISOString()`, and historically ran in **iad1** while HTML CDN-hits **hnd1**. Drawer auto-fetches on open.
- Tests: `playwright` is in `package.json` but there is no `@playwright/test` script, no specs, no `.github/`, no `src/app/error.tsx` / `not-found.tsx` / `loading.tsx`, no `vercel.json`.

Portfolio rule to honor on leftover 4: RSC at the page; `'use client'` only on interactive leaves (`portfolio-rules.md`).

---

## Leftover 1 — Above-fold Resume CTA / header Resume

**Why:** At 1280×800 / 1024×768 the Hero action row is around y≈805. On 390×844 “Explore Career Journey” starts around y=1262. Recruiters look for Resume + location + title in the first screen.

**Files:**

- `src/components/Hero.tsx` — dropdown lives here only (`RESUME_FILES`, `resumeMenuOpen`)
- `src/components/Navbar.tsx` — controls row has API / locale / theme / hamburger; no Resume
- `src/components/MobileNav.tsx` — no Resume
- Suggested new: `src/lib/resumes.ts` (shared paths/labels) + `src/components/ResumeMenu.tsx` (dropdown UI)

**Current (Hero):**

```tsx
<section id="hero" className="relative pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden">
```

Action row is **after** four metric cards (`mt-12`). Header has no equivalent control.

**Implement:**

1. Extract `RESUME_FILES` + the EN/JA dropdown into `ResumeMenu` so Hero, Navbar, and MobileNav do not duplicate it.
2. Add Resume to the **desktop header** (visible `lg+` without opening the hamburger). Demote header “cURL / API” — keep it in Hero as tertiary, or `hidden lg:flex` → `hidden xl:flex`, or icon-only.
3. Add Resume to **MobileNav** (and optionally a compact header control on small screens). Do not hide hire behind hamburger-only on phones.
4. Make **Download Resume** the primary Hero button (solid gradient). Demote Explore and API (outline / ghost).
5. Cut Hero padding (`pt-16 pb-24 md:pt-28 md:pb-36`) so the action row enters the first viewport on 1280×800 **even if** header Resume ships. Target: Resume visible without scroll at 1280×800 and 390×844.
6. Keep the existing dropdown a11y (`aria-expanded`, `aria-haspopup="menu"`, `role="menu"` / `menuitem`, outside-click close). Keyboard `:focus-visible` must still show `--focus-ring`.

**Do not:** change ThemeInit / Navbar theme sync. Do not add PDF paths here unless leftover 2 lands in the same wave (Wave 1 should include leftover 2 if PDFs are ready; otherwise `.docx` only).

**Accept:**

- 1280×800 and 390×844: a Resume control is visible without scrolling.
- EN and JA `.docx` (and PDF if leftover 2 is in) still download.
- Header does not overflow or wrap badly at 1024×768; hamburger still works below `lg`.

---

## Leftover 2 — PDF resumes + `#contact`

**Why:** Many ATS want PDF. Contact is icon-only (38×38). There is no `#contact` section or nav item. Footer email is already correct.

**Files:**

- `src/lib/resumes.ts` (from leftover 1) — add PDF entries
- `public/resumes/` — add PDFs next to existing `.docx` (do not delete `.docx`)
- New `src/components/ContactSection.tsx`
- `src/app/page.tsx` — render Contact (before Footer)
- `src/components/Navbar.tsx` — `SECTION_IDS` currently `['hero', 'timeline', 'agentic', 'projects', 'skills']`
- `src/components/MobileNav.tsx` — add Contact link
- `src/app/globals.css` — add `#contact` to the `scroll-margin-top: 6rem` list
- `src/data/career.en.ts` / `career.ja.ts` — optional: structured contact copy so EN/JA stay in parity

**Current resume paths (Hero):**

```ts
const RESUME_FILES = {
  en: { path: '/resumes/Luv_Raina_Updated_Resume.docx', label: 'English Resume' },
  ja: { path: '/resumes/職務経歴書.docx', label: '日本語履歴書' },
} as const;
```

**You must supply (blocked without these):**

- English PDF and Japanese PDF. Suggested names: `/resumes/Luv_Raina_Resume.pdf` and `/resumes/職務経歴書.pdf`. Export from the existing Word files; do not generate fake PDFs.
- Contact copy you stand behind:
  - email shown as **text** (`luvraina7@gmail.com`) plus `mailto:`
  - LinkedIn URL (already in data)
  - work authorization / location (“Tokyo / Japan” is already true; do **not** invent visa class)
  - one line: what you are looking for (roles / stack). Align with leftover 3’s positioning line.

**Implement:**

1. Commit the two PDFs under `public/resumes/`. Keep `.docx` as secondary downloads in the same menu (label format: `.pdf EN` / `.docx EN`).
2. Add `<section id="contact">` with heading, email as selectable text, LinkedIn, GitHub, and the positioning / “looking for” line. Match existing `glass-panel` / token classes — no new color system.
3. Nav: add Contact to desktop `navItems` and MobileNav. Include `'contact'` in `useScrollSpy` ids.
4. Hash links must clear the sticky header (`#contact` in the scroll-margin group).

**Do not:** change footer `mailto` back to `contact@example.com`. Do not put secrets in the page.

**Accept:**

- `GET /resumes/*.pdf` and existing `.docx` return 200 on a production-like serve.
- `#contact` is in the nav, keyboard-reachable, and not covered by the sticky header.
- Email is copyable as text, not icon-only.

---

## Leftover 3 — Featured case study + photo

**Why:** `imgCount` is 0. The page reads as a styled CV. Projects remix the timeline: four cards, no screenshots, three with no links. `bio` / `education` never render.

**Files:**

- `src/components/Hero.tsx` — name / title / tagline; no photo
- `src/data/career.en.ts` / `career.ja.ts` — `bio`, `education`, `tagline`, `title` unused for positioning
- `src/components/ProjectsSection.tsx` — hardcoded EN/JA `projects` arrays
- `public/` — photo + optional case screenshot (you supply)

**Audit intent (do not dilute):**

- Small professional **face** in the hero (not a decorative 3D blob).
- One-line positioning, e.g. “Full-stack (Next.js / Rails) in Tokyo — 6 years at IBJ, bilingual, open to [roles you specify].”
- **One** featured case: problem → role → stack → result → screenshot → GitHub and/or live. Strongest story in the data is the WordPress → Next.js migration (7d → 1d / ~85% time saved).
- Drop or shrink the “This Portfolio — Career Timeline API” meta card so it is not the featured proof.
- Project tech chips that look clickable should either filter the timeline (like `TimelineItem` tags) or not look like buttons.

**You must supply:**

- A real headshot (commit under e.g. `public/portrait.jpg`). Do not generate a fake portrait.
- Optional: one screenshot of the migration / corporate site work. If you cannot share a screenshot, ship the featured layout with metrics + stack + outcome and a clear “screenshot forthcoming” is worse than omitting the image slot — prefer metrics-only rather than a stock photo.

**Implement:**

1. Hero: circular (or rounded-xl) photo beside the name, `next/image` with explicit width/height (or CSS aspect-ratio) so CLS stays 0. Alt text: name.
2. Replace or supplement `tagline` with the positioning line. Keep bilingual parity in `career.ja.ts`.
3. Optionally surface a one-line `bio` under the title; education can wait unless it fits without pushing Resume below the fold (leftover 1 wins if they conflict).
4. Projects: featured case as a wide first row (problem / role / stack / result). Remaining cards smaller. Add real `githubUrl` / `liveUrl` only when they exist — do not fake repos.
5. Honor `scroll-margin` and existing tokens. Do not reintroduce raw `text-cyan-200` / `bg-black/40`.

**Accept:**

- Recruiter sees a face and a role-target sentence above the fold (with leftover 1).
- Featured case is visually distinct from the three supporting cards.
- CLS remains ~0; photo does not overflow on 390px.

---

## Leftover 4 — `page.tsx` Server Component split

**Why:** Whole route is a Client Component. Mobile LCP is ~97% render delay, not TTFB. Violates `portfolio-rules.md`. Both locale modules hydrate on every visit.

**Files:**

- `src/app/page.tsx` — `'use client'`; `useState` for `locale` and `isApiOpen`; `getCareerData(locale)` in the client
- `src/app/layout.tsx` — `lang="en"` only
- `src/data/index.ts` — `getCareerData` / `getAllTechStacks`
- Leaves that must stay client: `Navbar`, `Hero` (count-up, parallax, resume menu), `FilterBar`, `TimelineItem` (expand), `ApiDrawer`, theme toggle
- Leaves that can become server-friendly if they lose local `useState` / `useInView`: parts of `Footer`, static copy in `SkillsSection` / `ProjectsSection` / `AgenticShowcase` — only split if it stays readable; do not rewrite every section in one go

**Current:**

```tsx
'use client';
export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [isApiOpen, setIsApiOpen] = useState(false);
  const data = getCareerData(locale);
  // ...
}
```

**Implement (recommended shape):**

1. `src/app/page.tsx` becomes an async Server Component. Read locale from `searchParams` (`?locale=ja`) **or** a cookie set by the language toggle + `router.refresh()`. URL is simpler to share; cookie is nicer UX. Pick one and document it in the PR.
2. Call `getCareerData(locale)` and `getAllTechStacks()` **only on the server**. Pass the active `data` as props. The client bundle must not import both career files.
3. Thin client shell for `isApiOpen` + theme is already in Navbar. Language toggle updates the chosen locale source (query or cookie) rather than only `useState`.
4. Set `document.documentElement.lang` (and `<html lang>` from the server) to `ja` when locale is JA.
5. Keep ThemeInit as the first body child. Do not move theme into this refactor.
6. Do **not** `scroll-reveal` the LCP `<h1>` as part of this leftover if you touch Hero — the audit called that out as a mobile LCP footgun. Safe to do here; do not expand into a CSS rewrite.

**Next 16 notes:** `cookies()` / `headers()` / `searchParams` are async. `preferredRegion` is **deprecated** — leftover 6 handles region. Do not add `runtime = 'edge'`.

**Accept:**

- `page.tsx` has no `'use client'`.
- Client JS no longer contains both `career.en.ts` and `career.ja.ts` (check the client bundle or a source-map grep).
- EN/JA toggle still works; JA sets `lang="ja"`.
- Theme persistence still works after the split.

---

## Leftover 5 — Playwright smoke + CI + `error.tsx`

**Why:** Zero automated tests. A CSS or data typo ships uncaught. Playwright is installed as a library with no specs.

**Files to add:**

- `src/app/error.tsx` — Client Component error boundary. Next.js 16 uses **`retry`**, not the older `reset` prop. Use tokens (`--text-primary`, `--surface-subtle`, `--focus-ring`), bilingual if trivial, no new palette.
- Optional in the same leftover: `src/app/not-found.tsx` (audit asked for it). `loading.tsx` is optional; skip if it causes a flash on the prerendered home.
- `playwright.config.ts`
- `e2e/smoke.spec.ts` (or `tests/e2e/smoke.spec.ts`)
- `.github/workflows/e2e.yml`
- `package.json` — `"test:e2e": "playwright test"`; add `@playwright/test` if the runner is missing (today only `"playwright": "^1.62.1"`)

**Five smoke cases (from the audit):**

1. Load `/` — heading “Luv Raina”, no crash
2. Locale toggle — JA copy appears (e.g. 履歴書 / 経歴)
3. Timeline filter — select a category or tech; list updates
4. `GET /api/v1/career?locale=en` → 200 JSON with `profile` / `timeline`
5. Both resume URLs 200 (`.docx` now; add PDF URLs when leftover 2 lands)

Also worth asserting: theme script `#theme-init` exists; `html` has no `class="dark"`.

**CI:** GitHub Actions on pull_request + main: `npm ci`, `npx playwright install --with-deps chromium`, `npm run build`, `npx playwright test` against `next start` (not production Vercel).

**Do not:** hit `https://my-profile-coral-ten.vercel.app/` from CI load tests. Do not add analytics.

**Accept:**

- Intentionally throwing in a child shows `error.tsx` with a working Retry.
- CI runs the five cases on PRs.
- Existing theme and Resume dropdown still pass a local keyboard smoke.

---

## Leftover 6 — API cache / `hnd1` region

**Why:** `GET /api/v1/career` was always MISS, `max-age=0`, JSON includes a new `timestamp` every request. Function ran in **iad1** while HTML was served from **hnd1** (~573 ms on Slow 4G). Drawer auto-fetches on open.

**Files:**

- `src/app/api/v1/career/route.ts`
- `src/app/api/v1/openapi.json/route.ts` (same cache/region policy)
- `src/components/ApiDrawer.tsx` — auto-fetch on `isOpen`
- Project config: `vercel.json` (simplest) — **do not** add `export const preferredRegion` (deprecated in Next 16) and **do not** set `runtime = 'edge'`

**Current career handler (cache-buster):**

```ts
return NextResponse.json({
  meta: {
    version: '1.0.0',
    locale,
    totalMilestones: timeline.length,
    timestamp: new Date().toISOString(),  // drop this
  },
  // ...
});
```

**Implement:**

1. Remove `timestamp` from `meta` (it busts caches and is not useful to recruiters).
2. Send CDN-friendly headers, e.g. `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`. Prefer this over `dynamic = 'force-static'` because the handler reads `locale` / `skill` / `category` from the request URL — `force-static` empties cookies/headers and is the wrong tool for query-filtered JSON.
3. Pin serverless **region** to Tokyo: `vercel.json` `{ "regions": ["hnd1"] }` (project default so HTML origin and functions match). Confirm on a **preview** deployment via `x-vercel-id` / `x-vercel-cache` — never flood production with load tests.
4. Optional: stop auto-fetching the full career payload the instant the drawer opens; fetch on Execute only (cuts accidental origin hits). If you keep auto-fetch, caching still makes it cheap.
5. Invalid `locale` query: keep data fallback to EN, but do not echo an arbitrary `meta.locale` that disagrees with the body.

**Accept:**

- Repeat `GET /api/v1/career?locale=en` on preview shows CDN HIT (or at least `s-maxage` in `Cache-Control`) and **no** changing `timestamp`.
- Function region is `hnd1` (or documented equivalent Tokyo region), not `iad1`.
- OpenAPI route is cached the same way.
- ApiDrawer still shows real `res.status` (already done).

---

## Leftover 7 — Collapse timeline by default

**Why:** Timeline alone is ~6300px because every item starts expanded. Sourcers cannot scan tenure in 20 seconds. All five roles are IBJ with no one-line company context. EN dates are `2025-04` not `Apr 2025`.

**Files:**

- `src/components/TimelineItem.tsx` — `const [isExpanded, setIsExpanded] = useState(true);`
- `src/components/TimelineSection.tsx` — section intro; no IBJ blurb
- `src/data/career.en.ts` — `period.start` like `'2025-04'`
- `src/data/career.ja.ts` — already human (`'2025年4月'`)

**Current expand target:** only **Key Deliverables & Responsibilities** (`item.highlights`). Card header, summary, metrics, and tech tags stay visible either way.

**Implement:**

1. Default expanded **only** for the current role: `item.period.end === 'Present' || item.period.end === '現在'`. Everyone else `useState(false)`.
2. Add a one-line company context above the list, bilingual, e.g. “IBJ — Tokyo-listed marriage-matching / consultation platforms.” Put it in `TimelineSection` (once) rather than repeating on every card.
3. Format EN dates in the UI (`Apr 2025 – Present`). Keep ISO in data if you want; do not rewrite JA dates that are already human.
4. Expand/collapse control must remain keyboard-operable with `:focus-visible`. Consider `aria-expanded` on the deliverables button (it does not have it today).

**Accept:**

- First load: current role deliverables open; four older roles collapsed.
- Page height of `#timeline` drops substantially; filters still work.
- EN dates read as month names.

---

## Out of scope (do not mix into these leftovers)

Already shipped — do not reopen:

- Theme tokens, contrast, `:focus-visible`, `ThemeInit`, Navbar hydration sync, footer email, API drawer status/locale/Zod, Home vs Timeline icons, `scroll-margin` on the five original sections (only **add** `#contact`)

Still later, not in this file’s seven items:

- Recruiter-plain metric copy (“Human Verification Time” → “Cut review cycles 7 days → 1 day”)
- Filter-row fade on mobile, 44px tap targets, Swift out of “Backend & Cloud”
- `prefers-reduced-motion` for pulse/parallax
- Align header `max-w-6xl` with section `max-w-5xl`
- `og:image`, `sitemap.ts`, `robots.ts`, canonical
- Stop preloading JetBrains Mono; rAF-throttle Hero parallax
- Load-testing production

---

## Global constraints for whoever implements this

- Next.js 16 App Router; no `runtime = 'edge'`; no deprecated `preferredRegion` export.
- Bilingual parity: any user-visible string added in EN must exist in JA (`career.en.ts` / `career.ja.ts` or the component’s `en`/`ja` maps).
- Colors: CSS variables in `globals.css` only. No new hardcoded navy / `text-cyan-200` / `bg-black/40`.
- Do not read or commit `.env`, keys, or credentials.
- Do not revert `public/resumes/*.docx`.
- Verify UI in the browser (desktop + ~390px) before calling a leftover done. For leftover 1, actually check the fold, not only a screenshot of the header.
- Do not commit unless asked.

---

## Acceptance (all leftovers, when the wave is done)

Wave 1: Resume is above the fold; PDFs (if supplied) 200; `#contact` exists; timeline scans in one short scroll.

Wave 2: Face + positioning line + one featured case.

Wave 3: Homepage is an RSC; career JSON is cacheable from Tokyo.

Wave 4: `error.tsx` + five Playwright cases in CI.

No theme-init regression: light preference survives reload; `class="dark"` stays gone.
