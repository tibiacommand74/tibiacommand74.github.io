'use strict';
const toggle=document.getElementById('site-menu-toggle'),nav=document.getElementById('site-navigation');
if(toggle&&nav)toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('mobile-open',open);};
document.querySelectorAll('[data-copy-quest-command]').forEach(button=>button.onclick=async()=>{const status=button.closest('.guide-dialogue').querySelector('.guide-copy-status');try{await navigator.clipboard.writeText(button.dataset.copyQuestCommand);status.textContent='Fala copiada.';}catch{status.textContent='Selecione a fala e copie manualmente.';}});
