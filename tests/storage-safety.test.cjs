const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const app=readFileSync('app.js','utf8');
const prepare=readFileSync('scripts/prepare-android.mjs','utf8');

test('reminders continue using persistent IndexedDB storage',()=>{
 assert.ok(app.includes('indexedDB.open(DB_NAME,DB_VERSION)'));
 assert.ok(app.includes("d.createObjectStore(STORE,{keyPath:'id'})"));
 assert.ok(app.includes("db.transaction('reminders','readwrite')"));
 assert.ok(app.includes('transaction.oncomplete=()=>resolve()'));
});
test('backup export retains reminders and settings',()=>{
 const section=app.slice(app.indexOf('function exportBackup()'),app.indexOf('async function restoreBackup('));
 assert.ok(section.includes('formatVersion:3'));
 assert.ok(section.includes('reminders,settings:backupSettings()'));
});
test('backup restore validates input and asks before replacement',()=>{
 const section=app.slice(app.indexOf('async function restoreBackup('));
 assert.ok(section.includes('validateBackup(data)'));
 assert.ok(section.includes('if(!confirm('));
});
test('Android preparation copies app assets without deleting user storage',()=>{
 assert.ok(prepare.includes('copyFile(asset, destination)'));
 assert.ok(!prepare.includes('rm('));
 assert.ok(!app.includes('indexedDB.deleteDatabase('));
 assert.ok(!app.includes('localStorage.clear('));
});

test('reminder removal and clearing wait for transaction commit',()=>{
 const section=app.slice(app.indexOf('function remove(id)'),app.indexOf('async function deleteAllReminders()'));
 assert.ok(section.includes("transaction.objectStore(STORE).delete(id)"));
 assert.ok(section.includes("transaction.objectStore(STORE).clear()"));
 assert.equal((section.match(/transaction.oncomplete=\(\)=>resolve\(\)/g)||[]).length,2);
 assert.equal((section.match(/transaction.onabort=/g)||[]).length,2);
});

test('delete-all retains in-memory reminders if storage clearing fails',()=>{
 const section=app.slice(app.indexOf('async function deleteAllReminders()'),app.indexOf('const ACHIEVEMENTS='));
 assert.ok(section.includes('try{await clearAll()}catch(error)'));
 assert.ok(section.indexOf('return}reminders=[]')>section.indexOf('try{await clearAll()}catch(error)'));
 assert.ok(section.includes('Could not delete reminders. Your existing data is unchanged.'));
});
