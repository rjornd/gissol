# Fourth case metric card

## Goal

Add a fourth metric card to the flagship case section without removing or changing the existing three metrics.

## Content

- Place the new card first so the strongest adoption metric leads the row.
- Russian: `800+` with the label `специалистов работают / в системе`.
- English: `800+` with the label `specialists work / in the system`.
- Preserve the existing `15`, `24/7`, and `6` cards and their translations.

## Layout

- Wide screens: four equal-width cards in one row.
- Screens up to 900 px: a balanced 2 × 2 grid.
- Screens up to 560 px: one card per row.
- Reuse the existing metric card component and visual tokens; no new component or asset is needed.

## Implementation

- Add the localized metric as the first item in `case.metrics` in both language files.
- Update only the grid column rules in `mdggisStyle.css`.
- Keep rendering data-driven through the existing `t.case.metrics.map(...)` code.

## Verification

- Add a content check that expects four case metrics and the new localized value.
- Verify the test fails before the content is added and passes afterward.
- In the browser, confirm four cards on desktop, 2 × 2 at tablet width, one column on mobile, and no relevant console errors.
- Run the production build and the existing site-content verification.

