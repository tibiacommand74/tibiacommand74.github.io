'use strict';
const toggle=document.getElementById('site-menu-toggle'),nav=document.getElementById('site-navigation');
if(toggle&&nav)toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('mobile-open',open);};
document.querySelectorAll('[data-copy-quest-command]').forEach(button=>button.onclick=async()=>{const status=button.closest('.guide-dialogue').querySelector('.guide-copy-status');try{await navigator.clipboard.writeText(button.dataset.copyQuestCommand);status.textContent='Fala copiada.';}catch{status.textContent='Selecione a fala e copie manualmente.';}});

// Direct stage links open the surrounding spoiler and target detail before scrolling.
function revealGuideStage(){const match=location.hash.match(/^#etapa-(\d+)$/);if(!match)return;const target=document.getElementById('etapa-'+Number(match[1]));if(!target)return;for(let el=target;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;target.scrollIntoView({block:'start',behavior:'auto'});}
window.addEventListener('hashchange',revealGuideStage);revealGuideStage();
