/* Independent, persistent collapsible Progress & Achievements sections. */
(()=>{
const key='minna-ui-expanded-v164';
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
const persist=()=>{try{localStorage.setItem(key,JSON.stringify(saved))}catch{}};
const progress=document.getElementById('minnaProgressToggle');
const details=document.getElementById('minnaProgressDetails');
if(progress&&details){if(typeof saved.today==='boolean'){progress.setAttribute('aria-expanded',String(saved.today));details.hidden=!saved.today;}
progress.addEventListener('click',()=>{queueMicrotask(()=>{saved.today=progress.getAttribute('aria-expanded')==='true';persist()})});}
const section=document.querySelector('#settingsDialog .minna-achievements-section');
const heading=section?.querySelector('.achievement-head');
if(section&&heading){const body=document.createElement('div');body.id='minnaLifetimeAchievementDetails';body.className='minna-lifetime-details';
while(heading.nextSibling)body.appendChild(heading.nextSibling);section.appendChild(body);
const button=document.createElement('button');button.type='button';button.className='minna-lifetime-toggle';button.setAttribute('aria-controls',body.id);
const label=document.createElement('span');label.textContent='Progress & Achievements';const arrow=document.createElement('span');arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');button.append(label,arrow);
const original=heading.querySelector('strong');if(original)original.textContent='Lifetime achievements';heading.prepend(button);
const apply=(expanded)=>{body.hidden=!expanded;button.setAttribute('aria-expanded',String(expanded));arrow.style.transform=expanded?'rotate(180deg)':'rotate(0deg)'};
apply(saved.lifetime!==false);button.addEventListener('click',()=>{saved.lifetime=button.getAttribute('aria-expanded')!=='true';apply(saved.lifetime);persist()});}
})();
