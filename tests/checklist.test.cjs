'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'..','minna-chat-add.js'),'utf8');
function extract(start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a);
 assert.ok(a>=0&&b>a,'Parser anchors must exist');
 return source.slice(a,b);
}
const context=vm.createContext({});
vm.runInContext(extract('function detectList(title){','function renderChecklist()'),context);
const detect=title=>{const result=context.detectList(title);return result?Array.from(result.items,x=>x.text):null;};
const cases=[
 ['Buy water milk and clothes',['Water','Milk','Clothes']],
 ['Buy water, milk and clothes',['Water','Milk','Clothes']],
 ['Buy eggs; bread; milk',['Eggs','Bread','Milk']],
 ['Buy eggs plus milk',['Eggs','Milk']],
 ['Buy peanut butter and milk',['Peanut butter','Milk']],
 ['Buy chicken soup and bread',['Chicken soup','Bread']],
 ['Buy orange juice milk and bread',['Orange juice','Milk','Bread']],
 ['Buy phone charger and batteries',['Phone charger','Batteries']],
 ['Buy large eggs and milk',['Large eggs','Milk']],
 ['Buy a new phone charger and batteries',['A new phone charger','Batteries']],
 ['Buy a new winter jacket and socks',['A new winter jacket','Socks']],
 ['Buy water milk clothes',['Water','Milk','Clothes']],
 ['Buy peanut butter ice cream and milk',['Peanut butter','Ice cream','Milk']],
 ['Buy a new phone',null],
 ['Buy winter boots',null]
];
for(const [input,expected] of cases)test('checklist: '+input,()=>assert.deepEqual(detect(input),expected));
test('checklist deletion button and delegated removal remain present',()=>{
 assert.match(source,/data-mc-remove/);
 assert.match(source,/checkItems\.splice\(Number\(b\.dataset\.mcRemove\),1\)/);
});
test('checklist is saved through existing quick-add adapter',()=>{
 assert.match(source,/window\.minnaChatChecklistPayload=checkItems\.map/);
 assert.match(source,/quickAddForm'\)\.requestSubmit\(\)/);
});
test('date and time parsing code remains present',()=>{
 assert.match(source,/function parse\(raw\)/);
 assert.match(source,/day after tomorrow/);
 assert.match(source,/mcDate/);
 assert.match(source,/mcTime/);
});
