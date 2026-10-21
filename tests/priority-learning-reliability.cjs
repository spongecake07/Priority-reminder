/* Run locally: node tests/priority-learning-reliability.cjs. No app storage is touched. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(require('node:path').join(__dirname,'../minna-priority-learning.js'),'utf8');
function test(records,title){
 const store={'minna-priority-learning-v1':JSON.stringify({examples:records.map((e,i)=>({title:e[0],words:e[0].toLowerCase().match(/[a-z]+/g),priority:e[1],at:e[2]??(1000+i)}))})};
 const context={window:{},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},console};
 vm.runInNewContext(code,context);
 return context.window.MinnaPriorityLearning.suggest(title);
}
const bill=[['pay electricity bill','high'],['pay internet bill','high'],['pay water bill','high'],['organize old electricity bills','low'],['sort old electricity bills','low'],['file electricity bill receipts','low'],['review old electricity bills','low']];
assert.equal(test(bill,'pay electricity bill for december').priority,'high');
assert.equal(test(bill,'organize old electricity bills').priority,'low');
const repeat=Array.from({length:10},()=>['pay electricity bill','high']);
assert.equal(test(repeat,'pay electricity bill').confident,false,'duplicates are not independent evidence');
const conflict=[['review electricity bill','high'],['review electricity bill','low'],['review electricity bill records','high'],['review electricity bill records','low'],['review old electricity bill','high'],['review old electricity bill','low']];
assert.equal(test(conflict,'review electricity bill').confident,false,'conflicting evidence should not be confident');
assert.equal(test([['sort receipts folder','misc'],['sort receipts documents','misc'],['sort receipts archive','misc']],'sort receipts').priority,'misc');
assert.equal(test([['call plumber','medium'],['call electrician','medium'],['call contractor','medium']],'call plumber').priority,'medium');
// Controlled recency: identical vocabulary and order, only priority timestamps change.
const recencyOld=[['review garden tools','low',100],['review garden equipment','low',101],['review garden supplies','low',102],['review garden tools','high',200],['review garden equipment','high',201],['review garden supplies','high',202]];
const recencyNew=recencyOld.map(([title,priority,at])=>[title,priority,302-at]);
const newerHigh=test(recencyOld,'review garden tools');
const newerLow=test(recencyNew,'review garden tools');
assert.ok(newerHigh.scores.high>newerHigh.scores.low,'newer high examples must weigh more');
assert.ok(newerLow.scores.low>newerLow.scores.high,'reversing timestamps must reverse weighted evidence');
assert.equal(newerHigh.confident,false,'close competing priorities remain uncertain');
assert.equal(newerLow.confident,false,'close competing priorities remain uncertain');
for(const p of ['high','medium','low','misc'])assert.equal(test([['check garden tools',p],['check garden equipment',p],['check garden supplies',p]],'check garden tools').priority,p);
const storeTest=test([['pay power bill','high']],'pay power bill');
assert.equal(storeTest.examples,1,'Test Lab suggestion does not record new examples');
console.log('Priority learning reliability tests passed');
