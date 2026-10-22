const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const env={window:{}};vm.createContext(env);vm.runInContext(fs.readFileSync('public/key-acquisition-guides.js','utf8'),env);
for(const number of ['3001','3002','3003','3004','3005','3006','3007','3008','3012']){
 const html=env.window.KeyAcquisitionGuides.markup({number,name:'Key '+number});
 assert(html.includes('Como pegar a Key '+number));
 const paths=[...html.matchAll(/<img src="([^"]+)"/g)].map(x=>x[1]);assert(paths.length>=4);
 for(const p of paths){assert(fs.existsSync('public/'+p),p);assert(fs.statSync('public/'+p).size>1000,p);}
 if(Number(number)>=3004&&Number(number)<=3006){assert(html.includes('andar 6'));assert(html.includes('Destroy Field'));assert(!html.includes('As três coletas ficam no térreo'));}
 assert(html.includes('não estão documentadas'));if(Number(number)<=3007)assert(html.includes('respawn diário'));
}
assert.equal(env.window.KeyAcquisitionGuides.markup({number:'3009'}),'');
for(const file of ['public/classic-resources.js','public/server-lab.js'])assert(fs.readFileSync(file,'utf8').includes('KeyAcquisitionGuides?.markup(k)'),file);
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('key-acquisition-guides.js')<index.indexOf('classic-resources.js'));assert(index.includes('key-acquisition-guides.css'));
console.log('Key acquisition guides: nine existing sheets, shared rendering and local images verified.');

const render=n=>env.window.KeyAcquisitionGuides.markup({number:n,name:'Key '+n});
const duo=render('3007');assert(duo.includes('Jogador 1'));assert(duo.includes('Jogador 2'));assert(duo.includes('andar 5'));assert(!duo.includes('etapa cooperativa fica depois'));
const last=render('3008');assert(last.includes('ESQUERDA → DIREITA → ESQUERDA → DIREITA'));assert(last.includes('estante'));assert(!last.includes('etapa cooperativa fica depois'));
const npc=render('3012');assert(npc.includes('elathriel.gif'));assert(npc.includes('5.000 gp'));assert(npc.includes('<code>key</code>'));assert(npc.includes('andar 9'));assert(npc.includes('andar 10'));assert(!npc.includes('respawn diário compartilhado'));assert(!npc.includes('Como chegar · Ab’Dendriel → Hellgate → pirâmide'));
