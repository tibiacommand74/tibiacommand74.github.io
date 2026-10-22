const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const env={window:{}};vm.createContext(env);vm.runInContext(fs.readFileSync('public/key-acquisition-guides.js','utf8'),env);
for(const number of ['3001','3002','3003','3004','3005','3006','3007','3008','3012','3033','3142','3301','3302','3303','3304','3350','3520','3600']){
 const html=env.window.KeyAcquisitionGuides.markup({number,name:'Key '+number});
 assert(html.includes('Como pegar a Key '+number));
 const paths=[...html.matchAll(/<img src="([^"]+)"/g)].map(x=>x[1]);assert(paths.length>=({3033:3,3142:6,3301:1,3302:2,3303:3,3304:4,3350:4,3520:3,3600:6}[number]||4));
 for(const p of paths){assert(fs.existsSync('public/'+p),p);assert(fs.statSync('public/'+p).size>1000,p);}
 if(Number(number)>=3004&&Number(number)<=3006){assert(html.includes('andar 6'));assert(html.includes('Destroy Field'));assert(!html.includes('As três coletas ficam no térreo'));}
 if(Number(number)<=3012)assert(html.includes('não estão documentadas'));if(Number(number)<=3007)assert(html.includes('respawn diário'));
}
assert.equal(env.window.KeyAcquisitionGuides.markup({number:'3009'}),'');
for(const file of ['public/classic-resources.js','public/server-lab.js'])assert(fs.readFileSync(file,'utf8').includes('KeyAcquisitionGuides?.markup(k)'),file);
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('key-acquisition-guides.js')<index.indexOf('classic-resources.js'));assert(index.includes('key-acquisition-guides.css'));
console.log('Key acquisition guides: eighteen existing sheets, shared rendering and local images verified.');

const render=n=>env.window.KeyAcquisitionGuides.markup({number:n,name:'Key '+n});
const duo=render('3007');assert(duo.includes('Jogador 1'));assert(duo.includes('Jogador 2'));assert(duo.includes('andar 5'));assert(!duo.includes('etapa cooperativa fica depois'));
const last=render('3008');assert(last.includes('ESQUERDA → DIREITA → ESQUERDA → DIREITA'));assert(last.includes('estante'));assert(!last.includes('etapa cooperativa fica depois'));
const npc=render('3012');assert(npc.includes('elathriel.gif'));assert(npc.includes('5.000 gp'));assert(npc.includes('<code>key</code>'));assert(npc.includes('andar 9'));assert(npc.includes('andar 10'));assert(!npc.includes('respawn diário compartilhado'));assert(!npc.includes('Como chegar · Ab’Dendriel → Hellgate → pirâmide'));

const troll=render('3033');assert(troll.includes('50 gp'));assert(troll.includes('Shirith'));assert(!troll.includes('Elathriel</h4>'));assert(!troll.includes('DRACONIA · GUIA ILUSTRADO'));
const test=render('3142');assert(test.includes('<code>redips</code>'));assert(test.includes('<code>7</code>'));assert(test.includes('<code>black</code>'));assert(test.includes('nível 35'));assert(test.includes('1.000 gp'));
const outlaw=render('3301');assert(outlaw.includes('3302'));assert(outlaw.includes('Look'));assert(outlaw.includes('32609, 32244'));assert(outlaw.includes('32617, 32250'));assert(!outlaw.includes('etapa cooperativa'));
const resources={window:{}};vm.createContext(resources);vm.runInContext(fs.readFileSync('public/classic-resources-data.js','utf8'),resources);assert(resources.window.CLASSIC_RESOURCES.keys.find(k=>k.number==='3301').mapDisabled);

const silver=render('3302');assert(silver.includes('Look'));assert(silver.includes('primeira porta usa 3301'));assert(silver.includes('segunda usa 3302'));assert(resources.window.CLASSIC_RESOURCES.keys.find(k=>k.number==='3302').mapDisabled);
const ovenKey=render('3303');assert(ovenKey.includes('32651, 32244, 7'));assert(ovenKey.includes('noroeste'));assert(ovenKey.includes('outlaw-oven.svg'));
const golden=render('3304');assert(golden.includes('baú atrás do forno'));assert(golden.includes('nível 45'));assert(golden.includes('não o baú do forno'));assert(golden.includes('Key 3303'));
for(const asset of ['outlaw-trees.svg','outlaw-oven.svg']){const svg=fs.readFileSync('public/assets/guides/key-acquisition/'+asset,'utf8');assert(svg.includes('<title'));assert(!svg.includes('<script'));assert(!svg.includes('NaN'));}

assert(render('3350').includes('Monastery Intruders'));assert(render('3350').includes('multa'));assert(render('3520').includes('canto nordeste'));assert(render('3600').includes('32505, 32176, 14'));assert(render('3600').includes('poço'));
