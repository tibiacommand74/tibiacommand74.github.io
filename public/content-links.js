(function(){
'use strict';
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const tables={item:window.CATALOG.items,spell:window.CATALOG.spells,npc:window.CATALOG.npcs,creature:window.DATA.creatures};
const sections={item:'itens',spell:'magias',npc:'npcs',creature:'criaturas'},links={};
for(const [type,rows]of Object.entries(tables)){links[type]=new Map();const used=new Set();for(const r of rows){const key=type==='item'?String(r.id):r.name;const base=slug(r.name)||String(r.id);let name=base;if(used.has(name))name+='-'+(r.id??rows.indexOf(r));used.add(name);links[type].set(key,'/'+sections[type]+'/'+name+'/');}}
window.contentURL=(type,key)=>links[type]?.get(type==='item'?String(window.CATALOG.itemAliases?.[key]??key):String(key))||null;
})();
