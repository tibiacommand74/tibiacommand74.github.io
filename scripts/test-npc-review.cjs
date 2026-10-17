'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,open:false,addEventListener(){},querySelectorAll:()=>[],querySelector:()=>null,showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);}
const env={window:{},document:{querySelector:node,querySelectorAll:()=>[]},console,URL,reportButton:()=>'',bindContextReports(){}};vm.createContext(env);
for(const f of ['data','catalog-data','content-links','catalog'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),env);
vm.runInContext(fs.readFileSync('public/app.js','utf8').split("\ndocument.querySelectorAll('nav button[data-page]')")[0],env);
const run=s=>vm.runInContext(s,env),C=env.window.CATALOG,npcs=new Map(C.npcs.map(n=>[n.name,n]));assert.equal(npcs.size,308);assert.equal(C.npcs.length,npcs.size);
let positioned=0,historical=0;
for(const n of C.npcs){
 assert(n.image.startsWith('data:image/webp;base64,'),n.name);const bytes=Buffer.from(n.image.split(',')[1],'base64');assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.equal(n.imageSource.clientVersion,'7.4');assert.equal(n.imageSource.addons,0);
 const card=run('npcCard('+JSON.stringify(n)+')');assert(card.includes('class="npc-sprite"'));assert(card.includes(n.image));assert.equal((card.match(/<button\b/g)||[]).length,1);
 run('detailNpc('+JSON.stringify(n.name)+')');const html=node('#detail-body').innerHTML;assert(html.includes('npc-sheet'));assert(html.includes(n.image));assert(html.includes('Aparência e fontes'));assert(!/undefined|NaN/.test(html.replace(/data:image\/[^"]+/g,'')),n.name);
 const staticHTML=fs.readFileSync('public'+env.window.contentURL('npc',n.name)+'index.html','utf8');assert(staticHTML.includes(n.image));
 if(n.xyz){positioned++;assert(run('npcHasPosition('+JSON.stringify(n)+')'));assert(html.includes('data-catalog-map='));assert(staticHTML.includes('class="guide-minimap static-minimap"'));}
 else{historical++;assert(n.historicalOnly);assert(html.includes('Sem coordenada confirmada'));assert(!html.includes('data-catalog-map='));assert(!staticHTML.includes('/#npc-map/'));assert(!staticHTML.includes('class="guide-minimap static-minimap"'));}
 for(const name of n.spells){const s=C.spells.find(s=>s.name===name);assert(s.teachers.some(t=>t.npc===n.name&&t.city===n.city));}
 for(const offer of n.spellOffers)assert(n.spells.includes(offer.name));
 for(const side of ['buy','sell'])for(const row of n[side]){const item=C.items.find(i=>String(i.id)===String(row.item));assert(item,n.name);assert(item[side==='sell'?'buy':'sell'].some(o=>o.npc===n.name&&o.price===row.price&&o.city===n.city));}
}
assert.equal(positioned,303);assert.equal(historical,5);
for(const s of C.spells){for(const t of s.teachers)assert(npcs.get(t.npc).spells.includes(s.name));for(const o of s.offers)assert(s.teachers.some(t=>t.npc===o.npc));}
assert.equal(npcs.get('Shiriel').spells.length,0);assert.equal(npcs.get('Tothdral').spells.length,0);assert(npcs.get('Tothdral').auditNote.includes('revisão'));
for(const i of C.items.filter(i=>i.category==='Runas'&&i.id!==2260))assert.equal(i.buy.length,0,i.name+' later rune shop sales');
for(const name of ['Frans','Rachel','Topsy'])assert(npcs.get(name).sell.some(o=>o.item===2260&&o.price===10));
assert.equal(npcs.get('Gamon').city,'Thais');assert.equal(npcs.get('A Sweaty Cyclops').city,"Ab'Dendriel");assert.equal(npcs.get('A Sweaty Cyclops').xyz[2],3,'Do not copy the modern floor');assert.equal(npcs.get('Markwin').city,'Mintwallin');assert.equal(npcs.get('The Orc King').imageSource.lookType,19,'Classic slime appearance, not modern Defiler');
run("catalogTab='npcs';catalogQuery='rope';catalogCity='Thais';catalogRole='Comerciante';catalogSort='name'");assert(run("catalogRows().some(n=>n.name==='Lubo')"));
run("catalogQuery='baaleal';catalogCity='';catalogRole=''");assert.equal(run('catalogRows()[0].name'),"Baa'Leal");
run("catalogQuery='';catalogRole='Câmbio de moedas'");assert.equal(run('catalogRows().length'),5);
// No position may fall through to map setup or close the existing detail.
let cleanup=0;env.mapCleanup=()=>cleanup++;run("openCatalogMap('Eva')");assert.equal(cleanup,0);
const directory=fs.readFileSync('public/npcs/index.html','utf8');assert.equal((directory.match(/class="npc-sprite"/g)||[]).length,308);assert.equal((directory.match(/data-directory-search=/g)||[]).length,308);assert(directory.includes('Alatar Lake'));assert(directory.includes('library-design.css?v=20261017-npcs'));
console.log('PASS: 308 classic NPC portraits/details, 303 reference maps, 5 honest historical records, reciprocal trades/teaching, rune version policy and NPC/item/city search');
