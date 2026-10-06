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
