'use strict';
(()=>{
 const LEGACY='tc74-explorer-journal-v1';
 let signedIn=false,context=null,records={},dirty={},busy=false,timer=null,epoch=0,message='Entre na comunidade para abrir seu diário.',initializing=null;
 const safeRead=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}');}catch{return {};}};
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=c=>'tc74-journal-account:'+JSON.stringify([c.id,c.character,c.server]);
 function visibility(){document.querySelectorAll('[data-page="explorador"][data-hub-tab="journal"],a[href="#explorador/journal"]').forEach(el=>el.hidden=!signedIn);}
 function notify(){visibility();document.querySelectorAll('[data-journal-sync-status]').forEach(el=>el.textContent=message);}
 function persist(){if(!context)return;localStorage.setItem(key(context),JSON.stringify({records,dirty}));}
 function clear(){epoch++;clearTimeout(timer);context=null;signedIn=false;records={};dirty={};message='Entre na comunidade para abrir seu diário.';notify();}
 function refresh(){if(location.hash==='#explorador/journal')window.renderClassicHub?.(document.querySelector('#content'));}
 async function activate(character,server){
  const user=await CommunityAuth.journalIdentity();if(!user){clear();return false;}signedIn=true;
  character=String(character||'').trim().toLowerCase();server=String(server||'').trim().toLowerCase();
  if(character.length<2||character.length>40||server.length<2||server.length>60)throw Error('Informe personagem (2 a 40 caracteres) e servidor (2 a 60).');
  epoch++;clearTimeout(timer);context={id:user.id,character,server};const cached=object(safeRead(key(context)));records=object(cached.records);dirty=object(cached.dirty);
  try{localStorage.setItem('tc74-journal-selection:'+user.id,JSON.stringify({character,server}));}catch{}
  message='Carregando diário da conta…';notify();await sync();return true;
 }
 async function init(){
  if(initializing)return initializing;
  initializing=(async()=>{const user=await CommunityAuth.journalIdentity();if(!user){clear();return;}signedIn=true;visibility();
   if(context?.id===user.id)return;
   const selected=object(safeRead('tc74-journal-selection:'+user.id)),profile=user.profile||{};
   const character=selected.character||profile.character,server=selected.server||profile.server;
   if(character&&server)await activate(character,server);
   else{clear();signedIn=true;visibility();message='Escolha personagem e servidor para usar o diário da conta.';}
  })().catch(()=>{message='Não foi possível conectar à conta. O diário local permanece disponível.';notify();}).finally(()=>{initializing=null;});return initializing;
 }
 async function sync(){
  if(!context)return;if(busy){clearTimeout(timer);timer=setTimeout(sync,1200);return;}
  const captured={...context},version=epoch;busy=true;message='Sincronizando…';notify();
  try{
   const snapshot=Object.entries(dirty).map(([k,v])=>[k,{...v}]);
   await CommunityAuth.journalSave(captured.id,captured.character,captured.server,snapshot);
   if(version!==epoch)return;
   for(const [k,v] of snapshot)if(JSON.stringify(dirty[k])===JSON.stringify(v))delete dirty[k];
   const remote=await CommunityAuth.journalLoad(captured.character,captured.server);
   if(version!==epoch)return;
   for(const row of remote)if(!Object.hasOwn(dirty,row.entry_key))records[row.entry_key]=row.record;
   persist();message=Object.keys(dirty).length?'Novas alterações aguardam sincronização.':'Sincronizado com sua conta.';
   if(Object.keys(dirty).length){clearTimeout(timer);timer=setTimeout(sync,1200);}
  }catch(error){if(version===epoch)message=error.message||'Sem conexão. Tente sincronizar novamente.';}
  finally{busy=false;notify();}
 }
 function write(all){
  if(!context)throw Error('Entre na conta e escolha seu personagem.');
  for(const [k,v] of Object.entries(all))if(JSON.stringify(records[k])!==JSON.stringify(v))dirty[k]=v;
  records=all;persist();message='Salvo neste navegador; sincronização pendente.';notify();clearTimeout(timer);timer=setTimeout(sync,1200);
 }
 function markup(){if(!signedIn)return '<section class="explorer-journal-box"><h4>Entre para usar seu diário</h4><p>Esta ferramenta é exclusiva para quem tem conta na comunidade.</p><a class="action" href="#classificados" data-community-login>Entrar ou criar conta</a></section>';return `<section class="explorer-journal-box" aria-label="Conta e personagem do diário"><p data-journal-sync-status role="status">${esc(message)}</p><p>${context?'<strong>'+esc(context.character)+' · '+esc(context.server)+'</strong> — diário privado da sua conta.':'O diário é uma ferramenta exclusiva da comunidade. Entre na sua conta para guardar o progresso e continuar em outros dispositivos.'}</p><form data-journal-character class="explorer-fields"><label>Personagem<input name="character" required minlength="2" maxlength="40" value="${esc(context?.character||'')}" placeholder="Nome do personagem" autocomplete="off"></label><label>Servidor<input name="server" required minlength="2" maxlength="60" value="${esc(context?.server||'')}" list="journal-servers" placeholder="Ex.: Mythera"><datalist id="journal-servers"><option value="Mythera"><option value="Miracle"><option value="DeusOLD"><option value="Exordion Aegis"><option value="Exordion Legacy"><option value="Exordion Bravora"></datalist></label><button class="action" type="submit">Abrir diário do personagem</button></form><div class="explorer-actions"><a class="action secondary" href="#classificados" data-community-login>Entrar ou gerenciar conta</a>${context?'<button type="button" class="action secondary" data-journal-sync>Sincronizar agora</button><button type="button" class="action secondary" data-journal-import-local>Importar diário antigo deste navegador</button>':''}</div><small>A sincronização guarda seus registros na conta. O progresso continua manual e não acompanha o jogo.</small></section>`;}
 function bind(root){
  const form=root.querySelector('[data-journal-character]');if(!form)return;
  form.onsubmit=async ev=>{ev.preventDefault();const b=form.querySelector('button');b.disabled=true;try{if(!await activate(form.elements.character.value,form.elements.server.value))message='Entre nos Classificados e depois volte ao diário.';refresh();}catch(error){message=error.message;notify();}finally{b.disabled=false;}};
  root.querySelector('[data-journal-sync]')?.addEventListener('click',async()=>{await sync();refresh();});
  root.querySelector('[data-journal-local]')?.addEventListener('click',()=>{clear();refresh();});
  root.querySelector('[data-journal-import-local]')?.addEventListener('click',()=>{
   const old=object(safeRead(LEGACY));let count=0;
   for(const [k,v] of Object.entries(old)){if(Object.hasOwn(records,k))continue;const n=k.indexOf(':');if(n<1)continue;if(window.ClassicExplorer?.saveRecord(k.slice(0,n),k.slice(n+1),v))count++;}
   message=count+' registros antigos copiados. Registros existentes do personagem foram preservados.';notify();refresh();
  });
 }
 window.JournalAccount={signedIn:()=>signedIn,read:()=>context?{...records}:{},write,markup,bind,init,context:()=>context,saveMessage:()=>context?'Salvo neste navegador; sincronizando com sua conta.':'Entre na conta para salvar.'};
 window.addEventListener('tc74-auth-change',()=>{clear();init().then(refresh);});
 window.addEventListener('online',()=>{if(context)sync();});
 window.addEventListener('hashchange',()=>{if(location.hash==='#explorador/journal')init().then(refresh);});
 new MutationObserver(visibility).observe(document.body,{childList:true,subtree:true});
 init().then(()=>{visibility();refresh();});
})();
