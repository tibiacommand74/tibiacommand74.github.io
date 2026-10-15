'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const env={window:{},Intl,Number,String,Set,Error};vm.createContext(env);
for(const file of ['catalog-data','hunt-data','hunt-preparation'])vm.runInContext(fs.readFileSync('public/'+file+'.js','utf8'),env);
const api=env.window.HuntPreparation;
const raw={name:'Dragons',config:{huntId:'troll-thais',minutes:60,capacity:100,notes:'Reserva',items:[{id:'2273',quantity:20,owned:5,price:100,weight:1.2,ready:true},{id:'2263',quantity:10,owned:20,price:null,weight:1.2,ready:false}]}};
let v=api.validate(raw),m=api.calculate(v.config);assert.equal(m.cost,1500);assert.equal(m.weight,36);assert.equal(m.free,64);assert.equal(m.missingPrices,0);assert.equal(m.ready,1);assert.equal(m.toBuy,15);
v.config.items[0].price=null;v.config.items[1].weight=null;m=api.calculate(v.config);assert.equal(m.missingPrices,1);assert.equal(m.missingWeights,1);assert.equal(m.weight,24);
v.config.capacity=10;assert.equal(api.calculate(v.config).free,-14);v.config.capacity=null;assert.equal(api.calculate(v.config).free,null);
const clone=()=>JSON.parse(JSON.stringify(raw));
for(const patch of [v=>v.name='x',v=>v.config.minutes=0,v=>v.config.minutes=1.5,v=>v.config.capacity=-1,v=>v.config.huntId='invalid',v=>v.config.items[0].quantity=0,v=>v.config.items[0].price='1.000',v=>v.config.items[0].weight='NaN',v=>v.config.items.push(v.config.items[0]),v=>v.config.items[0].id='does-not-exist',v=>v.config.notes='x'.repeat(1001)]){const x=clone();patch(x);assert.throws(()=>api.validate(x));}
assert.equal(api.validate({...raw,config:{...raw.config,items:[],capacity:''}}).config.capacity,null);
const cents=api.calculate({capacity:1,items:[{quantity:3,owned:0,price:0,weight:0.1,ready:false}]});assert.equal(cents.weight,0.3);assert.equal(cents.free,0.7);
assert(fs.readFileSync('public/hunts.js','utf8').includes('data-hunt-prepare'));
assert(fs.readFileSync('public/account-page.js','utf8').includes("case 'preparar':"));
console.log('PASS: quantities, purchase gaps, partial totals, weight, capacity, invalid inputs and hunt/account integration');
for(const hunt of env.window.CLASSIC_HUNTS){const html=fs.readFileSync('public/hunts/'+hunt.id+'/index.html','utf8');assert(html.includes('href="/#conta/preparar/'+hunt.id+'"'),'Static guide must link to its preparation: '+hunt.id);}
console.log('PASS: all 103 standalone hunt guides link to the matching preparation');
