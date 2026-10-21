/* node tests/category-learning-v1233.cjs — isolated localStorage, no app data modified */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../minna-category-learning.js'),'utf8');
const store={},window={};
vm.runInNewContext(code,{window,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},console});
const api=window.MinnaCategoryLearning,cats=['Shopping','Finances','Groceries','Car'];
assert.equal(api.suggest('Buy milk eggs vodka',cats),'Shopping');
assert.equal(api.suggest('Pay electricity bill',cats),'Finances');
assert.equal(api.suggest('Unknown task',cats),'');
assert.equal(api.examples().length,0,'suggestions must not train');
api.record('Buy milk eggs vodka','Groceries');
api.record('Buy milk eggs vodka','Groceries');
assert.equal(api.suggest('Buy milk eggs vodka',cats),'Groceries','manual corrections become suggestions');
assert.equal(api.examples().length,2);
assert.equal(api.suggest('Buy milk eggs vodka',['Shopping']),'Shopping','never suggest unavailable categories');
console.log('Category learning tests passed');
