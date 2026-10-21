'use strict';
(()=>{
 const allowed=['classic','mythera'];let native;try{native=window.localStorage;}catch{native={getItem:()=>null,setItem:()=>{throw Error('Armazenamento local indisponível.');},removeItem:()=>{}};}let saved;try{saved=native.getItem('tc74-selected-server');}catch{}
 const requested=new URLSearchParams(location.search).get('servidor');const id=allowed.includes(requested)?requested:allowed.includes(saved)?saved:'classic';
 try{native.setItem('tc74-selected-server',id);}catch{}
 const prefix='tc74-server:v1:'+id+':';
 window.LabStorage={getItem:k=>native.getItem(prefix+(window.JournalAccount?.context()?.id||'guest')+':'+k),setItem:(k,v)=>native.setItem(prefix+(window.JournalAccount?.context()?.id||'guest')+':'+k,v),removeItem:k=>native.removeItem(prefix+(window.JournalAccount?.context()?.id||'guest')+':'+k)};
 window.TC74_LAB=false;const profile=window.MYTHERA_PROFILE;
 const classicXP=l=>Math.round((50*l*l*l-300*l*l+850*l-600)/3),cache=new Map([[160,classicXP(160)]]);
 function experience(level,server=id){if(!Number.isInteger(level)||level<1||level>10001)throw Error('Informe um level inteiro válido.');if(server!=='mythera'||level<=160)return classicXP(level);if(cache.has(level))return cache.get(level);let sum=classicXP(160);for(let l=161;l<=level;l++){sum+=(50*l*l-250*l+400)*Math.pow(1.002,l-160);if(!Number.isSafeInteger(Math.round(sum)))throw Error('Essa meta ultrapassa a precisão da previsão do Mythera. Reduza o level desejado.');}cache.set(level,Math.round(sum));return Math.round(sum);}
 function destination(value,section){
  if(!allowed.includes(value))throw Error('Servidor não disponível.');
  const url=new URL(location.href);url.searchParams.set('servidor',value);if(section)url.hash=section;
  if(value!=='classic')return url;
  for(const key of ['farming','mineracao','receita','treino','vocacao'])url.searchParams.delete(key);
  if(url.searchParams.get('categoria')==='guide')url.searchParams.delete('categoria');
  const [kind,raw]=url.hash.slice(1).split('/');let name;try{name=decodeURIComponent(raw||'');}catch{name='';}
  const key=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const same=(a,b)=>key(a)===key(b),set=(kind,name)=>url.hash='#'+kind+'/'+encodeURIComponent(name);
  if(kind==='mundo'){url.hash='#explorador/search';return url;}
  if(kind==='item'){
   const library=window.MytheraItemLibrary||[],catalog=window.CATALOG?.items||[];
   const item=library.find(i=>i.id===name||same(i.name,name));
   const classic=catalog.find(i=>String(i.id)===String(window.CATALOG?.itemAliases?.[name]??name)||item?.classicIds?.includes(String(i.id))||item&&same(i.name,item.name));
   if(classic)set('item',classic.id);else url.hash='#catalog/itens';
  }else if(['creature','creature-map','npc','npc-map','spell','quest','quest-map','hunt','hunt-map'].includes(kind)){
   const type=kind.replace(/-map$/,''),rows={creature:window.DATA?.creatures,npc:window.CATALOG?.npcs,spell:window.CATALOG?.spells,quest:typeof QUESTS!=='undefined'?QUESTS:window.QUESTS,hunt:window.CLASSIC_HUNTS}[type]||[];
   const spell=type==='spell'?(window.MytheraSpellLibrary||[]).find(s=>s.id===name):null;
   const record=name&&rows.find(r=>same(r.id,name)||same(r.name,spell?.name||name));
   if(record){let target=kind;if(kind==='npc-map'&&!Array.isArray(record.xyz)||kind==='quest-map'&&!window.QUEST_ROUTES?.[record.id]||kind==='hunt-map'&&record.mapUnavailable)target=type;set(target,['quest','hunt'].includes(type)?record.id:record.name);}
   else url.hash={creature:'#criaturas',npc:'#catalog/npcs',spell:'#catalog/magias',quest:'#quests',hunt:'#hunts'}[type];
  }
  return url;
 }
 function select(value,section){const url=destination(value,section);try{native.setItem('tc74-selected-server',value);}catch{}location.assign(url.href);}
 window.ServerContext={id,name:id==='mythera'?'Mythera':'Tibia 7.4 clássico',profile:id==='mythera'?profile:null,isMythera:id==='mythera',xp:experience,select,destination,storagePrefix:prefix};
 if(id==='mythera')for(const spell of window.CATALOG?.spells||[]){if(spell.kind!=='Runa')continue;spell.mytheraConfirmed={};if(profile.premiumRunes.includes(spell.name)){spell.premium=true;spell.mytheraConfirmed.premium=true;}const row=window.MYTHERA_ITEMS.find(i=>i.category==='runes'&&i.facts.Spell!=='-'&&i.facts.Spell.toLowerCase()===spell.words.toLowerCase());if(row&&/^\d+$/.test(row.facts.Charges)){spell.charges=Number(row.facts.Charges);spell.mytheraConfirmed.charges=true;}}

})();
