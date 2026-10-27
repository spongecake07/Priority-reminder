# Minna release candidate — Android functional test plan

Status: **NOT YET TESTED**. Baseline: app v1.294, commit `078a32d`.

## Before testing
- [ ] Export a backup and verify the JSON file exists and contains expected reminder records and settings. Keep a second copy off-device.
- [ ] Record the APK build/run, Android version, device, test date, and notification permissions.
- [ ] Install the APK **over** the existing app if signatures match; do not uninstall or clear app data.
- [ ] Confirm existing reminders, attached photos, checklist states, achievements, learning and settings remain intact.
- [ ] Use separate disposable test reminders clearly prefixed `TEST:`; do not delete existing user data.

## Core reminders — record PASS / FAIL and notes for each
- [ ] Create a high-priority reminder with date, time, notes and alert; reopen it and verify fields persist.
- [ ] Edit title, priority, date and time; close and reopen the app; verify edits persist.
- [ ] Add several checklist items; toggle each by tapping the row; reorder/edit/delete a test item; restart and verify state.
- [ ] Attach a gallery photo and a camera photo; open them after restarting; confirm they remain viewable.
- [ ] Mark a reminder complete, then undo completion; verify counts and achievements behave as expected.
- [ ] Verify Everything / Today / Upcoming / Overdue and category filters show the expected test reminders.
- [ ] Verify Smart Add parses a plain reminder and a multi-item shopping checklist; edit before confirming.
- [ ] Soft-delete a test reminder and restore it from Recently Deleted; verify its notes/photos/checklist survive.
- [ ] Permanently delete **only a disposable test reminder** and verify it stays deleted after restart.

## Notifications — test on actual Android device
- [ ] Grant notifications and Alarms & reminders permission; schedule a TEST alert 2–3 minutes ahead while app is open; record expected vs actual time.
- [ ] Schedule a second TEST alert; send app to background, use another app; confirm heads-up, sound, vibration and timing.
- [ ] Schedule a third TEST alert; lock the phone, leave Minna closed/in background; verify delivery and timing.
- [ ] Edit the time of a future TEST alert; verify no alert fires at the old time and exactly one fires at the new time.
- [ ] Complete or delete a future TEST reminder; confirm its scheduled alert does not fire.
- [ ] Reboot the phone with a future TEST reminder pending; check whether the alert survives. **Treat failure as a release blocker** until behavior is understood.
- [ ] Test with battery optimization enabled and under typical power-saving conditions; record any delays.

## Backup, restore and upgrade safety
- [ ] Export a backup including photos, checklists, achievements, settings and learned priorities; inspect backup file before restoring.
- [ ] On a **separate test install/device** with disposable data, restore a valid backup; verify record counts and representative photos/checklists/settings.
- [ ] On the test install, try a malformed backup and a cancelled restore; verify existing data remains unchanged.
- [ ] On the test install, simulate an upgrade by installing a newer same-signature APK over the old one; verify all local data persists.
- [ ] Test offline: create/edit/reopen reminders without network access; confirm persistence and app startup.

## Release blockers and exit criteria
- Any lost or corrupted reminder, photo, checklist, achievement or settings data is a blocker.
- Missed or materially late scheduled alerts, duplicate alerts, or uncancelled edited/deleted alerts are blockers until resolved.
- Crashes or nonfunctional primary controls are blockers.
- All core workflows and backup/upgrade tests must pass on the target Android device before release candidate sign-off.
- A successful GitHub Actions run is necessary but **not** a substitute for device tests.

## Test log
| Date / device / APK | Scenario | Result (PASS/FAIL) | Evidence / notes | Issue |
|---|---|---|---|---|
| | | NOT TESTED | | |

## Separate release prerequisites
- Android: Play Console setup, upload signing, signed AAB, store listing, privacy policy/Data safety disclosures, internal testing.
- iOS: macOS/Xcode and Apple Developer provisioning, Capacitor iOS project, permission and notification validation, TestFlight testing.
