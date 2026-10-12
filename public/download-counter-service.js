'use strict';
(()=>{
 const API='https://tibia-command-74.calmstronglife.chatgpt.site/api/downloads';
 const names=['minimap-tibia74.zip','minimapa-hunts-quests-tibia74.zip'];
 let cache=null,updated=0,pending=null;
 window.loadDownloadTotals=async()=>{
  if(cache&&Date.now()-updated<300000)return cache;
  if(!pending)pending=(async()=>{
   const response=await fetch(API,{signal:AbortSignal.timeout(15000),cache:'no-store'});
   const data=await response.json();
   if(!response.ok||!data.ok||!Number.isSafeInteger(data.program)||data.program<0||names.some(name=>!Number.isSafeInteger(data.maps?.[name])||data.maps[name]<0))throw Error('Contagem indisponível');
   cache=data;updated=Date.now();return data;
  })().finally(()=>{pending=null;});
  return pending;
 };
})();
