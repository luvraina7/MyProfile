# Cursor Rule: responsive-text-audit（レスポンシブテキスト監査）

<aside>
📌

**Source:** `ibjap-design/.cursor/rules/responsive-text-audit.mdc`

**Project:** ibjap-design (WordPress / kaisetu renewal)

**Triggers:** HTML, PHP, CSS, SCSS, JSX, TSX, Vue — on review, audit, fix, or layout-related requests (`alwaysApply: false`)

</aside>

---

## 日本語

### 目的

フロントエンドのレイアウト監査ルールです。テキストのはみ出し、ボタンやカードの意図しない拡大、flex/grid 子要素のコンテナ破壊を検出し、**CSS/SCSS 中心**で修正します。WordPress/PHP テンプレートでは、マークアップとクラス名を確認したうえで、対応する **ソース SCSS** に修正を置きます（ビルド済み CSS よりソースを優先）。

`ibjap-design` では、編集対象 PHP に紐づく SCSS に修正を置き、共有ファイル（`new-common.scss` / `new-top.scss`）へのページ固有修正は避け、必要ならページ専用クラスでスコープします。

### 使い方

1. **監査依頼時** — 対象ファイルを開き、チェックリスト（動的テキスト、flex/grid の `min-width: 0`、ボタン行、画像の `max-width: 100%` など）を確認
2. **修正時** — 検出パターン（Fix 1〜8、Fix 4a の CTA ボタン）に沿って既存クラスへ最小限の CSS を追加
3. **報告時** — `RESPONSIVENESS AUDIT - [filename]` 形式で問題・修正案・`MANUAL REVIEW` を記載
4. **SCSS 配置** — PHP 名に対応する SCSS → `kaisetu_page.scss`（安全にスコープできる場合）→ `ini-tob-header-css.php` での読み込み確認

### メリット

- 長い URL・メール・動的ユーザー名などの **オーバーフローを早期発見**
- flex/grid でよくある **`min-width: 0` 漏れ** を標準化
- ボタン・CTA の **見た目の一貫性**（文言短縮なし、兄弟ボタンとの整合）
- ibjap-design 向けの **SCSS 配置ルール** で他ページへの副作用を抑制
- Tailwind 利用時は **ユーティリティ対応表** あり

### 注意事項

- **文言の短縮・書き換えは禁止**（ユーザー明示指示時のみ）
- **`ellipsis` / `nowrap` は安易に追加しない** — 同セクションの既存ボタン挙動を先に確認
- 意図的な全幅 CTA には `max-width` を付けない
- `new-common.scss` / `new-top.scss` にページ固有修正を直接入れない
- 切り詰め vs 折り返しが不明な場合は **MANUAL REVIEW** で設計判断を残す
- 狭い画面（iPhone SE / X など）と中間ブレークポイントでボタン行を確認

---

## English

### Purpose

A frontend layout audit rule for detecting and fixing text overflow, unbounded button/card growth, and flex/grid blowout. Fixes belong in **source SCSS/CSS**, not generated assets when sources exist. For WordPress/PHP in `ibjap-design`, map fixes to the template-linked SCSS and avoid page-specific changes in shared `new-common.scss` / `new-top.scss` unless scoped with a page-specific class.

### Usage

1. **On audit requests** — Run the checklist: dynamic text, flex/grid `min-width: 0`, button rows, media `max-width: 100%`
2. **When fixing** — Apply Fix patterns 1–8 and Fix 4a (CTA buttons) with minimal changes to existing classes
3. **When reporting** — Use `RESPONSIVENESS AUDIT - [filename]` with issues, fixes, and `MANUAL REVIEW` items
4. **SCSS placement** — Template-matched SCSS → `kaisetu_page.scss` (if safely scoped) → verify loads in `ini-tob-header-css.php`

### Benefits

- Catches overflow from long URLs, emails, and dynamic user content early
- Standardizes common flex/grid fixes (`min-width: 0`)
- Preserves CTA/button visual consistency without shortening copy
- Reduces cross-page regressions via ibjap-design SCSS ownership rules
- Includes Tailwind utility equivalents

### Precautions

- Do **not** shorten or rewrite visible button text unless explicitly asked
- Do **not** add `ellipsis` / `nowrap` without checking sibling button patterns first
- Do not cap intentionally full-width CTAs with `max-width`
- Avoid page-specific edits directly in shared `new-common.scss` / `new-top.scss`
- Flag truncate vs wrap ambiguity as **MANUAL REVIEW**
- Test narrow mobile and intermediate breakpoints for button rows

---

## Rule file（全文）

- `.cursor/rules/responsive-text-audit.mdc` — click to expand
    
    ```markdown
    ---
    description: Detect and fix text overflow, button size inflation, and responsive container issues in HTML, PHP templates, CSS, SCSS, JSX, TSX, and Vue files. Triggers on review, audit, fix, or layout-related requests.
    globs: ["**/*.html", "**/*.php", "**/*.css", "**/*.scss", "**/*.jsx", "**/*.tsx", "**/*.vue"]
    alwaysApply: false
    ---
    
    # Responsive Text & Layout Auditor
    
    You are a frontend layout specialist. When reviewing or editing any HTML, PHP template, CSS, SCSS, JSX, TSX, or Vue file, **proactively audit for text overflow and container inflation issues** and apply fixes.
    
    For WordPress/PHP templates, inspect the rendered HTML structure and class names, then apply styling fixes in the appropriate CSS/SCSS source file when possible. Prefer source stylesheets over generated build output unless the project intentionally edits compiled CSS directly.
    
    For the `ibjap-design` WordPress theme, prefer placing SCSS fixes in the stylesheet that corresponds to the PHP template being edited. If a PHP template has a similarly named or clearly linked SCSS class/section, add the fix there. If that stylesheet is not linked yet and the page needs it, link it from `wp_core/wp-content/themes/ibjap/ini-tob-header-css.php` when necessary.
    
    If there is no dedicated SCSS file or section for the PHP template, check whether the template is already linked to `kaisetu-pack/src/kaisetu-renewal/kaisetu_page.scss`. If so, add the necessary SCSS there only when the selector can be scoped uniquely to the intended PHP markup and will not affect other PHP templates or shared components.
    
    Treat `kaisetu-pack/src/kaisetu-renewal/new-common.scss` and `kaisetu-pack/src/kaisetu-renewal/new-top.scss` as shared stylesheets. If the classes that need fixing are defined there, prefer creating a new page-specific class and applying the fix in the SCSS class/section similarly named to the PHP file. If no similarly named SCSS file or section exists, use `kaisetu-pack/src/kaisetu-renewal/kaisetu_page.scss` only when the PHP template already uses that stylesheet and the new selector can be scoped safely.
    
    ---
    
    ## Detection - Issues to Identify
    
    ### 1. Text Overflowing Its Container
    - Long words or URLs with no `overflow-wrap` or `word-break`
    - `white-space: nowrap` on elements that are not explicitly sized
    - Text inside flex/grid children missing `min-width: 0`
    
    ### 2. Button Inflating Due to Text Length
    - `<button>` or `.btn` with no `max-width`
    - Buttons in flex rows without constraints
    
    ### 3. Div / Card Growing Beyond Its Grid Column
    - Grid children without `min-width: 0`
    - Cards missing `overflow: hidden`
    
    ### 4. Missing Responsive Safeguards
    **Note:** The complete verbatim `.mdc` file is at the bottom of this page under **Raw rule file (verbatim)**. Structured sections below mirror the same content for easier reading in Notion.
    ```
    

---

## Rule file — complete sections (from `.mdc`)

### 4. Missing Responsive Safeguards

| Property | Missing from | Risk |
| --- | --- | --- |
| `overflow-wrap: break-word` | text containers | Long words overflow |
| `min-width: 0` | flex/grid children | Content blows out container |
| `max-width: 100%` | images/media | Media overflows |
| `text-overflow: ellipsis` | truncated text | Text clips without indicator |
| `overflow: hidden` | clipping containers | Content bleeds out |
| `flex-shrink` | button rows | Buttons don't shrink |

### Fix 1: Text That Should Wrap

```css
.text-container {
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
```

### Fix 2: Single-line Truncate

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
```

### Fix 3: Multi-line Clamp

```css
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Fix 4: Button Max Width + Truncation

```css
button, .btn {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
button.wrap-btn {
  white-space: normal;
  word-break: break-word;
  height: auto;
}
```

### Fix 4a: Div/Button CTA Text Refinement

- Do not shorten or rewrite visible button text unless the user explicitly asks.
- Preserve the same visual appearance as sibling buttons.
- Prefer a scoped class on one longer button; minimal CSS adjustments.
- Before adding `text-overflow: ellipsis` or `white-space: nowrap`, inspect similar divs/buttons on the same page.
- Prefer existing wrap / font-size / padding patterns over ellipsis when siblings use them.
- Reserve space for absolute-positioned arrow icons.
- Test iPhone SE / iPhone X and intermediate breakpoints.
- Delay two-column breakpoint if buttons become too narrow.
- Apply changes to both sibling buttons when needed.

### Fix 5: Flex Row With Multiple Buttons

```css
.button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}
.button-row button {
  flex: 1 1 auto;
  min-width: 80px;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Fix 6: Flex / Grid Child Text Container

```css
.flex-parent {
  display: flex;
  min-width: 0;
}
.flex-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Fix 7: Card / List Item in Grid

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.grid-item {
  min-width: 0;
  overflow: hidden;
}
.grid-item p, .grid-item span {
  overflow-wrap: break-word;
}
```

### Fix 8: Images and Media

```css
img, video, iframe, svg {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### Audit Checklist

- [ ]  PHP/WordPress dynamic text has matching CSS/SCSS overflow handling
- [ ]  SCSS placement uses PHP-linked class/section
- [ ]  Stylesheet linking checked in `ini-tob-header-css.php`
- [ ]  `kaisetu_page.scss` only when template is linked and selector is scoped
- [ ]  No page-specific edits in `new-common.scss` / `new-top.scss` without scoped class
- [ ]  Selector scope is unique to intended markup
- [ ]  Flex/grid children have `min-width: 0` where they contain text
- [ ]  Text containers have `overflow-wrap: break-word`
- [ ]  Truncation justified before ellipsis/nowrap
- [ ]  Truncated labels use nowrap + overflow + text-overflow trio
- [ ]  Multi-line clamps use `-webkit-line-clamp`
- [ ]  Buttons have max-width or flex-wrap row
- [ ]  Icon+text buttons work at narrow widths
- [ ]  Cards: `overflow: hidden`, children `min-width: 0`
- [ ]  Images: `max-width: 100%; height: auto`
- [ ]  No bare `nowrap` without overflow/max-width
- [ ]  Dynamic names, emails, URLs handled

### Reporting Format

```
RESPONSIVENESS AUDIT - [filename]
ISSUES FOUND: N
[1] Line XX - <element> - ...
    Problem : ...
    Fix     : ...
FIXED - [list]
MANUAL REVIEW - [truncate vs wrap, etc.]
```

### Behavior Rules (1–14)

1. Always check before editing (audit checklist)
2. Fix in place — no extra wrappers unless needed
3. Prefer CSS-only fixes
4. Respect intent (full-width CTA → no max-width)
5. WordPress/PHP: avoid inline styles unless already used
6. SCSS ownership: PHP-linked SCSS section
7. Stylesheet links via `ini-tob-header-css.php`
8. `kaisetu_page.scss` only when linked + scoped
9. No page-specific fixes in `new-common.scss` / `new-top.scss`
10. Unique selectors under page wrapper
11. Source SCSS over generated CSS
12. Avoid unnecessary truncation — match siblings first
13. JSX/TSX: Tailwind utilities when applicable
14. Ask when ambiguous → MANUAL REVIEW

### Tailwind Equivalents

| CSS | Tailwind |
| --- | --- |
| `overflow-wrap: break-word` | `break-words` |
| `word-break: break-all` | `break-all` |
| `white-space: nowrap` | `whitespace-nowrap` |
| `text-overflow: ellipsis` | `truncate` |
| `overflow: hidden` | `overflow-hidden` |
| `min-width: 0` | `min-w-0` |
| `max-width: 100%` | `max-w-full` |
| `-webkit-line-clamp: 2` | `line-clamp-2` |
| `flex-wrap: wrap` | `flex-wrap` |
| `flex: 1 1 auto` | `flex-auto` |

---

## Raw rule file (verbatim)

<aside>
📄

Copy-paste reference for `ibjap-design/.cursor/rules/responsive-text-audit.mdc` — matches the repo file.

</aside>

- responsive-text-audit.mdc — full file (295 lines)
    
    ```
    ---
    description: Detect and fix text overflow, button size inflation, and responsive container issues in HTML, PHP templates, CSS, SCSS, JSX, TSX, and Vue files. Triggers on review, audit, fix, or layout-related requests.
    globs: ["**/*.html", "**/*.php", "**/*.css", "**/*.scss", "**/*.jsx", "**/*.tsx", "**/*.vue"]
    alwaysApply: false
    ---
    
    # Responsive Text & Layout Auditor
    
    You are a frontend layout specialist. When reviewing or editing any HTML, PHP template, CSS, SCSS, JSX, TSX, or Vue file, **proactively audit for text overflow and container inflation issues** and apply fixes.
    
    For WordPress/PHP templates, inspect the rendered HTML structure and class names, then apply styling fixes in the appropriate CSS/SCSS source file when possible. Prefer source stylesheets over generated build output unless the project intentionally edits compiled CSS directly.
    
    For the `ibjap-design` WordPress theme, prefer placing SCSS fixes in the stylesheet that corresponds to the PHP template being edited. If a PHP template has a similarly named or clearly linked SCSS class/section, add the fix there. If that stylesheet is not linked yet and the page needs it, link it from `wp_core/wp-content/themes/ibjap/ini-tob-header-css.php` when necessary.
    
    If there is no dedicated SCSS file or section for the PHP template, check whether the template is already linked to `kaisetu-pack/src/kaisetu-renewal/kaisetu_page.scss`. If so, add the necessary SCSS there only when the selector can be scoped uniquely to the intended PHP markup and will not affect other PHP templates or shared components.
    
    Treat `kaisetu-pack/src/kaisetu-renewal/new-common.scss` and `kaisetu-pack/src/kaisetu-renewal/new-top.scss` as shared stylesheets. If the classes that need fixing are defined there, prefer creating a new page-specific class and applying the fix in the SCSS class/section similarly named to the PHP file. If no similarly named SCSS file or section exists, use `kaisetu-pack/src/kaisetu-renewal/kaisetu_page.scss` only when the PHP template already uses that stylesheet and the new selector can be scoped safely.
    
    ---
    
    ## Detection - Issues to Identify
    
    ### 1. Text Overflowing Its Container
    Look for elements where text can escape the bounds of its parent:
    - Long words or URLs with no `overflow-wrap` or `word-break`
    - `white-space: nowrap` on elements that are not explicitly sized
    - Inline elements inside constrained containers
    - Text inside flex/grid children missing `min-width: 0`
    
    **Signals in markup:**
    ```
    
    <!-- Bad: No overflow control -->
    
    <p style="width: 200px;">VeryLongWordThatDoesNotBreak</p>
    
    <div class="tag">[superlonguseremail@somecompany.co.jp](mailto:superlonguseremail@somecompany.co.jp)</div>
    
    <!-- Bad: Flex child can blow out -->
    
    <div style="display:flex">
    
    Some very long label text here
    
    </div>
    
    ```
    
    **Signals in PHP/WordPress templates:**
    ```
    
    <!-- Bad: Dynamic text can overflow if the class has no wrapping rules -->
    
    <p class="member-name"><?php echo esc_html($member_name); ?></p>
    
    <a class="external-link" href="<?php echo esc_url($url); ?>"><?php echo esc_html($url); ?></a>
    
    ```
    
    ---
    
    ### 2. Button Inflating Due to Text Length
    Buttons that grow unbounded with label length:
    - `<button>` or `.btn` with no `max-width`
    - Buttons with `width: fit-content` or no explicit constraint in a flex row
    - Icon + text buttons that don't truncate
    
    **Signals:**
    ```
    
    <!-- Bad: Button grows with text -->
    
    <button>Submit Your Application for Review</button>
    
    <!-- Bad: In a flex row, one long label pushes others out -->
    
    <div style="display:flex; gap:8px">
    
    <button>Cancel</button>
    
    <button>Submit Application for Final Review</button>
    
    </div>
    
    ```
    
    ---
    
    ### 3. Div / Card Growing Beyond Its Grid Column
    - Grid children without `min-width: 0`
    - Cards or list items missing `overflow: hidden`
    - Content containers relying on content width rather than grid/flex parent width
    
    ---
    
    ### 4. Missing Responsive Safeguards
    Flag any of these absences:
    | Property               | Missing from       | Risk                        |
    |------------------------|--------------------|-----------------------------|
    | `overflow-wrap: break-word` | text containers | Long words overflow       |
    | `min-width: 0`         | flex/grid children | Content blows out container |
    | `max-width: 100%`      | images/media       | Media overflows             |
    | `text-overflow: ellipsis` | truncated text  | Text clips without indicator|
    | `overflow: hidden`     | clipping containers| Content bleeds out          |
    | `flex-shrink`          | button rows        | Buttons don't shrink        |
    
    ---
    
    ## Fix Patterns - Apply These
    
    ### Fix 1: Text That Should Wrap
    ```
    
    / *For body text, labels, paragraphs* /
    
    .text-container {
    
    overflow-wrap: break-word;
    
    word-break: break-word; / *fallback for older browsers* /
    
    hyphens: auto;          / *optional: adds hyphens at break points* /
    
    }
    
    ```
    
    ### Fix 2: Text That Should Truncate (Single Line)
    ```
    
    .truncate {
    
    white-space: nowrap;
    
    overflow: hidden;
    
    text-overflow: ellipsis;
    
    min-width: 0; / *critical in flex/grid children* /
    
    }
    
    ```
    
    ### Fix 3: Text That Should Truncate (Multi-line Clamp)
    ```
    
    .clamp-2 {
    
    display: -webkit-box;
    
    -webkit-line-clamp: 2;
    
    -webkit-box-orient: vertical;
    
    overflow: hidden;
    
    }
    
    ```
    
    ### Fix 4: Button With Max Width + Truncation
    ```
    
    button, .btn {
    
    max-width: 200px;        / *or a contextual max* /
    
    white-space: nowrap;
    
    overflow: hidden;
    
    text-overflow: ellipsis;
    
    }
    
    / *For buttons that should wrap instead* /
    
    button.wrap-btn {
    
    white-space: normal;
    
    word-break: break-word;
    
    height: auto;
    
    }
    
    ```
    
    ### Fix 4a: Div/Button CTA Text Refinement
    When fixing text overflow in `.btn`, `.btn_white`, `.btn_mid`, or div-based CTA buttons:
    - Do not shorten or rewrite visible button text unless the user explicitly asks.
    - Preserve the same visual appearance as sibling buttons: shared font size, padding, border radius, icon position, and alignment should remain consistent.
    - If one button has longer text than nearby sibling buttons, prefer a scoped class on that button and minimal CSS adjustments.
    - Before adding `text-overflow: ellipsis` or `white-space: nowrap`, inspect similar divs/buttons in the same section/page. Do not add truncation properties unless similar components already use truncation, the design clearly requires a single-line label, or wrapping would break the layout.
    - When similar buttons wrap or fit by font size/padding adjustments, prefer those existing patterns over ellipsis-based truncation.
    - Reserve space for absolute-positioned arrow icons so text cannot overlap the icon.
    - Test narrow mobile widths such as iPhone SE / iPhone X and intermediate responsive widths where button layout changes.
    - If two-column buttons become too narrow between breakpoints, delay the flex/two-column breakpoint instead of shrinking only one button.
    - Apply changes to both sibling buttons when needed to preserve visual consistency.
    
    ### Fix 5: Flex Row With Multiple Buttons
    ```
    
    .button-row {
    
    display: flex;
    
    gap: 8px;
    
    flex-wrap: wrap;        / *wrap to next line on small screens* /
    
    min-width: 0;
    
    }
    
    .button-row button {
    
    flex: 1 1 auto;         / *grow/shrink equally* /
    
    min-width: 80px;        / *never collapse too small* /
    
    max-width: 240px;
    
    overflow: hidden;
    
    text-overflow: ellipsis;
    
    white-space: nowrap;
    
    }
    
    ```
    
    ### Fix 6: Flex / Grid Child Text Container
    ```
    
    / *Flex children ignore overflow without this* /
    
    .flex-parent {
    
    display: flex;
    
    min-width: 0; / *on parent too if nested* /
    
    }
    
    .flex-child {
    
    min-width: 0;           / *required for overflow to work* /
    
    overflow: hidden;
    
    text-overflow: ellipsis;
    
    white-space: nowrap;
    
    }
    
    ```
    
    ### Fix 7: Card / List Item in Grid
    ```
    
    .grid-container {
    
    display: grid;
    
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    
    }
    
    .grid-item {
    
    min-width: 0;           / *prevent blowout* /
    
    overflow: hidden;
    
    }
    
    .grid-item p, .grid-item span {
    
    overflow-wrap: break-word;
    
    }
    
    ```
    
    ### Fix 8: Images and Media
    ```
    
    img, video, iframe, svg {
    
    max-width: 100%;
    
    height: auto;
    
    display: block;
    
    }
    
    ```
    
    ---
    
    ## Audit Checklist - Run Through This for Every File
    
    When asked to audit or fix a file, go through each item:
    
    - [ ] **PHP/WordPress templates** with dynamic text have matching CSS/SCSS overflow handling
    - [ ] **SCSS placement** uses the PHP template's similarly named or linked SCSS class/section when available
    - [ ] **Stylesheet linking** is checked in `wp_core/wp-content/themes/ibjap/ini-tob-header-css.php` if a required page stylesheet is not loaded
    - [ ] **Shared SCSS fallback** uses `kaisetu-pack/src/kaisetu-renewal/kaisetu_page.scss` only when the PHP template is linked to it
    - [ ] **Shared stylesheet protection** avoids page-specific edits in `new-common.scss` or `new-top.scss`; create a scoped page-specific class instead
    - [ ] **Selector scope** is unique to the intended PHP markup and does not alter unrelated PHP pages or shared components
    - [ ] **All flex/grid children** have `min-width: 0` where they contain text
    - [ ] **All text containers** with fixed or max widths have `overflow-wrap: break-word`
    - [ ] **Truncation is justified** before adding `text-overflow: ellipsis` or `white-space: nowrap`; similar divs/buttons are checked first
    - [ ] **All intentionally truncated labels** use the full `white-space / overflow / text-overflow` trio
    - [ ] **Multi-line clamps** use `-webkit-line-clamp` with fallback `overflow: hidden`
    - [ ] **Buttons** have `max-width` or are in a flex row with `flex-wrap: wrap`
    - [ ] **Icon+text buttons** truncate or wrap gracefully at narrow widths
    - [ ] **Cards** have `overflow: hidden` and children have `min-width: 0`
    - [ ] **Images** have `max-width: 100%; height: auto`
    - [ ] **No bare `white-space: nowrap`** without a paired overflow/max-width constraint
    - [ ] **Dynamic content** such as user names, emails, and long URLs has overflow handling
    
    ---
    
    ## Reporting Format
    
    When auditing a file, report issues in this structure:
    
    ```
    
    RESPONSIVENESS AUDIT - [filename]
    
    ISSUES FOUND: N
    
    [1] Line XX - <element> - Button inflates with text length
    
    Problem : No max-width; text pushes button to full container width
    
    Fix     : Add max-width: 200px + text-overflow: ellipsis
    
    [2] Line XX - .class-name - Text overflows container
    
    Problem : flex child missing min-width: 0; overflow-wrap not set
    
    Fix     : Add min-width: 0 to flex child; overflow-wrap: break-word to text
    
    FIXED - [list of applied changes]
    
    MANUAL REVIEW - [items that need design decision, e.g. "should this button wrap or truncate?"]
    
    ```
    
    ---
    
    ## Behavior Rules
    
    1. **Always check before editing**: Before making layout changes, run the audit checklist mentally.
    2. **Fix in place**: Apply fixes directly to the existing class or element. Don't add new wrappers unless structurally necessary.
    3. **Prefer CSS-only fixes**: Avoid JS-based solutions for pure overflow/sizing issues.
    4. **Respect intent**: If a button is intentionally full-width, such as a CTA, don't add `max-width`. Use context.
    5. **WordPress/PHP**: Avoid inline style fixes in templates unless the surrounding code already uses inline styles. Prefer existing classes and stylesheet rules.
    6. **SCSS ownership**: Put fixes in the SCSS class/section that is similarly named to, or clearly linked from, the PHP file being edited.
    7. **Stylesheet links**: If a needed SCSS/CSS file is not loaded for the PHP template, add or adjust the link in `wp_core/wp-content/themes/ibjap/ini-tob-header-css.php` when necessary.
    8. **Shared kaisetu stylesheet**: Use `kaisetu-pack/src/kaisetu-renewal/kaisetu_page.scss` only when the PHP template already uses that stylesheet and the new selector can be scoped safely.
    9. **Shared common/top styles**: Do not make page-specific fixes directly in `new-common.scss` or `new-top.scss`. If an affected class is defined there, add a new page-specific class in the PHP markup and style that class in the PHP file's similarly named SCSS class/section, or in `kaisetu_page.scss` when it is already linked and safely scoped.
    10. **Unique selectors**: When adding SCSS for a PHP template, anchor selectors under a page-specific wrapper or uniquely named class so the fix applies only to the intended markup.
    11. **SCSS projects**: Put fixes in the source SCSS partial that owns the component. Avoid editing generated CSS when a source SCSS file exists.
    12. **Avoid unnecessary truncation**: Do not add `text-overflow: ellipsis` or `white-space: nowrap` just because text is long. Match similar div/button behavior first; use wrapping, font-size, padding, max-width, or breakpoint adjustments when those are the local pattern.
    13. **JSX/TSX**: Apply fixes via Tailwind utility classes when the file uses Tailwind. Fall back to inline style or a paired CSS module otherwise.
    14. **Ask when ambiguous**: If a design decision is required, such as truncate vs. wrap, flag it with `MANUAL REVIEW` rather than guessing.
    
    ---
    
    ## Tailwind Equivalents
    
    | CSS Fix                         | Tailwind Class(es)                              |
    |---------------------------------|-------------------------------------------------|
    | `overflow-wrap: break-word`     | `break-words`                                   |
    | `word-break: break-all`         | `break-all`                                     |
    | `white-space: nowrap`           | `whitespace-nowrap`                             |
    | `text-overflow: ellipsis`       | `truncate` (includes nowrap + overflow hidden)  |
    | `overflow: hidden`              | `overflow-hidden`                               |
    | `min-width: 0`                  | `min-w-0`                                       |
    | `max-width: 100%`               | `max-w-full`                                    |
    | `-webkit-line-clamp: 2`         | `line-clamp-2`                                  |
    | `flex-wrap: wrap`               | `flex-wrap`                                     |
    | `flex: 1 1 auto`                | `flex-auto`                                     |
    ```