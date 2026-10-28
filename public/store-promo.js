/* Own-store welcome promotion; daily browser frequency, no tracking requests. */
(()=>{'use strict';
const KEY='tc74-command-store-shown',URL='https://command-store.pages.dev/';
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function read(){try{const value=localStorage.getItem(KEY);if(value)return value;}catch{}try{return sessionStorage.getItem(KEY);}catch{return null;}}
function remember(){const value=today();try{localStorage.setItem(KEY,value);}catch{}try{sessionStorage.setItem(KEY,value);}catch{}}
function init(){
 if(read()===today()||typeof HTMLDialogElement==='undefined'||!HTMLDialogElement.prototype.showModal)return;
 let done=false,timer=null,observer;
 const stop=()=>{done=true;clearTimeout(timer);observer?.disconnect();document.removeEventListener('visibilitychange',schedule);window.removeEventListener('hashchange',schedule);window.removeEventListener('storage',sync);};
 function sync(e){if(e.key===KEY&&read()===today())stop();}
 function blocked(){return document.hidden||Array.from(document.querySelectorAll('.analytics-consent,dialog[open],[role="dialog"][aria-modal="true"]')).some(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden')||/^#(?:conta|account|login|register)(?:\/|$)/i.test(location.hash);}
 function show(){timer=null;if(done)return;if(read()===today()){stop();return;}if(blocked())return;
  const previous=document.activeElement;
  const modal=document.createElement('dialog');modal.className='store-promo';modal.setAttribute('aria-labelledby','store-promo-title');modal.setAttribute('aria-describedby','store-promo-description');
  modal.innerHTML=`<div class="store-promo-card"><button type="button" class="store-promo-close" aria-label="Fechar anúncio da Command Store" autofocus>×</button><img class="store-promo-crest" src="/assets/command-store-crest.svg" width="164" height="164" alt="Escudo da Command Store com C dourado e espadas cruzadas" decoding="async"><div class="store-promo-brand">COMMAND<span>STORE</span></div><div class="store-promo-divider" aria-hidden="true"></div><p class="store-promo-eyebrow">DA NOSSA COMUNIDADE PARA VOCÊ</p><h2 id="store-promo-title">Leve a Command<br>com você.</h2><p id="store-promo-description">O guia é só o começo.<br>Conheça também a nossa loja.</p><a class="store-promo-visit" href="${URL}" target="_blank" rel="noopener noreferrer" aria-label="Conhecer a Command Store, abre em nova aba">Conhecer a loja <span aria-hidden="true">↗</span></a><button type="button" class="store-promo-continue">Continuar no guia</button><small class="store-promo-label">DIVULGAÇÃO · COMMAND STORE</small></div>`;
  modal.querySelector('.store-promo-close').addEventListener('click',()=>modal.close());
  modal.querySelector('.store-promo-continue').addEventListener('click',()=>modal.close());
  modal.querySelector('.store-promo-visit').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{if(e.target!==modal)return;const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();});
  modal.addEventListener('close',()=>{document.documentElement.classList.remove('store-promo-open');modal.remove();if(previous?.isConnected&&previous!==document.body)previous.focus();},{once:true});
  document.body.append(modal);
  try{modal.showModal();document.documentElement.classList.add('store-promo-open');remember();stop();}catch{modal.remove();stop();}
 }
 function schedule(){if(done||timer!==null)return;timer=setTimeout(show,1200);}
 observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','aria-modal']});
 document.addEventListener('visibilitychange',schedule);window.addEventListener('hashchange',schedule);window.addEventListener('storage',sync);schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
