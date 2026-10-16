'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),env={window:{}};vm.createContext(env);for(const f of ['hunt-data','hunt-finder'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),env);const api=env.window.HuntFinder,rows=env.window.CLASSIC_HUNTS,p={level:35,vocation:'Knight',access:'free',goal:'',city:'',risk:''};
const found=api.recommend(rows,p);assert(found.length);assert(found.every(h=>h.level<=35&&!h.premium&&h.vocations.includes('Knight')&&!h.versionException));assert(found.every((h,i)=>!i||found[i-1].level>=h.level));
for(const vocation of ['Knight','Paladin','Druid','Sorcerer'])for(const access of ['free','premium'])for(const goal of ['','Economia','Experiência','Equilíbrio']){const r=api.recommend(rows,{...p,level:100,vocation,access,goal});assert(r.every(h=>h.vocations.includes(vocation)&&(!goal||h.goal===goal)&&(access==='premium'||!h.premium)));}
for(const risk of new Set(rows.map(h=>h.risk)))assert(api.recommend(rows,{...p,level:100,risk}).every(h=>h.risk===risk));
assert(api.recommend(rows,{...p,city:'Thais'}).every(h=>h.city==='Thais'));
assert(api.recommend(rows,{...p,level:10000,access:'premium'}).every(h=>!h.versionException));
assert.equal(api.recommend(rows,{...p,level:1}).length,0);
for(const level of ['',0,-1,35.5,10001,'abc',Infinity])assert.throws(()=>api.recommend(rows,{...p,level}));assert.throws(()=>api.recommend(rows,{...p,vocation:'Monk'}));assert.throws(()=>api.recommend(rows,{...p,city:'<script>'}));
const fake=[{...rows[0],id:'a',level:30,risk:'Alto'},{...rows[0],id:'b',level:30,risk:'Baixo'},{...rows[0],id:'c',level:31,risk:'Alto'},{...rows[0],id:'new',introducedVersion:'7.5'}];assert.deepEqual(Array.from(api.recommend(fake,p),h=>h.id),['c','b','a']);
const index=fs.readFileSync('public/index.html','utf8'),app=fs.readFileSync('public/app.js','utf8');assert(index.includes('href="#buscar-hunt"'));assert(index.includes('hunt-finder.js?v=20261016-finder-auto'));assert(app.includes("else if(p==='buscar-hunt'){window.HuntFinder.render(el);}"));assert(index.indexOf('hunt-finder.js')<index.indexOf('app.js'));
console.log('PASS: finder vocation/level/access/city/goal/risk filters, closest-level sorting, invalid values, 7.5 exclusion and route integration');
