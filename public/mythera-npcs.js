'use strict';
(()=>{
 const catalog=window.CATALOG,documented=window.MYTHERA_DOMAIN.npcs;
 const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const classicData=base=>({city:base.city,role:base.role,approximateCity:base.approximateCity===true,spells:[...(base.spells||[])],services:(base.services||[]).map(s=>typeof s==='string'?s:JSON.stringify(s)),auditNote:base.auditNote||null,offers:[...['buy','sell'].flatMap(direction=>(base[direction]||[]).map(offer=>{const item=catalog.items.find(i=>String(i.id)===String(offer.item));return {item:item?.name||'Item '+offer.item,itemId:offer.item,price:offer.price,currency:'gp',direction:direction==='buy'?'npc-buys':'npc-sells',origin:'classic'};}))]});
 const offerKey=o=>o.direction+'|'+normalize(o.item).replace(/[^a-z0-9]/g,'');
 const library=documented.map(n=>{const base=catalog.npcs.find(c=>normalize(c.name)===normalize(n.name)),classic=base?classicData(base):null,offers=new Map((classic?.offers||[]).map(o=>[offerKey(o),o]));for(const offer of n.offers)offers.set(offerKey(offer),{...offer,origin:n.status==='community'?'community':'official'});return {...n,city:n.city==='Local não publicado'&&classic?classic.city:n.city,cityOrigin:n.city==='Local não publicado'&&classic?'classic':'mythera',origin:'mythera',classic,offers:[...offers.values()],spells:[...new Set([...(classic?.spells||[]),...(n.spell?[n.spell]:[])])]};});
 for(const base of catalog.npcs){if(library.some(n=>normalize(n.name)===normalize(base.name)))continue;const classic=classicData(base);library.push({id:'classic-npc-'+encodeURIComponent(base.name),name:base.name,city:base.city,role:base.role||'Serviços e diálogos',status:'reference',origin:'classic',cityOrigin:'classic',description:base.auditNote||'Serviços e informações da base Tibia 7.4.',source:null,keywords:[],offers:classic.offers,spells:classic.spells,classic});}
 window.MytheraNpcLibrary=library;
})();
