/* Local Priority Learning v1: suggestion only, explicit user confirmation required. */
(()=>{
'use strict';
const KEY='minna-priority-learning-v1',PRIORITIES=['high','medium','low','misc'];
const words=s=>String(s||'').toLowerCase().match(/[a-zà-ÿ0-9]+/g)?.filter(w=>w.length>2&&!['the','and','for','with','tomorrow','today','this','that','remind','please'].includes(w))||[];
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return {examples:Array.isArray(x.examples)?x.examples.slice(-200):[]}}catch{return {examples:[]}}}
function suggest(title){
 const examples=read().examples,terms=new Set(words(title));const scores={high:0,medium:0,low:0,misc:0};let matches=0;
 for(const e of examples){if(!PRIORITIES.includes(e.priority)||!Array.isArray(e.words))continue;const overlap=e.words.filter(w=>terms.has(w)).length;if(overlap){scores[e.priority]+=overlap/Math.max(2,e.words.length);matches++}}
 const ranked=PRIORITIES.slice().sort((a,b)=>scores[b]-scores[a]);const best=ranked[0];const confident=matches>=3&&scores[best]>=1.2&&scores[best]>=scores[ranked[1]]*1.7;
 return {priority:confident?best:'medium',confident,examples:examples.length};
}
function record(title,chosen,predicted){
 if(!PRIORITIES.includes(chosen)||!String(title||'').trim())return;
 const state=read();state.examples.push({words:[...new Set(words(title))].slice(0,25),priority:chosen,predicted:PRIORITIES.includes(predicted)?predicted:'medium',at:Date.now()});
 state.examples=state.examples.slice(-200);
 try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){console.warn('Priority learning storage unavailable',e)}
}
window.MinnaPriorityLearning={suggest,record,stats:()=>{const x=read().examples;return {count:x.length,accuracy:x.length?Math.round(100*x.filter(e=>e.predicted===e.priority).length/x.length):null}}};
})();