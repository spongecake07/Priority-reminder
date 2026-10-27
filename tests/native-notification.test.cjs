const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const app=readFileSync('app.js','utf8');
const workflow=readFileSync('.github/workflows/android-debug-apk.yml','utf8');

test('Android APK declares exact-alarm permission',()=>{
 assert.ok(workflow.includes('android.permission.SCHEDULE_EXACT_ALARM'));
});
test('native notification synchronization preserves unchanged pending alarms',()=>{
 const section=app.slice(app.indexOf('async function syncNativeNotifications()'),app.indexOf('async function requestNotifications()'));
 assert.ok(section.includes('nativeExactAlarmGranted(plugin)'));
 assert.ok(section.includes('sameTime'));
 assert.ok(section.includes('if(previous&&sameTime'));
 assert.ok(section.includes('if(additions.length)await plugin.schedule'));
 assert.ok(section.includes('const stale=existing.filter'));
 assert.ok(!section.includes('if(existing.length)await plugin.cancel'));
});
test('exact alarm access is checked before scheduling in permission flow',()=>{
 const section=app.slice(app.indexOf('async function requestNotifications()'),app.indexOf('async function fireNotification('));
 assert.ok(section.indexOf('nativeExactAlarmGranted(native)')<section.indexOf('await syncNativeNotifications()'));
});
