const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const app=readFileSync('app.js','utf8');
const workflow=readFileSync('.github/workflows/android-debug-apk.yml','utf8');

test('Android APK declares exact-alarm permission',()=>{
 assert.match(workflow,/android\\.permission\\.SCHEDULE_EXACT_ALARM/);
});
test('native notification synchronization preserves unchanged pending alarms',()=>{
 const section=app.slice(app.indexOf('async function syncNativeNotifications()'),app.indexOf('async function requestNotifications()'));
 assert.match(section,/nativeExactAlarmGranted\\(plugin\\)/);
 assert.match(section,/sameTime/);
 assert.match(section,/if\\(previous&&sameTime/);
 assert.match(section,/if\\(additions\\.length\\)await plugin\\.schedule/);
 assert.match(section,/const stale=existing\\.filter/);
 assert.doesNotMatch(section,/existing\\.map\\(n=>\\(\\{id:n\\.id\\}\\)\\)/);
});
test('exact alarm access is checked before scheduling in permission flow',()=>{
 const section=app.slice(app.indexOf('async function requestNotifications()'),app.indexOf('async function fireNotification('));
 assert.ok(section.indexOf('nativeExactAlarmGranted(native)')<section.indexOf('await syncNativeNotifications()'));
});
