'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},showModal(){},close(){}});return nodes.get(id);}
const env={window:{},document:{querySelector:node,querySelectorAll:()=>[]},console,reportButton:()=>'',bindContextReports(){},URL};vm.createContext(env);
for(const f of ['data','catalog-data','content-links','catalog'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),env);
vm.runInContext(fs.readFileSync('public/app.js','utf8').split("\ndocument.querySelectorAll('nav button[data-page]')")[0],env);
env.contentPageLink=()=>'';
const D=env.window.DATA,C=env.window.CATALOG,run=s=>vm.runInContext(s,env);
assert.equal(D.creatures.length,109);assert.equal(D.creatureReview.withdrawn.length,13);
const names=new Set(D.creatures.map(c=>c.name.toLowerCase()));
for(const c of D.creatures){assert(c.sourceUrl?.startsWith('https://'));assert.equal(new Set(c.loot.map(l=>l.id)).size,c.loot.length,c.name+' duplicate loot');for(const l of c.loot){assert(l.max>0);assert(l.rolls.every(r=>r.chance>0&&r.chance<=100000));const item=C.items.find(i=>String(i.id)===String(l.id));if(item)assert(item.drops.some(d=>d.name===c.name&&d.max===l.max));}
 run('detail('+JSON.stringify(c.name)+')');const html=node('#detail-body').innerHTML;assert(!html.includes('undefined'),c.name);assert(!html.includes('NaN'),c.name);assert(html.includes('Consultar origem dos dados'));const spawns=D.map.spawns.filter(s=>s[0].toLowerCase()===c.name.toLowerCase());assert.equal(html.includes('id="find-spawns"'),spawns.length>0,c.name);
 if(c.kind==='trap'){assert.equal(c.hp,null);assert.equal(c.xp,0);assert.equal(c.loot.length,0);assert(html.includes('Sem XP de abate'));assert(!html.includes('armadura · referência'));}
}
for(const item of C.items)for(const d of item.drops){assert(names.has(d.name.toLowerCase()));assert(D.creatures.find(c=>c.name===d.name).loot.some(l=>String(l.id)===String(item.id)&&l.max===d.max));}
for(const r of D.creatureReview.withdrawn){assert(!names.has(r.name.toLowerCase()));const slug=r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');const html=fs.readFileSync('public/criaturas/'+slug+'/index.html','utf8');assert(html.includes('noindex,follow'));assert(!fs.readFileSync('public/sitemap.xml','utf8').includes('/criaturas/'+slug+'/'));}
run("detail('vampire')");assert(node('#detail-body').innerHTML.includes('bat'));assert(!node('#detail-body').innerHTML.includes('Pode ficar invisível.'));assert(node('#detail-body').innerHTML.includes('paralisia'));
run("detail('warlock')");assert(node('#detail-body').innerHTML.includes('Pode ficar invisível.'));
run("detail('banshee')");assert(!node('#detail-body').innerHTML.includes('Imunidades registradas: físico'));
run("query='hunter';immunityFilter='not:poison'");assert.equal(run('filtered().length'),0);run("immunityFilter='immune:poison'");assert.equal(run('filtered().length'),0);
assert(run("creatureSpawnMatches(['Dragon',1,1,7], 'dragon')"));assert(!run("creatureSpawnMatches(['Dragon Lord',1,1,7], 'dragon')"));assert(run("creatureSpawnMatches(['Dragon Lord',1,1,7], 'drag')"));
assert.equal(D.creatures.find(c=>c.name==='Ashmunrah').loot.find(l=>l.id===2148).max,370);
assert.equal(D.creatures.find(c=>c.name==='badger').loot[0].rolls[0].chance,50000);
console.log('PASS: 109 creature/trap/history details, 13 withdrawals, unique loot, inverse item links, uncertain filters, combat abilities and exact map species');

assert.equal(D.map.spawns.filter(s=>!names.has(s[0].toLowerCase())).length,0,'Every species on the map must have a creature detail');
run("query='';immunityFilter='';list()");assert.equal((node('#cards').innerHTML.match(/data-monster=/g)||[]).length,109,'All creatures visible without a load-more gate');
run("query='demongoblin';list()");assert.equal((node('#cards').innerHTML.match(/data-monster=/g)||[]).length,1);
run("detail('demongoblin')");assert(node('#detail-body').innerHTML.includes('Demon (Goblin)'));assert(node('#detail-body').innerHTML.includes('id="find-spawns"'));
run("detail('Orshabaal')");assert(node('#detail-body').innerHTML.includes('XP histórico não confirmado'));assert(!node('#detail-body').innerHTML.includes('0 armadura'));
run("detail('Mimic')");assert(node('#detail-body').innerHTML.includes('REGISTRO HISTÓRICO'));assert(!node('#detail-body').innerHTML.includes('0 XP'));

run("query='dragon';immunityFilter='';creatureSearchMode='name'");assert(run("filtered().every(c=>c.name.toLowerCase().includes('dragon'))"));
run("query='dragon shield'");assert.equal(run('filtered().length'),0);run("creatureSearchMode='loot'");assert(run('filtered().length')>0);assert(run("filtered().every(c=>c.loot.some(l=>l.name.includes('dragon shield')))"));
