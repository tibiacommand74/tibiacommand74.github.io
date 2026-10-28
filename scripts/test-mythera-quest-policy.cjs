'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require),e=setup('mythera').env;
vm.runInContext(fs.readFileSync('public/quest-version-policy.js','utf8'),e);
const approved=Array.from(vm.runInContext('QUESTS',e)),rows=e.MytheraWorkspace.questLibrary(),withdrawn=e.QUEST_VERSION_POLICY.withdrawn;
assert.equal(approved.length,71);assert.equal(rows.length,72);assert.equal(rows.filter(q=>q.origin==='classic').length,70);
for(const q of approved)assert(rows.some(r=>r.id===q.id),q.name+' remains available');
for(const q of withdrawn){assert(!rows.some(r=>r.id===q.id),q.name+' must not return through the unfiltered legacy catalogue');assert(!e.MytheraWorkspace.searchAll(q.name,'quest').some(r=>r.id===q.id));}
assert.equal(rows.filter(q=>q.name==='Iron Hammer').length,1);assert(rows.find(q=>q.name==='Iron Hammer').origin==='mythera');assert(rows.find(q=>q.name==='The Strange Work').rewards.length);
let opened='';e.openCatalogDialog=html=>opened=html;
for(const q of rows){opened='';e.MytheraWorkspace.openRoute('#quest/'+encodeURIComponent(q.id));assert(opened.includes('<h2>'),q.name+' has an accessible guide');assert(!opened.includes('undefined'));}
console.log('PASS: production quest policy applied to Mythera catalogue/search/routes; all 71 admitted classics and both documented Mythera missions retained without duplicate Iron Hammer');

vm.runInContext(fs.readFileSync('public/classic-resources-data.js','utf8'),e);vm.runInContext(fs.readFileSync('public/classic-resources.js','utf8'),e);
let records={};e.JournalAccount={context:()=>({character:'quest tester',server:'mythera'}),read:()=>({...records}),write:next=>{records=next;}};
const custom=rows.find(q=>q.name==='The Strange Work');assert(e.ClassicExplorer.saveRecord('quest',custom.id,{status:'in-progress',note:'Voltar a Lugri'}));assert.equal(e.ClassicExplorer.getRecord('quest',custom.id).status,'in-progress');assert(e.ClassicExplorer.journalRows().some(r=>r.id===custom.id));assert(e.guideJournalMarkup('quest',custom.id).includes('data-journal-status'));assert(e.MytheraWorkspace.recordSheet(custom).includes('Materiais consumidos'));assert(e.MytheraWorkspace.recordSheet(custom).includes('data-journal-type="quest"'));
let target='';const open=e.MytheraWorkspace.openRoute;e.MytheraWorkspace.openRoute=hash=>{target=hash;};e.ClassicExplorer.open('quest',custom.id);assert.equal(target,'#quest/'+encodeURIComponent(custom.id));e.MytheraWorkspace.openRoute=open;e.ServerContext.isMythera=false;assert(!e.ClassicExplorer.entry('quest',custom.id));
console.log('PASS: custom Mythera quest progress, notes, journal rows and reopening stay in the correct server');
