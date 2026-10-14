'use strict';
(()=>{
 const ID='G-1KZLJG32S3',KEY='tc74-analytics-consent',EXCLUDED='tc74-exclude-visits';
 let ready=false,lastPage='',choice=null;
 const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
 const internal=()=>read(EXCLUDED)==='1'||new URL(location.href).searchParams.get('interno')==='1';
 const allowed=()=>choice==='accepted'&&!internal();
 function cleanURL(raw,withCampaign=false){
  try{const u=new URL(raw,location.href);if(!/^https?:$/.test(u.protocol))return '';
   const out=new URL(u.origin+u.pathname);
   if(u.origin===location.origin&&/^#(?:[a-z-]+)(?:\/[a-z0-9-]+){0,3}$/i.test(u.hash))out.hash=u.hash;
   if(withCampaign)for(const k of ['utm_source','utm_medium','utm_campaign','utm_content']){const v=u.searchParams.get(k);if(v&&/^[a-z0-9_.-]{1,100}$/i.test(v))out.searchParams.set(k,v);}
   return out.href;
  }catch{return '';}
 }
 function pageTitle(){
  if(!/^\/(?:index\.html)?$/.test(location.pathname))return document.title;
  const parts=location.hash.slice(1).split('/');
  const titles={inicio:'Início',iniciantes:'Iniciantes',quests:'Quests',hunts:'Hunts',mapa:'Mapa',criaturas:'Criaturas',biblioteca:'Biblioteca',servidores:'Servidores',classificados:'Classificados',feedback:'Opiniões e sugestões',calculadora:'Calculadora de XP, skills e magic level',mana:'Mana e runas',equipamentos:'Equipamentos',loot:'Lootbag',downloads:'Downloads',programa:'Programa para Windows',sobre:'Sobre e contato'};
  const catalog={itens:'Itens',magias:'Magias e runas',npcs:'NPCs'};
  const explorer={journal:'Meu diário',planner:'Planejar quests',search:'Busca geral',keys:'Chaves clássicas',cities:'Cidades',lore:'Livros e mistérios',sets:'Sets clássicos',food:'Comidas'};
  const title=parts[0]==='catalog'?catalog[parts[1]]:parts[0]==='explorador'?explorer[parts[1]]:titles[parts[0]||'inicio'];
  return title?title+' | Tibia Command 7.4':document.title;
 }
 function event(name,params){if(ready&&allowed())window.gtag('event',name,{send_to:ID,...params});}
 function page(){if(!allowed()||!ready)return;const url=cleanURL(location.href,true);if(url===lastPage)return;const ref=lastPage||(document.referrer?new URL(document.referrer).origin:'');lastPage=url;event('page_view',{page_location:url,page_title:pageTitle(),page_referrer:ref});}
 function enable(){
  window['ga-disable-'+ID]=!allowed();if(!allowed())return;
  if(!ready){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
   window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   window.gtag('js',new Date());window.gtag('config',ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanURL(location.href,true),page_referrer:document.referrer?new URL(document.referrer).origin:''});
   const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.append(s);ready=true;
  }else window.gtag('consent','update',{analytics_storage:'granted'});
  page();
 }
 function save(v){choice=v;try{localStorage.setItem(KEY,v);}catch{choice='declined';}banner.remove();if(choice!=='accepted'){window['ga-disable-'+ID]=true;if(ready)window.gtag('consent','update',{analytics_storage:'denied'});for(const c of document.cookie.split(';')){const name=c.split('=')[0].trim();if(/^_ga(?:_|$)/.test(name))for(const domain of ['',location.hostname,'.'+location.hostname])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'');}lastPage='';}enable();}
 const banner=document.createElement('aside');banner.className='analytics-consent';banner.setAttribute('aria-label','Preferências de análise de uso');banner.innerHTML='<p>Ajude a melhorar o Tibia Command! Usamos cookies do Google Analytics para saber como os visitantes chegam e quais páginas mais usam. Você escolhe se quer participar. <a href="/privacidade.html">Privacidade</a></p><div><button type="button" data-analytics-accept>Aceitar</button><button type="button" data-analytics-decline>Recusar</button></div>';
 banner.querySelector('[data-analytics-accept]').onclick=()=>save('accepted');banner.querySelector('[data-analytics-decline]').onclick=()=>save('declined');
 const style=document.createElement('style');style.textContent='.analytics-consent{position:fixed;bottom:12px;left:12px;right:12px;max-width:760px;margin:auto;z-index:10000;padding:16px;background:#162725;color:#eee;border:1px solid #c7ac6c;border-radius:8px;box-shadow:0 8px 30px #0008}.analytics-consent{max-height:calc(100dvh - 24px);overflow-y:auto}.analytics-consent p{margin:0 0 10px}.analytics-consent a{color:#e2c785}.analytics-consent div{display:flex;flex-wrap:wrap;gap:10px}.analytics-consent button,.analytics-preferences{min-height:44px;padding:8px 14px;cursor:pointer}.analytics-consent button{border:1px solid #c7ac6c;background:#263b31;color:#f0e5cc;border-radius:5px}.analytics-consent button:hover{background:#344e41}.analytics-consent button:focus-visible{outline:2px solid #e2c785;outline-offset:3px}';document.head.append(style);
 const preferences=document.createElement('button');preferences.type='button';preferences.className='analytics-preferences';preferences.textContent='Preferências de análise';preferences.onclick=()=>document.body.append(banner);(document.querySelector('footer')||document.body).append(preferences);
 choice=read(KEY);if(!choice&&!internal())document.body.append(banner);enable();
 window.addEventListener('hashchange',()=>setTimeout(page,0));window.addEventListener('tc74-visit-preference',enable);
 window.addEventListener('storage',e=>{if(e.key===KEY){choice=read(KEY);enable();}if(e.key===EXCLUDED)enable();});
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a||!allowed())return;const url=cleanURL(a.href);if(!url)return;const u=new URL(url);if(u.hostname==='www.twitch.tv'&&['/kingninhow','/kingninhow/'].includes(u.pathname.toLowerCase())){const placement=a.closest('#twitch-live-banner')?'live_banner':a.closest('#twitch-mobile-note')?'home_mobile':a.closest('#community-live')?'home_card':'footer';event('streamer_click',{streamer_channel:'kingninhow',placement,pilot_id:'kingninhow_20261014',link_url:'https://www.twitch.tv/kingninhow'});}if(/\.(exe|zip|7z|msi)$/i.test(u.pathname)){event('file_download',{link_url:url,file_name:u.pathname.split('/').pop(),file_extension:u.pathname.split('.').pop().toLowerCase()});}else if(u.origin!==location.origin)event('outbound_click',{link_domain:u.hostname,link_url:url});});
})();
