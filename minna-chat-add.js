/* Minna floating chat composer v1.222. Legacy quick add/editor retained as save and edit adapters. */
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
let settleTimer=0;
function settleBubble(){
 scheduleBubblePosition();
 clearInterval(settleTimer);
 let checks=0;
 settleTimer=setInterval(()=>{
  if(!modal.open||++checks>24){clearInterval(settleTimer);return;}
  scheduleBubblePosition();
 },75);
}
window.visualViewport?.addEventListener('resize',settleBubble);
window.visualViewport?.addEventListener('scroll',scheduleBubblePosition);
window.addEventListener('resize',settleBubble);
window.addEventListener('orientationchange',settleBubble);
input.addEventListener('focus',settleBubble);
input.addEventListener('input',scheduleBubblePosition);
new ResizeObserver(scheduleBubblePosition).observe(modal);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateStr=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
let pending=null,priority='medium',checkItems=[],suggestedPriority='medium',suggestionConfident=false,suggestionSimilar=0;
function detectList(title){
 const m=/^(buy|pick up|get|pack|bring|clean|prepare|order|purchase)\s+(.+)$/i.exec(title);
 if(!m)return null;
 const body=m[2].replace(/[.!?]+$/,'').trim();
 // Conservative undelimited shopping lists: require 3+ recognized standalone item nouns.
 // Avoid splitting ordinary sentences or descriptive purchases such as "buy new winter boots".
 if(!/,|\\s+and\\s+|\\s*&\\s*/i.test(body)){
  if(!/^(buy|pick up|get|order|purchase)$/i.test(m[1]))return null;
  const nouns=new Set('book books crayon crayons milk bread eggs egg butter cheese yogurt yoghurt apples apple bananas banana oranges orange grapes grape rice pasta cereal flour sugar salt pepper coffee tea water juice soap shampoo toothpaste toothbrush diapers wipes batteries pens pen pencils pencil paper notebooks notebook markers marker glue tape socks shoes shirts shirt towels towel batteries battery carrots carrot potatoes potato onions onion tomatoes tomato lettuce spinach broccoli chicken beef fish beans bean'.split(' '));
  const tokens=body.split(/\\s+/).filter(Boolean);
  if(tokens.length<3||tokens.length>12||!tokens.every(w=>nouns.has(w.toLowerCase())))return null;
  return {title:/^buy$/i.test(m[1])?'Buy groceries':m[1][0].toUpperCase()+m[1].slice(1).toLowerCase(),items:tokens.map(w=>({text:w[0].toUpperCase()+w.slice(1),done:false}))};
 }
 const parts=body.split(/,\s*|\s+and\s+|\s*&\s*/i).map(x=>x.trim()).filter(Boolean);
 if(parts.length<2||parts.length>12||parts.some(x=>x.split(/\s+/).length>6))return null;
 return {title:m[1].toLowerCase()==='buy'?'Buy groceries':m[1][0].toUpperCase()+m[1].slice(1).toLowerCase(),items:parts.map(x=>({text:x[0].toUpperCase()+x.slice(1),done:false}))};
}
function renderChecklist(){
 const host=convo.querySelector('#mcChecklist');if(!host)return;
 host.innerHTML=checkItems.length?'<div class="mc-checklist-heading">CHECKLIST · '+checkItems.length+'</div>'+checkItems.map((x,i)=>'<div class="mc-check-row"><input type="text" data-mc-item="'+i+'" maxlength="160" aria-label="Checklist item '+(i+1)+'" value="'+escape(x.text)+'"><button type="button" data-mc-remove="'+i+'" aria-label="Remove item">×</button></div>').join(''):'';
}

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
function open(){if(legacy.open)legacy.close();pending=null;priority='medium';checkItems=[];modal.classList.remove('mc-reviewing');input.value='';convo.innerHTML='<div class="mc-welcome"><div class="mc-star">✦</div><h2>What can I remind you about?</h2><p>Tell me naturally. I’ll prepare the reminder for you.</p></div>';$('mcOptionsPanel').hidden=true;modal.show();settleBubble();setTimeout(()=>{input.focus({preventScroll:true});settleBubble();},120);}
plus.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open();},true);
$('mcClose').onclick=()=>modal.close();
$('mcOptions').onclick=()=>{$('mcOptionsPanel').hidden=!$('mcOptionsPanel').hidden;};
function previewCard(){
 const date=pending.date?new Date(pending.date+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'}).toUpperCase():'Add date';
 const time=pending.time||'Add time';
 return '<div class="mc-reply mc-confirm"><div class="mc-reminder-card" data-priority="'+priority+'"><div class="mc-reminder-meta"><div class="mc-picker-direct"><button type="button" data-mc-picker="date" aria-label="Choose date">'+escape(date)+'</button><input id="mcDate" aria-label="Reminder date" type="date" value="'+escape(pending.date)+'"></div><div class="mc-picker-direct"><button type="button" data-mc-picker="time" aria-label="Choose time">'+escape(time)+'</button><input id="mcTime" aria-label="Reminder time" type="time" value="'+escape(pending.time)+'"></div></div><h3>'+escape(pending.title)+'</h3><div id="mcChecklist"></div></div><p class="mc-learning-hint">✦ Suggested: '+suggestedPriority[0].toUpperCase()+suggestedPriority.slice(1)+(suggestionConfident?' · Based on '+suggestionSimilar+' similar reminders':' · Not enough reliable evidence')+' · Learning '+Math.min(window.MinnaPriorityLearning?.stats().count||0,30)+'/30</p><button type="button" class="mc-check-toggle" id="mcConvert">'+(checkItems.length?'Edit checklist · Add item':'Convert to checklist')+'</button><p class="mc-tap-hint">Tap date or time to change</p><div class="mc-priorities" role="group" aria-label="Select reminder priority"><button type="button" data-mc-priority="high">High</button><button type="button" data-mc-priority="medium">Medium</button><button type="button" data-mc-priority="low">Low</button><button type="button" data-mc-priority="misc">Misc</button></div><button type="button" class="mc-confirm-save" id="mcSave">Add Reminder</button><p class="mc-warning" id="mcWarning" hidden></p></div>';
}
function prepare(){
 const raw=input.value.trim();if(!raw)return;
 pending=parse(raw);const detected=detectList(pending.title);checkItems=detected?detected.items:[];if(detected)pending.title=detected.title;if(!pending.title){convo.innerHTML='<p class="mc-note">Please include what you want to remember.</p>';return;}
 const suggestion=window.MinnaPriorityLearning?.suggest(pending.title);suggestedPriority=suggestion?.priority||'medium';suggestionConfident=!!suggestion?.confident;suggestionSimilar=suggestion?.similar||0;priority=suggestedPriority;
 convo.innerHTML=previewCard();renderChecklist();convo.querySelector('[data-mc-priority="'+priority+'"]')?.classList.add('selected');
 modal.classList.add('mc-reviewing');input.blur();
 input.value='';convo.scrollTop=convo.scrollHeight;scheduleBubblePosition();
}
$('mcSend').onclick=prepare;
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();prepare();}});
convo.addEventListener('input',e=>{if(e.target.dataset.mcItem!==undefined){const n=Number(e.target.dataset.mcItem);if(checkItems[n])checkItems[n].text=e.target.value;}});
convo.addEventListener('change',e=>{
 if(!pending)return;
 if(e.target.id==='mcDate')pending.date=e.target.value;
 if(e.target.id==='mcTime')pending.time=e.target.value;
 const dateButton=convo.querySelector('[data-mc-picker="date"]'),timeButton=convo.querySelector('[data-mc-picker="time"]');
 if(dateButton)dateButton.textContent=pending.date?new Date(pending.date+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'}).toUpperCase():'Add date';
 if(timeButton)timeButton.textContent=pending.time||'Add time';
 scheduleBubblePosition();
});
convo.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='mcConvert'){checkItems.push({text:'',done:false});renderChecklist();convo.querySelector('[data-mc-item="'+(checkItems.length-1)+'"]')?.focus();scheduleBubblePosition();return;}
 if(b.dataset.mcRemove!==undefined){checkItems.splice(Number(b.dataset.mcRemove),1);renderChecklist();scheduleBubblePosition();return;}
 if(b.dataset.mcPicker){const picker=$(b.dataset.mcPicker==='date'?'mcDate':'mcTime');if(picker){try{picker.showPicker()}catch(_){picker.focus();picker.click()}}return;}
 if(b.dataset.mcPriority){
  priority=b.dataset.mcPriority;
  const card=convo.querySelector('.mc-reminder-card');if(card)card.dataset.priority=priority;
  convo.querySelectorAll('[data-mc-priority]').forEach(x=>x.classList.toggle('selected',x===b));
  return;
 }
 if(b.id==='mcSave')bridge(false);
});
function bridge(edit){
 if(!pending){if(edit){pending={title:'',date:'',time:''};}else return;}
 const date=$('mcDate')?.value||pending.date||'',time=$('mcTime')?.value||pending.time||'';
 if(time&&!date&&!edit){const warn=convo.querySelector('.mc-warning');if(warn){warn.hidden=false;warn.textContent='Choose a date before saving a timed reminder.';}else{const p=document.createElement('p');p.className='mc-warning';p.textContent='Choose a date before saving a timed reminder.';convo.querySelector('.mc-reply')?.prepend(p);}return;}
 modal.close();
 window.openSimpleReminder?.('');
 $('quickAddTitle').value=pending.title;
 $('quickAddDate').value=date;$('quickAddTime').value=time;$('quickAddPriority').value=priority;
 if(edit){$('quickAddMoreBtn').click();return;}
 window.minnaPriorityLearningPending={title:pending.title,priority,predicted:suggestedPriority,confident:suggestionConfident};
 window.minnaChatChecklistPayload=checkItems.map(x=>({text:x.text.trim(),done:false})).filter(x=>x.text);
 $('quickAddForm').requestSubmit();
}
$('mcFullEditor').onclick=()=>{pending={title:input.value.trim().slice(0,120),date:'',time:''};bridge(true);};
$('mcOldAdd').onclick=()=>{modal.close();window.openSimpleReminder?.('');};
})();
