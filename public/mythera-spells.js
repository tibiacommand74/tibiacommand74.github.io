'use strict';
(()=>{
 const catalog=window.CATALOG,items=window.MYTHERA_ITEMS,profile=window.MYTHERA_PROFILE;
 const key=s=>String(s).toLowerCase().replace(/rune/g,'').replace(/[^a-z0-9]/g,'');
 const wiki=path=>'https://mythera74.gitbook.io/mythera74/gameplay/spells/'+path;
 const changes='https://mythera74.gitbook.io/mythera74/informations/publish-your-docs';
 const animation=path=>'assets/mythera-spell-'+path+'.gif';
 const own=[
  {name:'Taunt',vocation:'Elite Knight',words:'exeta',ml:null,mana:null,manaRule:'5% do HP máximo',price:10000,group:'Suporte',kind:'Instantânea',path:'elite-knight',image:'assets/vocation-knight.webp',detail:'Força uma criatura a até 4 SQMs a atacar o caster e mantém o alvo por aproximadamente 6 segundos. Exige completar uma facção. Magic level não publicado.'},
  {name:'Purification',vocation:'Elder Druid',words:'exura mas sio "nome',ml:23,mana:60,price:10000,group:'Cura',kind:'Instantânea',path:'elder-druid',image:'assets/vocation-druid.webp',detail:'Cura o jogador selecionado em 5 ticks. Exige completar uma facção.'},
  {name:'Light Purification',vocation:'Elder Druid',words:'exura min sio "nome',ml:12,mana:30,price:3500,group:'Cura',kind:'Instantânea',path:'elder-druid',image:'assets/vocation-druid.webp',detail:'Cura o jogador selecionado em 3 ticks. Aprendida com Ursula. A animação da wiki demonstra as magias da vocação, sem identificar separadamente cada versão.'},
  {name:'Energy Explosion',vocation:'Master Sorcerer',words:'adori mas vis',ml:40,mlUse:3,mana:180,price:10000,group:'Ataque',kind:'Runa',path:'master-sorcerer',status:'conflict',detail:'Cria uma runa de energia com explosão em forma de cruz ao redor do alvo. Exige completar uma facção. A página atual da wiki consultada informa 180 mana e 3 cargas, enquanto a tabela de itens informa 2 cargas. Mantida fora dos cálculos automáticos.'},
  {name:'Utana Gran Vid',vocation:'Royal Paladin',words:'utana gran vid',ml:18,mana:40,price:10000,group:'Suporte',kind:'Instantânea',path:'royal-paladin',image:'assets/vocation-paladin.webp',detail:'Redireciona criaturas que atacam o caster para aliados próximos, priorizando knights. Exige completar uma facção. A wiki informa as palavras, mas não publica um nome separado para esta magia.'}
 ].map(s=>({...s,id:'mythera-spell-'+key(s.name),origin:'custom',voc:[s.vocation],premium:true,promoted:true,cost:s.price,source:wiki(s.path),animation:animation(s.path),confirmed:['words','mana','price','premium','voc',...(s.ml==null?[]:['ml']),...(s.mlUse==null?[]:['mlUse'])],charges:null,teachers:[]}));
 const library=catalog.spells.map(base=>{
  const row={...base,id:'mythera-spell-'+key(base.name)+'-'+(base.kind==='Runa'?'rune':'spell'),origin:'classic',source:null,confirmed:[],detail:'Magia da base Tibia 7.4. As alterações documentadas do Mythera são aplicadas nesta mesma ficha.',teachers:(base.teachers||[]).map(t=>({npc:t.npc,city:t.city}))};
  if(base.kind==='Runa'){
   const item=items.find(i=>i.category==='runes'&&key(i.name)===key(base.name));
   if(item){row.image=item.image;row.runeItemId=item.id;row.source=item.source;if(item.facts.Spell&&item.facts.Spell!=='-'&&item.facts.Spell!=='?'){row.words=item.facts.Spell;row.confirmed.push('words');}if(/^\d+$/.test(item.facts.Charges)){row.charges=Number(item.facts.Charges);row.confirmed.push('charges');}}
   if(profile.premiumRunes.includes(base.name)){row.premium=true;row.confirmed.push('premium');row.premiumSource=changes;}
  }
  return row;
 });
 const icicle=items.find(i=>i.category==='runes'&&i.name==='Icicle Rune');
 if(icicle)library.push({id:'mythera-spell-icicle-rune',name:'Icicle',words:icicle.facts.Spell,kind:'Runa',group:'Ataque',voc:[],ml:null,mlUse:null,mana:null,price:null,premium:null,charges:Number(icicle.facts.Charges),image:icicle.image,runeItemId:icicle.id,origin:'rune-catalog',source:icicle.source,confirmed:['words','charges'],teachers:[],detail:'Runa documentada no catálogo oficial do Mythera. Magic level, mana, vocações, preço de aprendizado e acesso Premium não constam nessa tabela.'});
 const energyItem=items.find(i=>i.category==='runes'&&i.name==='Energy Explosion Rune');
 const energy=own.find(s=>s.name==='Energy Explosion');energy.image=energyItem.image;energy.runeItemId=energyItem.id;energy.chargeConflict={wiki:3,catalog:Number(energyItem.facts.Charges),catalogSource:energyItem.source};
 own.find(s=>s.name==='Light Purification').teachers=[{npc:'Ursula',city:catalog.npcs.find(n=>n.name==='Ursula')?.city||'Não informada',origin:'mythera',cityOrigin:'classic',price:3500}];
 library.push(...own);
 window.MytheraSpells=own;window.MytheraSpellLibrary=library;
})();
