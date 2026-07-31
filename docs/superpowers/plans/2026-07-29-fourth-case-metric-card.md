# Fourth Case Metric Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `800+ specialists work in the system` as the first of four localized metric cards in the flagship case section.

**Architecture:** Keep the existing data-driven `t.case.metrics.map(...)` rendering. Extend the Russian and English translation data, then adjust only the responsive CSS grid so the same component renders 4 columns, 2 × 2, and 1 column at the existing breakpoints.

**Tech Stack:** React 19, Vite, JavaScript ES modules, CSS Grid, Node.js assertions, Codex in-app Browser.

## Global Constraints

- Preserve the existing `15`, `24/7`, and `6` metric cards.
- Russian copy: `800+` with `специалистов работают / в системе`.
- English copy: `800+` with `specialists work / in the system`.
- Do not add components, dependencies, images, or unrelated refactors.
- Wide screens use four equal columns; up to 900 px use 2 × 2; up to 560 px use one column.

---

### Task 1: Add the localized fourth metric

**Files:**
- Modify: `scripts/verify-site-content.mjs`
- Modify: `src/i18n/ru.js:70-74`
- Modify: `src/i18n/en.js:70-74`

**Interfaces:**
- Consumes: the existing `case.metrics` arrays rendered by `App.jsx`.
- Produces: four ordered metric objects shaped as `{ num: string, label: string[] }` in each locale.

- [ ] **Step 1: Write the failing data test**

Add real module imports and assertions to `scripts/verify-site-content.mjs`:

```js
const ruData = (await import('../src/i18n/ru.js')).default;
const enData = (await import('../src/i18n/en.js')).default;

assert.equal(ruData.case.metrics.length, 4);
assert.deepEqual(ruData.case.metrics[0], {
  num: '800+',
  label: ['специалистов работают', 'в системе'],
});
assert.equal(enData.case.metrics.length, 4);
assert.deepEqual(enData.case.metrics[0], {
  num: '800+',
  label: ['specialists work', 'in the system'],
});
```

- [ ] **Step 2: Run the test and confirm the expected failure**

Run:

```powershell
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\verify-site-content.mjs
```

Expected: failure because `case.metrics.length` is `3`, proving the test detects the missing card.

- [ ] **Step 3: Add the minimal localized data**

Insert first in `src/i18n/ru.js`:

```js
{ num: '800+', label: ['специалистов работают', 'в системе'] },
```

Insert first in `src/i18n/en.js`:

```js
{ num: '800+', label: ['specialists work', 'in the system'] },
```

- [ ] **Step 4: Re-run the data test**

Run the same Node command.

Expected: `Site content verification passed.`

- [ ] **Step 5: Commit the localized metric**

```powershell
git add -- scripts/verify-site-content.mjs src/i18n/ru.js src/i18n/en.js
git commit -m "feat: add specialist case metric"
```

### Task 2: Make the four-card grid responsive

**Files:**
- Modify: `src/mdggisStyle.css:603-608`
- Modify: `src/mdggisStyle.css:1290`
- Verify: `src/App.jsx:372-377`

**Interfaces:**
- Consumes: four `.metric` elements rendered inside `.case-metrics`.
- Produces: four equal columns above 900 px, two columns from 561–900 px, and one column at or below 560 px.

- [ ] **Step 1: Extend the failing verification**

Add these assertions to `scripts/verify-site-content.mjs`:

```js
assert.match(styles, /\.case-metrics\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*1fr\)/);
assert.match(styles, /@media \(max-width:\s*900px\)[\s\S]*?\.case-metrics\s*\{\s*grid-template-columns:\s*repeat\(2,\s*1fr\)/);
assert.match(styles, /@media \(max-width:\s*560px\)[\s\S]*?\.case-metrics,[\s\S]*?grid-template-columns:\s*1fr/);
```

- [ ] **Step 2: Run the verification and confirm the expected failure**

Run the Node verification command from Task 1.

Expected: failure on the first desktop grid assertion because the current rule is `repeat(3, 1fr)`.

- [ ] **Step 3: Apply the minimal CSS change**

Use:

```css
.case-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}
```

At `max-width: 900px`, use:

```css
.case-metrics { grid-template-columns: repeat(2, 1fr); }
```

Keep the existing `max-width: 560px` one-column rule unchanged.

- [ ] **Step 4: Run automated verification**

Run:

```powershell
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\verify-site-content.mjs
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules\vite\bin\vite.js build
```

Expected: verification passes and Vite exits with code `0`. The existing large-chunk warning is informational.

- [ ] **Step 5: Verify the rendered layouts**

Open `http://localhost:5173/#case` in the in-app Browser and verify:

- Desktop, 1280 × 720: four cards in one row, first card is `800+`.
- Tablet, 800 × 900: four cards in a 2 × 2 grid.
- Mobile, 390 × 844: four cards in one column.
- All four cards are visible without clipping or overlap.
- Page title and URL are correct, the page is not blank, no framework overlay is shown, and console errors/warnings are empty or explained.

- [ ] **Step 6: Commit the responsive layout**

```powershell
git add -- scripts/verify-site-content.mjs src/mdggisStyle.css
git commit -m "style: lay out four case metrics"
```

