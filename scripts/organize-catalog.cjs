'use strict';
const fs=require('fs'),vm=require('vm');
const context={window:{}};vm.runInNewContext(fs.readFileSync('catalog-data.js','utf8'),context);const d=context.window.CATALOG;
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const unique=a=>[...new Map(a.map(r=>[JSON.stringify(r),r])).values()];
const spellAliases={firebomb:'Fire Bomb',invisible:'Invisibility',exevoconvis:'Conjure Power Bolt'};
const aliases={apple:'red apple',arrows:'arrow',devilshelmet:'devil helmet',candlebra:'candelabrum',presentbox:'present',watches:'watch',redcusionedchair:'red cushioned chair',sqarepillow:'square pillow',portaitpicture:'portrait picture',portrait:'portrait picture',landscape:'landscape picture',stilllife:'still life picture',stillifepicture:'still life picture',indoorplants:'indoor plant',goblin:'goblin statue',knight:'knight statue',minotaur:'minotaur statue',worms:'worm'};
const services={blessing:{name:'Blessings',kind:'Bênçãos'},promotion:{name:'Promotion',kind:'Promoção'},folda:{name:'Passagem para Folda',kind:'Viagem'},senja:{name:'Passagem para Senja',kind:'Viagem'},vega:{name:'Passagem para Vega',kind:'Viagem'}};
const byId=new Map(d.items.map(i=>[String(i.id),i]));const byName=new Map(d.items.map(i=>[norm(i.name),i]));
const remap={},moves=[],merged=[];d.services=d.services||[];
for(const item of d.items){
 if(typeof item.id!=='string')continue;
 const key=norm(item.name),spell=d.spells.find(s=>norm(s.name)===key||s.name===spellAliases[key]);
 if(spell){spell.offers=unique([...(spell.offers||[]),...item.buy]);remap[item.id]={type:'spell',name:spell.name};moves.push(item.id);continue;}
 if(services[key]){const s={id:item.id,...services[key],providers:item.buy};d.services.push(s);remap[item.id]={type:'service',id:s.id};moves.push(item.id);continue;}
 let target=aliases[key]&&byName.get(norm(aliases[key]));
 // Correct spelling when both historical aliases need one canonical entry.
 if(['stilllife','stillifepicture'].includes(key)){target=byName.get('stillifepicture')||byName.get('stilllife');if(target)target.name='still life picture';}
 if(target&&target!==item){target.buy=unique([...target.buy,...item.buy]);target.sell=unique([...target.sell,...item.sell]);target.aliases=unique([...(target.aliases||[]),item.name]);remap[item.id]={type:'item',id:target.id};merged.push(item.id);}
}
const removed=new Set([...moves,...merged]);d.items=d.items.filter(i=>!removed.has(i.id));
// Keep legacy item links working; resolve chained aliases too.
d.itemAliases={...(d.itemAliases||{})};for(const [id,r]of Object.entries(remap))if(r.type==='item')d.itemAliases[id]=r.id;
const resolve=id=>{let n=id;for(let k=0;k<10&&d.itemAliases[n]!==undefined;k++)n=d.itemAliases[n];return n;};
for(const n of d.npcs){
 n.services=n.services||[];n.spellOffers=n.spellOffers||[];
 for(const field of ['sell','buy'])n[field]=unique(n[field].flatMap(row=>{
  const item=byId.get(String(row.item))||byName.get(norm(row.item)),r=item&&remap[item.id];
  if(!r)return[row];
  if(r.type==='item')return[{...row,item:resolve(r.id)}];
  if(r.type==='spell'){n.spellOffers.push({name:r.name,price:row.price});if(!n.spells.includes(r.name))n.spells.push(r.name);return[];}
  n.services.push({id:r.id,price:row.price});return[];
 }));
 n.spellOffers=unique(n.spellOffers);n.services=unique(n.services);
}
for(const s of d.spells){if(s.kind==='Runa'){const i=d.items.find(i=>norm(i.name)===norm(s.name)||norm(i.name)===norm(s.name+' rune'));if(i){s.runeId=i.id;if(i.image)s.image=i.image;}}}
for(const n of d.npcs){if(!n.buy.length&&!n.sell.length){if(n.spells.length)n.role='Professor de magias';else if(n.services.length)n.role='Serviços e diálogos';}}
const furniture=new Set('barrel,big table,birdcage,coal basin,drawer,dresser,edged mirror,football,globe,goblin statue,god flower,green cushioned chair,harp,heart pillow,indoor plant,knight statue,landscape picture,large amphora,locker,minotaur statue,oval mirror,pendulum clock,piano,portrait picture,red cushioned chair,rocking chair,rocking horse,round mirror,round pillow,round table,small pillow,small table,sofa chair,square pillow,square table,still life picture,table lamp,tapestry,telescope,trough,trunk,wooden chair'.split(','));
for(const i of d.items){if(furniture.has(i.name))i.category='Móveis e decoração';if(['beer','lemonade','life fluid','mana fluid','milk','oil','water','wine'].includes(i.name))i.category='Fluidos e bebidas';}
const out='window.CATALOG='+JSON.stringify(d)+';\n';fs.writeFileSync('catalog-data.js',out);fs.writeFileSync('public/catalog-data.js',out);
const report={movedFromItems:moves.length,mergedDuplicates:merged.length,items:d.items.length,spells:d.spells.length,services:d.services.length,pendingImages:d.items.filter(i=>!i.image).map(i=>({id:i.id,name:i.name,category:i.category}))};fs.writeFileSync('scripts/catalog-review.json',JSON.stringify(report,null,2)+'\n');console.log({...report,pendingImages:report.pendingImages.length});
