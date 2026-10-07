# Minna — Development Handoff

Use this document when continuing Minna in a new ChatGPT conversation. **Before editing anything, fetch the current GitHub files. GitHub is the source of truth.**

## Project
- App name: **Minna**
- Repository: `spongecake07/Priority-reminder`
- Branch: `main`
- Live app: `https://spongecake07.github.io/Priority-reminder/`
- Current cache-busted build at handoff: **v57**
- Current test URL: `https://spongecake07.github.io/Priority-reminder/?v=57`
- Static GitHub Pages PWA, primarily used on Android.
- Main files: `index.html`, `styles.css`, `nav-polish.css`, `app.js`, `service-worker.js`, `manifest.json`.
- Icons: `icons/icon-192.png`, `icons/icon-512.png`.

## Non-negotiable data safety
- IndexedDB database is named **`priority-reminders-db`**. DO NOT rename it: existing reminders would appear lost.
- Reminder data/photos are local to the user's browser/device, not GitHub.
- Do not tell the user to clear app/site data casually. Export a backup first if storage/reinstall work is ever required.
- Backup JSON currently preserves reminders/photos. Preserve backward compatibility with existing backups.
- **Start Fresh deletes reminders only. It must NOT erase lifetime stars, achievements, productive days, rank, profile name, categories, theme, or other progress.**
- Profile name localStorage: `minna-profile-name`
- Custom categories localStorage: `minna-custom-categories`
- Lifetime progress localStorage: `minna-lifetime-progress`
- Developer rank override: `minna-dev-rank`
- Developer color scheme preview: `minna-dev-scheme`
- Theme storage remains `priority-reminders-theme`.

## Working method
- User expects app changes to be made directly in GitHub when they say “do it/go ahead”.
- Always fetch the latest file + SHA immediately before updating that file.
- Make small edits; `app.js` has been accidentally corrupted by broad replacements before.
- Do not generate an image when the user gives a screenshot/reference and asks to change the app. Use it as a visual reference and edit code.
- After UI/code changes, bump query versions in `index.html` and service-worker cache/assets so the Android PWA gets fresh files.
- Never claim syntax validation unless it was actually run.
- Keep confirmations concise and include the versioned live-app link.

## Product direction
Minna is a calm, compact reminder/PWA. The user prefers:
- polished but space-efficient UI
- welcoming/premium rather than corporate
- Home, Calendar and You to look visually consistent
- colorful rank badges/rewards without excessive gamification
- expanded checklist chips to use little vertical/horizontal space
- Calendar reminder cards to behave like Home cards
- dedicated edit controls; tapping cards expands/collapses
- local-first data and safe backups

## Core reminder features
- High / Medium / Low / Miscellaneous priorities
- title, notes, due date, alert time, notification toggle
- category/project
- checklist
- camera/gallery photos, compression, max 8
- IndexedDB persistence
- complete/incomplete, soft delete, edit, search, filters, sorting
- views: All / Today / Upcoming / Overdue / Completed / Pinned
- repeating reminders
- Recently Deleted + Undo
- full-screen photo viewer
- backup/restore JSON including photos
- monthly Calendar
- category icons + custom categories
- pin reminders
- Light/Dark theme
- bottom navigation: Home / Calendar / + / Pinned / You

## Notification limitation
Because this is a static GitHub Pages PWA, exact scheduled notifications are not guaranteed when the app/browser is fully closed or suspended. Current notifications work while active/resumed. Reliable closed-app Android alarms would require native local notifications/Capacitor or push infrastructure such as FCM. Do not promise otherwise.

## Home organization
Normal All view is grouped:
**Overdue → Today → Tomorrow → Upcoming → No Date → Completed**
Selected sort applies within each section. Specific smart views avoid redundant section headings.

## Categories
Built-ins currently include House, Bathroom, Car, Family, Shopping, Work, Repairs, Documents, Appointments, Garden, Pets, Health & Fitness, Cooking, Ideas, Finances, Travel, Education, Renovation, Moving, Personal, Self Care, Clothing, Reading, Leisure, Communication, Trash & Recycling, Maintenance, Seasonal, Other.
Custom category deletion currently does not migrate old reminders; old reminders fall back to a generic icon.

## Achievements and lifetime progress
Completion milestones:
1 First Step; 3 Getting Started; 5 Five Down; 10 On a Roll; 25 Momentum; 50 Making It Happen; 75 Steady Pace; 100 Century; 150 Committed; 250 Quarter Thousand; 300 Task Tamer; 500 Halfway to a Thousand; 750 Unstoppable; 1000 One Thousand Strong; 1500 Master of Momentum; 2000 Two Thousand Done; 3000 Productivity Pro; 4000 Remarkable Routine; 5000 Minna Legend.

Special achievements include Morning Spark, Picture This, Snapshot Day, Step by Step, Big One Done, Back on Track, Sorted Out, Clean Slate, Three-Day Rhythm, Week of Wins, Month Maker, Century of Days, Memory Keeper, Checklist Champion, Priority Pro.

Lifetime stars are awarded from completion tracking. Current implementation may count complete → incomplete → complete again because there is no unique completion ledger yet.

## Ranks
Current code rank thresholds may still be the older values:
- Seedling 0
- Bronze 10
- Silver 50
- Gold 150
- Platinum 350
- Diamond 750
- Sapphire 1500
- Emerald 3000
- Ruby 6000
- Master 10000

A later visual reference showed desired ranges of Seedling 0–49, Bronze 50–199, Silver 200–499, Gold 500–999, Platinum 1000–1999, Diamond 2000–2999, Sapphire 3000–4999, Emerald 5000–9999, Ruby 10000–19999, Master 20000+. **These ranges have not necessarily been aligned in code yet.** Verify before changing.

Badges are hard-coded HTML/CSS, not image assets. Reference direction:
Seedling sprout medal; Bronze/Silver/Gold faceted star coins; Platinum icy star/laurels; Diamond bright blue diamond shield; Sapphire blue gem/laurels; Emerald green gem/laurels; Ruby red gem with crown/gold laurels; Master purple/gold shield with multicolor star and gold laurels.

## Temporary Developer Tools
Keep for now; user explicitly wants them removed before final release.
Developer Tools currently include:
1. rank preview selector (does not modify real progress)
2. Color Scheme Preview

## Color Scheme Preview — current active work
Added in v54 and refined through v57:
- Current
- Soft Blush
- Sage & Cream
- Lavender Mist
- Warm Sand
- Cloud Blue

The palette system uses CSS custom properties in the tail of `nav-polish.css`, including:
`--scheme-bg`, `--scheme-surface`, `--scheme-soft`, `--scheme-primary`, `--scheme-primary2`, `--scheme-text`, `--scheme-muted`, `--scheme-border`, `--scheme-nav`.

v55 expanded palette coverage/readable text.
v56 targeted hard-coded Search & Filters, page backgrounds, Calendar controls, quick-add elements and navigation.
v57 specifically fixed the center **+** button after a broad themed-button selector was overriding its fill. The high-specificity rule at the end of `nav-polish.css` targets `#addBtn.bottom-nav-add` and should give it a filled primary-color gradient, white +, and themed outer ring.

**Important:** The user was actively visually testing Warm Sand and other schemes via screenshots. Continue checking for old hard-coded navy/purple/white colors that don't follow the selected palette. Because `nav-polish.css` has accumulated many historical overrides, specificity/order conflicts are likely. Prefer targeted cleanup or eventual consolidation rather than adding uncontrolled broad rules.

## Current personalized header
Home header includes Minna logo/wordmark/tagline on left and user's locally stored name, rank, achievement count, and rank badge on right. Tapping profile area opens You. The user can edit their name in You.

## Known/possible technical debt
- `nav-polish.css` is now very large (~100 KB at this handoff) with historical overrides; CSS consolidation would improve maintainability.
- Recently Deleted historically had a possible double-toggle issue.
- Deleted reminder notification/category filtering should be checked for `deletedAt`.
- Repeat without due date needs defensive handling.
- Monthly/yearly repeat around Jan 31 may need date clamping.
- Undo only remembers last deletion.
- Custom categories are not currently included in reminder JSON backup.
- Recurring checklist reset is intentional.
- Completion stats can potentially be farmed by toggling completion repeatedly.
- Dead sample-reminder helper code may remain even though sample reminders are no longer displayed.

## Google Calendar discussion
No Calendar integration has been implemented. Future options discussed:
- simple per-reminder “Add to Google Calendar” prefilled URL (lowest complexity)
- one-way OAuth/API sync
- two-way sync (substantially more involved)
Recommendation discussed was to start with optional per-reminder Add to Calendar rather than automatically cluttering the calendar.

## Current file state at handoff
At the moment this handoff was created:
- `index.html` blob SHA: `a09bfab57c2cf154bcc125d6629d32dd96721981`
- `styles.css` blob SHA: `9a25f69c40440551ff8d87838350328c30b4f0b2`
- `nav-polish.css` blob SHA: `9c33202d6e9cdb37a907046381064f31911ef655`
- `app.js` blob SHA: `54bd8a2c964a15fb13dbd75645962e09d0d85236`
- `service-worker.js` blob SHA: `b21d706eb0460e9737c09fa70cca6e3009b1dc17`
- `manifest.json` blob SHA: `4e7ca0f5981aa1f7b58d3eadfc75533a1bc69a5d`

These SHAs are only a snapshot. **Always refetch current SHAs in the new conversation.**

## First message for a new chat
Paste/send:
> Continue developing my Minna app from the GitHub repository `spongecake07/Priority-reminder`. Read `MINNA_HANDOFF.md` first, then fetch the current files before making changes. GitHub is the source of truth. Preserve all local reminder data, achievements and existing functionality. We were most recently refining the selectable color schemes and fixing remaining hard-coded colors; v57 specifically fixed the center + button fill.



# HANDOFF UPDATE — v1.27 (2026-10-07)

This section is the newest source-of-truth handoff. Read it first in a new chat, then fetch the current GitHub files before changing anything.

## Current release
- Repository: `spongecake07/Priority-reminder`
- Branch: `main`
- GitHub is the source of truth.
- Current visible version: **v1.27**
- Current cache/query version: **127**
- Current service worker cache: `minna-v127`
- Current assets include `nav-polish.css?v=127`, `minna-theme.css?v=127`, and `app.js?v=127`.
- Do not bump the version for documentation-only changes.

## Required workflow
1. Before any app change, tell the user exactly what will change in a short bullet list.
2. Wait for the user's explicit **Ok**.
3. Read this handoff and refetch every relevant GitHub file immediately before editing. Never reuse an old SHA.
4. Preserve reminders, photos, achievements, settings, categories, themes, manual ordering, and all existing functionality.
5. For a release, increment visible version and synchronize every cache/query version in `index.html` and `service-worker.js`.
6. Verify every GitHub write returned a commit before claiming completion.
7. After a successful release, the user wants only: `Done — v1.xx`. Do not send the deployment link.

## Recent releases
### v1.20 — reminder card polish
Improved reminder hierarchy, typography, spacing, completed state, checklist spacing, action buttons, and pinned styling without changing the established layout.

### v1.21–v1.25 — checklist interaction
The user requested checklist items be selectable/unselectable by tapping anywhere on the checklist item, not only the checkbox.
- The first implementation caused toggle problems and was corrected.
- Current implementation uses a controlled `.checklist-row` as the click target on both Home and Calendar.
- The checkbox inside the row has `pointer-events:none`; the row performs exactly one app-controlled toggle.
- Full-row check/uncheck is confirmed working by the user.
- The original compact checklist-chip appearance was restored after the interaction change.
- A brief blue browser tap flash was suppressed with transparent tap highlight/focus styling.
- Do not revert checklist rows to native label-driven toggling without carefully handling the double/native click behavior.

Current conceptual markup:
`<div class="checklist-row" data-action="check" data-check-index="..." role="checkbox" aria-checked="..."><input type="checkbox" tabindex="-1" ...><span>...</span></div>`
Calendar uses `data-calendar-action="check"`.

### v1.26 — controlled CSS cleanup
Removed about 1.9 KB of obsolete legacy checklist styling from `nav-polish.css` and consolidated superseded checklist rules in `minna-theme.css`. No intended visual/functional change.

### v1.27 — reminder-card legacy cleanup
Removed about 4.5 KB more obsolete reminder-card CSS from `nav-polish.css`, including deleted `.priority-bar` markup styling, old priority-bar-dependent collapsed-card rules, and obsolete expand/collapse chevron styling. No intended visual/functional change.

After v1.27:
- `nav-polish.css` is still large (~153 KB) and contains additional historical CSS.
- `minna-theme.css` remains the current visual source of truth and loads after legacy CSS.
- Continue cleanup only in small, controlled stages with no visual regressions.

## Critical UI baselines — do not regress
- Expanded reminder actions are exactly four equal-width buttons in one row: **Pin | Calendar | Edit | Done**.
- Home and Calendar reminder cards must remain aligned in appearance and behavior.
- No expand/collapse chevrons/arrows on reminder cards.
- Urgency is shown through card-body gradients; do not restore old priority rails or `.priority-bar` markup.
- Expanded dated reminders use the left due column with category/date/time and notification bell.
- Checklist progress bar remains; textual `0/5`-style progress counter should not be reintroduced on Home.
- Checklist items remain compact chips and the **entire chip/row is tappable** to check or uncheck.
- Checklist tapping must not produce a blue panel flash.
- Pinned action is visually yellow.
- Collapsed Today's Summary remains compact like Today's Progress.
- Current design direction: black background, charcoal panels, dark-gray borders, soft off-white text, cyan accent, Samsung One UI-inspired, clean and compact.

## Data safety
- Reminder database: IndexedDB `priority-reminders-db`; preserve its object store/key behavior.
- Achievements/lifetime state are stored separately in localStorage.
- Start Fresh deletes reminders only; it must not wipe lifetime progress/profile/categories/theme/etc.
- Backup JSON must remain compatible with reminders and photos.
- Manual order remains in localStorage key `minna-manual-order`; do not migrate it into reminder records.
- Do not advise clearing app/site data without first protecting/exporting user data.

## CSS architecture / cleanup status
- `nav-polish.css`: legacy structural/history file, still ~153 KB after v1.26/v1.27 cleanup.
- `minna-theme.css`: current visual source of truth.
- Avoid solving conflicts by endlessly appending overrides. When safe, remove obsolete legacy rules and keep one canonical current rule.
- Cleanup already completed:
  - v1.17: consolidated glance/filter override chain.
  - v1.26: removed obsolete legacy checklist rules.
  - v1.27: removed obsolete priority-bar/reminder-card/chevron rules.
- Good next cleanup stages:
  1. Remaining duplicated collapsed/expanded reminder-card rules.
  2. Remaining historical Home/Summary/filter rules.
  3. Calendar/Home duplicated card styling.
  4. Old hard-coded colors replaced by theme variables.
  5. Dead selectors for UI elements that no longer exist.
  6. Only after CSS stabilizes, controlled `app.js` dead-code cleanup.
- Always regression-check Home, Calendar, checklist, photos, Add/Edit, completed reminders, themes, and mobile layout after cleanup.

## Feature work still available
Previously discussed improvements that are not yet completed:
- Home hierarchy/spacing refinement.
- Faster Add Reminder flow.
- Snooze/reschedule shortcuts.
- Smarter notification presets.
- Quick swipe/long-press actions.
- Calendar refinement.
- Backup/restore improvements.
- PWA reliability: update detection, offline behavior, service-worker recovery, and safer caching.
- Final systematic testing/regression pass.

The user briefly selected PWA reliability (#8) but changed their mind before implementation and chose code cleanup (#9). Therefore **PWA reliability work has NOT yet been implemented**.

## Known caveat
A historical `updateHomeFilterStatus()` implementation may target the first `small` inside the Home filter toggle and could replace the Today label with status text. Do not silently change this unless verified/currently relevant or the user approves it.

## New-chat instruction
When the user starts a new chat and asks to continue Minna development:
- Read this file first.
- Fetch the latest GitHub versions of `index.html`, `app.js`, `nav-polish.css`, `minna-theme.css`, and `service-worker.js`.
- Treat GitHub `main` as authoritative.
- Do not assume this handoff's SHAs are still current.
- Preserve all local user data and established UI baselines.
