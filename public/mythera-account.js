'use strict';
(()=>{
 const original=window.renderCommunityAccount;
 const accountPages=[
 ['inicio','Visão geral','#conta','Sua jornada em um só lugar.'],
 ['personagem','Meu personagem','#conta/personagem','Ficha, vocação e objetivo de level.'],
 ['evolucao','Evolução','#conta/personagem/evolucao','Registre level, XP e skills.'],
 ['anotacoes','Anotações','#conta/personagem/anotacoes','Ideias, lembretes e planos pessoais.'],
 ['atividades','Atividades e recargas','#conta/atividades','Bosses, rituais e abates manuais.'],
 ['metalevel','Meta de level','#conta/personagem/metalevel','Planeje sua próxima conquista.'],
 ['runas','Planos de runas','#conta/personagem/runas','Organize sua produção de runas.'],
 ['diario','Diário de quests','#conta/diario','Acompanhe quests e restaure backups.'],
 ['favoritos','Favoritos','#conta/favoritos','Suas referências salvas.'],['hunts','Minhas hunts','#conta/hunts','Histórico e rendimento.'],['timers','Timers','#conta/timers','Alarmes e rotina.'],['perfil','Meu perfil','#conta/perfil','Perfil e contato público.']
 ];
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let accountGeneration=0;
 window.renderCommunityAccount=async root=>{
 const generation=++accountGeneration;const parts=location.hash.split('/'),key=parts[1]==='personagem'?(parts[2]||'personagem'):parts[1]||'inicio',pages=accountPages.filter(p=>p[0]!=='atividades'||window.ServerContext.isMythera),active=pages.find(p=>p[0]===key)||pages[0];
 if(!window.ServerContext.isMythera||['hunts','timers','perfil'].includes(key)||!accountPages.some(p=>p[0]===key))return original(root);let user;try{user=await window.CommunityAuth.journalIdentity();}catch{return original(root);}if(generation!==accountGeneration||!root.isConnected||!location.hash.startsWith('#conta'))return;if(!user)return original(root);root.dataset.accountUser=user.id;root.classList.add('account-page');root.innerHTML=`<section class="lab-account-shell"><div class="section-head guide-hub-heading"><div><p class="eyebrow">TIBIA COMMAND · ÁREA PESSOAL</p><h2>Minha conta</h2><p>Seu personagem, seus planos e sua evolução.</p></div></div><div class="guide-hub-layout"><aside class="guide-hub-sidebar"><p class="eyebrow">MINHA JORNADA</p><nav class="guide-hub-nav" aria-label="Minha conta">${pages.map(p=>`<a href="${p[2]}" ${p[0]===active[0]?'aria-current="page"':''}>${p[1]} <span aria-hidden="true">›</span></a>`).join('')}</nav><p class="lab-account-scope">${escape(window.ServerContext.name)}<br>Sua conta da comunidade</p></aside><section class="guide-hub-panel"><div class="explorer-panel-heading"><h3>${active[1]}</h3><p>${active[3]}</p></div><div data-lab-character></div></section></div></section>`;
 const panel=root.querySelector('[data-lab-character]');
 await window.JournalAccount?.init();if(generation!==accountGeneration||root.isConnected===false)return;
 if(active[0]==='atividades'){if(window.JournalAccount?.context()?.id!==user.id){panel.innerHTML='<p>Selecione seu personagem do Mythera para registrar atividades.</p><a class="action" href="#conta/personagem">Selecionar personagem</a>';return;}window.MytheraWiki.renderRecords(panel);const character=window.JournalAccount?.context()?.character;if(character)panel.querySelectorAll('input[name="character"]').forEach(input=>input.value=character);return;}
 if(active[0]==='inicio'){panel.innerHTML=`${window.CharacterTools.summaryMarkup()}<div class="lab-account-shortcuts">${pages.filter(p=>['personagem','evolucao','anotacoes','atividades','diario','favoritos'].includes(p[0])).map(p=>`<a class="catalog-card library-card" href="${p[2]}"><h3>${p[1]}</h3><p class="library-card-note">${p[3]}</p><span class="library-card-footer">Abrir <span aria-hidden="true">→</span></span></a>`).join('')}</div><p class="lab-account-scope">Escolha “Meu personagem” para trocar o personagem em uso. Os registros são manuais e não consultam o jogo.</p>`;return;}
 if(active[0]==='diario'){window.renderCommunityJournal(panel);return;}
 if(active[0]==='favoritos'){window.renderCommunityFavorites(panel);return;}
 await window.CharacterTools.render(panel,{identity:user});
 };

})();
