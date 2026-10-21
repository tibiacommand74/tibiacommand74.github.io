/* Reuse the site's existing page structure and CSS. No separate Mythera theme. */
'use strict';
window.applyMytheraLayout=(root,page)=>{
 if(!window.ServerContext?.isMythera)return;
 const workspace=root.querySelector(':scope > .world-workspace');
 if(!workspace||workspace.dataset.sharedLayout||page==='inicio')return;
 const oldHeading=workspace.querySelector(':scope > .world-page-heading');
 if(!oldHeading)return;
 workspace.dataset.sharedLayout='true';
 const title=oldHeading.querySelector('h1')?.textContent||'Mythera';
 const description=oldHeading.querySelector('p:last-child')?.textContent||'';
 const tab=location.hash.split('/')[1]||'search';
 const library=['biblioteca','criaturas','explorador'].includes(page);
 const tool=['loot','equipamentos'].includes(page)||page==='explorador'&&['sets','food'].includes(tab);
 const community=['servidores','classificados','feedback','sobre'].includes(page);
 const selected=page==='criaturas'?'criaturas':page==='biblioteca'?catalogTab:tab;
 const heading=document.createElement('div');heading.className='section-head guide-hub-heading';
 const intro=document.createElement('div');
 const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='TIBIA COMMAND · MYTHERA';
 const h=document.createElement('h2');h.textContent=tool?'Ferramentas do Mythera':library?'Biblioteca do Mythera':community?'Comunidade':title;
 const lead=document.createElement('p');lead.textContent=library?'Consulte o mundo, prepare sua aventura e guarde suas descobertas.':description;
 intro.append(eyebrow,h,lead);heading.append(intro);
 const explorer=page==='explorador';
 const layout=document.createElement('div');layout.className=explorer?'explorer-layout':'guide-hub-layout';
 if(tool||community)layout.classList.add('section-area-layout');
 const side=document.createElement(explorer?'nav':'aside');side.className=explorer?'explorer-tabs':'guide-hub-sidebar';
 const nav=explorer?side:document.createElement('nav');nav.classList.add('guide-hub-nav');
 if(tool||community){window.buildSectionNavigation(nav,tool?'tools':'community',page==='explorador'?'explorador/'+tab:page);nav.querySelector('a[href="#explorador/journal"]')?.remove();}
 else if(library)window.buildLibraryNavigation(nav,selected,root);
 else if(page==='mundo'&&window.MytheraSystems)window.MytheraSystems.buildNavigation(nav);
 else{nav.setAttribute('aria-label','Guias');for(const [id,label]of [['iniciantes','Iniciantes'],['hunts','Hunts'],['quests','Quests'],['mundo','Sistemas Mythera']]){const a=document.createElement('a');a.href='#'+id;a.textContent=label;if(id===page)a.setAttribute('aria-current','page');nav.append(a);}}
 if(!explorer)side.append(nav);
 const panel=document.createElement('section');panel.className=explorer?'explorer-content-panel':'guide-hub-panel';
 if(tool||community)panel.classList.add('section-area-panel');
 const panelHeading=document.createElement('div');panelHeading.className='explorer-panel-heading';
 const subtitle=document.createElement('h3');subtitle.textContent=title;
 const subtitleText=document.createElement('p');subtitleText.textContent=description;
 panelHeading.append(subtitle,subtitleText);if(!workspace.dataset.crafting&&!workspace.dataset.profession&&!workspace.dataset.trainingGuide&&!workspace.dataset.adventureGuide)panel.append(panelHeading);
 oldHeading.remove();workspace.querySelectorAll(':scope > .world-library-tabs').forEach(n=>n.remove());
 const filterNodes=[...workspace.querySelectorAll(':scope > .world-filters')];
 const input=filterNodes[0]?.querySelector('input[type="search"]');
 if(input&&!explorer&&!tool){const oldLabel=input.closest('label'),search=document.createElement('div'),label=document.createElement('label');search.className='library-search-bar';input.id='mythera-search-'+selected;label.htmlFor=input.id;label.textContent=oldLabel?.firstChild?.textContent?.trim()||'Pesquisar';search.append(label,input);oldLabel?.remove();panel.append(search);}
 for(const filter of filterNodes){if(explorer||tool){filter.className=tool?'tc-fields':selected==='keys'?'key-library-filters':'explorer-filter-bar';continue;}filter.className=page==='biblioteca'&&selected==='magias'?'spell-inline-filters':'toolbar';filter.querySelectorAll('label').forEach(label=>label.className=page==='biblioteca'&&selected==='magias'?'spell-filter':'guide-filter-label');if(page==='biblioteca'&&selected==='magias')continue;if(!filter.children.length){filter.remove();continue;}let block=side.querySelector('.guide-hub-filters');if(!block){block=document.createElement('div');block.className='guide-hub-filters';const caption=document.createElement('h3');caption.textContent='Filtrar resultados';block.append(caption);side.append(block);}block.append(filter);}
 workspace.querySelectorAll('.global-search-grid').forEach(n=>n.classList.remove('global-search-grid'));
 workspace.querySelectorAll('.world-button').forEach(n=>{n.classList.remove('world-button');n.classList.add('action');});
 workspace.querySelectorAll('.world-download-card').forEach(n=>n.classList.add('catalog-card','library-card'));
 workspace.querySelectorAll('.mythera-creature-summary').forEach(n=>n.className='catalog-reference');
 for(const child of [...workspace.children])panel.append(child);
 workspace.className='';layout.append(side,panel);root.append(heading,layout);workspace.remove();
 root.classList.add('guide-hub-root');root.dataset.guideKind=page==='biblioteca'?'library-'+selected:page;
};
