'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require);
for(const mode of ['classic','mythera']){
 const e=setup(mode).env;
 for(const f of ['quest-filmed-guides','quest-route-data','quest-map-guides','quest-guide-details','quest-wiki-review','quest-version-policy','quest-directory','rook-quest-guides'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),e);
 const quests=vm.runInContext('QUESTS',e), rows=mode==='mythera'?e.MytheraWorkspace.questLibrary():quests;
 assert.equal(Object.keys(e.RookQuestGuides).length,13);
 for(const id of Object.keys(e.RookQuestGuides)){
  const q=rows.find(q=>q.id===id);assert(q,mode+': '+id);assert.equal(rows.filter(q=>q.id===id).length,1);
  const html=e.mappedQuestMarkup(q);if(id==='combat-knife'){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,2);assert(html.includes('/assets/guides/combat-knife/'));assert(html.includes('https://www.tibiawiki.com.br/wiki/Combat_Knife_Quest'));assert(!html.includes('/assets/guides/bear-room/'));}if(id==='bear-room'){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,6);assert.equal(e.RookQuestGuides[id].steps.length,7);assert(html.includes('Tibia Wiki'));assert(html.includes('Key 4601'));}assert(html.includes('Como voltar'));assert(html.includes('Antes de sair'));assert(html.includes('tibiawiki.com.br'));assert(html.includes('qd-reward'));assert(!html.includes('href="#rook-'));assert(!html.includes('undefined'));
  for(const src of [...html.matchAll(/<img src="([^"]+)"/g)].map(m=>m[1]))assert(src.startsWith('data:image/')||fs.existsSync('public/'+src.replace(/^\//,'')),src);
 }
 assert(e.mappedQuestMarkup(quests.find(q=>q.id==='skull-of-ratha')).includes('filmed-guide'));
 assert.equal(e.mappedQuestMarkup({id:'other'}),'');
 assert(!rows.some(q=>q.id==='antidote-rune'));
 console.log(mode,rows.length,'quests; 13 illustrated guides, original Amazon preserved');

}
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('src="rook-quest-guides.js')>index.indexOf('src="quest-version-policy.js'));assert(index.includes('rook-quest-guides.css'));
