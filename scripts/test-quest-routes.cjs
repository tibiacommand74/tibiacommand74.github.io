const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function node(id){if(!nodes.has(id))nodes.set(id,{value:'',hidden:false,checked:false,innerHTML:'',textContent:'',parentElement:{clientWidth:800,clientHeight:600},querySelectorAll:()=>[],close(){},showModal(){},addEventListener(){},getContext:()=>ctx});return nodes.get(id);}
const env={window:{},document:{querySelector:node,querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem(){}},Image:class{complete=false},ResizeObserver:class{observe(){}disconnect(){}},location:{hash:''},URL,console,setTimeout,clearTimeout};vm.createContext(env);
for(const name of ['data.js','catalog-data.js','catalog.js','adventures.js','quest-catalog.js','quest-route-data.js','quest-map-guides.js','quest-guide-details.js','quest-wiki-review.js','route-review.js','quest-route-audit.js','reports.js','quest-routes.js','hunt-data.js','hunt-paths.js','hunts.js'])vm.runInContext(fs.readFileSync('public/'+name,'utf8'),env);
vm.runInContext(fs.readFileSync('public/app.js','utf8').split("\ndocument.querySelectorAll('nav button[data-page]')")[0],env);
const run=s=>vm.runInContext(s,env);
assert.equal(Object.keys(env.window.QUEST_ROUTES).length,98);
assert.equal(run("QUESTS.filter(q=>q.historicalStatus==='documentada').length"),63);
run("questHistory='confirmed'");assert.equal(run('questRows().length'),63);assert(run("questRows().every(q=>(q.introducedVersion||q.documentedByVersion)&&q.category!=='respawn')"));
run("questHistory='review'");assert.equal(run('questRows().length'),35);
run("questHistory='respawn'");assert.equal(run('questRows().length'),2);
assert.equal(run("QUESTS.find(q=>q.id==='serpentine-tower').city"),'Ankrahmun');
run("questHistory='all'");
for(const route of Object.values(env.window.QUEST_ROUTES))for(const step of route.stages){assert(step.points.length);assert(step.floor>=0&&step.floor<=15);for(const p of step.points)assert.equal(p[2],step.floor);}
run("openQuestRoute('fibula');bindMap()");assert.equal(run('mapState.z'),7);assert.equal(node('#quest-trail').hidden,false);assert(node('#quest-trail').innerHTML.includes('Etapa 1'));
for(let floor=8;floor<=15;floor++){node('#floor-down').onclick();assert.equal(run('mapState.z'),floor);assert.equal(node('#floor').value,String(floor));}
assert.equal(node('#floor-down').disabled,true);node('#floor-down').onclick();assert.equal(run('mapState.z'),15);
for(let floor=14;floor>=0;floor--){node('#floor-up').onclick();assert.equal(run('mapState.z'),floor);}
assert.equal(node('#floor-up').disabled,true);node('#floor-up').onclick();assert.equal(run('mapState.z'),0);
node('#floor').onchange({target:{value:'7'}});assert.equal(run('mapState.z'),7);
const count=run("window.QUEST_ROUTES.fibula.stages.length");run(`questRouteFocus(${count-1})`);assert.equal(run('mapState.z'),10);assert.equal(node('#floor').value,'10');assert(node('#quest-trail').innerHTML.includes('Teleport de saída'));
node('#trail-prev').onclick();assert.equal(run('questRouteIndex'),count-2);node('#trail-next').onclick();assert.equal(run('questRouteIndex'),count-1);
run('questRouteFocus(999)');assert.equal(run('questRouteIndex'),count-1);run('questRouteFocus(-5)');assert.equal(run('questRouteIndex'),0);
run('mapCleanup()');assert.equal(run('questRouteFocus'),null);run("openMap('dragon')");assert.equal(run('activeQuestRoute'),null);
run("openQuestRoute('black-knight');bindMap()");node('#map-reset').onclick();assert.equal(run('activeQuestRoute'),null);assert.equal(run('mapState.z'),7);
run("openQuestRoute('orc-fortress');bindMap()");node('#town').value='0';node('#town').onchange({target:node('#town')});assert.equal(run('activeQuestRoute'),null);
console.log('PASS: cinco rotas, andares, enquadramento, avanço/retorno, limites, limpeza, respawns e cidades');

run("questRewardFilter='equipment'");assert(run("questRows().some(q=>q.id==='black-knight')"));assert(run("questRows().some(q=>q.id==='doublet')"));run("questRewardFilter='accessories'");assert(!run("questRows().some(q=>q.id==='black-knight')"));run("renderQuests(document.querySelector('#content'))");node('#quest-clear-filters').onclick();assert.equal(run('questRewardFilter'),'');run("openQuestRoute('fibula');bindMap()");assert(node('#quest-trail').innerHTML.includes('quest-stage-progress'));run("questRouteFocus(window.QUEST_ROUTES.fibula.stages.findIndex((s,i,a)=>a[i+1]&&a[i+1].floor!==s.floor))");assert(node('#quest-trail').innerHTML.includes('Próxima etapa: mudança de andar'));run("detailQuest('black-knight')");const guide=node('#detail-body').innerHTML;assert(guide.indexOf('1 · Prepare')<guide.indexOf('2 · Chegada'));assert(guide.indexOf('2 · Chegada')<guide.indexOf('3 · Colete'));assert(guide.includes('report-context-button'));console.log('PASS: recompensa, limpeza dos filtros, etapas do guia, mudança de andar e aviso contextual');


// Integração: abrir diretamente uma etapa mantém o andar e as falas corretas.
run("openQuestRoute('postman-missions',18);bindMap()");
assert.equal(run('questRouteIndex'),18);assert.equal(run('mapState.z'),6);
assert(node('#quest-trail').innerHTML.includes('sniff mouldy cheese'));
run("openQuestRoute('postman-missions',999);bindMap()");assert.equal(run('questRouteIndex'),35);
run("detailQuest('postman-missions')");const detailed=node('#detail-body').innerHTML;
assert(detailed.includes('data-guide-map="18"'));assert(detailed.includes('data-open-quest-stage="18"'));
assert(detailed.includes('500 oz'));assert(detailed.includes('new dress patterns'));
assert.equal(env.window.QUEST_ROUTES['the-djinn-war-efreet-faction'].stages.filter(s=>s.points.length>1).length,3);
assert.equal(env.window.QUEST_ROUTES['the-djinn-war-marid-faction'].stages.find(s=>s.commands?.includes('lamp')).floor,9);
console.log('PASS: guia detalhado, falas por etapa, acesso direto e reutilização de caminhos por andar');

// Os botões copiam apenas uma palavra-chave; falhas não simulam sucesso.
(async()=>{
 const messages={textContent:''};let copied;
 const button={dataset:{copyQuestCommand:"DJANNI'HAH"},closest:()=>({querySelector:()=>messages})};
 const root={querySelectorAll:s=>s==='[data-copy-quest-command]'?[button]:[]};
 env.navigator={clipboard:{writeText:async text=>{copied=text}}};
 env.window.bindQuestGuideDetails(root,'the-djinn-war-efreet-faction');
 await button.onclick();assert.equal(copied,"DJANNI'HAH");assert(messages.textContent.includes('Copiado'));
 env.navigator.clipboard.writeText=async()=>{throw Error('permission denied')};
 await button.onclick();assert(messages.textContent.includes('manualmente'));assert(!messages.textContent.includes('Copiado'));
 console.log('PASS: cópia individual e mensagem útil quando a área de transferência falha');
})().catch(e=>{console.error(e);process.exitCode=1});

assert.equal(Object.keys(env.window.QUEST_WIKI_REVIEW).length,98);
assert(run("QUESTS.every(q=>q.steps.length>=3 && q.reviewedAt==='12/10/2026')"));
for(const [id,r] of Object.entries(env.window.QUEST_WIKI_REVIEW)) {assert(r.source.startsWith('https://'));if(env.window.QUEST_ROUTES[id].coverage!=='area')assert(env.window.questDetailedGuide(id).includes('data-guide-stage'),id);}
assert(env.window.questStageExtras('the-paradox-tower',13).includes('Melon'));
assert(run("QUESTS.find(q=>q.id==='alawar-s-vault').rewards.length")===2);
console.log('PASS: 98 roteiros revisados, fontes, enigmas e recompensas separadas');

// A descida de Pick não pode gerar uma caminhada fictícia no z=8.
const folda=env.window.QUEST_ROUTES['alawar-s-vault'];
const pick=folda.stages.findIndex(s=>s.transition==='mechanism-drop');
assert.equal(folda.stages[pick].floor,8);assert.equal(folda.stages[pick+1].floor,10);
assert.deepEqual(Array.from(folda.stages[pick+1].points[0]),[32040,31636,10]);
assert.equal(folda.stages[pick].points.length,1);
assert.equal(run('questFloor(8)'),'Subsolo -1');
run("detailQuest('fibula')");assert(node('#detail-body').innerHTML.includes('Subsolo -1'));
for(const [id,r] of Object.entries(env.window.QUEST_ROUTES)){
 const stats=env.window.ROUTE_REVIEW.quests[id];assert.equal(stats.segments,r.stages.filter(s=>s.points.length>1).length,id);
 for(let i=0;i<r.stages.length;i++){const s=r.stages[i],next=r.stages[i+1];if(s.pathReview==='suspended')assert.equal(s.points.length,1);if(next&&s.transition==='inferred-stairs')assert.equal(Math.abs(next.floor-s.floor),1,id+' '+i);}
}
assert(env.window.QUEST_ROUTES['the-ancient-tombs'].stages.every(s=>s.label.startsWith('Entrada · ')));
assert(env.window.QUEST_ROUTE_AUDIT.suspended>0);assert.equal(env.window.QUEST_ROUTE_AUDIT.quests,98);
console.log('PASS: descida real de Folda, traçados suspensos, andares consistentes, entradas de tumbas e contagens atualizadas');
const terrainSamples=require('./verify-quest-terrain.cjs')(env.window.QUEST_ROUTES,'public/assets');
assert(terrainSamples>8000);console.log('PASS: '+terrainSamples+' amostras nos minimapas reais, sem linhas atravessando fundo ou parede');
