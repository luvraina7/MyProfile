---
name: playwright
description: "Browser automation via Playwright — navigate, snapshot, click, fill, screenshot, and visually verify UI. Use when user wants browser tool use, visual QA, E2E testing, or to see the portfolio in a real browser."
---

# /playwright — Browser Tool Use

Automate Chromium/Firefox/WebKit via `@playwright/mcp` (official Microsoft Playwright MCP). Provides browser tabs, snapshots, and actor tools to the agent.

## Setup (one-time)

```bash
# MCP is npx-based (no global install needed), but install browsers once:
npx playwright install chromium
# verify MCP responds:
npx -y @playwright/mcp@latest --help | head -20
```

MCP is configured in `opencode.jsonc` as `playwright` (local, `npx -y @playwright/mcp@latest --caps vision --viewport-size 1280x720`).

## When to use me

- User says "browser tool use", "visually verify", "take a screenshot", "check UI"
- Need to test portfolio on `http://localhost:3000` after dramatic overhaul
- E2E flows: click nav links, open mobile hamburger, test resume download, scroll spy

## What I do

Exposes Playwright MCP tools (names prefixed `playwright_` or `mcp_playwright_` depending on opencode version):

- `browser_navigate` — go to URL
- `browser_snapshot` — accessibility snapshot (preferred over screenshot for actions)
- `browser_click` / `browser_fill` / `browser_select` / `browser_press_key`
- `browser_take_screenshot` — visual proof (fullPage: true for portfolio)
- `browser_tabs` / `browser_close` / `browser_resize`
- `browser_evaluate` — run JS in page context

## Standard verification flow for this portfolio

```text
1. Ensure dev server running: ps aux | grep "next dev"  → http://localhost:3000
2. browser_navigate {"url": "http://localhost:3000"}
3. browser_snapshot → confirm grid-pattern, glass-panel, scroll-reveal nodes
4. browser_take_screenshot {"fullPage": true} → save to /tmp/portfolio.png
5. For scroll animations: browser_evaluate "() => window.scrollTo(0, 800)" then snapshot
6. For mobile nav: browser_resize {"width": 375, "height": 812} then click hamburger
7. For download: browser_click on "Download Resume" then check network
```

## Capabilities enabled

- `--caps vision` — screenshots + snapshots
- `--viewport-size 1280x720` desktop, resize to `375x812` for mobile QA
- Isolated context per session (no storage-state leak)

## Troubleshooting

- If MCP tools not listed: `opencode mcp list` → should show `playwright` enabled
- If browser fails to launch: `npx playwright install --with-deps chromium`
- If page not loading: check `curl -I http://localhost:3000` and `cat /tmp/next-dev.log`

## Quick test

```
browser_navigate to http://localhost:3000 then browser_snapshot — should see "Luv Raina" h1, 4 metric cards, timeline spine, projects grid
```
