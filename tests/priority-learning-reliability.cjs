/* Run locally: node tests/priority-learning-reliability.cjs. No app storage is touched. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(require('node:path').join(__dirname,'../minna-priority-learning.js'),'utf8');
function test(records,title){
 const store={'minna-priority-learning-v1':JSON.stringify({examples:records.map((e,i)=>({title:e[0],words:e[0].toLowerCase().match(/[a-z]+/g),priority:e[1],at:1000+i}))})};
 const context={window:{},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},console};
 vm.runInNewContext(code,context);
 return context.window.MinnaPriorityLearning.suggest(title);
}
const bill=[['pay electricity bill','high'],['pay internet bill','high'],['pay water bill','high'],['organize old electricity bills','low'],['sort old electricity bills','low'],['file electricity bill receipts','low']];
assert.equal(test(bill,'pay electricity bill for december').priority,'high');
assert.equal(test(bill,'organize old electricity bills').priority,'low');
const repeat=Array.from({length:10},()=>['pay electricity bill','high']);
assert.equal(test(repeat,'pay electricity bill').confident,false,'duplicates are not independent evidence');
const conflict=[['review electricity bill','high'],['review electricity bill','low'],['review electricity bill records','high'],['review electricity bill records','low'],['review old electricity bill','high'],['review old electricity bill','low']];
assert.equal(test(conflict,'review electricity bill').confident,false,'conflicting evidence should not be confident');
assert.equal(test([['sort receipts','misc'],['sort bills','misc'],['sort invoices','misc']],'sort receipts').priority,'misc');
assert.equal(test([['call plumber','medium'],['call electrician','medium'],['call contractor','medium']],'call plumber').priority,'medium');
console.log('Priority learning reliability tests passed');
