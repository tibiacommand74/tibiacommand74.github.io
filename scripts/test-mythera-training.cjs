'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const e={window:{},URL,location:{href:'https://example.org/?servidor=mythera&treino=Rod'},history:{replaceState(){}}};e.window=e;vm.createContext(e);
for(const f of ['mythera-items','mythera-training'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),e);
const w=e.MytheraTraining;assert.equal(w.catalogue().length,31);
for(const type of ['Sword','Axe','Club','Spear','Rod','Wand','Shield']){const a=w.variants(type);assert.equal(a.length,4);assert(a[3].name.startsWith('Overcharged'));for(const i of a)assert(fs.existsSync('public/'+i.image));const n=['Rod','Wand'].includes(type)?400:3600;assert.equal(+a[1].facts.Charges,n);assert.equal(+a[2].facts.Charges,n*2);assert.equal(+a[3].facts.Charges,n*3);}
for(const i of w.catalogue())assert(fs.existsSync('public/'+i.image));
const cards={innerHTML:''},root={innerHTML:'',querySelector:()=>cards,querySelectorAll:()=>[]};assert(w.render(root,'gameplay--training-weapons'));assert.match(cards.innerHTML,/Discharged Training Rod/);assert.match(root.innerHTML,/1.500 gp/);assert.match(root.innerHTML,/equivalência não está confirmada/);assert.match(root.innerHTML,/não foram publicados/);assert(!root.innerHTML.includes('data-wiki-record='));assert.match(w.itemInfo(w.catalogue()[0]),/passo a passo/);assert.equal(w.itemInfo({category:'armor'}),'');assert.equal(w.render(root,'other'),false);
const index=fs.readFileSync('public/index.html','utf8');assert(index.indexOf('mythera-training.js')<index.indexOf('mythera-wiki.js'));assert.match(fs.readFileSync('public/server-context.js','utf8'),/'treino'/);
console.log('PASS: 31 existing images, all 7 families and 4 tiers, correct charges, guide/item links, source differences and server query cleanup');
