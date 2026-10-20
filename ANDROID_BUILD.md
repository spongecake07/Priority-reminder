# Minna Android debug builds

The GitHub Actions workflow **Android debug APK** builds a Capacitor Android app from the current GitHub Pages source files. Android package ID: `app.minna.reminders`.

## Run without a PC
Open this repository in GitHub → **Actions** → **Android debug APK** → **Run workflow** (main). Once the run finishes, open its **Artifacts** section and download **minna-android-debug**. Unzip to obtain `app-debug.apk`.

## Important
- The build uses a new ephemeral debug signing key. It generally **cannot update** the old debug APK in place. Uninstall the old debug APK before installing the new one **only after backing up any data you wish to keep**.
- Debug builds are for testing, not Play Store release. Production requires stable signing credentials, a release build, and testing.
- The APK contains a snapshot of the web files at build time. Web changes on GitHub Pages do **not** update the APK automatically. Run the workflow again for new Android test versions.
- This workflow does not upload, erase, or migrate reminders and photos. They remain in each installation's local app storage.
- If the workflow fails, inspect its logs before attempting to install anything.
