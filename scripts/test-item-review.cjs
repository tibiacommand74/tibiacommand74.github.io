'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,addEventListener(){},querySelectorAll:()=>[],querySelector:()=>null,showModal(){},close(){}});return nodes.get(id);}
const env={window:{},document:{querySelector:node,querySelectorAll:()=>[]},console,URL,reportButton:()=>'',bindContextReports(){}};vm.createContext(env);
for(const f of ['data','catalog-data','content-links','catalog'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),env);
vm.runInContext(fs.readFileSync('public/app.js','utf8').split("\ndocument.querySelectorAll('nav button[data-page]')")[0],env);
const run=s=>vm.runInContext(s,env),C=env.window.CATALOG,D=env.window.DATA,items=new Map(C.items.map(i=>[String(i.id),i])),npcs=new Map(C.npcs.map(n=>[n.name,n]));
assert.equal(items.size,677);assert.equal(C.items.length,items.size);
for(const i of C.items){for(const v of Object.values(i.stats))assert(Number.isFinite(v)&&v>=0,i.name);for(const side of ['buy','sell'])for(const o of i[side]){assert(o.price>0);assert(npcs.get(o.npc)[side==='buy'?'sell':'buy'].some(t=>String(t.item)===String(i.id)&&t.price===o.price),i.name+' inverse trade');}
 run('detailItem('+JSON.stringify(i.id)+')');assert(!/undefined|NaN/.test(node('#detail-body').innerHTML),i.name);
 const html=run('itemCard('+JSON.stringify(i)+')');assert(html.includes('library-card'));assert.equal((html.match(/<button\b/g)||[]).length,1);assert(!/<a\b|undefined|NaN/.test(html));
}
for(const n of C.npcs){for(const side of ['buy','sell'])for(const row of n[side]){assert(items.has(String(row.item)),n.name+' dangling stock');assert(items.get(String(row.item))[side==='buy'?'sell':'buy'].some(o=>o.npc===n.name&&o.price===row.price));}assert(run('npcCard('+JSON.stringify(n)+')').includes('library-card'));}
for(const c of D.creatures)assert(run('card('+JSON.stringify(c)+')').includes('library-card'));
for(const [id,category]of [[2544,'Munição'],[2148,'Valiosos'],[2348,'Objetos mágicos'],[1294,'Distância']])assert.equal(items.get(String(id)).category,category);
assert(items.get('1294').drops.length>0);assert.equal(items.get('1294').stats.attack,5);
for(const n of ['worm','ceremonial mask','dwarven legs'])assert(!C.items.some(i=>i.name===n));
for(const r of C.itemReview.withdrawn){const slug=r.name.replace(/ /g,'-'),html=fs.readFileSync('public/itens/'+slug+'/index.html','utf8');assert(html.includes('noindex,follow'));assert(!fs.readFileSync('public/sitemap.xml','utf8').includes('/itens/'+slug+'/'));run('detailItem('+JSON.stringify(r.id)+')');assert(node('#detail-body').innerHTML.includes('REVISÃO HISTÓRICA'));}
assert(!('armor' in items.get('2507').stats));assert(items.get('2507').calculationExcluded);
run("detailItem('ref-waterhose')");assert(node('#detail-body').innerHTML.includes('waterskin'));
run("detailItem('ref-worms')");assert(node('#detail-body').innerHTML.includes('7.5'));
const boots=items.get('2195');if(boots?.sell.length>1){run('detailItem(2195)');const html=node('#detail-body').innerHTML;const sorted=[...boots.sell].sort((a,b)=>b.price-a.price);assert(html.indexOf('Onde vender')<html.lastIndexOf(sorted[0].npc));}
for(const [section,count]of [['itens',677],['npcs',303],['criaturas',109]]){const html=fs.readFileSync('public/'+section+'/index.html','utf8');assert.equal((html.match(/class="catalog-card library-card"/g)||[]).length,count);assert(html.includes('/library-design.css?v=20261017-items'));assert(!html.includes('class="guide-directory"'));}
assert(fs.readFileSync('public/catalog.js','utf8').includes("'spell-grid':'library-grid'"));
const report=JSON.parse(fs.readFileSync('docs/item-review-2026-10-17.json','utf8'));assert.equal(report.imageAudit.length,677);assert(report.imageAudit.every(i=>i.decoded));
console.log('PASS: 677 item details/cards, canonical reciprocal NPC trades, historic withdrawals, unknown armor excluded, Small Stone loot, 3 complete card directories');
