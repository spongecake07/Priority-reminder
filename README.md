# Priority Reminders PWA

An installable Android-friendly Progressive Web App for personal reminders.

## Features
- High / Medium / Low priority reminders
- Notes and extra information
- Due date and alert time
- Add photos from the gallery
- Open the Android camera directly from a reminder
- Browser notification permission and due-reminder notifications while the app is active/resumed
- Offline support via service worker
- Local on-device storage with IndexedDB
- Search, filter, sort and completion status

## Important notification limitation
This is a static PWA designed to run on GitHub Pages. Android/browser security does not provide reliable exact scheduled alarms from a fully closed static website. The app checks due reminders while it is open and whenever it resumes, and can display browser notifications after permission is granted.

For reliable notifications at an exact time even when the app has been fully closed for hours/days, add a push backend (for example Firebase Cloud Messaging + a scheduler) or package the app as a native Android app using Capacitor and native local notifications.

## Publish on GitHub Pages
1. Put all files in the root of a GitHub repository.
2. In GitHub: **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then Save.
5. Open the Pages URL in Chrome on Android.
6. Chrome menu → **Add to Home screen** / **Install app**.
7. Open the installed app and tap the bell to grant notification permission.

## Data privacy
Reminder text and attached photos are stored locally in the browser's IndexedDB on that device. They are not uploaded to GitHub.
