/* Fit dated reminder titles to available width without changing stored titles. */
(()=>{const list=document.getElementById('reminderList');if(!list)return;
let queued=false;const fit=()=>{queued=false;const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');if(!ctx)return;
list.querySelectorAll('article.reminder-card.collapsed.has-date .card-title').forEach(el=>{const width=el.getBoundingClientRect().width;if(width<20)return;const weight=getComputedStyle(el).fontWeight||'700';let chosen=15;for(const size of [19,17,15]){ctx.font=weight+' '+size+'px system-ui';if(ctx.measureText(el.textContent||'').width<=width-3){chosen=size;break}}el.style.setProperty('--minna-fit-font',chosen+'px')});};
const queue=()=>{if(!queued){queued=true;requestAnimationFrame(fit)}};
new MutationObserver(queue).observe(list,{childList:true,subtree:true,characterData:true});window.addEventListener('resize',queue);queue();
})();
