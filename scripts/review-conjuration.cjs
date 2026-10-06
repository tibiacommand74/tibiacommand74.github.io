'use strict';
const fs=require('fs'),vm=require('vm'),context={window:{}};vm.runInNewContext(fs.readFileSync('catalog-data.js','utf8'),context);const d=context.window.CATALOG;
const results={'Conjure Arrow':2544,'Conjure Bolt':2543,'Conjure Explosive Arrow':2546,'Conjure Poisoned Arrow':2545,'Conjure Power Bolt':2547,'Enchant Staff':2433,'Food':2671};
for(const [name,id]of Object.entries(results)){const spell=d.spells.find(s=>s.name===name),item=d.items.find(i=>i.id===id);if(!spell||!item?.image)throw Error('Missing image: '+name);spell.image=item.image;spell.imageItemId=id;spell.imageNote=name==='Food'?'A imagem representa Ham, um dos alimentos que esta magia pode criar.':'A imagem representa '+item.name+', resultado desta magia.';}
const n=d.npcs.find(n=>n.name==='Nielson');n.city='Carlin';n.approximateCity=false;n.locationNote='Balsa no continente, a noroeste de Carlin.';
// Passagens ficam fora da Biblioteca por enquanto; o histórico permanece no Git.
const hiddenTravel=new Set(d.services.filter(s=>s.kind==='Viagem').map(s=>s.id));
d.services=d.services.filter(s=>s.kind!=='Viagem');
for(const npc of d.npcs)npc.services=(npc.services||[]).filter(s=>!hiddenTravel.has(s.id));
const out='window.CATALOG='+JSON.stringify(d)+';\n';for(const path of ['catalog-data.js','public/catalog-data.js'])fs.writeFileSync(path,out);
console.log('7 conjurações com imagens; passagens retiradas da Biblioteca; localização de Nielson corrigida.');
