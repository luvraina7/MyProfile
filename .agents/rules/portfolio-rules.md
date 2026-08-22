# Portfolio & Career Timeline Project Rules

## Architecture & Code Conventions
1. **Next.js App Router (React 19 / Next 15+)**:
   - Keep page-level components as React Server Components (RSC) wherever possible for maximum performance.
   - Use `'use client'` only on interactive leaf components (Filter bars, language switchers, interactive modals, API drawer).
2. **Bilingual Data Integrity**:
   - All career data must conform strictly to `src/types/career.ts`.
   - Maintain parity between `src/data/career.en.ts` and `src/data/career.ja.ts`.
3. **Design System & Aesthetics**:
   - Dark & Light mode support using semantic CSS custom properties defined in `globals.css`.
   - Rich aesthetics: Glassmorphism (`backdrop-filter: blur()`), subtle border glows, gradient accents, modern typography.
   - Zero Layout Shift (CLS) with fixed aspect ratios and responsive container sizing.
4. **Accessibility (a11y)**:
   - Use semantic HTML tags (`<time>`, `<article>`, `<nav>`, `<section>`, `<main>`).
   - Accessible keyboard focus states (`:focus-visible`).
