/* Run locally: node tests/checklist-detection-v1232.cjs. No user storage touched. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../minna-chat-add.js'),'utf8');
const start=source.indexOf('function detectList(title){');
const end=source.indexOf('function renderChecklist()',start);
assert.ok(start>=0&&end>start,'detectList source found');
const detect=Function(source.slice(start,end)+';return detectList;')();
const cases=[
 ['Buy milk eggs vodka',3],['Buy books crayons milk',3],
 ['Get paper stapler folders',3],['Buy shampoo conditioner toothpaste',3],
 ['Buy new winter boots',0],['Buy fresh red apples',0],
 ['Buy books for school',0],['Buy milk eggs for party',0],
 ['Buy milk',0],['Call plumber tomorrow',0],
 ['Buy books, crayons and milk',3],['Buy milk and eggs',2]
];
for(const [title,count] of cases)assert.equal(detect(title)?.items.length||0,count,title);
console.log('Checklist detection: '+cases.length+' tests passed');
