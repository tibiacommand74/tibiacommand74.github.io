/* One search experience; each server keeps its own catalog and relationships. */
(()=>{
'use strict';
const labels={creature:'Criaturas',item:'Itens',spell:'Magias',npc:'NPCs',hunt:'Hunts',quest:'Quests',key:'Chaves',city:'Cidades',guide:'Guias e sistemas'};
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const my=()=>Boolean(window.ServerContext?.isMythera);
let cache,cacheServer;
function rows(){
 const server=my()?'mythera':'classic';if(cache&&cacheServer===server)return cache;cacheServer=server;
 if(my())cache=window.MytheraWorkspace.globalSearchRows();
 else cache=window.ClassicExplorer.allEntries().map(r=>{
  const record=r.type==='item'?window.CATALOG.items.find(i=>String(i.id)===r.id):r.type==='creature'?window.DATA.creatures.find(i=>i.name===r.id):r.type==='spell'?window.CATALOG.spells.find(i=>i.name===r.id):r.type==='npc'?window.CATALOG.npcs.find(i=>i.name===r.id):r.type==='quest'?QUESTS.find(i=>i.id===r.id):r.type==='hunt'?window.CLASSIC_HUNTS.find(i=>i.id===r.id):r.type==='key'?window.CLASSIC_RESOURCES.keys.find(i=>i.number===r.id):window.CLASSIC_RESOURCES.regions.find(i=>i.name===r.id);
  return {...r,text:r.search,record:record||{},origin:'Base 7.4'};
 });
 // Search the inherited loot and documented rewards without merging server attributes.
 cache=cache.map(r=>{const base=r.type==='creature'?window.DATA.creatures.find(c=>norm(c.name)===norm(r.name)):null;return {...r,text:[r.text,r.record.path,...(base?.loot||[]).map(l=>l.name),...(r.record.rewards||[]),...(r.record.needs||[]),...(r.record.mobs||[])].join(' ')};});
 return cache;
}
function creatureLoot(r){return window.DATA.creatures.find(c=>norm(c.name)===norm(r.name))?.loot||r.record?.loot||[];}
function creatureMatches(r,terms,mode){const values=mode==='loot'?creatureLoot(r).map(l=>l.name):[r.name,...(r.record?.aliases||[])];return values.some(v=>terms.every(t=>norm(v).includes(t)));}
function search(query,type='',mode='name'){
 const q=norm(query),terms=q.split(/\s+/).filter(Boolean);if(!terms.length)return [];
 const rank=r=>norm(r.name)===q?0:norm(r.name).startsWith(q)?1:norm(r.name).includes(q)?2:3;
 return rows().filter(r=>(!type||r.type===type)&&(r.type==='creature'?creatureMatches(r,terms,mode):terms.every(t=>norm(r.text).includes(t)))).sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name,'pt-BR'));
}
function visual(r){
 const d=r.record;let src=d.image;
 if(r.type==='creature')src=my()?window.MytheraWorkspace.creatureImage(d):(window.DATA.monsters?.[norm(r.name)]);
 if(r.type==='npc'&&my())src=window.MytheraWorkspace.npcImage(d);
 return src?`<img class="catalog-sprite" src="${escape(src)}" alt="" loading="lazy" decoding="async">`:r.type==='spell'?spellVisual(d):libraryGraphic(r.type==='creature'?'creature':r.type==='npc'?'npc':'guide');
}
function facts(r){const d=r.record;if(r.type==='creature'){const c=window.DATA.creatures.find(c=>norm(c.name)===norm(r.name));return [['Experiência',c?.xp!=null?c.xp.toLocaleString('pt-BR')+' XP':'Consultar ficha'],['Loot',c?.loot?.length?c.loot.length+' itens registrados':'Consultar ficha']];}if(r.type==='spell')return [['Conjuração',d.words||'Consultar ficha'],['Magic level',d.ml??'Não informado']];if(r.type==='item')return my()?window.MytheraWorkspace.itemFacts(d,2):Object.entries(d.stats||{}).filter(([k])=>['attack','defense','armor','weight'].includes(k)).slice(0,2).map(([k,v])=>[{attack:'Ataque',defense:'Defesa',armor:'Armadura',weight:'Peso (oz)'}[k],v]);return d.city?[['Localização',d.city]]:[];}
function summary(r){if(r.type==='creature'&&window.DATA.creatures.some(c=>norm(c.name)===norm(r.name)))return 'Combate, loot e hunts relacionadas na ficha.';const value=r.record.role||r.record.use||r.record.description||r.record.summary||'';return value.length>110?value.slice(0,107).replace(/\s+\S*$/,'')+'…':value;}
function open(r){if(!r)return;if(my())window.MytheraWorkspace.openSearchResult(r);else window.ClassicExplorer.open(r.type,r.id);connect(r.type,r.record);}
function go(query,type=''){
 const u=new URL(location.href);u.searchParams.set('busca',query.trim());u.searchParams.delete('criaturasPor');if(type)u.searchParams.set('categoria',type);else u.searchParams.delete('categoria');history.replaceState(null,'',u.href);
 document.querySelector('#detail')?.close();if(location.hash==='#explorador/search')render(document.querySelector('#content'));else location.hash='explorador/search';
}
function render(root){
 const params=new URL(location.href).searchParams;let query=params.get('busca')||window.MytheraSearchQuery||'',type=labels[params.get('categoria')]&&(my()||params.get('categoria')!=='guide')?params.get('categoria'):'';window.MytheraSearchQuery='';let limit=24,mode=params.get('criaturasPor')==='loot'?'loot':'name';
 root.innerHTML=`<section class="world-workspace connected-search"><div class="connected-search-heading"><p class="eyebrow">${my()?'MYTHERA · BASE 7.4 + SERVIDOR':'TIBIA 7.4 · BIBLIOTECA CLÁSSICA'}</p><h2>O que você procura?</h2><p>Encontre a ficha e descubra os caminhos que se conectam a ela.</p></div><div class="world-filters global-search-toolbar"><label>Buscar na biblioteca<input id="explorer-search" data-global-query type="search" maxlength="150" autocomplete="off" placeholder="Dragon, crown armor, exura, Thais…" value="${escape(query)}"></label><label>Categoria<select id="explorer-search-type" data-global-type><option value="">Todas as categorias</option>${Object.entries(labels).filter(([k])=>my()||k!=='guide').map(([k,v])=>`<option value="${k}" ${type===k?'selected':''}>${v}</option>`).join('')}</select></label><button type="button" class="world-button secondary" data-search-clear>Limpar</button></div><label class="creature-search-mode" data-creature-mode-wrap>Pesquisar criaturas por<select data-creature-search-mode><option value="name">Nome da criatura</option><option value="loot">Item do loot</option></select><small data-creature-mode-help></small></label><div class="connected-search-categories" aria-label="Resultados por categoria"></div><p data-search-count role="status" aria-live="polite"></p><div class="catalog-grid library-grid" data-search-results></div><button class="world-button secondary connected-search-more" type="button" data-search-more hidden>Mostrar mais resultados</button></section>`;
 const input=root.querySelector('#explorer-search'),select=root.querySelector('#explorer-search-type'),out=root.querySelector('[data-search-results]'),counts=root.querySelector('.connected-search-categories'),more=root.querySelector('[data-search-more]');
 function paint(){
  const all=search(query,'',mode),filtered=type?all.filter(r=>r.type===type):all,shown=filtered.slice(0,limit),u=new URL(location.href);
  if(query.trim())u.searchParams.set('busca',query.trim());else u.searchParams.delete('busca');if(type)u.searchParams.set('categoria',type);else u.searchParams.delete('categoria');if(mode==='loot')u.searchParams.set('criaturasPor','loot');else u.searchParams.delete('criaturasPor');history.replaceState(null,'',u.href);
  root.querySelector('[data-creature-mode-wrap]').hidden=Boolean(type&&type!=='creature');root.querySelector('[data-creature-search-mode]').value=mode;root.querySelector('[data-creature-mode-help]').textContent=mode==='loot'?'Mostra criaturas com o item pesquisado no loot registrado.':'Mostra criaturas pelo nome ou apelido cadastrado.';
  root.querySelector('[data-search-count]').textContent=query.trim()?`${filtered.length} resultados · ${shown.length} exibidos · ${my()?'Mythera':'Tibia 7.4 clássico'}`:'Pesquise por nome, palavras mágicas ou cidade. Para procurar drops, escolha Item do loot.';
  counts.innerHTML=query.trim()?[['','Todas',all.length],...Object.entries(labels).map(([k,v])=>[k,v,all.filter(r=>r.type===k).length]).filter(([k,v,n])=>n)].map(([k,v,n])=>`<button type="button" data-search-category="${k}" aria-pressed="${type===k}">${v} <span>${n}</span></button>`).join(''):'';
  counts.querySelectorAll('[data-search-category]').forEach(b=>b.onclick=()=>{type=b.dataset.searchCategory;select.value=type;limit=24;paint();});
  out.innerHTML=!query.trim()?`<div class="connected-search-empty"><h3>Por onde começar?</h3><p>Um nome pode levar a criaturas, equipamentos, hunts e quests.</p><div>${['dragon','crown armor','exura','Thais',...(my()?['mineração']:[])].map(t=>`<button type="button" class="world-button secondary" data-search-example="${t}">${t}</button>`).join('')}</div></div>`:shown.map((r,i)=>libraryCard({attribute:'data-search-open',key:i,name:r.name,category:labels[r.type],art:visual(r),badge:r.origin,facts:facts(r),note:r.type==='creature'&&query.trim()?(mode==='loot'?'Loot correspondente: '+creatureLoot(r).filter(l=>norm(query).split(/\s+/).every(t=>norm(l.name).includes(t))).map(l=>l.name).join(', '):'Nome da criatura corresponde à busca.'):summary(r),footer:'Abrir ficha e explorar conexões →'})).join('')||'<div class="connected-search-empty"><h3>Nenhum resultado neste filtro</h3><p>Tente outro nome ou selecione Todas as categorias.</p></div>';
  out.querySelectorAll('[data-search-open]').forEach(b=>b.onclick=()=>open(shown[Number(b.dataset.searchOpen)]));out.querySelectorAll('[data-search-example]').forEach(b=>b.onclick=()=>{query=b.dataset.searchExample;type='';input.value=query;select.value='';limit=24;paint();});more.hidden=filtered.length<=limit;
 }
 root.querySelector('[data-creature-search-mode]').onchange=ev=>{mode=ev.target.value;if(mode==='loot'){type='creature';select.value=type;}limit=24;paint();};
 input.oninput=()=>{query=input.value;limit=24;paint();};select.onchange=()=>{type=select.value;limit=24;paint();};more.onclick=()=>{limit+=24;paint();};root.querySelector('[data-search-clear]').onclick=()=>{query=type='';mode='name';input.value=select.value='';limit=24;paint();input.focus();};paint();
}
function related(type,record){
 const name=norm(record.name),all=rows(),links=[],add=(r,reason)=>{if(r&&!(r.type===type&&norm(r.name)===name)&&!links.some(l=>l.row===r))links.push({row:r,reason});},find=(t,n)=>all.find(r=>r.type===t&&norm(r.name)===norm(n)),has=(values,n)=>values?.some(v=>norm(typeof v==='string'?v:v.name||v.item||v.creature)===n);
 if(type==='creature'){
  all.filter(r=>r.type==='hunt'&&norm(r.record.mob)===name).forEach(r=>add(r,'Hunt da criatura principal'));
  all.filter(r=>r.type==='quest'&&has(r.record.mobs,name)).forEach(r=>add(r,'Criatura citada na quest'));
  const base=window.DATA.creatures.find(c=>norm(c.name)===name);for(const l of base?.loot||[])add(find('item',l.name),'Item do loot · base 7.4');
 }
 if(type==='item'){
  window.DATA.creatures.filter(c=>has(c.loot,name)).forEach(c=>add(find('creature',c.name),'Loot registrado · base 7.4'));
  all.filter(r=>r.type==='quest'&&has(r.record.rewards,name)).forEach(r=>add(r,'Recompensa registrada'));
  all.filter(r=>r.type==='npc'&&(has(r.record.offers?.map(o=>o.item),name)||[...(r.record.buy||[]),...(r.record.sell||[])].some(o=>String(o.item)===String(record.id)))).forEach(r=>add(r,'Comércio registrado · consulte a operação'));
 }
 if(type==='hunt'||type==='quest'){
  for(const n of [record.mob,...(record.mobs||[])].filter(Boolean))add(find('creature',n),'Criatura registrada no guia');
  for(const n of record.rewards||[])add(find('item',n),'Recompensa registrada');
 }
 if(record.city)add(find('city',record.city),'Explorar a região');
 if(type==='spell')for(const t of record.teachers||[])add(find('npc',t.npc),'Professor registrado');
 if(type==='city')all.filter(r=>['hunt','quest','npc','key'].includes(r.type)&&norm(r.record.city)===name).forEach(r=>add(r,'Registro nesta região'));
 return links;
}
function connect(type,record){
 if(!record||!labels[type])return;const body=document.querySelector('#detail-body');if(!body)return;body.querySelector('[data-library-connections]')?.remove();const links=related(type,record);if(!links.length)return;
 const section=document.createElement('section');section.className='library-connections';section.dataset.libraryConnections='';section.innerHTML=`<p class="eyebrow">CONTINUE EXPLORANDO · ${my()?'MYTHERA':'TIBIA 7.4'}</p><h3>Conexões da biblioteca</h3><p>Relações registradas nas fichas. Consulte a origem e os detalhes de cada informação.</p><div class="library-connection-list"></div><button type="button" class="world-button secondary" data-connections-more hidden>Mostrar mais conexões</button>`;body.append(section);let limit=8;
 const paint=()=>{section.querySelector('.library-connection-list').innerHTML=links.slice(0,limit).map(({row:r,reason},i)=>`<button type="button" data-connection-open="${i}"><span>${escape(labels[r.type])}</span><strong>${escape(r.name)}</strong><small>${escape(reason)}</small></button>`).join('');section.querySelectorAll('[data-connection-open]').forEach(b=>b.onclick=()=>open(links[Number(b.dataset.connectionOpen)].row));section.querySelector('[data-connections-more]').hidden=limit>=links.length;};section.querySelector('[data-connections-more]').onclick=()=>{limit+=8;paint();};paint();
}
window.LibrarySearch={rows,search,render,go,related,connect};
// Public classic entry points also receive connections when opened outside search.
for(const [key,type]of [['detailItem','item'],['detailSpell','spell'],['detailNpc','npc'],['detailQuest','quest'],['detailHunt','hunt']]){
 const original=window[key];if(typeof original!=='function')continue;window[key]=function(id,...args){const result=original(id,...args);if(!my()){const r=rows().find(r=>r.type===type&&(String(r.id)===String(id)||norm(r.name)===norm(id)));if(r)connect(type,r.record);}return result;};
}
})();
