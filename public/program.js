'use strict';
function renderProgram(el){
 const screenshots=[
  ['overview','Visão geral','Seu resumo de personagens, metas e resultados.'],
  ['characters','Personagens','Level, skills e Magic Level de cada personagem.'],
  ['map','Mapa de hunts','Respawns, andares e seus locais de caça.'],
  ['calculators','Calculadoras','XP, skills e Magic Level em painéis separados.'],
  ['history','Histórico','Registros para acompanhar a evolução dos seus chars.']
 ];
 const download='https://github.com/tibiacommand74/tibiacommand74.github.io/releases/download/v0.35.1/Tibia-Command-Desktop-Setup-0.35.1.exe';
 el.innerHTML=`<div class="program-simple">
 <section class="program-intro" aria-labelledby="program-title">
  <div class="program-heading"><img src="assets/program-logo.webp" alt="Tibia Command 7.4" width="100" height="100"><div><p class="eyebrow">SEU COMPANHEIRO FORA DO JOGO</p><h2 id="program-title">Tibia Command Desktop</h2><p>Organize seus personagens, quests e hunts em um só programa.</p></div></div>
  <div class="program-install" id="program-download"><a class="action" href="${download}">↓ Baixar para Windows</a><small>Windows 10 / 11 · 64 bits · v0.35.1 · 131,4 MB</small></div>
  <div class="program-highlights"><span>Personagens e quests</span><span>Hunts e evolução</span><span>Calculadoras 7.4</span><span>Dados e backups locais</span></div>
  <div class="program-download-counter"><div><strong data-program-download-count aria-live="polite">—</strong><span> downloads do programa</span></div><small data-program-download-status>Consultando downloads…</small></div>
 </section>
 <section class="program-gallery" aria-labelledby="program-gallery-title">
  <div class="program-gallery-heading"><h3 id="program-gallery-title">Conheça o programa</h3><span>Selecione uma tela para ver</span></div>
  <div class="program-screen-nav" role="group" aria-label="Telas do programa">${screenshots.map(([id,label],i)=>`<button type="button" data-program-screen="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</div>
  <figure class="program-screen"><button type="button" class="program-screen-open" aria-label="Ampliar tela: Visão geral"><img id="program-screen-image" src="assets/program/overview.webp" alt="Tela de visão geral do Tibia Command Desktop" width="1877" height="971" fetchpriority="high"><span>⤢ Ampliar imagem</span></button><figcaption><strong id="program-screen-title">Visão geral</strong><span id="program-screen-caption">${screenshots[0][2]}</span></figcaption></figure>
 </section>
 <section class="program-notes"><div><h3>Instalação simples</h3><p>Baixe o instalador, instale e abra pelo atalho. O programa tem sua própria janela.</p><a class="program-release-link" href="https://github.com/tibiacommand74/tibiacommand74.github.io/releases/tag/v0.35.1" target="_blank" rel="noopener noreferrer">Detalhes da versão</a></div><div><h3>Seus dados ficam com você</h3><p>Os cadastros ficam no computador. Exporte um backup antes de atualizar e guarde uma cópia fora dele.</p><p class="program-footnote">Quests e rates podem ser ajustados conforme seu servidor.</p></div></section>
 <dialog class="program-preview" aria-labelledby="program-preview-title"><div class="program-preview-heading"><strong id="program-preview-title">Visão geral</strong><button type="button" class="program-preview-close" aria-label="Fechar imagem">×</button></div><img alt="Tela ampliada do programa"><p>Use Esc ou o botão × para fechar.</p></dialog>
 </div>`;
 const main=el.querySelector('#program-screen-image'),title=el.querySelector('#program-screen-title'),caption=el.querySelector('#program-screen-caption'),open=el.querySelector('.program-screen-open'),dialog=el.querySelector('.program-preview');
 let selected=0;
 el.querySelectorAll('[data-program-screen]').forEach(button=>button.onclick=()=>{
  selected=Number(button.dataset.programScreen);
  const [id,label,description]=screenshots[selected];
  main.src=`assets/program/${id}.webp`;main.alt=`Tela de ${label.toLowerCase()} do Tibia Command Desktop`;
  title.textContent=label;caption.textContent=description;open.setAttribute('aria-label',`Ampliar tela: ${label}`);
  el.querySelectorAll('[data-program-screen]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 });
 open.onclick=()=>{
  const [id,label]=screenshots[selected];dialog.querySelector('img').src=`assets/program/${id}.webp`;dialog.querySelector('img').alt=`Tela ampliada: ${label}`;dialog.querySelector('#program-preview-title').textContent=label;dialog.showModal();
 };
 dialog.querySelector('.program-preview-close').onclick=()=>dialog.close();
 window.refreshProgramDownloads?.(el);
}
