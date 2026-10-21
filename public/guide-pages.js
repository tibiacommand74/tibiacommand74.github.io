'use strict';
const toggle=document.getElementById('site-menu-toggle'),nav=document.getElementById('site-navigation');
if(toggle&&nav)toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('mobile-open',open);};
document.querySelectorAll('[data-copy-quest-command]').forEach(button=>button.onclick=async()=>{const status=button.closest('.guide-dialogue').querySelector('.guide-copy-status');try{await navigator.clipboard.writeText(button.dataset.copyQuestCommand);status.textContent='Fala copiada.';}catch{status.textContent='Selecione a fala e copie manualmente.';}});

// Copy spell words from standalone spell sheets with a manual fallback.
document.querySelectorAll('[data-copy-spell-words]').forEach(button=>button.onclick=async()=>{const status=button.closest('.spell-incantation').querySelector('[data-spell-copy-status]');try{await navigator.clipboard.writeText(button.dataset.copySpellWords);status.textContent='Palavras copiadas.';}catch{status.textContent='Não foi possível copiar. Selecione as palavras e copie manualmente.';}});

document.querySelectorAll('[data-rook-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.rookJump)?.scrollIntoView({behavior:'smooth',block:'start'}));

// Direct stage links open the surrounding spoiler and target detail before scrolling.
function revealGuideStage(){const match=location.hash.match(/^#etapa-(\d+)$/);if(!match)return;const target=document.getElementById('etapa-'+Number(match[1]));if(!target)return;for(let el=target;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;target.scrollIntoView({block:'start',behavior:'auto'});}
window.addEventListener('hashchange',revealGuideStage);revealGuideStage();


// Filter every library directory without hiding records from non-JavaScript readers.
(()=>{const input=document.getElementById('directory-search'),directory=document.getElementById('library-directory');if(!input||!directory)return;const entries=[...directory.querySelectorAll('a[data-directory-search]')],count=document.getElementById('directory-search-count'),empty=document.getElementById('directory-search-empty'),clear=document.getElementById('directory-search-clear');const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();const indexed=entries.map(entry=>({entry,text:normalize(entry.dataset.directorySearch)}));const filter=()=>{const terms=normalize(input.value).split(/\s+/).filter(Boolean);let visible=0;for(const row of indexed){row.entry.hidden=!terms.every(term=>row.text.includes(term));if(!row.entry.hidden)visible++;}count.textContent=visible+' '+(visible===1?'resultado':'resultados');empty.hidden=visible>0;};input.addEventListener('input',filter);input.addEventListener('search',filter);clear.addEventListener('click',()=>{input.value='';filter();input.focus();});filter();})();


