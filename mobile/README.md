# Minna mobile proof of concept

This branch is isolated from the GitHub Pages production app. No production data or code has been changed.

## Status
- Capacitor configuration and native local-notification dependency declared.
- Native Android/iOS projects have **not** been generated or tested.
- Reliable notification scheduling, mobile backup/restore and existing-user migration are **not yet implemented**.

## Before native generation
The existing web app is served from the repository root, but Capacitor requires a web assets directory. Prepare a `www/` output containing `index.html`, JavaScript, CSS, manifest, icons and other required static assets. Exclude native folders and development files. Keep `main` unchanged.

Run `npm install`, then `npx cap add android` and `npx cap add ios` on a suitable development machine (iOS requires macOS/Xcode), after assets are prepared. Run `npx cap sync` after changes.

## Safety gates
1. Export and verify a backup from the original PWA before migration.
2. Test import of existing JSON format 2 and 3 backups, including photos, settings and achievements.
3. Do not rename IndexedDB `priority-reminders-db` or its reminder store.
4. Native notifications must be scheduled, updated and canceled with reminder lifecycle changes; verify delivery on real Android and iOS devices.
5. Do not claim release readiness without actual device tests.

No changes to the live PWA are included in this proof-of-concept setup.
