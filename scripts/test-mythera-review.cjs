'use strict';
const fs=require('node:fs'), assert=require('node:assert/strict');
const harness=fs.readFileSync('scripts/test-server-lab.cjs','utf8').split('(async()=>')[0];
const setup=new Function('require',harness+'\nreturn setup;')(require);
const e=setup('mythera').env, classic=setup('classic').env, api=e.MytheraWorkspace;
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
assert.equal(api.items.length,780);
assert.equal(api.creatureLibrary.length,129);
assert.equal(new Set(api.items.map(i=>i.id)).size,780);
assert.equal(new Set(api.creatureLibrary.map(c=>norm(c.name))).size,129);
for(const base of e.CATALOG.items){
  assert(api.items.some(i=>i.classicIds.includes(String(base.id))),base.name+' retained by classic id');
  assert(api.searchAll(base.name,'item').length,base.name+' searchable');
}
for(const base of e.DATA.creatures)assert(api.creatureLibrary.some(c=>norm(c.name)===norm(base.name)),base.name);
for(const row of e.MYTHERA_ITEMS){
  const merged=api.items.find(i=>i.id===row.id);
  for(const [field,value]of Object.entries(row.facts))assert.equal(merged.facts[field],value,row.name+' '+field);
}
assert.deepEqual(JSON.parse(JSON.stringify(e.MYTHERA_ITEMS)),JSON.parse(JSON.stringify(classic.MYTHERA_ITEMS)),'Server table never mutated');
assert.deepEqual(JSON.parse(JSON.stringify(e.DATA)),JSON.parse(JSON.stringify(classic.DATA)),'Classic creature/map data never mutated');
assert.equal(api.huntRows().length,111);
assert.equal(api.questLibrary().length,99);
for(const h of e.CLASSIC_HUNTS)assert(api.huntRows().some(r=>r.id===h.id));
for(const q of e.CLASSIC_QUEST_CATALOG)assert(api.questLibrary().some(r=>r.id===q.id));
assert.equal(api.questLibrary().filter(r=>norm(r.name)==='ironhammer').length,1,'Mythera override uses same quest');
assert(api.huntRows().some(r=>r.origin==='mythera'&&r.name==='Crypt of the Vacant'));
assert(api.recordSheet(api.huntRows().find(r=>r.origin==='classic')).includes('Ver referência no mapa 7.4'));
assert(api.useClassicMap('#hunt-map/troll-thais'));
assert(!api.useClassicMap('#hunt-map/mythera-cryptofthevacant'));
assert(!api.useClassicMap('#npc-map/Eirik'));
assert(api.itemSheet(api.items.find(i=>i.name==='Plate Armor')).includes('Comprar e vender'));
assert(api.itemSheet(api.items.find(i=>i.name==='Plate Armor')).includes('#creature/'));
let modal='';e.openCatalogDialog=html=>{modal=html;};
const routes=[...api.items.map(r=>['item',r.id]),...api.creatureLibrary.map(r=>['creature',r.name]),...e.MytheraNpcLibrary.map(r=>['npc',r.name]),...e.MytheraSpellLibrary.map(r=>['spell',r.name]),...api.huntRows().map(r=>['hunt',r.id]),...api.questLibrary().map(r=>['quest',r.id])];
for(const [kind,id]of routes){
  modal='';api.openRoute('#'+kind+'/'+encodeURIComponent(id));
  assert(modal.includes('<h2>'),kind+'/'+id+' opens a ficha');
  assert(!modal.includes('undefined'),kind+'/'+id+' has no undefined fields');
  assert(!modal.includes('href="null"'),kind+'/'+id+' has no null source links');
  for(const match of modal.matchAll(/href="#(item|npc|spell|creature|hunt|quest)\/([^"#]+)"/g)){
    const target=decodeURIComponent(match[2]).replace(/&amp;/g,'&'),type=match[1];
    const found=type==='item'?api.items.some(r=>r.id===target||r.classicIds.includes(target)):type==='npc'?e.MytheraNpcLibrary.some(r=>r.name===target):type==='spell'?e.MytheraSpellLibrary.some(r=>r.name===target):type==='creature'?api.creatureLibrary.some(r=>norm(r.name)===norm(target)):type==='hunt'?api.huntRows().some(r=>r.id===target):api.questLibrary().some(r=>r.id===target);
    assert(found,kind+'/'+id+' links to missing '+type+'/'+target);
  }
}
for(const item of e.CATALOG.items){modal='';api.openRoute('#item/'+item.id);assert(modal.includes('<h2>'),'Legacy item id '+item.id+' opens');}
const script=fs.readFileSync('public/server-lab.js','utf8'), html=fs.readFileSync('public/index.html','utf8');
assert(html.indexOf('mythera-library-model.js')<html.indexOf('server-lab.js'));
assert(!html.includes('mythera-review.css'));assert(html.includes('mythera-layout.js'));assert(script.includes('window.applyMytheraLayout?.(root,page)'));
assert(!script.includes('<h3>${esc(r.name)}</h3><p>${esc(r.description)}</p>'),'Directory uses shared library cards');
assert(script.includes('world-reference-note'),'Long editorial notes are collapsible');
assert(fs.readFileSync('public/library-design.css','utf8').includes('prefers-reduced-motion'));
let sharedHomeCalls=0;e.renderHome=root=>{sharedHomeCalls++;root.innerHTML='<div class="home-new">Página inicial compartilhada</div>';};const home=new (e.document.body.constructor)();e.renderMytheraHome(home);assert.equal(sharedHomeCalls,1);assert(home.innerHTML.includes('home-new'));
console.log('PASS: 780 items, 129 creatures, 111 hunts, 99 quests; complete classic ids, all official fields preserved; '+routes.length+' ficha routes and 677 legacy item links open without missing fields.');
