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
let category='',pending=null,priority='medium',automaticMisc=false,checkItems=[],suggestedPriority='medium',suggestionConfident=false,suggestionSimilar=0;
function detectList(title){
 const m=/^(buy|pick up|get|pack|bring|clean|prepare|order|purchase)\s+(.+)$/i.exec(title);
 if(!m)return null;
 const body=m[2].replace(/[.!?]+$/,'').trim();
 // Explicit separators are strong evidence; whitespace alone is ambiguous.
 // Use the same phrase-aware parser in both cases instead of splitting all bare words.
 const hasSeparator=/[,;\n&+]|\b(?:and|plus)\b/i.test(body);
 if(!hasSeparator&&!/^(buy|pick up|get|order|purchase)$/i.test(m[1]))return null;
 const standalone=new Set("water milk eggs bread cheese butter rice pasta apples bananas oranges tomatoes potatoes onions carrots chicken beef fish salmon juice coffee tea sugar salt flour cereal yogurt yoghurt soap shampoo toothpaste diapers wipes detergent towels socks shirts pants shoes batteries paper pens pencils lettuce cucumber spinach grapes strawberries lemons limes oil vinegar honey jam beans corn peas garlic ginger soda pears peaches plums apricots nectarines cherries blueberries raspberries blackberries cranberries pineapple mango papaya kiwi watermelon cantaloupe melon avocado coconut dates figs pomegranate grapefruit tangerines clementines mandarins broccoli cauliflower cabbage kale arugula celery asparagus zucchini eggplant squash pumpkin radishes beets turnips parsnips mushrooms scallions leeks shallots peppers chilies jalapenos basil parsley cilantro thyme rosemary oregano mint dill sage chives turkey pork lamb bacon sausage ham steak shrimp prawns lobster crab tuna cod haddock tilapia sardines anchovies tofu tempeh lentils chickpeas edamame quinoa couscous oats barley cream kefir ricotta mozzarella cheddar parmesan feta brie gouda provolone margarine ghee mayonnaise mustard ketchup relish salsa hummus pesto tahini dressing bagels croissants muffins tortillas pita naan buns rolls crackers pretzels chips popcorn cookies biscuits brownies cake cupcakes donuts waffles pancakes granola muesli almonds walnuts cashews pecans pistachios peanuts hazelnuts sunflower sesame chia flax seeds raisins prunes cinnamon nutmeg paprika cumin turmeric coriander cardamom cloves pepper vanilla cocoa chocolate syrup molasses yeast baking powder cornstarch cola lemonade kombucha seltzer sparkling cider espresso cappuccino latte bleach disinfectant sanitizer sponges brushes scrubbers mop broom dustpan vacuum trash garbage bags foil parchment clingwrap napkins tissues plates bowls cups mugs glasses cutlery forks spoons knives chopsticks straws containers jars bottles thermos lunchbox toothbrush floss mouthwash deodorant lotion moisturizer sunscreen conditioner bodywash cleanser perfume cologne razors shaving gel cotton swabs bandages plasters laundry fabric softener stain remover dishwashing tablets dishwasher pods notebooks markers highlighters erasers rulers scissors glue tape staples stapler envelopes folders binders labels stamps printer ink charger cables adapters headphones earbuds keyboard mouse monitor laptop tablet phone bulbs flashlight extension cord hammer screwdriver screws nails bolts nuts washers drill saw wrench pliers level sandpaper paint primer caulk silicone flowers soil compost fertilizer mulch pots planters gloves hose sprinkler rake shovel petfood kibble litter treats leash collar toys breadsticks gnocchi ravioli spaghetti macaroni noodles ramen dumplings pierogies pierogi lasagna jelly marmalade preserves pickles olives capers milkshake smoothie icecream sorbet gelato clothes jacket coat sweater hoodie cardigan blouse dress skirt jeans shorts leggings underwear pajamas pyjamas sandals boots sneakers slippers belt hat scarf mittens".split(' '));
 const compound=new Set(["ice cream","peanut butter","olive oil","orange juice","apple juice","almond milk","oat milk","soy milk","coconut milk","toilet paper","paper towels","dish soap","laundry detergent","ground beef","chicken breast","sweet potatoes","green beans","hot dogs","baby wipes","baby food","coffee beans","black pepper","brown sugar","cream cheese","sour cream","winter boots","school supplies","sparkling water","baking powder","fabric softener","stain remover","dishwasher pods","cotton swabs","body wash","shaving gel","sunflower seeds","pumpkin seeds","sesame seeds","flax seeds","chia seeds","printer ink","extension cord","trash bags","garbage bags","cling wrap","parchment paper","hand soap","hand sanitizer","face wash","shower gel","olive spread","maple syrup","chocolate milk","whole milk","skim milk","baby formula","diaper cream","frozen peas","frozen berries","frozen pizza","pizza dough","pizza sauce","tomato sauce","tomato paste","pasta sauce","rice noodles","egg noodles","bread crumbs","bread flour","all purpose flour","white rice","brown rice","basmati rice","jasmine rice","coconut oil","vegetable oil","canola oil","sesame oil","red onions","green onions","spring onions","bell peppers","red peppers","green peppers","chicken thighs","chicken wings","chicken nuggets","fish sticks","fish fingers","french fries","potato chips","tortilla chips","sour dough","sourdough bread","whole wheat bread","whole grain bread","burger buns","hot dog buns","paper plates","plastic cups","plastic bags","ziplock bags","storage bags","dish towels","bath towels","hand towels","laundry soap","washing powder","dishwashing liquid","dishwashing soap","cleaning spray","glass cleaner","floor cleaner","toilet cleaner","toilet brush","laundry basket","trash can","garbage bin","light bulbs","AA batteries","AAA batteries","USB cable","phone charger","charging cable","coffee filters","tea bags","herbal tea","green tea","black tea","iced tea","ice cubes","ice packs","milk powder","powdered milk","condensed milk","evaporated milk","whipping cream","heavy cream","cooking cream","sour cream","cream of wheat","cream of mushroom","cream of chicken","chicken stock","beef stock","vegetable stock","chicken broth","beef broth","vegetable broth","almond butter","cashew butter","sunflower butter","hazelnut spread","strawberry jam","raspberry jam","peanut oil","rice vinegar","apple cider vinegar","balsamic vinegar","white vinegar","red wine vinegar","soy sauce","hot sauce","fish sauce","oyster sauce","barbecue sauce","bbq sauce","chili sauce","sweet chili sauce","chili powder","garlic powder","onion powder","curry powder","cocoa powder","protein powder","baby cereal","oat cereal","corn flakes","rolled oats","steel cut oats","instant oatmeal","granola bars","protein bars","energy bars","fruit snacks","fruit cups","applesauce pouches","baby pouches","wet wipes","makeup wipes","cleaning wipes","disinfecting wipes","paper napkins","facial tissues","cotton pads","cotton balls","hair ties","hair clips","hair brush","hair gel","hair spray","nail polish","nail remover","contact solution","contact lenses","reading glasses","sun glasses","sunglasses case","first aid kit","band aid","band aids","pain relief","vitamin c","vitamin d","fish oil","olive soap","shampoo bar","conditioner bar","bar soap","liquid soap","hand cream","body lotion","face cream","lip balm","lip gloss","lipstick","eye liner","eyeliner pencil","mascara brush","makeup brush","tooth paste","dental floss","electric toothbrush","replacement heads","razor blades","shaving cream","shower curtain","curtain hooks","bath mat","bath rug","floor mat","door mat","pillow cases","bed sheets","duvet cover","fitted sheet","flat sheet","laundry pods","detergent pods","dish pods","dishwasher detergent","dishwasher rinse aid","fabric spray","air freshener","dryer sheets","dryer balls","lint roller","pet food","cat food","dog food","cat litter","dog treats","cat treats","bird seed","fish food","plant food","potting soil","garden soil","grass seed","flower seeds","plant pots","flower pots","watering can","garden gloves","work gloves","rubber gloves","dish gloves","trash liners","bin liners","storage bins","storage boxes","storage containers","plastic wrap","aluminum foil","tin foil","wax paper","freezer bags","sandwich bags","lunch bags","lunch boxes","water bottles","coffee mugs","travel mugs","paper cups","plastic forks","plastic spoons","plastic knives","wooden spoons","measuring cups","measuring spoons","cutting board","baking tray","baking sheet","oven mitts","pot holders","dish rack","dish brush","scrub brush","scrub sponge","steel wool","microfiber cloth","cleaning cloth","dust cloth","paper clips","sticky notes","post it notes","index cards","file folders","pencil case","pencil sharpener","school bag","back pack","backpack straps","packing tape","masking tape","duct tape","electrical tape","double sided tape","super glue","wood glue","hot glue","glue sticks","glue gun","paint brush","paint roller","roller tray","drop cloth","safety glasses","safety goggles","dust mask","face mask","work boots","rain boots","running shoes","dress shoes","baby shoes","baby clothes","winter coat","rain jacket","t shirts","t shirt","long sleeves","short sleeves","dress pants","yoga pants","swim suit","swimsuit cover","swim diapers","swim goggles","swim cap","beach towel","beach umbrella","beach chair","camping chair","sleeping bag","tent poles","tent pegs","picnic blanket","picnic basket","birthday candles","birthday balloons","gift bags","gift wrap","wrapping paper","greeting cards","thank you cards","birthday cards","party plates","party cups","party napkins","party decorations","party favors","cake mix","pancake mix","waffle mix","brownie mix","cookie dough","pizza crust","pizza base","frozen vegetables","mixed vegetables","mixed berries","mixed nuts","trail mix","dried fruit","fresh fruit","fresh vegetables","organic milk","lactose free milk","gluten free bread","gluten free pasta","decaf coffee","instant coffee","ground coffee","whole bean coffee","coffee creamer","non dairy creamer","whipped cream","vanilla extract","almond extract","lemon juice","lime juice","grape juice","cranberry juice","pineapple juice","grapefruit juice","vegetable juice","tomato juice","carrot juice","coconut water","sports drink","energy drink","mineral water","distilled water","spring water","bottled water","tap water"]);
 const modifiers=new Set('a an the my our your some any new old fresh frozen organic large small big little extra whole skim lactose free gluten red green yellow white black brown blue baby kids adult winter summer hot cold spicy sweet unsalted salted low fat nonfat two three four five six dozen pack packs box boxes bag bags bottle bottles carton cartons can cans jar jars of for with without'.split(' '));
 const extraPhrases=new Set(['chicken soup','tomato soup','vegetable soup','mushroom soup','phone charger','wireless charger','winter jacket','winter boots','running shoes','fresh milk','fresh bread','new phone','new shoes','baby clothes','baby shampoo','baby lotion','baby soap','baby diapers','whole chicken','fresh salmon','red apples','green apples','large eggs','brown eggs','white eggs','frozen chicken','frozen fish','frozen vegetables','fresh vegetables','new batteries','black socks','white socks']);
 function splitKnownItems(part){
  const words=part.split(/\s+/).filter(Boolean);
  if(words.length<2||words.length>12||words.some(w=>!/^[a-zà-ÿ'-]+$/i.test(w)))return [part];
  const lower=words.map(w=>w.toLowerCase());
  const output=[];let i=0;
  while(i<words.length){
   let match=0;
   for(let size=Math.min(5,words.length-i);size>=2;size--){
    if(compound.has(lower.slice(i,i+size).join(' '))||extraPhrases.has(lower.slice(i,i+size).join(' '))){match=size;break;}
   }
   if(match){output.push(words.slice(i,i+match).join(' '));i+=match;continue;}
   // Keep modifiers attached to the following recognized product.
   if(modifiers.has(lower[i])){
    let j=i;while(j<words.length&&modifiers.has(lower[j]))j++;
    if(j<words.length){let phraseSize=0;for(let size=Math.min(5,words.length-j);size>=2;size--){if(compound.has(lower.slice(j,j+size).join(' '))||extraPhrases.has(lower.slice(j,j+size).join(' '))){phraseSize=size;break;}}if(phraseSize){output.push(words.slice(i,j+phraseSize).join(' '));i=j+phraseSize;continue;}if(standalone.has(lower[j])){output.push(words.slice(i,j+1).join(' '));i=j+1;continue;}}
    return [part];
   }
   if(!standalone.has(lower[i]))return [part];
   output.push(words[i]);i++;
  }
  return output;
 }
 const parts=body.replace(/\s*,?\s*\b(?:and|plus)\b\s*/gi,',').split(/\s*[,;\n&+]\s*/).map(x=>x.trim()).filter(Boolean).flatMap(splitKnownItems);
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
function open(){if(legacy.open)legacy.close();pending=null;priority='medium';automaticMisc=false;category='';checkItems=[];modal.classList.remove('mc-reviewing');input.value='';convo.innerHTML='<div class="mc-welcome"><div class="mc-star">✦</div><h2>What can I remind you about?</h2><p>Tell me naturally. I’ll prepare the reminder for you.</p></div>';$('mcOptionsPanel').hidden=true;modal.show();settleBubble();setTimeout(()=>{input.focus({preventScroll:true});settleBubble();},120);}
plus.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open();},true);
$('mcClose').onclick=()=>modal.close();
$('mcOptions').onclick=()=>{$('mcOptionsPanel').hidden=!$('mcOptionsPanel').hidden;};
function previewCard(){
 const date=pending.date?new Date(pending.date+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'}).toUpperCase():'Add date';
 const time=pending.time||'Add time';
 return '<div class="mc-reply mc-confirm"><div class="mc-reminder-card" data-priority="'+priority+'"><div class="mc-reminder-meta"><div class="mc-picker-direct"><button type="button" data-mc-picker="date" aria-label="Choose date">'+escape(date)+'</button><input id="mcDate" aria-label="Reminder date" type="date" value="'+escape(pending.date)+'"></div><div class="mc-picker-direct"><button type="button" data-mc-picker="time" aria-label="Choose time">'+escape(time)+'</button><input id="mcTime" aria-label="Reminder time" type="time" value="'+escape(pending.time)+'"></div><div class="mc-picker-direct"><button type="button" id="mcCategoryButton">'+escape(category||'Category')+'</button><select id="mcCategorySelect" aria-label="Reminder category"><option value="">No category</option>'+((window.minnaAvailableCategories?.()||[]).map(c=>'<option value="'+escape(c)+'"'+(c===category?' selected':'')+'>'+escape(c)+'</option>').join(''))+'</select></div></div><h3>'+escape(pending.title)+'</h3><div id="mcChecklist"></div></div><p class="mc-learning-hint">✦ Suggested: '+suggestedPriority[0].toUpperCase()+suggestedPriority.slice(1)+(suggestionConfident?' · Based on '+suggestionSimilar+' similar reminders':' · Not enough reliable evidence')+' · Learning '+Math.min(window.MinnaPriorityLearning?.stats().count||0,30)+'/30</p><button type="button" class="mc-check-toggle" id="mcConvert">'+(checkItems.length?'Edit checklist · Add item':'Convert to checklist')+'</button><p class="mc-tap-hint">Tap date or time to change</p><div class="mc-priorities" role="group" aria-label="Select reminder priority"><button type="button" data-mc-priority="high">High</button><button type="button" data-mc-priority="medium">Medium</button><button type="button" data-mc-priority="low">Low</button><button type="button" data-mc-priority="misc">Misc</button></div><button type="button" class="mc-confirm-save" id="mcSave">Add Reminder</button><p class="mc-warning" id="mcWarning" hidden></p></div>';
}
function prepare(){
 const raw=input.value.trim();if(!raw)return;
 pending=parse(raw);pending.categoryLearningTitle=raw;const detected=detectList(pending.title);checkItems=detected?detected.items:[];if(detected)pending.title=detected.title;category=window.MinnaCategoryLearning?.suggest(raw,window.minnaAvailableCategories?.()||[])||'';if(!pending.title){convo.innerHTML='<p class="mc-note">Please include what you want to remember.</p>';return;}
 automaticMisc=!!detected&&/^buy\s+/i.test(raw);const suggestion=automaticMisc?null:window.MinnaPriorityLearning?.suggest(pending.title);suggestedPriority=automaticMisc?'misc':suggestion?.priority||'medium';suggestionConfident=automaticMisc||!!suggestion?.confident;suggestionSimilar=automaticMisc?0:suggestion?.similar||0;priority=suggestedPriority;
 convo.innerHTML=previewCard();renderChecklist();convo.querySelector('[data-mc-priority="'+priority+'"]')?.classList.add('selected');
 modal.classList.add('mc-reviewing');input.blur();
 input.value='';convo.scrollTop=convo.scrollHeight;scheduleBubblePosition();
}
$('mcSend').onclick=prepare;
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();prepare();}});
convo.addEventListener('input',e=>{if(e.target.dataset.mcItem!==undefined){const n=Number(e.target.dataset.mcItem);if(checkItems[n])checkItems[n].text=e.target.value;}});
convo.addEventListener('change',e=>{
 if(!pending)return;
 if(e.target.id==='mcCategorySelect'){category=e.target.value;const label=convo.querySelector('#mcCategoryButton');if(label)label.textContent=category||'Category';}
 if(e.target.id==='mcDate')pending.date=e.target.value;
 if(e.target.id==='mcTime')pending.time=e.target.value;
 const dateButton=convo.querySelector('[data-mc-picker="date"]'),timeButton=convo.querySelector('[data-mc-picker="time"]');
 if(dateButton)dateButton.textContent=pending.date?new Date(pending.date+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'}).toUpperCase():'Add date';
 if(timeButton)timeButton.textContent=pending.time||'Add time';
 scheduleBubblePosition();
});
convo.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='mcCategoryButton'){const picker=convo.querySelector('#mcCategorySelect');if(picker){try{picker.showPicker()}catch(_){picker.focus();picker.click()}}return;}
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
 window.minnaChatCategoryPending=category;window.minnaChatCategoryLearningTitle=pending.categoryLearningTitle||pending.title;
 window.minnaPriorityLearningPending=automaticMisc?null:{title:pending.title,priority,predicted:suggestedPriority,confident:suggestionConfident};
 window.minnaChatChecklistPayload=checkItems.map(x=>({text:x.text.trim(),done:false})).filter(x=>x.text);
 $('quickAddForm').requestSubmit();
}
$('mcFullEditor').onclick=()=>{pending={title:input.value.trim().slice(0,120),date:'',time:''};bridge(true);};
$('mcOldAdd').onclick=()=>{modal.close();window.openSimpleReminder?.('');};
})();
