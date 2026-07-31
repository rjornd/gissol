# Partner Strip and Hero Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge the partner strip by 25%, temporarily hide EuroChem, darken the mock application header, and apply the supplied Uralkali testimonial attribution.

**Architecture:** Keep all partner and translation data intact. Apply a render-only filter in `ClientsStrip`, update the existing responsive CSS rules in place, and change testimonial copy in both locale files. Extend the existing site verification script before each production edit so every behavior is observed failing first.

**Tech Stack:** React 19, Vite 6, CSS, Node.js `assert`, in-app Browser QA.

## Global Constraints

- Preserve the EuroChem translation entries and `src/assets/clients/eurochem.jpg`.
- Hide EuroChem only through `logoKey === "eurochem"` render filtering.
- Use exactly five desktop partner columns, three tablet columns, and two mobile columns.
- Regular logo bounds are exactly `187.5 × 90 px`; compact logo bounds are exactly `140 × 67.5 px`.
- Partner cell minimum height is exactly `130 px`.
- Keep the existing testimonial quotation and avatar initials.
- Do not add dependencies or refactor unrelated components.

---

### Task 1: Enlarge the partner strip and hide EuroChem

**Files:**
- Modify: `scripts/verify-site-content.mjs`
- Modify: `src/App.jsx:357-379`
- Modify: `src/mdggisStyle.css:495-554`
- Modify: `src/mdggisStyle.css:1290-1291`
- Modify: `src/mdggisStyle.css:1341-1345`

**Interfaces:**
- Consumes: `t.clients.logos: Array<{ name: string, meta: string, logoKey: string }>`
- Produces: `visibleClients`, a render-only array excluding `logoKey === "eurochem"`

- [ ] **Step 1: Write the failing partner-strip checks**

Add these assertions after the existing client checks in `scripts/verify-site-content.mjs`:

```js
assert.match(
  app,
  /const visibleClients = t\.clients\.logos\.filter\(\(\{ logoKey \}\) => logoKey !== 'eurochem'\);/,
);
assert.match(app, /\{visibleClients\.map\(\(client\) => \(/);
assert.match(styles, /\.clients-strip\s*\{[\s\S]*?padding:\s*3\.75rem;/);
assert.match(styles, /\.clients-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
assert.match(styles, /\.client-logo\s*\{[\s\S]*?min-height:\s*130px;/);
assert.match(styles, /\.client-logo-image\s*\{[\s\S]*?max-width:\s*187\.5px;[\s\S]*?height:\s*90px;/);
assert.match(
  styles,
  /\.client-logo-image\[data-logo="miningInstitute"\],[\s\S]*?max-width:\s*140px;[\s\S]*?height:\s*67\.5px;/,
);
assert.doesNotMatch(styles, /\.client-logo-image\[data-logo="eurochem"\]/);
assert.match(styles, /@media \(max-width:\s*900px\)[\s\S]*?\.clients-strip\s*\{\s*padding:\s*3\.125rem 1\.875rem;/);
assert.match(styles, /@media \(max-width:\s*560px\)[\s\S]*?\.clients-strip\s*\{\s*padding:\s*2\.8125rem 1\.25rem;/);
```

Keep the existing checks proving that the EuroChem translation and asset still exist.

- [ ] **Step 2: Run the checks and verify RED**

Run:

```powershell
node scripts\verify-site-content.mjs
```

Expected: FAIL on the missing `visibleClients` filter before any production file is changed.

- [ ] **Step 3: Implement the render-only filter**

Update `ClientsStrip` in `src/App.jsx`:

```jsx
function ClientsStrip() {
  const { t } = useI18n();
  const visibleClients = t.clients.logos.filter(({ logoKey }) => logoKey !== 'eurochem');

  return (
    <div className="clients-strip reveal">
      <div className="clients-label">{t.clients.label}</div>
      <div className="clients-grid">
        {visibleClients.map((client) => (
          <div className="client-logo" key={client.name}>
            <img
              className="client-logo-image"
              data-logo={client.logoKey}
              src={clientLogoAssets[client.logoKey]}
              alt={client.name}
              loading="lazy"
            />
            <small>{client.meta}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement exact 25% sizing and responsive layout**

Update the existing CSS declarations:

```css
.clients-strip {
  width: 100vw;
  padding: 3.75rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.clients-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.75rem;
  align-items: center;
}
.client-logo {
  min-height: 130px;
}
.client-logo-image {
  max-width: 187.5px;
  height: 90px;
}
.client-logo-image[data-logo="miningInstitute"],
.client-logo-image[data-logo="permPolytechnic"] {
  max-width: 140px;
  height: 67.5px;
}
```

Delete the EuroChem transform rule. Update breakpoint rules:

```css
@media (max-width: 900px) {
  .clients-strip { padding: 3.125rem 1.875rem; }
  .clients-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
}

@media (max-width: 560px) {
  .clients-strip { padding: 2.8125rem 1.25rem; }
  .clients-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
```

- [ ] **Step 5: Run the checks and verify GREEN**

Run:

```powershell
node scripts\verify-site-content.mjs
```

Expected: `Site content verification passed.`

- [ ] **Step 6: Commit the partner-strip change**

```powershell
git add scripts/verify-site-content.mjs src/App.jsx src/mdggisStyle.css
git commit -m "feat: enlarge partner strip and hide EuroChem"
```

---

### Task 2: Darken the application window header

**Files:**
- Modify: `scripts/verify-site-content.mjs`
- Modify: `src/mdggisStyle.css:395-420`

**Interfaces:**
- Consumes: existing `.hero-app-chrome` and `.hero-app-title` markup
- Produces: dark navy header with readable light title; no JSX changes

- [ ] **Step 1: Write the failing dark-header checks**

Add:

```js
assert.match(styles, /\.hero-app-chrome\s*\{[\s\S]*?background:\s*#183247;/);
assert.match(styles, /\.hero-app-chrome\s*\{[\s\S]*?border-bottom:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.16\);/);
assert.match(styles, /\.hero-app-title\s*\{[\s\S]*?color:\s*#c9d7e2;/);
```

- [ ] **Step 2: Run the checks and verify RED**

Run:

```powershell
node scripts\verify-site-content.mjs
```

Expected: FAIL because `.hero-app-chrome` still uses `#eef3f4`.

- [ ] **Step 3: Apply the dark header palette**

Change only the relevant declarations:

```css
.hero-app-chrome {
  height: 34px;
  background: #183247;
  border-bottom: 1px solid rgba(255,255,255,0.16);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.8rem;
}
.hero-app-title {
  margin-left: 0.4rem;
  font-size: 0.7rem;
  color: #c9d7e2;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

- [ ] **Step 4: Run the checks and verify GREEN**

Run:

```powershell
node scripts\verify-site-content.mjs
```

Expected: `Site content verification passed.`

- [ ] **Step 5: Commit the dark header**

```powershell
git add scripts/verify-site-content.mjs src/mdggisStyle.css
git commit -m "style: darken application window header"
```

---

### Task 3: Apply the supplied testimonial attribution

**Files:**
- Modify: `scripts/verify-site-content.mjs`
- Modify: `src/i18n/ru.js:140-148`
- Modify: `src/i18n/en.js:140-148`

**Interfaces:**
- Consumes: `t.testimonials.items[0].name` and `.role`
- Produces: supplied title on the first line and person name on the second line

- [ ] **Step 1: Write failing locale-data checks**

Add:

```js
assert.equal(ruData.testimonials.items[0].name, 'Главный маркшейдер ПАО «Уралкалий»');
assert.equal(ruData.testimonials.items[0].role, 'А. М. Мачерет');
assert.equal(enData.testimonials.items[0].name, 'Chief Mine Surveyor, PJSC Uralkali');
assert.equal(enData.testimonials.items[0].role, 'A. M. Macheret');
assert.equal(ruData.testimonials.items[0].initials, 'МС');
```

- [ ] **Step 2: Run the checks and verify RED**

Run:

```powershell
node scripts\verify-site-content.mjs
```

Expected: FAIL because the current first Russian testimonial name is `Главный маркшейдер`.

- [ ] **Step 3: Update both locale entries**

In `src/i18n/ru.js`, replace only the first item attribution:

```js
name: 'Главный маркшейдер ПАО «Уралкалий»',
role: 'А. М. Мачерет',
```

In `src/i18n/en.js`, replace only the first item attribution:

```js
name: 'Chief Mine Surveyor, PJSC Uralkali',
role: 'A. M. Macheret',
```

- [ ] **Step 4: Run the checks and verify GREEN**

Run:

```powershell
node scripts\verify-site-content.mjs
```

Expected: `Site content verification passed.`

- [ ] **Step 5: Commit the attribution**

```powershell
git add scripts/verify-site-content.mjs src/i18n/ru.js src/i18n/en.js
git commit -m "content: attribute Uralkali testimonial"
```

---

### Task 4: Production and rendered QA

**Files:**
- Verify: `src/App.jsx`
- Verify: `src/mdggisStyle.css`
- Verify: `src/i18n/ru.js`
- Verify: `src/i18n/en.js`
- Generated by build: `dist/`

**Interfaces:**
- Consumes: completed Tasks 1-3
- Produces: verified production build and browser evidence

- [ ] **Step 1: Run full static verification**

```powershell
node scripts\verify-site-content.mjs
npx eslint src\App.jsx src\i18n\ru.js src\i18n\en.js
npm run build
git diff --check
```

Expected: all commands exit `0`. Record any pre-existing Vite chunk-size warning separately; it is not introduced by this change.

- [ ] **Step 2: Define and run the browser target flow**

The flow under test is: `http://127.0.0.1:4174/` loads → hero application mock shows a dark readable header → partner strip shows five larger logos with no EuroChem → first testimonial shows the Uralkali title above `А. М. Мачерет`.

Use the in-app Browser:

1. Confirm URL and title.
2. Capture a fresh DOM snapshot with meaningful content and no framework overlay.
3. Inspect the hero header and capture a screenshot.
4. Scroll to the partner strip; confirm exactly five `.client-logo` elements and no `[data-logo="eurochem"]`.
5. Capture the partner strip at the default desktop viewport.
6. Scroll to the first testimonial and verify both supplied lines.
7. Set a `390 × 844` viewport, reload, and confirm `document.documentElement.scrollWidth === innerWidth`.
8. Capture the mobile partner strip.
9. Check `tab.dev.logs({ levels: ["error", "warn"], limit: 50 })`.
10. Reset the temporary viewport and finalize the deliverable tab.

- [ ] **Step 3: Review the final diff**

```powershell
git status --short
git diff --stat
git diff -- src/App.jsx src/mdggisStyle.css src/i18n/ru.js src/i18n/en.js scripts/verify-site-content.mjs
```

Expected: only the specified application, style, locale, verification, plan, and generated build files are changed.

- [ ] **Step 4: Commit final generated output if tracked**

If `dist/` is tracked and changed by the verified build:

```powershell
git add dist
git commit -m "build: refresh production assets"
```
