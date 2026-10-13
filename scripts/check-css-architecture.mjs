// Dependency-free guard against repeating the CSS override regressions.
// Run: node scripts/check-css-architecture.mjs
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const nav=read('nav-polish.css'),theme=read('minna-theme.css');
const index=read('index.html'),sw=read('service-worker.js');
const errors=[];
const assert=(ok,message)=>{if(!ok)errors.push(message)};
assert((theme.match(/\/\* Canonical surface treatment:/g)||[]).length===1,'Expected exactly one canonical surface treatment');
assert(theme.includes('--ui-surface-border:0')&&theme.includes('--ui-elevation:'),'Missing shared surface design tokens');
assert(!nav.includes('v92 hard override: reminder edge'),'Obsolete high-specificity v92 card border has returned');
assert(!/border-width:2px!important;\s*border-style:solid!important;\s*border-color:rgb\(70,70,70\)/.test(nav),'Legacy hard-coded gray card border has returned');
const canonical=theme.slice(theme.indexOf('/* Canonical surface treatment:'));
assert(!/\/\* v\d+(?:\.\d+)?:/.test(canonical),'Version-numbered override appended after canonical CSS');
const version=index.match(/class="minna-version">v1\.(\d+)<\/span>/)?.[1];
assert(!!version,'Missing visible app version');
if(version){
 const assetVersion=String(Number(version));
 for(const file of ['nav-polish.css','minna-theme.css','app.js']){
  assert(index.includes(file+'?v='+assetVersion),'index.html has stale '+file+' version');
  assert(sw.includes(file+'?v='+assetVersion),'service worker has stale '+file+' version');
 }
 assert(sw.includes("minna-v"+assetVersion),'Service-worker cache version differs from visible version');
}
if(errors.length){for(const e of errors)console.error('FAIL:',e);process.exitCode=1}
else console.log('CSS architecture guard passed');
