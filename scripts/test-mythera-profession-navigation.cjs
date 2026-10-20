'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require),e=setup('mythera').env;
e.history={replaceState(a,b,url){e.location.href=url;}};
Object.getPrototypeOf(e.document.createElement('main')).setAttribute=function(k,v){this[k]=v;};
function load(name){vm.runInContext(fs.readFileSync('public/'+name+'.js','utf8'),e);}
load('mythera-professions');for(const name of ['mythera-crafting','mythera-mining','mythera-farming'])load(name);
const p=e.MytheraProfessions;assert.equal(p.professions.length,3);
e.location.href='https://lab.example/?servidor=mythera&farming=plan&mineracao=bank&receita=magma&busca=copper#mundo/guia/systems--crafting';
const url=new URL(p.link('systems--mining',{mineracao:'smelt'}),e.location.href);assert.equal(url.searchParams.get('mineracao'),'smelt');assert(!url.searchParams.has('farming'));assert(!url.searchParams.has('receita'));assert.equal(url.searchParams.get('busca'),'copper');assert.equal(url.hash,'#mundo/guia/systems--mining');
for(const profession of p.professions){assert(e.MYTHERA_WIKI.guides[profession.guide]);assert(fs.existsSync('public/'+profession.image));for(const [,id]of profession.actions)assert(e.MYTHERA_WIKI.guides[id]);}
assert.equal((p.directory().match(/class="catalog-card library-card profession-card"/g)||[]).length,3);
assert.equal((p.navigation('systems--crafting--ingredients').match(/aria-current="page"/g)||[]).length,1);assert.equal(p.navigation('systems--bed-system'),'');
for(const id of ['systems--crafting','systems--crafting--ingredients','systems--mining','systems--farming']){const root=e.document.createElement('main');assert.equal(e.MytheraWiki.render(root,id),true);assert(root.innerHTML.includes('Navegar entre profissões'),id);assert(root.innerHTML.includes('Todas as profissões'),id);}
const material=e.MytheraCrafting.materials;assert(material.find(m=>m.id==='bars').links[0][1].includes('mineracao=smelt'));assert(material.find(m=>m.id==='fragments').links[0][1].includes('mineracao=bank'));assert(material.find(m=>m.id==='magma').links[0][1].includes('mineracao=resources'));
e.location.hash='#mundo/categoria/equipamentos';const root=e.document.createElement('main');e.MytheraSystems.render(root);assert(root.querySelector('[data-systems-home]').innerHTML.includes('Escolha o que quer produzir'));assert.equal(root.querySelector('[data-systems-results]').hidden,true);root.querySelector('[data-systems-search]').value='copper';root.querySelector('[data-systems-search]').oninput();assert.equal(root.querySelector('[data-systems-home]').hidden,true);assert.equal(root.querySelector('[data-systems-results]').hidden,false);assert(root.querySelector('[data-systems-cards]').innerHTML.includes('systems--mining'));
root.querySelector('[data-systems-clear]').onclick();assert.equal(root.querySelector('[data-systems-home]').hidden,false);assert(root.querySelector('[data-systems-home]').innerHTML.includes('Escolha o que quer produzir'));
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('src="mythera-professions.js')<index.indexOf('src="mythera-crafting.js'));assert(index.includes('mythera-professions.css'));
console.log('PASS: profession cards, verified guide links and assets, focused material links, clean tab parameters, cross-guide navigation, category search and clear');
