/* Minna category learning v1.233. Local-only, no category creation or reminder mutations. */
(()=>{'use strict';
const KEY='minna-category-learning-v1';
const words=s=>String(s||'').toLowerCase().match(/[a-zà-ÿ0-9]+/g)?.filter(w=>w.length>2&&!['the','and','for','with','today','tomorrow','please','remind'].includes(w))||[];
const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.slice(-200):[]}catch{return[]}};
const hints={Shopping:/\b(buy|purchase|shop|groceries|milk|eggs|bread|order)\b/i,Car:/\b(car|audi|vehicle|tires|oil change)\b/i,House:/\b(house|home|kitchen|living room)\b/i,Work:/\b(work|office|meeting|boss)\b/i,Family:/\b(family|kids|baby|daughter|son)\b/i,Finances:/\b(pay|bill|bank|tax|invoice|mortgage)\b/i,Appointments:/\b(appointment|doctor|dentist|visit)\b/i,Repairs:/\b(fix|repair|broken|replace)\b/i,Documents:/\b(document|paperwork|form|letter)\b/i,Garden:/\b(garden|plants|lawn|grass)\b/i,Cooking:/\b(cook|recipe|dinner|meal)\b/i};
function suggest(title,categories){
 const allowed=Array.isArray(categories)?categories.filter(x=>typeof x==='string'):[];
 const tokens=new Set(words(title)),score=new Map(),support=new Map();
 for(const e of read()){
  if(!allowed.includes(e.category))continue;
  const common=[...new Set(words(e.title))].filter(w=>tokens.has(w)).length;
  if(!common)continue;
  const weight=common/Math.max(1,new Set([...tokens,...words(e.title)]).size);
  if(weight<0.2)continue;
  score.set(e.category,(score.get(e.category)||0)+weight);
  support.set(e.category,(support.get(e.category)||0)+1);
 }
 const best=[...score.keys()].sort((a,b)=>score.get(b)-score.get(a))[0];
 if(best&&(support.get(best)||0)>=2&&score.get(best)>=0.8)return best;
 return allowed.find(c=>hints[c]?.test(title))||'';
}
function record(title,category){
 if(!String(title||'').trim()||!String(category||'').trim())return;
 const entries=read();entries.push({title:String(title).slice(0,120),category:String(category).slice(0,40),at:Date.now()});
 try{localStorage.setItem(KEY,JSON.stringify(entries.slice(-200)))}catch(e){console.warn('Category learning unavailable',e)}
}
window.MinnaCategoryLearning={suggest,record,examples:()=>read().map(x=>({...x}))};
})();