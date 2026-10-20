# Android release preparation

Minna will eventually use Google Play internal testing and Play-managed updates.

## Current state
- Android package ID: `app.minna.reminders` (keep stable after Play enrollment).
- Development APKs are unsigned-for-release debug builds; they are **not** suitable for Play submission.
- Native notifications require the Capacitor local-notifications plugin and Android notification permission.
- Existing test reminders do not need to migrate to the Play version.

## Before the first Play internal-test release
1. Create a Google Play Console developer account and register the app.
2. Create a **private upload keystore**. Never commit the keystore, passwords, or base64 keys to GitHub.
3. Configure the release signing inputs in GitHub Actions secrets, or build/sign locally in a trusted environment.
4. Build a signed Android App Bundle (`.aab`) with a monotonically increasing `versionCode`, and confirm the package ID.
5. Enroll in Play App Signing, upload the AAB to internal testing, and install through Play.
6. Test notification permission, scheduled notifications while closed, offline use, and upgrade behavior.
7. Prepare store listing, privacy policy, Data safety disclosures, and any required testing/verification before production release.

## Update model
Google Play distributes native updates. The website's service-worker update control is not an Android APK updater. Avoid introducing a separate self-update mechanism for Play builds.

## Release gate
Do not publish, generate or expose signing credentials, or replace the user's installed APK automatically. Confirm the release signing and Play Console setup first.
