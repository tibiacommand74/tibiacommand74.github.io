'use strict';
window.applyGuideLayout=(root,kind)=>{
 const library=kind==='criaturas'||kind.startsWith('library-');
 const heading=root.querySelector('.section-head');if(!heading)return;
 heading.classList.add('guide-hub-heading');
 const layout=document.createElement('div');layout.className='guide-hub-layout';
 const sidebar=document.createElement('aside');sidebar.className='guide-hub-sidebar';
 const nav=document.createElement('nav');nav.className='guide-hub-nav';nav.setAttribute('aria-label',library?'Biblioteca clássica':'Guias da comunidade');
 if(library){
  const oldTabs=root.querySelector('.catalog-tabs');if(oldTabs)oldTabs.remove();
  const selected=kind==='criaturas'?'criaturas':catalogTab;
  window.buildLibraryNavigation(nav,selected,root);
  const h=heading.querySelector('h2'),p=heading.querySelector('p');
  h.textContent='Biblioteca 7.4';p.textContent='Consulte o mundo clássico, prepare sua aventura e guarde suas descobertas.';
 }else nav.innerHTML='<p class="eyebrow">GUIAS CLÁSSICOS</p>'+[['iniciantes','Iniciantes'],['hunts','Hunts'],['quests','Quests']].map(([id,name])=>`<a href="#${id}" ${kind===id?'aria-current="page"':''}>${name}<span aria-hidden="true">›</span></a>`).join('');sidebar.append(nav);
 const panel=document.createElement('section');panel.className='guide-hub-panel';
 const filter=root.querySelector(library?(kind==='criaturas'?'.toolbar':'.catalog-toolbar'):kind==='quests'?'.quest-filter-panel':kind==='hunts'?'.hunt-toolbar':'.beginner-nav');
 if(filter){filter.querySelectorAll('label.sr-only').forEach(label=>label.remove());const block=document.createElement('div');block.className='guide-hub-filters';const label=document.createElement('h3');label.textContent=library?'Filtrar biblioteca':kind==='iniciantes'?'Sua jornada':'Encontre seu guia';block.append(label,filter);sidebar.append(block);
  if(kind!=='iniciantes')filter.querySelectorAll('input,select').forEach(control=>{const text=control.getAttribute('aria-label')||({'search':'Buscar criatura ou loot','catalog-search':'Buscar na biblioteca'}[control.id]);if(!text)return;const label=document.createElement('label');label.className='guide-filter-label';const span=document.createElement('span');span.textContent=text;control.before(label);label.append(span,control);});
 }
 for(const child of [...root.children])if(child!==heading)panel.append(child);
 if(library){const ph=document.createElement('div');ph.className='explorer-panel-heading';const names={criaturas:['Criaturas','Conheça os atributos, loots e respawns.'],itens:['Itens','Compare equipamentos e encontre compradores e vendedores.'],magias:['Magias','Consulte palavras, requisitos e professores.'],npcs:['NPCs','Encontre comerciantes, professores e referências no mapa.']};const info=names[kind==='criaturas'?'criaturas':catalogTab];ph.innerHTML='<h3>'+info[0]+'</h3><p>'+info[1]+'</p>';panel.prepend(ph);}
 layout.append(sidebar,panel);root.append(layout);root.classList.add('guide-hub-root');root.dataset.guideKind=kind;
 if(kind==='iniciantes'){const links=sidebar.querySelectorAll('.beginner-nav a');links.forEach((link,i)=>{if(i===0)link.setAttribute('aria-current','step');link.addEventListener('click',()=>{links.forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','step');});});}
};

window.buildLibraryNavigation=(nav,selected,root)=>{
 nav.classList.add('unified-library-nav');nav.setAttribute('aria-label','Biblioteca e planejamento');
 const groups=[['Consultar',[['search','Busca geral'],['criaturas','Criaturas'],['itens','Itens'],['magias','Magias'],['npcs','NPCs'],['keys','Chaves'],['cities','Cidades']]],['Preparar',[['planner','Planejar quests'],['sets','Sets clássicos'],['food','Comidas']]],['Guardar e descobrir',[['journal','Meu diário'],['lore','Livros e mistérios']]]];
 const href=id=>id==='criaturas'?'#criaturas':['itens','magias','npcs'].includes(id)?'#biblioteca':'#explorador/'+id;
 nav.innerHTML=groups.map(([name,entries])=>'<div class="explorer-nav-group"><h3>'+name+'</h3>'+entries.map(([id,label])=>'<a href="'+href(id)+'" '+(['itens','magias','npcs'].includes(id)?'data-library-section="'+id+'" ':'')+(selected===id?'aria-current="page"':'')+'>'+label+'<span aria-hidden="true">›</span></a>').join('')+'</div>').join('');
 nav.querySelectorAll('[data-library-section]').forEach(a=>a.onclick=ev=>{ev.preventDefault();catalogTab=a.dataset.librarySection;catalogQuery=catalogCategory=catalogVocation=catalogKind=catalogPremium=catalogCity=catalogRole='';catalogSort='name';catalogLimit=36;if(location.hash==='#biblioteca')renderCatalog(root);else location.hash='biblioteca';});
};
