'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,open:false,querySelectorAll:()=>[],querySelector:()=>null,showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);}
const env={window:{},console,document:{querySelectorAll:()=>[]},$:node,esc:s=>String(s??''),fmt:n=>String(n),options:(a,v,label)=>`<option>${label}</option>`+a.map(x=>`<option>${x}</option>`).join(''),title:(a,b)=>`<h2>${a}</h2><p>${b}</p>`,reportButton:()=>'',bindContextReports:()=>{}};vm.createContext(env);
for(const f of ['catalog-data.js','catalog.js'])vm.runInContext(fs.readFileSync(f,'utf8'),env);const run=s=>vm.runInContext(s,env),d=env.window.CATALOG;
assert.equal(d.services.length,2);assert(!d.items.some(i=>['antidote','sudden death','promotion','folda','senja','vega','sqare pillow','arrows',"devil's helmet"].includes(i.name)));
const duria=d.npcs.find(n=>n.name==='Duria');assert.equal(duria.sell.length,0);assert(duria.spellOffers.some(s=>s.name==='Antidote'&&s.price===150));
const nielson=d.npcs.find(n=>n.name==='Nielson');assert.equal(nielson.sell.length,0);assert.equal(nielson.services.length,0);assert.equal(nielson.city,'Carlin');
const helmet=d.items.find(i=>i.id===2462);assert(helmet.sell.some(o=>o.npc==='Kroox'&&o.price===450));assert.equal(d.itemAliases['ref-devilshelmet'],2462);
run(`catalogQuery=${JSON.stringify("devil's helmet")};catalogTab='itens'`);assert.equal(run('catalogRows().length'),1);
run("catalogQuery='';catalogTab='itens';renderCatalog($('content'))");assert(!node('content').innerHTML.includes('data-catalog-tab="servicos"'));assert(!d.services.some(s=>s.kind==='Viagem'));
for(const spell of d.spells.filter(s=>s.kind==='Conjuração')){assert(spell.image,spell.name);assert(d.items.some(i=>i.id===spell.imageItemId));}
run("detailSpell('Conjure Explosive Arrow')");assert(node('#detail-body').innerHTML.includes('burst arrow'));assert(node('#detail-body').innerHTML.includes('data-catalog-item="2546"'));
run("detailNpc('Nielson')");assert(!node('#detail-body').innerHTML.includes('Passagem para'));
run("catalogVocation='';detailSpell('Antidote')");assert(node('#detail-body').innerHTML.includes('Preços registrados por NPC'));assert(node('#detail-body').innerHTML.includes('Duria'));
for(const s of d.spells.filter(s=>s.runeId&&d.items.some(i=>i.id===s.runeId)))assert.equal(s.image,d.items.find(i=>i.id===s.runeId)?.image);
for(const [id,target]of Object.entries(d.itemAliases))assert(d.items.some(i=>String(i.id)===String(target)),id);
for(const f of ['catalog.js','catalog-data.js','index.html'])assert.equal(fs.readFileSync(f,'utf8'),fs.readFileSync('public/'+f,'utf8'));
console.log('PASS: biblioteca sem aba Serviços, 7 conjurações com imagens, aliases, preços e imagens de runas');
