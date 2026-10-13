'use strict';
window.applyGuideLayout=(root,kind)=>{
 const heading=root.querySelector('.section-head');if(!heading)return;
 heading.classList.add('guide-hub-heading');
 const layout=document.createElement('div');layout.className='guide-hub-layout';
 const sidebar=document.createElement('aside');sidebar.className='guide-hub-sidebar';
 const nav=document.createElement('nav');nav.className='guide-hub-nav';nav.setAttribute('aria-label','Guias da comunidade');
 nav.innerHTML='<p class="eyebrow">GUIAS CLÁSSICOS</p>'+[['iniciantes','Iniciantes'],['hunts','Hunts'],['quests','Quests']].map(([id,name])=>`<a href="#${id}" ${kind===id?'aria-current="page"':''}>${name}<span aria-hidden="true">›</span></a>`).join('');sidebar.append(nav);
 const panel=document.createElement('section');panel.className='guide-hub-panel';
 const filter=root.querySelector(kind==='quests'?'.quest-filter-panel':kind==='hunts'?'.hunt-toolbar':'.beginner-nav');
 if(filter){const block=document.createElement('div');block.className='guide-hub-filters';const label=document.createElement('h3');label.textContent=kind==='iniciantes'?'Sua jornada':'Encontre seu guia';block.append(label,filter);sidebar.append(block);
  if(kind!=='iniciantes')filter.querySelectorAll('input,select').forEach(control=>{const text=control.getAttribute('aria-label');if(!text)return;const label=document.createElement('label');label.className='guide-filter-label';const span=document.createElement('span');span.textContent=text;control.before(label);label.append(span,control);});
 }
 for(const child of [...root.children])if(child!==heading)panel.append(child);
 layout.append(sidebar,panel);root.append(layout);root.classList.add('guide-hub-root');root.dataset.guideKind=kind;
 if(kind==='iniciantes'){const links=sidebar.querySelectorAll('.beginner-nav a');links.forEach((link,i)=>{if(i===0)link.setAttribute('aria-current','step');link.addEventListener('click',()=>{links.forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','step');});});}
};
