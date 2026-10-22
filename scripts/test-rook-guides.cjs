'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require);
for(const mode of ['classic','mythera']){
 const e=setup(mode).env;
 for(const f of ['quest-filmed-guides','quest-route-data','quest-map-guides','quest-guide-details','quest-wiki-review','quest-version-policy','quest-directory','rook-quest-guides'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),e);
 const quests=vm.runInContext('QUESTS',e), rows=mode==='mythera'?e.MytheraWorkspace.questLibrary():quests;
 assert.equal(Object.keys(e.RookQuestGuides).length,13);
 for(const id of Object.keys(e.RookQuestGuides)){
  assert(e.RookQuestGuides[id].illustrations?.length>0,id+' missing illustrations');const q=rows.find(q=>q.id===id);assert(q,mode+': '+id);assert.equal(rows.filter(q=>q.id===id).length,1);
  const html=e.mappedQuestMarkup(q);if(['amber-s-notebook','honey-flower','banana','torch'].includes(id)){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,['amber-s-notebook','banana'].includes(id)?2:1);assert(html.includes('/assets/guides/'+id+'/'));if(id==='honey-flower'){assert(html.includes('data-copy-quest-command="bye"'));assert(!e.RookQuestGuides[id].words.includes('yes'));}}if(['present-box','minotaur-hell','rapier'].includes(id)){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,id==='rapier'?3:5);assert(html.includes('/assets/guides/'+id+'/'));if(id==='present-box'){assert(html.includes('data-copy-quest-command="present box"'));assert(q.rewards.includes('present box'));assert(html.includes('/assets/guides/bear-room/'));}else assert(!html.includes('/assets/guides/bear-room/'));}if(['dragon-corpse','goblin-temple'].includes(id)){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,id==='dragon-corpse'?4:9);assert(html.includes('/assets/guides/'+id+'/'));assert(html.includes(e.RookQuestGuides[id].source));assert(!html.includes('/assets/guides/bear-room/'));if(id==='goblin-temple'){assert.equal((html.match(/rook-route-figure is-map/g)||[]).length,9);assert(!html.includes('50 gp'));}}if(['doublet','katana'].includes(id)){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,id==='doublet'?1:10);assert(html.includes('/assets/guides/'+id+'/'));assert(!html.includes('/assets/guides/bear-room/'));}if(id==='combat-knife'){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,2);assert(html.includes('/assets/guides/combat-knife/'));assert(html.includes('https://www.tibiawiki.com.br/wiki/Combat_Knife_Quest'));assert(!html.includes('/assets/guides/bear-room/'));}if(id==='bear-room'){assert.equal((html.match(/class="rook-route-figure/g)||[]).length,6);assert.equal(e.RookQuestGuides[id].steps.length,7);assert(html.includes('Tibia Wiki'));assert(html.includes('Key 4601'));}assert(html.includes('Como voltar'));assert(html.includes('Antes de sair'));assert(html.includes('tibiawiki.com.br'));assert(html.includes('qd-reward'));assert(!html.includes('href="#rook-'));assert(!html.includes('undefined'));
  for(const src of [...html.matchAll(/<img src="([^"]+)"/g)].map(m=>m[1]))assert(src.startsWith('data:image/')||fs.existsSync('public/'+src.replace(/^\//,'')),src);
 }
 assert(e.mappedQuestMarkup(quests.find(q=>q.id==='skull-of-ratha')).includes('filmed-guide'));
 assert.equal(e.mappedQuestMarkup({id:'other'}),'');
 assert(!rows.some(q=>q.id==='antidote-rune'));
 console.log(mode,rows.length,'quests; 13 illustrated guides, original Amazon preserved');

}
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('src="rook-quest-guides.js')>index.indexOf('src="quest-version-policy.js'));assert(index.includes('rook-quest-guides.css'));
