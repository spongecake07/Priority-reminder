# Minna CSS architecture policy

## Source of truth
- `styles.css`: foundational layout and fallback styling.
- `nav-polish.css`: historical layout/interaction compatibility. **Do not add new appearance overrides here.**
- `minna-theme.css`: authoritative current visual design (tokens, card surfaces, colors, shadows and radius).
- For any new visual change, edit the *existing* component declaration in `minna-theme.css`; never append a version-numbered CSS override.
- Define shared values once in `:root`, e.g. `--ui-surface-border`, `--ui-elevation`, `--ui-r`.
- Do not introduce additional `!important` declarations. Remove old conflicts when safely tested.
- Home and Calendar reminder cards must use the same surface treatment.
- Keep functional controls, checklist rows, navigation separators, photo borders and accessibility focus outlines independent of card-surface borders.

## Mandatory update checklist
1. Read all three stylesheets and locate *all* selectors affecting the target, including theme/scheme, pseudo-elements, nested containers, and `!important`.
2. Modify or delete the old source declarations, rather than adding a higher-specificity override.
3. Check collapsed/expanded reminders, dated reminders, completed reminders, Home, Calendar, dashboard, color schemes, light/dark, and mobile viewport.
4. Run the CSS architecture check (`node scripts/check-css-architecture.mjs`).
5. Verify browser-computed styles and screenshots whenever a browser test environment is available. Source checks alone are not visual verification.
6. Preserve reminder storage, photos, achievements, backup and app functionality.
7. Bump visible version, all asset query versions, and service-worker cache together.

## Incremental migration
The legacy stylesheets still contain duplicate historical declarations. Do **not** bulk-delete them: past removal broke layouts. Move each component to one authoritative declaration in small, independently tested releases. Any remaining historical `!important` is technical debt, not a precedent for adding more.
