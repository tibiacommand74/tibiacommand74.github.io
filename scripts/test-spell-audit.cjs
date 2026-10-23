'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const e={window:{}};vm.createContext(e);
for(const f of ['catalog-data','server-profile-data','mythera-items','mythera-spells'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),e);
const c=e.window.CATALOG,spells=c.spells,world=e.window.MytheraSpellLibrary;
assert.equal(spells.length,66);assert.equal(world.length,72);
for(const rows of [spells,world]){assert.equal(new Set(rows.map(s=>s.words)).size,rows.length,'No duplicate incantations');for(const s of rows)assert(s.name&&s.words);}
assert.equal(new Set(world.map(s=>s.id)).size,world.length);
const costs={'Cancel Invisibility':200,'Mass Healing':150,'Paralyze':900,'Poison Storm':600,'Undead Legion':500,'Wild Growth':220};
for(const [name,mana] of Object.entries(costs)){assert.equal(spells.find(s=>s.name===name).mana,mana,name+' uses classic mana');const inherited=world.find(s=>s.name===name);assert.equal(inherited.mana,mana);assert(!inherited.confirmed.includes('mana'),'Inherited fields must not claim Mythera confirmation');}
const cancel=spells.find(s=>s.name==='Cancel Invisibility');assert.deepEqual([...cancel.voc],['Sorcerer']);assert(cancel.teachers.every(t=>t.voc.includes('Sorcerer')&&!t.voc.includes('Druid')));
for(const custom of ['Taunt','Purification','Light Purification','Energy Explosion','Utana Gran Vid'])assert(world.some(s=>s.name===custom&&s.origin==='custom'));
for(const name of ['Explosion','Great Fireball','Heavy Magic Missile','Ultimate Healing Rune','Sudden Death']){const s=world.find(s=>s.name===name);assert(s.premium&&s.confirmed.includes('premium'),name+' retains Mythera Premium override');}
const normalize=s=>s.toLowerCase().replace(/rune/g,'').replace(/[^a-z0-9]/g,'');
for(const item of e.window.MYTHERA_ITEMS.filter(i=>i.category==='runes'&&i.facts.Spell!=='-'))assert(world.some(s=>normalize(s.name)===normalize(item.name)),item.name+' exists in spell library');
const energy=world.find(s=>s.name==='Energy Explosion');assert.equal(energy.charges,null);assert.equal(energy.chargeConflict.wiki,3);assert.equal(energy.chargeConflict.catalog,2);
const icicle=world.find(s=>s.name==='Icicle');for(const field of ['ml','mlUse','mana','price','premium'])assert.equal(icicle[field],null);assert.equal(icicle.voc.length,0);
assert.equal(world.find(s=>s.name==='Taunt').manaRule,'5% do HP máximo');
console.log('PASS: 66 classic spells, 72 Mythera entries, six classic corrections, vocation/teacher consistency, complete rune coverage, five custom spells, Premium overrides and preserved unknown/conflicting fields');
