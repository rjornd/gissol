# Partner strip, application window header, and testimonial attribution

## Scope

Apply four focused presentation changes to the existing landing page:

1. Enlarge the partner strip and its logos by 25%.
2. Temporarily hide EuroChem while keeping its data and asset available for restoration.
3. Restyle the mock application window header to match the dark program interface.
4. Replace the first testimonial attribution with the supplied Uralkali title and name.

## Partner strip

- Increase strip padding by 25% at each breakpoint: desktop `3rem` → `3.75rem`, tablet `2.5rem 1.5rem` → `3.125rem 1.875rem`, and mobile `2.25rem 1rem` → `2.8125rem 1.25rem`.
- Increase regular logo bounds from `150 × 72 px` to `187.5 × 90 px`.
- Increase the two intentionally compact logos (Mining Institute and Perm Polytechnic) from `112 × 54 px` to `140 × 67.5 px`.
- Increase each logo cell's minimum height from `104 px` to `130 px`.
- Render five desktop columns after EuroChem is hidden.
- Keep three columns at tablet width and two columns at mobile width.
- Hide EuroChem by filtering `logoKey === "eurochem"` in the rendered list. Do not delete its translations or image asset.
- Remove the now-unused EuroChem-specific alignment transform.

## Application window header

- Change `.hero-app-chrome` from a pale surface to the same dark blue family as the program screenshot.
- Use a subtle lighter border at the bottom so the header remains distinct from the screenshot.
- Render the title in a light blue-gray with sufficient contrast.
- Keep the red, amber, and green window indicators unchanged.

## Testimonial attribution

- Russian first testimonial:
  - title: `Главный маркшейдер ПАО «Уралкалий»`
  - second line: `А. М. Мачерет`
- English counterpart:
  - title: `Chief Mine Surveyor, PJSC Uralkali`
  - second line: `A. M. Macheret`
- Keep the testimonial quotation and avatar initials unchanged.

## Validation

- Add regression checks for the five visible partner entries, the hidden EuroChem entry, the 25% logo sizing, the dark application header, and the testimonial attribution.
- Verify the rendered page at desktop and mobile widths.
- Confirm that the partner strip has no clipping or horizontal overflow.
- Confirm that the dark application header remains readable and that the hero screenshot is unaffected.
- Confirm that the first testimonial shows the new title above the name.
- Check page identity, meaningful DOM content, absence of framework overlays, and browser console health.
