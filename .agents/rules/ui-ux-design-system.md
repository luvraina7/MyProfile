# UI/UX & Design System Rules for Modern Portfolios

## 1. 8-Point Spacing System & Visual Breathing Room
- **Section Spacing**: Always maintain generous vertical padding (`py-20 md:py-32` / `80px–128px`) between distinct content sections to avoid cognitive overload.
- **Card Padding**: Inner card padding must be at least `24px` on mobile and `32px` (`p-6 md:p-8`) on desktop.
- **Grid Gaps**: Use explicit `gap-6 md:gap-8` for card grids. Never let adjacent cards feel cramped.
- **List & Highlight Spacing**: Maintain `space-y-3` to `space-y-4` between bullet deliverables with `gap-3` between icon and text.

## 2. Bilingual Typography & Reading Rhythm (EN + JA)
- **Line Heights**:
  - English body text: `line-height: 1.65` to `1.75`.
  - Japanese (日本語) text: `line-height: 1.75` to `1.85` (CJK glyphs require extra vertical line-height for effortless scanning).
- **Paragraph Length & Max Widths**:
  - Constrain text content widths to `max-w-3xl` (approx. 65–75 characters per line) for optimal reading comfort.
- **Font Sizes**:
  - Heading 1: `text-4xl sm:text-5xl md:text-6xl` (`font-extrabold tracking-tight`).
  - Section Headings: `text-2xl sm:text-3xl md:text-4xl`.
  - Body Text: `text-sm sm:text-base` with higher contrast (`#e2e8f0` / `#94a3b8`).

## 3. Visual Hierarchy & Contrast (WCAG 2.1 AA Compliant)
- **Primary Text**: Bright, crisp contrast (`#f8fafc`).
- **Secondary / Descriptive Text**: `#cbd5e1` to `#94a3b8` (minimum 4.5:1 contrast against dark glass card background).
- **Interactive Targets**: Minimum clickable/tap area of `40px x 40px` for touch targets and filter chips.
- **Focus Rings**: Clear `:focus-visible` outline rings with `2px offset`.

## 4. Modern Glassmorphism Depth
- Subtle multi-layered elevation (`backdrop-filter: blur(20px)` + translucent border + soft ambient drop shadow).
- Hover micro-interactions: Gentle lift (`transform: translateY(-2px)`) with smooth `cubic-bezier(0.16, 1, 0.3, 1)` easing.
