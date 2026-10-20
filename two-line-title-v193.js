/* v1.193: add six pixels only when a collapsed title-only reminder wraps to two lines. */
(()=>{const list=document.getElementById('reminderList');if(!list)return;let queued=false;
function update(){queued=false;list.querySelectorAll('article.reminder-card.collapsed.minna-title-only').forEach(card=>{
 const title=card.querySelector('.card-title');if(!title)return;
 const node=[...title.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
 let lines=1;if(node&&node.textContent.trim()){const range=document.createRange();range.selectNodeContents(node);const rects=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);const tops=[];for(const rect of rects){if(!tops.some(t=>Math.abs(t-rect.top)<2))tops.push(rect.top)}lines=tops.length||1;}
 card.classList.toggle('minna-two-line-title',lines>=2);
 });}
function queue(){if(!queued){queued=true;requestAnimationFrame(update)}}
new MutationObserver(queue).observe(list,{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',queue);document.fonts?.ready?.then(queue);queue();
})();