'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require);
const e=setup('mythera').env;for(const f of ['quest-route-data','quest-map-guides'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),e);vm.runInContext(fs.readFileSync('public/quest-directory.js','utf8'),e);const api=e.QuestDirectory,classic=Array.from(vm.runInContext('QUESTS',e)),mythera=e.MytheraWorkspace.questLibrary();
for(const rows of [classic,mythera]){
 const found=api.filter(rows,{query:'Warrior Helmet',mode:'reward'});assert.equal(found.length,1);assert.equal(found[0].id,'fibula');assert.equal(api.filter(rows,{query:'warrior helmet'}).length,1);
 assert(api.filter(rows,{query:'sword fire',mode:'reward'}).some(q=>q.id==='orc-fortress'));
 assert(api.filter(rows,{query:'Amazon Camp'}).some(q=>q.id==='skull-of-ratha'));
 assert.equal(api.filter(rows,{query:'warrior helmet',mode:'name'}).length,0);
 assert(api.filter(rows,{query:'Warrior Helmet',city:'Fibula',access:'free',level:'50'}).length);assert.equal(api.filter(rows,{query:'Warrior Helmet',city:'Carlin'}).length,0);assert.equal(api.filter(rows,{query:'Warrior Helmet',level:'49'}).length,0);
 const card=api.card(found[0],{query:'warrior helmet',mode:'reward'},'mythera');assert(card.includes('is-match'));assert(card.includes('item-2475.png'));assert(card.indexOf('warrior helmet')<card.indexOf('knight axe'));assert(card.includes('#quest/fibula'));assert(card.includes('#quest-map/fibula/0'));
}
assert.equal(api.filter([{name:'Needs a helmet',rewards:['gold'],needs:['Warrior Helmet'],rewardNote:'Bring Warrior Helmet'}],{query:'warrior helmet',mode:'reward'}).length,0);
assert.equal(api.filter([{name:'Unknown',rewards:[]}],{query:'helmet',mode:'reward'}).length,0);assert.equal(api.filter([{name:'Unknown',rewards:[]}],{level:'50'}).length,0);
assert(api.filter([{name:'Sword',rewards:['broad sword']}],{query:'broadsword',mode:'reward'}).length);
assert.equal(api.filter(mythera,{origin:'mythera'}).every(q=>q.origin==='mythera'),true);
const iron=mythera.find(q=>q.name==='Iron Hammer');assert(api.matchedRewards(iron,'iron hammer').length);assert(!api.card(iron,{query:'iron hammer',mode:'reward'},'mythera').includes('#quest-map/'));
const escaped=api.card({id:'test',name:'<script>alert(1)</script>',city:'<b>city</b>',rewards:['<img onerror=bad>']},{query:'',mode:'all'},'classic');assert(!escaped.includes('<script>'));assert(!escaped.includes('<img onerror='));
const root=e.document.createElement('main');api.render(root,{rows:mythera,server:'mythera'});const search=root.querySelector('#qd-search');search.oninput({target:{value:'warrior helmet'}});assert(root.querySelector('#qd-count').textContent.startsWith('1 quest'));assert(root.querySelector('#qd-grid').innerHTML.includes('Deeper Fibula'));root.querySelector('#qd-reset').onclick();assert(root.querySelector('#qd-count').textContent.startsWith(mythera.length+' '));assert(root.innerHTML.includes('data-guide')===false);
const html=fs.readFileSync('public/index.html','utf8');assert(html.includes('quest-directory.css'));assert(html.indexOf('src="quest-directory.js')<html.indexOf('src="adventures.js'));assert(fs.readFileSync('public/server-lab.js','utf8').includes("QuestDirectory.render(root,{rows:questLibrary(),server:'mythera'})"));
console.log('PASS: shared classic/Mythera reward search, item thumbnails, matched reward priority, aliases, no ingredient matches, city/access/level/origin filters, missing data, routes, escaping and reset');
