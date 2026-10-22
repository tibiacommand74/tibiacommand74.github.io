const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const env={window:{}};vm.createContext(env);vm.runInContext(fs.readFileSync('public/key-acquisition-guides.js','utf8'),env);
for(const number of ['3001','3002','3003','3004','3005','3006']){
 const html=env.window.KeyAcquisitionGuides.markup({number,name:'Key '+number});
 assert(html.includes('Como pegar a Key '+number));
 const paths=[...html.matchAll(/<img src="([^"]+)"/g)].map(x=>x[1]);assert(paths.length>=4);
 for(const p of paths){assert(fs.existsSync('public/'+p),p);assert(fs.statSync('public/'+p).size>1000,p);}
 if(Number(number)>=3004){assert(html.includes('andar 6'));assert(html.includes('Destroy Field'));assert(!html.includes('As três coletas ficam no térreo'));}
 assert(html.includes('não estão documentadas'));assert(html.includes('respawn diário'));
}
assert.equal(env.window.KeyAcquisitionGuides.markup({number:'3007'}),'');
for(const file of ['public/classic-resources.js','public/server-lab.js'])assert(fs.readFileSync(file,'utf8').includes('KeyAcquisitionGuides?.markup(k)'),file);
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('key-acquisition-guides.js')<index.indexOf('classic-resources.js'));assert(index.includes('key-acquisition-guides.css'));
console.log('Key acquisition guides: six existing sheets, shared rendering and local images verified.');
