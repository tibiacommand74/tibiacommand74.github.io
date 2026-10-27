'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const storage=new Map(),nodes=new Map();let blocked=false;
function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'',hidden:false,textContent:'',open:false,addEventListener(){},querySelectorAll:()=>[],querySelector:()=>null,showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);}
const env={reportButton:()=>'',bindContextReports(){},window:{},document:{querySelector:node,querySelectorAll:()=>[]},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v);}},location:{hash:'#explorador/search'},URL,console,setTimeout,clearTimeout};vm.createContext(env);
for(const f of ['data','catalog-data','catalog','adventures','quest-catalog','quest-route-data','quest-map-guides','quest-guide-details','quest-wiki-review','route-review','quest-route-audit','hunt-data','hunt-paths','hunts','community-tools','classic-resources-data','classic-resources'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),env);
const run=s=>vm.runInContext(s,env),api=env.window.ClassicExplorer,data=env.window.CLASSIC_RESOURCES;
assert.equal(data.keys.length,47);assert.equal(new Set(data.keys.map(k=>k.number)).size,47);
for(const k of data.keys){if(k.questId)assert(run(`QUESTS.some(q=>q.id===${JSON.stringify(k.questId)})`));assert(k.sources.length>=2);assert(k.sources.every(u=>u.startsWith('https://')));if(k.introducedVersion)assert(Number(k.introducedVersion)<=7.4);}
assert(api.search('4503').some(r=>r.type==='key'&&r.id==='4503'));
assert(api.search('exura','spell').every(r=>r.type==='spell'));
assert(api.search('crown armor','item').some(r=>r.name==='crown armor'));
assert.equal(api.search('xyz-inexistente-921').length,0);assert.equal(api.search(' ').length,0);
assert(api.cityRows('Thais').npcs.every(n=>n.city==='Thais'));
assert(api.cityRows('Thais').quests.every(q=>q.city==='Thais'));
assert(api.plannerRows(30,false).every(q=>!q.premium&&q.level<=30&&q.historicalStatus==='documentada'));
assert(!api.plannerRows(30,false).some(q=>q.id==='annihilator'));
assert(api.plannerNeeds(['fibula']).some(n=>n.includes('3980')));
assert.deepEqual(JSON.parse(JSON.stringify(api.foodPlan(60,2789))),{quantity:14,weight:2.8,seconds:3696});
assert.equal(api.foodPlan(60,2671).quantity,10);assert.equal(data.foods.find(f=>f.id===2696).stackable,false);for(const f of data.foods)assert.equal(run(`C.items.find(i=>i.id===${f.id}).stats.weight`),f.weight);assert.equal(api.foodPlan(0,2671),null);assert.equal(api.foodPlan(2000,2671),null);
for(const set of api.setExamples)for(const name of set.pieces)assert(run(`C.items.some(i=>i.name===${JSON.stringify(name)})`),name);
assert.equal(api.keyStage(data.keys.find(k=>k.number==='4501')),null,'Disputed coordinates must not be presented as verified');
const stage=api.keyStage(data.keys.find(k=>k.number==='4503'));assert.equal(env.window.QUEST_ROUTES['alawar-s-vault'].stages[stage].label,'Key 4503');
assert(api.saveRecord('quest','fibula',{favorite:true,status:'in-progress',stage:999,note:'<img src=x onerror=evil()>',extra:'discard'}));
assert.equal(api.getRecord('quest','fibula').stage,env.window.QUEST_ROUTES.fibula.stages.length-1);
assert(!JSON.parse(storage.get('tc74-explorer-journal-v1'))['quest:fibula'].extra);
const markup=env.window.guideJournalMarkup('quest','fibula');assert(markup.includes('&lt;img'));assert(!markup.includes('<img src=x'));assert(markup.includes('Continuar no mapa'));
assert(!api.saveRecord('quest','not-a-quest',{favorite:true}));
assert(api.journalRows().some(r=>r.id==='fibula'));
// Progress controls must update immediately without replacing the note editor.
const progress={hidden:true},select={value:'in-progress'},saveStatus={textContent:''};
const box={dataset:{journalType:'quest',journalId:'fibula'},querySelector:s=>({'[data-journal-status]':select,'[data-journal-progress]':progress,'.explorer-save-status':saveStatus}[s]||null)};
env.window.bindGuideJournal({querySelectorAll:s=>s==='[data-journal-type]'?[box]:[]});
select.onchange();assert.equal(progress.hidden,false);assert.equal(api.getRecord('quest','fibula').status,'in-progress');
select.value='done';select.onchange();assert.equal(progress.hidden,true);assert.equal(api.getRecord('quest','fibula').status,'done');
assert(env.window.guideJournalMarkup('quest','fibula').includes('data-journal-progress hidden'));
const learnedControl={checked:true},spellStatus={textContent:''};
const spellBox={dataset:{journalType:'spell',journalId:'Light Healing'},querySelector:s=>({'[data-journal-learned]':learnedControl,'.explorer-save-status':spellStatus}[s]||null)};
env.window.bindGuideJournal({querySelectorAll:s=>s==='[data-journal-type]'?[spellBox]:[]});
learnedControl.onchange();assert.equal(api.getRecord('spell','Light Healing').status,'done');
assert(env.window.guideJournalMarkup('spell','Light Healing').includes('data-journal-learned checked'));
learnedControl.checked=false;learnedControl.onchange();assert.equal(api.getRecord('spell','Light Healing').status,'not-started');
blocked=true;learnedControl.checked=true;learnedControl.onchange();assert.equal(learnedControl.checked,false);blocked=false;
blocked=true;assert.equal(api.saveRecord('quest','fibula',{note:'temporário'}),false);assert.equal(api.getRecord('quest','fibula').note,'temporário');
vm.runInContext(fs.readFileSync('public/app.js','utf8').split("\ndocument.querySelectorAll('nav button[data-page]')")[0],env);
run("detailQuest('fibula')");assert(node('#detail-body').innerHTML.includes('data-journal-status'));assert(node('#detail-body').innerHTML.includes('data-record-quest-stage'));
run("detailItem(2666)");assert(node('#detail-body').innerHTML.includes('data-journal-type="item"'));
run("detailSpell('Light Healing')");assert(node('#detail-body').innerHTML.includes('data-journal-type="spell"'));
run("detailNpc('Dermot')");assert(node('#detail-body').innerHTML.includes('data-journal-type="npc"'));
run("detailHunt('troll-thais')");assert(node('#detail-body').innerHTML.includes('data-journal-type="hunt"'));
assert(fs.readFileSync('public/index.html','utf8').indexOf('classic-resources.js')<fs.readFileSync('public/index.html','utf8').indexOf('app.js'));
console.log('PASS: 47 chaves, busca geral, cidades, planejamento clássico, comida, sets, diário sanitizado, falha de armazenamento e integração das fichas');
blocked=false;
api.saveRecord('quest','fibula',{favorite:true,note:'Manter anotação',status:'done'});
api.saveRecord('item','2666',{favorite:true});
const favoriteSearch={value:''},favoriteType={value:''},favoriteCount={},favoriteMessage={};
const favoriteList={innerHTML:'',querySelectorAll(selector){if(selector==='[data-remove-favorite]')return this.innerHTML.includes('data-remove-favorite="quest"')?[this.removeButton={dataset:{removeFavorite:'quest',favoriteId:'fibula'}}]:[];return [];}};
const favoriteRoot={innerHTML:'',querySelector:s=>({'[data-favorite-search]':favoriteSearch,'[data-favorite-type]':favoriteType,'[data-favorite-count]':favoriteCount,'[data-favorite-message]':favoriteMessage,'[data-favorite-results]':favoriteList}[s]||null)};
env.window.renderCommunityFavorites(favoriteRoot);
assert(favoriteRoot.innerHTML.includes('Buscar favorito'));
favoriteType.value='quest';favoriteType.onchange();assert(favoriteList.innerHTML.toLowerCase().includes('fibula'));assert(!favoriteList.innerHTML.includes('data-remove-favorite="item"'));
favoriteSearch.value='inexistente';favoriteSearch.oninput();assert.equal(favoriteCount.textContent,'0 favoritos');
favoriteSearch.value='fibula';favoriteSearch.oninput();assert.equal(favoriteCount.textContent,'1 favorito');
favoriteList.removeButton.onclick();assert.equal(api.getRecord('quest','fibula').favorite,false);assert.equal(api.getRecord('quest','fibula').note,'Manter anotação');assert.equal(api.getRecord('quest','fibula').status,'done');assert.equal(favoriteCount.textContent,'0 favoritos');
console.log('PASS: favorites category/search and removal preserve notes and completed quests');

assert.equal(api.keyRows('', '', '', '').length,47);
assert.equal(api.keyRows('', '', '', 'historica').length,3);
assert(api.keyRows('Shirith', '', '', '').some(k=>k.number==='3033'));
assert(api.keyRows('library', 'Jakundaf', 'silver', '').some(k=>k.number==='4009'));
assert(api.keyRows('', 'Fibula', '', '').every(k=>k.city==='Fibula'));
assert(api.keyRows('', '', 'copper', '').every(k=>k.material==='copper'));
assert(!api.keyRows('', '', '', 'classica').some(k=>k.number==='4600'));
assert(api.saveRecord('key','3033',{status:'done',note:'Comprada',favorite:true}));
assert(api.keyRows('', '', '', '', 'yes').some(k=>k.number==='3033'));
assert(!api.keyRows('', '', '', '', 'no').some(k=>k.number==='3033'));
api.detailKey('4009');assert(node('#detail-body').innerHTML.includes('Consultar Key 4022'));
api.detailKey('4600');assert(node('#detail-body').innerHTML.includes('Uso histórico / não confirmado'));assert(!node('#detail-body').innerHTML.includes('data-key-map='));
for(const k of data.keys){assert(k.material);assert(k.method);assert(['historica','classica'].includes(k.availability));if(!k.questId)assert.equal(api.keyStage(k),null);}
console.log('PASS: key city/material/scope/alias filters, owned records, prerequisites and historical map guards');
// Historical keys, acquisition-only map links and curated city/region navigation.
assert.equal(data.keys.filter(k=>k.availability==='classica').length,44);
assert(data.keys.some(k=>k.number==='3350'));
assert(!data.keys.some(k=>k.number==='3700'));
assert.equal(data.keys.find(k=>k.number==='3142').material,'copper');
for(const id of ['3940','3980','6010'])assert.equal(api.keyStage(data.keys.find(k=>k.number===id)),null,id+' must not link acquisition to a door');
for(const k of data.keys){const i=api.keyStage(k);if(i!==null){const stage=env.window.QUEST_ROUTES[k.questId].stages[i];assert(['chave','npc','recompensa'].includes(stage.role));}for(const n of k.requires||[])assert(data.keys.some(x=>x.number===n));for(const id of k.relatedQuests||[])assert(run(`QUESTS.some(q=>q.id===${JSON.stringify(id)})`));}
assert.equal(data.regions.filter(r=>r.kind==='city').length,9);assert.equal(data.regions.length,38);
const aliases=new Set();for(const r of data.regions){for(const a of [r.name,r.id,...r.aliases]){const normalized=a.toLowerCase();if(normalized===r.name.toLowerCase()&&aliases.has(normalized))continue;aliases.add(normalized);}if(r.parent)assert(api.regionProfile(r.parent));assert(r.map.every(Number.isInteger));assert(r.map[2]>=0&&r.map[2]<=15);for(const id of r.questIds)assert(run(`QUESTS.some(q=>q.id===${JSON.stringify(id)})`));for(const id of r.huntIds)assert(env.window.CLASSIC_HUNTS.some(h=>h.id===id));}
assert.equal(api.regionProfile('Jakundaf').name,'Jakundaf Desert');
assert.equal(api.regionProfile('Venore').map[2],6);assert.equal(api.regionProfile('Darashia').map[2],7);assert.equal(api.regionProfile('Edron').map[2],7);assert.equal(api.regionProfile('Kazordoon').map[2],9);
assert.equal(api.cityRows('Draconia').keys.length,8);assert(api.cityRows("Ab'Dendriel",true).keys.length>=8);assert(api.cityRows('Thais',true).npcs.length>api.cityRows('Thais').npcs.length);
const dom=new Map();function el(selector){if(!dom.has(selector))dom.set(selector,{innerHTML:'',value:'',checked:false,textContent:'',querySelectorAll:()=>[]});return dom.get(selector);}
const root={innerHTML:'',querySelector:el,querySelectorAll:()=>[]};api.renderKeys(root);assert(el('#explorer-key-list').innerHTML.includes('library-card'));assert(root.innerHTML.includes('key-clear'));el('#explorer-key-search').oninput({target:{value:'inexistente-8811'}});assert(el('#explorer-key-list').innerHTML.includes('Nenhuma chave'));el('#key-clear').onclick();assert(el('#key-result-count').textContent.startsWith('44 '));
api.renderCity(root);assert(root.innerHTML.includes('Regiões e ilhas'));assert(el('#city-results').innerHTML.includes('city-summary-card'));assert(!el('#city-results').innerHTML.includes('data-catalog-npc='));assert(!el('#city-results').innerHTML.includes('npc-sprite'));assert(!el('#city-results').innerHTML.includes('Key 3008'));assert(el('#city-results').innerHTML.includes('#city-catalog/npcs/Thais/local'));
el('#explorer-city').onchange({target:{value:'Draconia'}});assert(el('#city-results').innerHTML.includes('#city-catalog/keys/Draconia/local'));assert(el('#city-results').innerHTML.includes('<strong>8</strong>'));
const originalRender=env.render,rendered=[];env.render=p=>rendered.push(p);const directory=env.window.CityDirectory;
for(const [kind,field,expression,target] of [['npcs','npcs','catalogRows()','biblioteca'],['magias','spells','catalogRows()','biblioteca'],['quests','quests','questRows()','quests'],['hunts','hunts','huntRows()','hunts'],['keys','keys','window.ClassicExplorer.keyRows()','explorador']]){
 for(const [name,nearby] of [['Thais',false],["Ab'Dendriel",true],['Jakundaf Desert',false]]){
  const expected=api.cityRows(name,nearby)[field].filter(r=>kind!=='keys'||r.availability==='classica').map(r=>String(kind==='keys'?r.number:kind==='hunts'||kind==='quests'?r.id:r.name)).sort();
  assert(directory.route('#city-catalog/'+kind+'/'+encodeURIComponent(name)+'/'+(nearby?'nearby':'local')));assert.equal(rendered.at(-1),target);
  const actual=run(expression).map(r=>String(kind==='keys'?r.number:kind==='hunts'||kind==='quests'?r.id:r.name)).sort();assert.deepEqual(Array.from(actual),Array.from(expected),kind+' '+name);
  const banner=directory.markup(kind);assert(banner.includes('Remover filtro de local'));assert(banner.includes('Voltar ao resumo'));assert(!directory.markup(kind==='npcs'?'keys':'npcs'));
  directory.clear();assert.equal(directory.markup(kind),'');assert(directory.matches(kind,'any-id'));
 }
}
assert(!directory.route('#city-catalog/npcs/%E0%A4%A/local'));assert(!directory.route('#city-catalog/npcs/Unknown/local'));assert(!directory.route('#city-catalog/unknown/Thais/local'));
const appSource=fs.readFileSync('public/app.js','utf8');vm.runInContext(appSource.slice(appSource.indexOf('function route(){'),appSource.indexOf("document.addEventListener('click',event=>")),env);
env.location.hash='#city-catalog/npcs/Thais/local';run('route()');assert.equal(rendered.at(-1),'biblioteca');assert(run('catalogRows().every(n=>n.city===\'Thais\')'));assert(directory.markup('npcs').includes('Thais'));
env.location.hash='#catalog/npcs';run('route()');assert.equal(directory.markup('npcs'),'');assert.equal(run('catalogRows().length'),env.window.CATALOG.npcs.length);
env.render=originalRender;

for(const k of data.keys){const html=api.keyCard(k);assert.equal((html.match(/<button/g)||[]).length,1);assert.equal((html.match(/<\/button>/g)||[]).length,1);}
console.log('PASS: key/city historical review, safe map roles, city memberships, overview floors, summary navigation, scoped catalogs, cards, search and clear filters');

assert(api.saveRecord('spell','Light Healing',{status:'done'}));assert.equal(api.getRecord('spell','Light Healing').status,'done');assert(api.journalRows().some(r=>r.type==='spell'&&r.name==='Light Healing'&&r.record.status==='done'));const noRouteQuest=run('QUESTS.find(q=>!window.QUEST_ROUTES[q.id])?.id');if(noRouteQuest){assert(api.saveRecord('quest',noRouteQuest,{status:'done'}));assert.equal(api.getRecord('quest',noRouteQuest).stage,0);}

let accountRecords={};env.window.JournalAccount={context:()=>({id:'test',character:'Teste',server:'mythera'}),read:()=>accountRecords,write:r=>{accountRecords=r;},saveMessage:()=>'Salvo'};env.window.ServerContext={isMythera:true};env.window.MytheraSpellLibrary=[{name:'Magia teste Mythera',words:'ex teste',voc:['Druid']}];let opened='';env.window.MytheraWorkspace={openRoute:route=>{opened=route;}};assert(api.saveRecord('spell','Magia teste Mythera',{status:'done'}));assert.equal(api.getRecord('spell','Magia teste Mythera').status,'done');assert(api.journalRows().some(r=>r.name==='Magia teste Mythera'));api.open('spell','Magia teste Mythera');assert.equal(opened,'#spell/Magia%20teste%20Mythera');
