'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),e={};e.window=e;vm.createContext(e);
for(const f of ['mythera-wiki-data','mythera-crafting'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),e);
const api=e.MytheraCrafting;
assert.equal(api.recipes.length,10);assert.equal(api.recipes.filter(r=>r.family==='Mystic Rune').length,6);
const mystic=api.plan('mystic-0',3);assert.deepEqual(Array.from(mystic.materials,m=>m.quantity),[15,3,15]);assert.equal(mystic.onyxCost,22500);assert.equal(mystic.recipe.skill,20);
assert.deepEqual(Array.from(api.plan('toolkit',2).materials,m=>m.quantity),[2,10]);assert.equal(api.plan('magma',4).materials[0].quantity,20);
for(const id of ['golden','hellstone']){assert.equal(api.plan(id,10).complete,false);assert.equal(api.plan(id,10).materials,undefined);}
for(const value of [0,-1,1.2,10001,NaN])assert.equal(api.plan('toolkit',value),null);assert.equal(api.plan('unknown',1),null);
assert(api.breakables('', '',10).every(r=>r.skill<=10));assert.equal(api.breakables().length,25);assert.equal(api.breakables('halberd','Machados',20).length,1);assert.equal(api.breakables('halberd','Machados',10).length,0);
assert(api.materials.find(m=>m.id==='dust').note.includes('TODOS'));assert(api.materials.find(m=>m.id==='fragments').note.includes('não foram confirmados'));assert(api.materials.find(m=>m.id==='magma').note.includes('distintos'));
const wiki=fs.readFileSync('public/mythera-wiki.js','utf8');assert(wiki.includes('MytheraCrafting?.enhance(root,g)'));const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('mythera-crafting.js')>index.indexOf('mythera-wiki.js'));assert(index.includes('mythera-crafting.css'));
console.log('PASS: 10 recipes, 6 Mystic variants, exact attempt totals, partial Onyx cost, no invented pick quantities, limits, 25 breakables and acquisition links');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require),live=setup('mythera').env;
const prototype=Object.getPrototypeOf(live.document.createElement('section'));prototype.setAttribute=function(k,v){this[k]=v;};prototype.scrollIntoView=function(){};
vm.runInContext(fs.readFileSync('public/mythera-crafting.js','utf8'),live);
const root=live.document.createElement('main');live.MytheraWiki.render(root,'systems--crafting--craftable-items');const section=root.querySelector('[data-wiki-section="0"]');assert(section.innerHTML.includes('Receitas e materiais'));section.querySelector('[data-craft-recipe]').value='mystic-0';section.querySelector('[data-craft-attempts]').value='3';section.querySelector('.craft-planner').onsubmit({preventDefault(){}});assert(section.querySelector('[data-craft-plan]').innerHTML.includes('22.500 gp'));assert(section.querySelector('[data-craft-plan]').innerHTML.includes('15×')||section.querySelector('[data-craft-plan]').innerHTML.includes('15</strong>'));
live.MytheraWiki.render(root,'systems--crafting--breakable-items');const list=root.querySelector('[data-wiki-section="1"]');list.querySelector('[data-craft-break-query]').value='halberd';list.querySelector('[data-craft-break-skill]').value='10';list.querySelector('[data-craft-break-skill]').oninput();assert(list.querySelector('[data-craft-break-results]').innerHTML.includes('Nenhum item'));list.querySelector('[data-craft-break-skill]').value='20';list.querySelector('[data-craft-break-skill]').oninput();assert(list.querySelector('[data-craft-break-results]').innerHTML.includes('Halberd'));
console.log('PASS: article rendering, interactive recipe totals and live skill filters');
