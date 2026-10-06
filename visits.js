'use strict';
(()=>{
 const API='https://tibia-command-74.calmstronglife.chatgpt.site/api/visits';
 const EXCLUDED='tc74-exclude-visits',SESSION='tc74-visit-session',SESSION_MS=30*60*1000;
 const counter=document.getElementById('visit-count'),status=document.getElementById('visit-preference'),button=document.getElementById('visit-toggle');
 let excluded=false,session=null,storage=true,busy=false;
 try{
  const url=new URL(location.href);
  if(url.searchParams.get('interno')==='1'){
   localStorage.setItem(EXCLUDED,'1');url.searchParams.delete('interno');history.replaceState(null,'',url.pathname+url.search+url.hash);
  }
  excluded=localStorage.getItem(EXCLUDED)==='1';
  try{session=JSON.parse(localStorage.getItem(SESSION)||'null');}catch{session=null;}
  if(!session||typeof session.id!=='string'||!Number.isFinite(session.started))session=null;
 }catch{storage=false;excluded=true;}
 function preference(){
  status.textContent=!storage?'A contagem está desativada neste navegador.':excluded?'Seus acessos neste navegador não são contados.':'Uma visita por navegador a cada 30 minutos.';
  button.textContent=excluded?'Contar este navegador':'Não contar meus acessos';button.disabled=busy||!storage;
 }
 async function request(action,id){
  const options={cache:'no-store',signal:AbortSignal.timeout(15000)};
  if(action){options.method='POST';options.headers={'content-type':'application/json'};options.body=JSON.stringify({action,id});}
  const response=await fetch(API,options),data=await response.json();
  if(!response.ok||!data.ok||!Number.isSafeInteger(data.total)||data.total<0)throw Error('Contador indisponível');
  counter.textContent=data.total.toLocaleString('pt-BR');
 }
 async function refresh(){
  busy=true;preference();
  try{
   if(excluded){await request(session?'exclude':null,session?.id);}
   else{
    if(!session||Date.now()-session.started>=SESSION_MS||session.started>Date.now()){
     session={id:crypto.randomUUID(),started:Date.now()};localStorage.setItem(SESSION,JSON.stringify(session));
    }
    await request('visit',session.id);
   }
  }catch{counter.textContent='—';}
  finally{busy=false;preference();}
 }
 button.onclick=async()=>{
  if(busy||!storage)return;
  try{
   excluded=!excluded;localStorage.setItem(EXCLUDED,excluded?'1':'0');
   if(!excluded){session=null;localStorage.removeItem(SESSION);}
   await refresh();
  }catch{storage=false;excluded=true;preference();}
 };
 window.addEventListener('storage',e=>{if(e.key===EXCLUDED){excluded=e.newValue==='1';if(!busy)refresh();}});
 refresh();
})();
