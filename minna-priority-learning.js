/* Local Priority Learning v1: suggestion only, explicit user confirmation required. */
(()=>{
'use strict';
const KEY='minna-priority-learning-v1',PRIORITIES=['high','medium','low','misc'];
const words=s=>String(s||'').toLowerCase().match(/[a-zà-ÿ0-9]+/g)?.filter(w=>w.length>2&&!['the','and','for','with','tomorrow','today','this','that','remind','please'].includes(w))||[];
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return {examples:Array.isArray(x.examples)?x.examples.slice(-200):[]}}catch{return {examples:[]}}}
function suggest(title){
 const examples=read().examples,query=words(title),terms=new Set(query);
 const scores={high:0,medium:0,low:0,misc:0},support={high:0,medium:0,low:0,misc:0};
 const groups=new Map();
 const pairs=a=>new Set(a.slice(1).map((w,i)=>a[i]+' '+w));
 const queryPairs=pairs(query);
 // Group identical wording within each priority, without rewriting stored history.
 for(const e of examples){
  if(!PRIORITIES.includes(e.priority)||!Array.isArray(e.words))continue;
  const tokens=words(e.title||e.words.join(' ')),unique=[...new Set(tokens)];
  const common=unique.filter(w=>terms.has(w)).length;
  if(!common)continue;
  const similarity=common/Math.max(1,new Set([...unique,...terms]).size);
  const phrase=[...pairs(tokens)].filter(p=>queryPairs.has(p)).length;
  const weight=similarity+Math.min(2,phrase)*0.45;
  if(weight<0.3)continue;
  const key=e.priority+'|'+tokens.join(' ');
  const previous=groups.get(key);
  const at=Number.isFinite(e.at)?e.at:0;
  if(!previous||at>=previous.at)groups.set(key,{priority:e.priority,weight,at,similarity,phrase});
 }
 // A gentle age adjustment applies only when usable timestamps exist.
 const timestamps=[...groups.values()].map(x=>x.at).filter(Boolean);
 const oldest=Math.min(...timestamps),newest=Math.max(...timestamps);
 for(const e of groups.values()){
  const recency=oldest<newest&&e.at?0.85+0.3*(e.at-oldest)/(newest-oldest):1;
  scores[e.priority]+=e.weight*recency;
  if(e.similarity>=0.35||e.phrase>0)support[e.priority]++;
 }
 const ranked=PRIORITIES.slice().sort((a,b)=>scores[b]-scores[a]);
 const best=ranked[0],runner=ranked[1];
 const confident=support[best]>=3&&scores[best]>=1.8&&scores[best]>=scores[runner]*1.8;
 return {priority:confident?best:'medium',confident,examples:examples.length,similar:confident?support[best]:0,support:{...support},scores:{...scores},conflict:scores[best]>0&&scores[runner]>0&&scores[best]<scores[runner]*1.8,reason:confident?'Supported by distinct similar reminders':scores[best]===0?'No similar examples yet':scores[runner]>0&&scores[best]<scores[runner]*1.8?'Conflicting evidence':'Not enough reliable evidence'};
}
function record(title,chosen,predicted,confident=false){
 if(!PRIORITIES.includes(chosen)||!String(title||'').trim())return;
 const state=read();state.examples.push({words:[...new Set(words(title))].slice(0,25),priority:chosen,predicted:PRIORITIES.includes(predicted)?predicted:'medium',confident:!!confident,title:String(title).trim().slice(0,120),at:Date.now()});
 state.examples=state.examples.slice(-200);
 try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){console.warn('Priority learning storage unavailable',e)}
}
window.MinnaPriorityLearning={suggest,record,examples:()=>read().examples.map(e=>({...e})),stats:()=>{const x=read().examples,c=x.filter(e=>e.confident===true);return {count:x.length,accuracy:c.length?Math.round(100*c.filter(e=>e.predicted===e.priority).length/c.length):null,confidentCount:c.length}}};
})();