/* Minna Smart Add v1.210 — isolated enhancement, never saves reminders itself. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const dialog = $('quickAddDialog'), input = $('minnaSmartText'), prepare = $('minnaSmartParse');
  const feedback = $('minnaSmartFeedback'), full = $('minnaSmartFullEditor');
  if (!dialog || !input || !prepare || !feedback || !full) return;
  const dateString = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  function parse(text) {
    let title = text.trim(), date = '', time = '';
    const now = new Date(), base = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const relative = /\b(today|tomorrow|day after tomorrow)\b/i.exec(title);
    if (relative) {
      base.setDate(base.getDate()+(relative[1].toLowerCase()==='tomorrow'?1:relative[1].toLowerCase()==='day after tomorrow'?2:0));
      date=dateString(base);title=title.replace(relative[0],' ');
    } else {
      const weekdays=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const wd=/\b(?:(next|this)\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i.exec(title);
      if(wd){
        const target=weekdays.indexOf(wd[2].toLowerCase());
        let diff=(target-base.getDay()+7)%7;
        if(wd[1]?.toLowerCase()==='next') diff=diff===0?7:diff+7;
        else if(diff===0)diff=7;
        base.setDate(base.getDate()+diff);date=dateString(base);title=title.replace(wd[0],' ');
      }
    }
    const t=/\b(?:at\s+)?(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/i.exec(title);
    const t24=/\b(?:at\s+)([01]?\d|2[0-3]):([0-5]\d)\b/i.exec(title);
    if(t){let h=Number(t[1])%12+(t[3].toLowerCase()==='pm'?12:0);time=String(h).padStart(2,'0')+':'+(t[2]||'00');title=title.replace(t[0],' ');}
    else if(t24){time=t24[1].padStart(2,'0')+':'+t24[2];title=title.replace(t24[0],' ');}
    title=title.replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').trim();
    return {title,date,time};
  }
  function apply(){
    const raw=input.value.trim();if(!raw){feedback.textContent='Type a reminder first.';input.focus();return;}
    const result=parse(raw);
    if(!result.title){feedback.textContent='Please include what you need to remember.';return;}
    if(result.time&&!result.date){feedback.textContent='Time found. Add a date using When before saving.';}
    else feedback.textContent='Details prepared. Review them below, choose a priority, then add or open the full editor.';
    $('quickAddTitle').value=result.title.slice(0,120);
    if(result.date)$('quickAddDate').value=result.date;
    if(result.time)$('quickAddTime').value=result.time;
    $('quickAddDate').dispatchEvent(new Event('change',{bubbles:true}));
    $('quickAddTime').dispatchEvent(new Event('change',{bubbles:true}));
    $('composerPriorityPanel')?.classList.remove('hidden');
    $('quickAddTitle').focus();
  }
  prepare.addEventListener('click',apply);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply();}});
  full.addEventListener('click',()=>{const more=$('quickAddMoreBtn');if(more)more.click();});
  dialog.addEventListener('close',()=>{input.value='';feedback.textContent='We’ll fill in the reminder details for you.';});
})();
