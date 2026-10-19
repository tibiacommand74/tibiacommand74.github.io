/* Selected-world libraries: complete historical base plus documented server overrides. */
'use strict';
(()=>{
 const key=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const categoryMap={'Espadas':'swords','Capacetes':'helmets','Armaduras':'armors','Calças':'legs','Botas':'boots','Escudos':'shields','Anéis':'rings','Amuletos':'amulets','Machados':'axes','Clavas':'clubs','Distância':'distance','Munição':'ammunition','Recipientes':'containers','Alimentos':'foods','Runas':'runes','Ferramentas':'tools'};
 const statMap={attack:'Atk',defense:'Def',armor:'Arm',weight:'Weight',range:'Range',slots:'Size'};
 const factsFor=i=>{const out={};for(const [k,v] of Object.entries(i.stats||{}))if(v!=null)out[statMap[k]||k]=String(v);if(i.hands!=null)out.Hands=String(i.hands);return out;};
 const classics=window.CATALOG.items,official=window.MYTHERA_ITEMS,officialNames=new Set(official.map(i=>key(i.name)));
 window.MytheraItemLibrary=[...official.map(i=>{const base=classics.find(c=>key(c.name)===key(i.name));const inherited=factsFor(base||{});return {...i,facts:{...inherited,...i.facts},confirmedFields:Object.keys(i.facts),classic:base||null,classicIds:base?[String(base.id)]:[],origin:'mythera',aliases:base?[base.name,...(base.aliases||[])]:[]};}),...classics.filter(i=>!officialNames.has(key(i.name))).map(i=>({id:'classic-item-'+i.id,name:i.name,category:categoryMap[i.category]||'classic-'+key(i.category),categoryLabel:i.category,facts:factsFor(i),image:i.image,classic:i,classicIds:[String(i.id)],origin:'classic',status:'reference',confirmedFields:[],aliases:i.aliases||[],source:null}))];
 const officialCreatures=window.MYTHERA_DOMAIN.creatures,byName=new Map(window.DATA.creatures.map(c=>[key(c.name),{...c,origin:'classic',status:'reference',classic:c,aliases:[],description:'Criatura da referência Tibia 7.4.'}]));
 for(const c of officialCreatures){const old=byName.get(key(c.name));byName.set(key(c.name),{...c,origin:'mythera',kind:c.status==='seasonal'?'event':old?.kind==='trap'?'trap':'creature',classic:old?.classic||null,aliases:old?[old.name]:[]});}
 window.MytheraCreatureLibrary=[...byName.values()];
})();
