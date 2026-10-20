const CACHE='minna-v278';
const ASSETS=['./','./index.html','./reminder-menu-gap-v175.css?v=278','./dated-card-text-gap-v174.css?v=274','./dated-card-text-gap-v173.css?v=273','./dated-card-refine-v172.css?v=272','./dated-title-fit-v172.js?v=272','./misc-dated-card-v171.css?v=271','./dated-card-spacing-v170.css?v=270','./dated-card-inset-v169.css?v=269','./dated-card-inset-layer-v169.css?v=269','./dated-card-alignment-v168.css?v=268','./dated-card-tints-v167.css?v=267','./settings-colors-v166.css?v=266','./settings-fix-v165.css?v=265','./progress-fold-v164.css?v=264','./progress-fold-v164.js?v=264','./settings-panels-v163.css?v=263','./cancel-contrast-v162.css?v=262','./bottom-nav-depth.css?v=260','./add-button-shadow-v161.css?v=261','./styles.css','./nav-polish.css?v=259','./minna-theme.css?v=259','./app.js?v=259','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('minna-v')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 const shell=url.pathname.endsWith('/')||/\/(index\.html|styles\.css|nav-polish\.css|minna-theme\.css|app\.js|manifest\.json)$/.test(url.pathname);
 if(shell){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response}).catch(async()=>{const cache=await caches.open(CACHE);return(await cache.match(event.request))||(await cache.match('./index.html'))||Response.error()}));return}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response})));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('focus'in client)return client.focus()}if(self.clients.openWindow)return self.clients.openWindow('./')}))});
