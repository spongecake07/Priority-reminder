(()=>{'use strict';
const $=id=>document.getElementById(id),dialog=$('minnaLearningDialog'),open=$('minnaLearningOpen'),close=$('minnaLearningClose'),host=$('minnaLearningContent');
if(!dialog||!open||!close||!host)return;
const labels={high:'High',medium:'Medium',low:'Low',misc:'Misc'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
const api=window.MinnaPriorityLearning;if(!api)return;
const examples=api.examples(),stats=api.stats(),count=examples.length;
const confident=examples.filter(e=>e.confident===true).length;
const fallback=examples.filter(e=>e.confident===false).length;
const older=examples.length-confident-fallback;
const threshold=30;
const progress=Math.min(100,Math.round(count/threshold*100));
const progressPanel='<section class="mld-panel"><strong>Learning progress</strong><small>'+count+' of '+threshold+' examples toward the initial learning milestone</small><div class="mld-track mld-progress-track"><i class="mld-total" style="width:'+progress+'%"></i></div><small>'+(count>=threshold?'Initial milestone reached — learning continues.':'Add '+(threshold-count)+' more confirmed reminders to reach the milestone.')+'</small></section>';
const confidencePanel='<section class="mld-panel"><strong>Suggestion confidence</strong><div class="mld-confidence"><div><strong>'+confident+'</strong><small>Confident</small></div><div><strong>'+fallback+'</strong><small>Fallback</small></div></div>'+(older?'<small>'+older+' older examples without recorded confidence are excluded.</small>':'')+'<small>Confidence is determined by matching past examples, not by reaching the milestone.</small></section>';
const bars=Object.keys(labels).map(p=>{const n=examples.filter(e=>e.priority===p).length;return '<div class="mld-bar-row"><span>'+labels[p]+'</span><div class="mld-track"><i class="mld-'+p+'" style="width:'+(count?100*n/count:0)+'%"></i></div><small>'+n+'</small></div>'}).join('');
const recent=examples.slice(-10).reverse().map(e=>'<div class="mld-example"><strong>'+esc(e.title||((e.words||[]).join(' ')||'Older example'))+'</strong><small>Suggested: '+esc(labels[e.predicted]||'Medium')+' → Selected: '+esc(labels[e.priority]||'Medium')+(e.confident===true?' · Confident':' · Fallback / older')+'</small></div>').join('');
host.innerHTML='<div class="mld-stats"><section><small>Learning examples</small><strong>'+count+' <em>/ 200</em></strong><div class="mld-track"><i class="mld-total" style="width:'+count/2+'%"></i></div></section><section><small>Suggestion accuracy</small><strong>'+(stats.accuracy===null?'—':stats.accuracy+'%')+'</strong><small>'+stats.confidentCount+' confident suggestions</small></section></div><section class="mld-panel"><strong>Learned priorities</strong>'+bars+'</section>'+progressPanel+confidencePanel+'<section class="mld-panel"><strong>Recent learning</strong><small>Latest 10 examples</small>'+(recent||'<p>No examples collected yet.</p>')+'</section><button type="button" id="mldExport">↓ Export learning data (JSON)</button><p class="mld-note">Accuracy measures confident suggestions only. Older records remain preserved, but may not contain titles or confidence information.</p>';
$('mldExport').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),examples:api.examples()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='minna-priority-learning-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
}
open.addEventListener('click',()=>{render();dialog.showModal()});close.addEventListener('click',()=>dialog.close());
})();