'use strict';
(()=>{
 const API='https://api.github.com/repos/tibiacommand74/tibiacommand74.github.io/releases';
 let cached=null,lastUpdated=0,pending=null;
 async function load(){
  let total=0;
  for(let page=1;page<=10;page++){
   const response=await fetch(`${API}?per_page=100&page=${page}`,{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw Error('Consulta indisponível');
   const releases=await response.json();
   if(!Array.isArray(releases))throw Error('Resposta inválida');
   for(const release of releases){
    if(release.draft)continue;
    if(!Array.isArray(release.assets))throw Error('Arquivos inválidos');
    for(const asset of release.assets){
     if(asset.state!=='uploaded'||!/^Tibia-Command-Desktop-Setup-.*\.exe$/i.test(asset.name||''))continue;
     if(!Number.isSafeInteger(asset.download_count)||asset.download_count<0)throw Error('Contagem inválida');
     total+=asset.download_count;
     if(!Number.isSafeInteger(total))throw Error('Contagem inválida');
    }
   }
   if(releases.length<100){cached=total;lastUpdated=Date.now();return total;}
  }
  throw Error('Consulta incompleta');
 }
 window.refreshProgramDownloads=async root=>{
  const count=root.querySelector('[data-program-download-count]');
  if(!count)return;
  const status=root.querySelector('[data-program-download-status]');
  try{
   let total;
   if(cached!==null&&Date.now()-lastUpdated<60000)total=cached;
   else{
    if(!pending)pending=load().finally(()=>{pending=null;});
    total=await pending;
   }
   if(!count.isConnected)return;
   count.textContent=total.toLocaleString('pt-BR');
   status.textContent='Downloads dos instaladores desktop. Inclui novas versões e downloads repetidos.';
  }catch{
   if(!count.isConnected)return;
   count.textContent='—';
   status.textContent='Contagem temporariamente indisponível. O download continua funcionando.';
  }
 };
})();

'use strict';
(()=>{
 const API='https://api.github.com/repos/tibiacommand74/tibiacommand74.github.io/releases/tags/minimapas-20261010';
 const names=['minimap-tibia74.zip','minimapa-hunts-quests-tibia74.zip'];
 let cached=null,lastUpdated=0,pending=null;
 async function load(){
  const response=await fetch(API,{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Consulta indisponível');
  const release=await response.json();
  if(release.draft||!Array.isArray(release.assets))throw Error('Resposta inválida');
  const totals={};
  for(const name of names){
   const asset=release.assets.find(a=>a.name===name&&a.state==='uploaded');
   if(!asset||!Number.isSafeInteger(asset.download_count)||asset.download_count<0)throw Error('Contagem inválida');
   totals[name]=asset.download_count;
  }
  cached=totals;lastUpdated=Date.now();return totals;
 }
 window.refreshMapDownloads=async root=>{
  const counters=Array.from(root.querySelectorAll('[data-map-download]'));
  if(!counters.length)return;
  try{
   let totals;
   if(cached&&Date.now()-lastUpdated<60000)totals=cached;
   else{
    if(!pending)pending=load().finally(()=>{pending=null;});
    totals=await pending;
   }
   for(const card of counters){
    if(!card.isConnected)continue;
    const total=totals[card.dataset.mapDownload];
    if(!Number.isSafeInteger(total))throw Error('Mapa desconhecido');
    card.querySelector('[data-map-download-count]').textContent=total.toLocaleString('pt-BR');
    card.querySelector('[data-map-download-status]').textContent='Contagem desde 10/10/2026. Inclui downloads repetidos.';
   }
  }catch{
   for(const card of counters){
    if(!card.isConnected)continue;
    card.querySelector('[data-map-download-count]').textContent='—';
    card.querySelector('[data-map-download-status]').textContent='Contagem temporariamente indisponível. O download continua funcionando.';
   }
  }
 };
})();
