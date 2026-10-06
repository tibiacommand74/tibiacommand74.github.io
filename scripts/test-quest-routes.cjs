const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function node(id){if(!nodes.has(id))nodes.set(id,{value:'',hidden:false,checked:false,innerHTML:'',textContent:'',parentElement:{clientWidth:800,clientHeight:600},querySelectorAll:()=>[],close(){},showModal(){},addEventListener(){},getContext:()=>ctx});return nodes.get(id);}
const env={window:{},document:{querySelector:node,querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem(){}},Image:class{complete=false},ResizeObserver:class{observe(){}disconnect(){}},location:{hash:''},URL,console,setTimeout,clearTimeout};vm.createContext(env);
for(const name of ['data.js','catalog-data.js','catalog.js','adventures.js','quest-catalog.js','quest-route-data.js','quest-map-guides.js','route-review.js','reports.js','quest-routes.js','hunt-data.js','hunt-paths.js','hunts.js'])vm.runInContext(fs.readFileSync('public/'+name,'utf8'),env);
vm.runInContext(fs.readFileSync('public/app.js','utf8').split("\ndocument.querySelectorAll('nav button[data-page]')")[0],env);
const run=s=>vm.runInContext(s,env);
assert.equal(Object.keys(env.window.QUEST_ROUTES).length,98);
for(const route of Object.values(env.window.QUEST_ROUTES))for(const step of route.stages){assert(step.points.length);assert(step.floor>=0&&step.floor<=15);for(const p of step.points)assert.equal(p[2],step.floor);}
run("openQuestRoute('fibula');bindMap()");assert.equal(run('mapState.z'),7);assert.equal(node('#quest-trail').hidden,false);assert(node('#quest-trail').innerHTML.includes('Etapa 1'));
const count=run("window.QUEST_ROUTES.fibula.stages.length");run(`questRouteFocus(${count-1})`);assert.equal(run('mapState.z'),10);assert.equal(node('#floor').value,'10');assert(node('#quest-trail').innerHTML.includes('Teleport de saída'));
node('#trail-prev').onclick();assert.equal(run('questRouteIndex'),count-2);node('#trail-next').onclick();assert.equal(run('questRouteIndex'),count-1);
run('questRouteFocus(999)');assert.equal(run('questRouteIndex'),count-1);run('questRouteFocus(-5)');assert.equal(run('questRouteIndex'),0);
run('mapCleanup()');assert.equal(run('questRouteFocus'),null);run("openMap('dragon')");assert.equal(run('activeQuestRoute'),null);
run("openQuestRoute('black-knight');bindMap()");node('#map-reset').onclick();assert.equal(run('activeQuestRoute'),null);assert.equal(run('mapState.z'),7);
run("openQuestRoute('orc-fortress');bindMap()");node('#town').value='0';node('#town').onchange({target:node('#town')});assert.equal(run('activeQuestRoute'),null);
console.log('PASS: cinco rotas, andares, enquadramento, avanço/retorno, limites, limpeza, respawns e cidades');

run("questRewardFilter='equipment'");assert(run("questRows().some(q=>q.id==='black-knight')"));assert(run("questRows().some(q=>q.id==='doublet')"));run("questRewardFilter='accessories'");assert(!run("questRows().some(q=>q.id==='black-knight')"));run("renderQuests(document.querySelector('#content'))");node('#quest-clear-filters').onclick();assert.equal(run('questRewardFilter'),'');run("openQuestRoute('fibula');bindMap()");assert(node('#quest-trail').innerHTML.includes('quest-stage-progress'));run("questRouteFocus(window.QUEST_ROUTES.fibula.stages.findIndex((s,i,a)=>a[i+1]&&a[i+1].floor!==s.floor))");assert(node('#quest-trail').innerHTML.includes('Próxima etapa: mudança de andar'));run("detailQuest('black-knight')");const guide=node('#detail-body').innerHTML;assert(guide.indexOf('1 · Prepare')<guide.indexOf('2 · Chegada'));assert(guide.indexOf('2 · Chegada')<guide.indexOf('3 · Colete'));assert(guide.includes('report-context-button'));console.log('PASS: recompensa, limpeza dos filtros, etapas do guia, mudança de andar e aviso contextual');
