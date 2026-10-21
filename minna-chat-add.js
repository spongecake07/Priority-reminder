/* Minna floating chat composer v1.215. Legacy quick add/editor retained as save and edit adapters. */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const plus=$('addBtn'), legacy=$('quickAddDialog');
if(!plus||!legacy)return;
const modal=document.createElement('dialog');modal.id='minnaChatDialog';modal.className='minna-chat-dialog minna-floating-chat';
modal.innerHTML='<div class="mc-shell"><header class="mc-head"><strong>✦ Minna</strong><button type="button" id="mcClose" aria-label="Close">×</button></header><div class="mc-conversation" id="mcConversation"><div class="mc-welcome"><div class="mc-star">✦</div><h2>What can I remind you about?</h2><p>Tell me naturally. I’ll prepare the reminder for you.</p></div></div><div class="mc-compose"><textarea id="mcInput" rows="2" placeholder="Message Minna…" aria-label="Message Minna"></textarea><div class="mc-actions"><button type="button" id="mcOptions" aria-label="More options">＋</button><button type="button" id="mcSend" aria-label="Prepare reminder">↑</button></div><div class="mc-options" id="mcOptionsPanel" hidden><button type="button" id="mcFullEditor">Open Full Reminder Editor</button><button type="button" id="mcOldAdd">Classic Quick Add</button></div></div></div>';
document.body.appendChild(modal);
const convo=$('mcConversation'),input=$('mcInput');
function positionBubble(){
 if(!modal.open)return;
 const vv=window.visualViewport;
 const viewportBottom=vv?vv.offsetTop+vv.height:window.innerHeight;
 const keyboard=vv?Math.max(0,window.innerHeight-viewportBottom):0;
 const raised=keyboard>100;
 modal.classList.toggle('mc-keyboard-open',raised);
 const desiredBottom=viewportBottom-(raised?12:90);
 const height=modal.getBoundingClientRect().height;
 modal.style.setProperty('--mc-top',Math.max(vv?.offsetTop||0,desiredBottom-height)+'px');
}
let positionFrame=0;
function scheduleBubblePosition(){cancelAnimationFrame(positionFrame);positionFrame=requestAnimationFrame(positionBubble)}

window.visualViewport?.addEventListener('resize',scheduleBubblePosition);window.visualViewport?.addEventListener('scroll',scheduleBubblePosition);window.addEventListener('resize',scheduleBubblePosition);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateStr=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
let pending=null,priority='medium';
function parse(raw){
 let title=raw.trim(),date='',time='';const today=new Date();today.setHours(12,0,0,0);
 const rel=/\b(day after tomorrow|tomorrow|today)\b/i.exec(title);
 if(rel){const days=rel[1].toLowerCase()==='today'?0:rel[1].toLowerCase()==='tomorrow'?1:2;today.setDate(today.getDate()+days);date=dateStr(today);title=title.replace(rel[0],' ');}
 else{const days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];const match=/\b(?:(next|this)\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i.exec(title);if(match){let diff=(days.indexOf(match[2].toLowerCase())-today.getDay()+7)%7;if(match[1]?.toLowerCase()==='next')diff+=7;if(!diff)diff=7;today.setDate(today.getDate()+diff);date=dateStr(today);title=title.replace(match[0],' ');}}
 const t=/\b(?:at\s+)?(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/i.exec(title);
 const t24=/\bat\s+([01]?\d|2[0-3]):([0-5]\d)\b/i.exec(title);
 if(t){const h=Number(t[1])%12+(t[3].toLowerCase()==='pm'?12:0);time=String(h).padStart(2,'0')+':'+(t[2]||'00');title=title.replace(t[0],' ');}
 else if(t24){time=t24[1].padStart(2,'0')+':'+t24[2];title=title.replace(t24[0],' ');}
 title=title.replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').trim();
 return {title: title.slice(0,120),date,time};
}
function open(){if(legacy.open)legacy.close();pending=null;priority='medium';input.value='';convo.innerHTML='<div class="mc-welcome"><div class="mc-star">✦</div><h2>What can I remind you about?</h2><p>Tell me naturally. I’ll prepare the reminder for you.</p></div>';$('mcOptionsPanel').hidden=true;modal.show();scheduleBubblePosition();setTimeout(()=>{input.focus({preventScroll:true});scheduleBubblePosition();},120);}
plus.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open();},true);
$('mcClose').onclick=()=>modal.close();
$('mcOptions').onclick=()=>{$('mcOptionsPanel').hidden=!$('mcOptionsPanel').hidden;};
function prepare(){
 const raw=input.value.trim();if(!raw)return;
 pending=parse(raw);if(!pending.title){convo.innerHTML='<p class="mc-note">Please include what you want to remember.</p>';return;}
 priority='medium';
 convo.innerHTML='<div class="mc-message">'+escape(raw)+'</div><div class="mc-reply"><small>✦ REMINDER PREVIEW</small><h3>'+escape(pending.title)+'</h3><div class="mc-detail">'+(pending.date?escape(pending.date):'No date')+(pending.time?' · '+escape(pending.time):'')+'</div>'+(pending.time&&!pending.date?'<p class="mc-warning">Choose a date before saving a timed reminder.</p>':'')+'<label class="mc-label" for="mcDate">Date</label><input id="mcDate" type="date" value="'+escape(pending.date)+'"/><label class="mc-label" for="mcTime">Time</label><input id="mcTime" type="time" value="'+escape(pending.time)+'"/><div class="mc-label">Choose priority</div><div class="mc-priorities" role="group" aria-label="Priority"><button type="button" data-mc-priority="high">High</button><button type="button" data-mc-priority="medium" class="selected">Medium</button><button type="button" data-mc-priority="low">Low</button><button type="button" data-mc-priority="misc">Misc</button></div><button type="button" class="mc-save" id="mcSave">Save reminder</button><button type="button" class="mc-edit" id="mcEdit">Open Full Reminder Editor</button></div>';
 input.value='';convo.scrollTop=convo.scrollHeight;
}
$('mcSend').onclick=prepare;
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();prepare();}});
convo.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.mcPriority){priority=b.dataset.mcPriority;convo.querySelectorAll('[data-mc-priority]').forEach(el=>el.classList.toggle('selected',el===b));}
 if(b.id==='mcSave')bridge(false);
 if(b.id==='mcEdit')bridge(true);
});
function bridge(edit){
 if(!pending){if(edit){pending={title:'',date:'',time:''};}else return;}
 const date=$('mcDate')?.value||pending.date||'',time=$('mcTime')?.value||pending.time||'';
 if(time&&!date&&!edit){const warn=convo.querySelector('.mc-warning');if(warn)warn.textContent='Choose a date before saving a timed reminder.';else{const p=document.createElement('p');p.className='mc-warning';p.textContent='Choose a date before saving a timed reminder.';convo.querySelector('.mc-reply')?.prepend(p);}return;}
 modal.close();
 window.openSimpleReminder?.('');
 $('quickAddTitle').value=pending.title;
 $('quickAddDate').value=date;$('quickAddTime').value=time;$('quickAddPriority').value=priority;
 if(edit){$('quickAddMoreBtn').click();return;}
 $('quickAddForm').requestSubmit();
}
$('mcFullEditor').onclick=()=>{pending={title:input.value.trim().slice(0,120),date:'',time:''};bridge(true);};
$('mcOldAdd').onclick=()=>{modal.close();window.openSimpleReminder?.('');};
})();
