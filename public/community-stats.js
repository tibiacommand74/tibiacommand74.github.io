'use strict';
(()=>{
 const API='https://pnbwrpvhqmvhgqgftpou.supabase.co/functions/v1/community-stats';
 let lastActivity=Date.now(),lastAttempt=0,busy=false,reading=false;
 const visible=()=>document.visibilityState!=='hidden';
 async function totals(){if(!visible()||reading)return;reading=true;try{const response=await fetch(API,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error();const data=await response.json();if(!Number.isSafeInteger(data.registered)||data.registered<0||!Number.isSafeInteger(data.online)||data.online<0||data.online>data.registered)throw Error();document.querySelectorAll('[data-members-registered]').forEach(el=>el.textContent=data.registered.toLocaleString('pt-BR'));document.querySelectorAll('[data-members-online]').forEach(el=>el.textContent=data.online.toLocaleString('pt-BR'));document.querySelectorAll('[data-members-status]').forEach(el=>el.textContent='Online: membros com atividade nos últimos 5 minutos.');}catch{document.querySelectorAll('[data-members-registered],[data-members-online]').forEach(el=>el.textContent='—');document.querySelectorAll('[data-members-status]').forEach(el=>el.textContent='Contagem temporariamente indisponível.');}finally{reading=false;}}
 async function pulse(force=false){if(!visible()||busy||Date.now()-lastActivity>60000||!force&&Date.now()-lastAttempt<60000)return;busy=true;lastAttempt=Date.now();try{const token=await window.CommunityAuth?.token();if(!token)return;const response=await fetch(API,{method:'POST',headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(15000)});if(response.ok)await totals();}catch{}finally{busy=false;}}
 function activity(){lastActivity=Date.now();pulse();}
 for(const event of ['pointerdown','keydown','scroll'])window.addEventListener(event,activity,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(visible()){activity();totals();}});
 window.addEventListener('tc74-auth-change',()=>{lastActivity=Date.now();pulse(true);});
 window.addEventListener('online',()=>{totals();pulse(true);});
 setInterval(()=>{totals();pulse();},60000);
 totals();pulse();
})();
