/* Guias por etapa. Coordenadas e caminhos continuam com a precisão da base original.
 * Palavras-chave são enviadas individualmente; não reproduzimos falas inteiras dos NPCs.
 */
(function () {
  'use strict';
  const routes = window.QUEST_ROUTES;
  const wiki = 'https://www.tibiawiki.com.br/wiki/';
  const post = 'postman-missions', green = 'the-djinn-war-efreet-faction', blue = 'the-djinn-war-marid-faction';
  const banshee = 'the-queen-of-the-banshees', tombs = 'the-ancient-tombs', desert = 'the-desert-dungeon';
  const source = {
    [post]: wiki + 'The_Postman_Missions_Quest',
    [green]: wiki + 'The_Djinn_War_Quest#The_Efreet_-_Missão_01',
    [blue]: wiki + 'The_Djinn_War_Quest#The_Marid_-_Missão_01',
    [banshee]: wiki + 'The_Queen_of_the_Banshees_Quest',
    [tombs]: wiki + 'The_Ancient_Tombs_Quest'
  };
  const patch = (id, i, data) => Object.assign(routes[id].stages[i], data);
  const postSpeakers={0:'Kevin',1:'Captain Bluebear',2:'Uzon',3:'Captain Seahorse',4:'Brodrosch',5:'Kevin',7:'Kevin',8:'A Strange Fellow',9:'Kevin',10:'Dermot',11:'Kevin',12:'Hugo',13:'Kevin',14:'Talphion',15:'Kevin',16:'Queen Eloise',17:'Kevin',18:'Noodles',19:'Kevin',20:'Hugo',21:'Kevin',22:'Benjamin',23:'Liane',24:'Olrik',25:'Lokur',26:'Kroox',27:'Dove',28:'Chrystal',29:'Kevin',31:'Kevin',33:'Kevin',34:'Markwin',35:'Kevin'};
  const talk = (id, i, commands, data = {}) => patch(id, i, { commands, speaker:id===post?postSpeakers[i]:routes[id].stages[i].label.split('·')[0].trim(), ...data });
  for (const [id, url] of Object.entries(source)) {
    routes[id].detailReviewedAt = '12/10/2026';
    routes[id].sources = [...new Set([url, ...(routes[id].sources || [])])];
    routes[id].stages.forEach(s => { s.detailSource = url; });
  }
  // Postman: a ordem das missões exige relatórios intermediários a Kevin.
  talk(post, 0, ['hi', 'mission'], { action: 'Aceite a inscrição e as confirmações de Kevin, uma pergunta por vez.' });
  [[1,'carlin'],[2,'edron'],[3,'venore'],[4,'cormaya']].forEach(([i,d]) => talk(post,i,['hi',d,'yes']));
  [5,7,11,29,33].forEach(i => talk(post,i,['hi','mission','yes']));
  patch(post,6,{action:'Use a Crowbar na mailbox, não envie uma carta.'});
  talk(post,8,['hi','hat','hat','hat','hat','bill','yes']);
  talk(post,9,['hi','all','yes','mission','yes','advancement','yes']);
  talk(post,10,['hi','present','yes'],{warning:'Não abra o presente: ele desaparece.'});
  talk(post,12,['hi','new uniforms','new dress patterns'],{arrival:'Hugo fica acima da loja de Velvet, a sudeste do depot principal de Venore.'});
  [13,15].forEach(i => talk(post,i,['hi','new dress patterns']));
  talk(post,14,['hi',...Array(5).fill('new dress patterns')]);
  talk(post,16,['hail queen','uniforms']);
  talk(post,17,['hi','new dress pattern','yes']);
  talk(post,18,['hi','sniff banana skin','do you like that?','sniff dirty fur','do you like that?','sniff mouldy cheese','do you like that?'],{warning:'Espere Noodles se afastar dos guardas.'});
  [19,20].forEach(i => talk(post,i,['hi','new dress pattern']));
  talk(post,21,['hi','mission','advancement','yes'],{action:'Depois da promoção, peça mission e aceite a tarefa das medidas.'});
  [22,25,28].forEach(i => talk(post,i,['hi','measurements']));
  [23,24,27].forEach(i => talk(post,i,['hi','measurements','yes']));
  patch(post,24,{action:'Cada rodada custa 5 gp. Repita a tentativa até tirar 6.'});
  talk(post,26,['hi','lokurs measurements']);
  talk(post,29,['hi','mission','yes','yes']);
  patch(post,30,{arrival:'Abra com Shovel a entrada 32493, 32259, 7. Desça a leste; siga norte e leste, suba e procure a porta a oeste.',action:'Use o corpo de Waldo para obter o Post Horn.'});
  talk(post,31,['hi','mission','yes','yes','advancement','yes'],{warning:'Libere 500 oz antes de retirar a bag de cartas.'});
  patch(post,32,{before:'Depois da promoção, peça mission a Kevin, confirme yes e retire a letterbag no baú autorizado.',action:'Use a letterbag na mailbox de Santa; não coloque a bag como uma encomenda comum.'});
  talk(post,34,['hi','letter','yes'],{warning:'O primeiro hi chama os guarda-costas. Prepare o combate e só então retome a conversa.'});
  talk(post,35,['hi','mission','advancement','yes']);
  // Djinn: a escolha de facção é permanente.
  [green,blue].forEach(id => talk(id,0,['hi','word of greeting']));
  talk(green,1,["DJANNI'HAH",'passage','no','yes','yes'],{warning:'Escolha permanente: você se alia aos Green Djinns.'});
  talk(green,2,["DJANNI'HAH",'mission','yes'],{warning:"Não cumprimente Baa'leal com hi: use DJANNI'HAH."});
  talk(green,4,['hi','prison','ankrahmun','supplies']);
  talk(green,5,["DJANNI'HAH",'mission','yes','partos']);
  [6,9,10,13].forEach(i => talk(green,i,["DJANNI'HAH",'mission','yes']));
  talk(green,3,['hi','waterpipe','prisoner'],{action:'Pergunte a Shauna pelo antigo prisioneiro e siga a pista até Thais.',detailSource:wiki+'Shauna'});
  patch(green,7,{arrival:'Suba a rampa 33178, 32557, 7; vá oeste, desça e entre pelo sul.',warning:'Entrada secreta: a torre rival contém inimigos.'});
  patch(green,8,{action:'Use a fonte ao norte e recolha a Tear of Daraman que aparece no chão.'});
  patch(green,12,{action:'Use a Gemmed Lamp na lâmpada do quarto de Gabel e volte a Malor.'});
  talk(blue,1,["DJANNI'HAH",'passage','yes','yes'],{warning:'Escolha permanente: você se alia aos Blue Djinns.'});
  talk(blue,2,['hi','mission','yes']);
  talk(blue,3,['hi maryza','cookbook','yes'],{warning:'Leve 150 gp para o livro.'});
  talk(blue,4,['hi','cookbook','yes']);
  talk(blue,5,['hi','mission']);
  talk(blue,6,['PIEDPIPER','spy report','spy report','yes'],{warning:'Leve um Cheese e limpe os djinns antes de falar com o espião.'});
  [7,8,11].forEach(i => talk(blue,i,['hi','mission','yes']));
  patch(blue,10,{action:'Use a Gemmed Lamp na lâmpada do quarto de Malor e volte a Gabel.'});
  [green,blue].forEach(id => {
    const king = routes[id].stages.find(s => /Orc King/.test(s.label));
    Object.assign(king,{commands:['hi','lamp','malor'],warning:'O primeiro hi invoca orcs. Limpe os summons antes de continuar.',action:'Com a missão final ativa, obtenha a Gemmed Lamp.'});
    const at = routes[id].stages.indexOf(king);
    // Reutiliza os mesmos trechos aproximados do guia Orc Fortress, sem criar ligações entre cidades.
    const access = routes['orc-fortress'].stages.slice(0,5).map(s => ({...s,points:s.points.map(p=>p.slice()),marker:s.marker?.slice(),label:'Orc Fortress · '+s.label,detailSource:source[id]}));
    routes[id].stages.splice(at,0,...access);
    routes[id].pathSegments = routes[id].stages.filter(s=>s.points.length>1).length;
  });
  // Banshee: o minimapa localiza a sala, não substitui o desenho do enigma.
  patch(banshee,6,{action:'Use Pick em 32266, 31892, 12 para abrir a passagem do Hidden Seal.'});
  patch(banshee,7,{action:'Cada jogador atravessa a chama azul e volta pelo teleport.',warning:'A ativação invoca criaturas; organize a equipe.'});
  patch(banshee,8,{action:'Ajuste as alavancas conforme a referência visual antes da chama azul.',detailSource:source[banshee]+'#Missão_02:_The_Seal_of_Logic',visualRequired:true});
  patch(banshee,12,{action:'Atravesse os pisos na ordem da referência visual, entre na chama e retorne.',detailSource:source[banshee]+'#Missão_03:_The_Seal_of_the_True_Path',visualRequired:true});
  patch(banshee,13,{action:'Despeje Blood no chão entre as pedras; atravesse a chama e retorne.'});
  patch(banshee,14,{warning:'Cada personagem deve pisar em apenas um interruptor: ele invoca dois Warlocks.',action:'Resolva as alavancas conforme a imagem antes da chama.',detailSource:source[banshee]+'#Missão_05:_The_Seal_of_Demonrage',visualRequired:true});
  patch(banshee,15,{action:'Cada jogador coloca uma Black Pearl e uma White Pearl nos altares; atravesse o teleport, a chama e retorne.'});
  talk(banshee,16,['hi','seventh seal',...Array(6).fill('yes'),'kiss','yes'],{warning:'O beijo envia você à lápide. Refaça o acesso para chegar à sala final.'});
  patch(banshee,18,{warning:'Prepare seis Banshees, dois Dragon Lords e duas Giant Spiders. A descida final não permite subir de volta.',action:'Pegue os quatro baús antes do teleport de saída.'});
  // Ancient Tombs: cada entrada continua marcada como entrada, nunca como sala do boss.
  const parts = [
    ['Omruc','Crystal Arrow','Helmet Adornment','Labirinto de pisos; confira o desenho antes de atravessar.'],
    ['Thalas','Cobrafang Dagger','Gem Holder','Oito alavancas com tempo limitado. Fale hi à estátua de cobra ainda envenenado.'],
    ['Dipthrah','Ornamented Ankh','Damaged Helmet','Onze alavancas. Portas: endless → pale-faced → deceased → unholy → doomed → righteous → sharpened → mortal.'],
    ['Mahrdis','Burning Heart','Helmet Ornament','Espere o fogo roxo apagar antes de pisar no próximo piso.'],
    ['Vashresamun','Blue Note','Left Horn','Use os instrumentos na ordem mostrada na referência visual.'],
    ['Morguthis','Sword Hilt','Right Horn','Labirinto com Deathslicers: organize blockers e acompanhe as imagens sala a sala.'],
    ['Rahemos','Ancient Rune','Helmet Piece','Alavancas, paredes falsas e lava; acompanhe as imagens dos mecanismos.']
  ];
  parts.forEach(([boss,item,part,puzzle],i) => patch(tombs,i,{action:puzzle,objective:item+' → '+part,detailSource:source[tombs]+'#'+boss,visualRequired:[0,1,4,5,6].includes(i)}));
  talk(tombs,1,['hi'],{speaker:'Estátua de cobra',commandNote:'À estátua de cobra, depois dos mecanismos e enquanto estiver envenenado.'});
  patch(tombs,7,{action:'Reúna as sete peças na mesa, um jogador por vez; entre e saia do piso especial.',detailSource:source[tombs]+'#The_Helmet_of_the_Ancients'});
  // Desert: configuração de quatro vocações da referência 7.4.
  [[1,'Spellbook',32679,32089],[2,'Apple',32667,32089],[3,'Crossbow',32673,32083],[4,'Sword',32673,32094]].forEach(([i,item,x,y]) => patch(desert,i,{action:'Coloque '+item+' no altar '+x+', '+y+', 8. O personagem fica no piso indicado pelo marcador.'}));
  patch(desert,5,{warning:'Quatro personagens, quatro vocações e nível 20+ em todos. Confira os itens nos altares antes da alavanca.'});
  window.QUEST_DETAIL_IDS = [post,green,blue,banshee,tombs,desert];

  const safe = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const floor = z => z===7?'Superfície':z>7?'Subsolo '+(z-7):'Acima +'+(7-z);
  window.questStageExtras = function (id,i) {
    const s=routes[id]?.stages[i]; if(!s)return '';
    return `${s.warning?`<p class="guide-warning"><b>Atenção:</b> ${safe(s.warning)}</p>`:''}${s.before?`<p><b>Antes de sair:</b> ${safe(s.before)}</p>`:''}${s.arrival?`<p><b>Como chegar:</b> ${safe(s.arrival)}</p>`:''}${s.action?`<p><b>O que fazer:</b> ${safe(s.action)}</p>`:''}${s.objective?`<p class="guide-objective"><b>Item de passagem e peça:</b> ${safe(s.objective)}</p>`:''}${s.commands?.length?`<div class="guide-dialogue"><b class="guide-dialogue-title">${s.speaker?'Fale com '+safe(s.speaker):'Falas do NPC'}</b><small class="guide-dialogue-hint">Envie uma fala por vez.</small>${s.commandNote?`<p>${safe(s.commandNote)}</p>`:''}<ol role="list">${s.commands.map((c,n)=>`<li><span class="guide-command-number" aria-hidden="true">${n+1}</span><code>${safe(c)}</code><button type="button" data-copy-quest-command="${safe(c)}" aria-label="Copiar fala ${n+1}: ${safe(c)}">Copiar</button></li>`).join('')}</ol><small>Espere o NPC responder antes de continuar.</small><p class="guide-copy-status" role="status" aria-live="polite"></p></div>`:''}${s.detailSource?`<a class="guide-source" href="${safe(s.detailSource)}" target="_blank" rel="noopener noreferrer">${s.visualRequired?'Ver sequência e imagens do mecanismo ↗':'Consultar referência desta etapa ↗'}</a>`:''}`;
  };
  window.questDetailedGuide = function(id) {
    const guide=routes[id];if(!guide?.stages.length||guide.coverage==='area')return '';
    return `<section class="guide-stage-list"><h3>Passo a passo no mapa</h3><p>Abra a etapa para ver o local e a ação. Minimapas de referência: linhas mostram somente os trechos já desenhados; pontos isolados localizam a área.</p>${guide.detailReviewedAt?`<p class="catalog-footnote">Instruções complementadas em ${guide.detailReviewedAt}. Referências atuais podem diferir do servidor 7.4.</p>`:''}${guide.stages.map((s,i)=>{
      const p=s.marker||s.points.at(-1);
      return `<details class="guide-stage" data-guide-stage="${i}"><summary><span class="guide-stage-number">${i+1}</span><span>${safe(s.label)}<small>${floor(s.floor)} · ${p.join(', ')}</small></span></summary><div class="guide-stage-body"><p>${safe(s.text)}</p>${window.questStageExtras(id,i)}<figure class="guide-minimap"><canvas width="640" height="360" data-guide-map="${i}" role="img" aria-label="Localização da etapa ${i+1}: ${safe(s.label)}, ${floor(s.floor)}, ${p.join(', ')}"></canvas><figcaption>${s.points.length>1?'Trecho aproximado neste andar':'Localização de referência · sem caminho desenhado'}${s.transition==='inferred-stairs'?' · passagem de andar inferida':''}</figcaption></figure>${s.gap?`<p class="guide-unconfirmed">${safe(s.gap)}</p>`:''}<button class="action secondary" type="button" data-open-quest-stage="${i}" data-guide-quest="${safe(id)}">Abrir etapa ${i+1} no mapa completo</button></div></details>`;
    }).join('')}</section>`;
  };
  const images = new Map();
  function floorImage(z) {
    if(!images.has(z))images.set(z,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{images.delete(z);reject(new Error('mapa'));};im.src=window.DATA.map.floors[z];}));
    return images.get(z);
  }
  window.paintQuestMiniMap = async function(canvas,id,index) {
    const s=routes[id]?.stages[index];if(!s||!canvas)return;
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,p=s.marker||s.points.at(-1),points=[...s.points,p];
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    const x=(Math.min(...xs)+Math.max(...xs))/2,y=(Math.min(...ys)+Math.max(...ys))/2;
    const scale=Math.min(8,(w-100)/Math.max(50,Math.max(...xs)-Math.min(...xs)),(h-90)/Math.max(34,Math.max(...ys)-Math.min(...ys)));
    const project=p=>[(p[0]-x)*scale+w/2,(p[1]-y)*scale+h/2];
    ctx.fillStyle='#091012';ctx.fillRect(0,0,w,h);
    try {
      const im=await floorImage(s.floor);if(!canvas.isConnected)return;
      const [bx,by,bw,bh]=window.DATA.map.bounds;ctx.imageSmoothingEnabled=false;
      ctx.drawImage(im,(bx-x)*scale+w/2,(by-y)*scale+h/2,bw*scale,bh*scale);
      if(s.points.length>1){ctx.lineJoin='round';ctx.lineWidth=7;ctx.strokeStyle='#071813';ctx.beginPath();s.points.forEach((p,i)=>i?ctx.lineTo(...project(p)):ctx.moveTo(...project(p)));ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#ffe29a';ctx.stroke();if(typeof paintQuestPath==='function')paintQuestPath(ctx,s.points.map(project),true);}
      const [px,py]=project(p);ctx.beginPath();ctx.arc(px,py,13,0,Math.PI*2);ctx.fillStyle='#22567a';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#ffe29a';ctx.stroke();
      ctx.font='bold 15px Arial';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(index+1,px,py+5);
      ctx.fillStyle='#081414ed';ctx.fillRect(0,0,w,32);ctx.textAlign='left';ctx.fillStyle='#ffe29a';ctx.fillText(floor(s.floor)+' · '+p.join(', '),12,22);ctx.textAlign='right';ctx.fillText('N ↑',w-12,22);
    } catch {ctx.fillStyle='#f3dfb4';ctx.font='16px Arial';ctx.textAlign='center';ctx.fillText('Mapa indisponível. Use a coordenada ou o mapa completo.',w/2,h/2);}
  };
  window.bindQuestGuideDetails = function(root,id) {
    root.querySelectorAll('[data-copy-quest-command]').forEach(button=>button.onclick=async()=>{
      const status=button.closest('.guide-dialogue').querySelector('.guide-copy-status');
      try {if(!navigator.clipboard?.writeText)throw new Error('clipboard');await navigator.clipboard.writeText(button.dataset.copyQuestCommand);status.textContent='Copiado: '+button.dataset.copyQuestCommand;}
      catch {status.textContent='Não foi possível copiar. Selecione a fala ao lado e copie manualmente.';}
    });
    root.querySelectorAll('[data-open-quest-stage]').forEach(button=>button.onclick=()=>openQuestRoute(button.dataset.guideQuest,Number(button.dataset.openQuestStage)));
    root.querySelectorAll('[data-guide-stage]').forEach(detail=>detail.addEventListener('toggle',()=>{
      if(detail.open)window.paintQuestMiniMap(detail.querySelector('canvas'),id,Number(detail.dataset.guideStage));
    }));
  };
})();
