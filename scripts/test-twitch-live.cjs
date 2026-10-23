'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const events={},players=[],scripts=[],nodes=new Map();
 const node=()=>({classList:{toggle(){}},hidden:false,dataset:{},attrs:{},events:{},parentElement:{clientWidth:700},frame:null,setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.events[k]=fn;},replaceChildren(){this.frame=null;},querySelector(){return this.frame;},focus(){this.focused=true;}});
 for(const id of ['community-live','twitch-watch-panel','twitch-player','twitch-status','twitch-mobile-note','twitch-mobile-link','twitch-close-player'])nodes.set(id,node());
 nodes.get('twitch-watch-panel').hidden=true;
 const buttons=['kingninhow','kingstwv'].map(channel=>Object.assign(node(),{dataset:{watchStream:channel}}));
 const badges=['kingninhow','kingstwv'].map(channel=>({dataset:{twitchLiveBadge:channel},hidden:true}));
 const statuses=Object.fromEntries(buttons.map(b=>[b.dataset.watchStream,node()]));
 nodes.get('community-live').querySelectorAll=()=>buttons;nodes.get('community-live').querySelector=selector=>selector.includes('data-streamer')?null:statuses[selector.match(/="([^"]+)"/)[1]];
 const document={addEventListener(){},hidden:false,getElementById:id=>nodes.get(id),querySelectorAll:()=>badges,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
 const location={hash:'#inicio',hostname:'tibiacommand74.com'};const window={setTimeout,clearTimeout,setInterval(){},addEventListener:(key,fn)=>(events[key]??=[]).push(fn)};
 const env={document,window,location,AbortController,fetch:async url=>({ok:true,text:async()=>url.endsWith('kingstwv')?'50 minutes, 11 seconds':'kingninhow is offline'})};vm.createContext(env);vm.runInContext(fs.readFileSync('public/twitch-live.js','utf8'),env);
 await new Promise(setImmediate);assert.equal(badges[1].hidden,false,'Background presence marks the live partner before player opens');assert.equal(badges[0].hidden,true);assert.equal(scripts.length,0,'No embeds or SDK loaded before choosing a stream');assert.equal(players.length,0);assert(nodes.get('twitch-watch-panel').hidden);
 buttons[0].events.click();buttons[1].events.click();assert.equal(scripts.length,1,'One SDK even when switching during loading');
 function Player(id,options){this.options=options;this.listeners={};this.addEventListener=(k,fn)=>this.listeners[k]=fn;this.pause=()=>this.paused=true;nodes.get(id).frame={};players.push(this);}
 Object.assign(Player,{ONLINE:'online',OFFLINE:'offline',ENDED:'ended'});window.Twitch={Player};scripts[0].onload();await new Promise(setImmediate);
 assert.equal(players.length,1);assert.equal(players[0].options.channel,'kingstwv');assert.equal(players[0].options.autoplay,false);assert.equal(players[0].options.muted,true);assert.equal(players[0].options.parent[0],location.hostname);
 players[0].listeners.online();assert.equal(badges[1].hidden,false);assert.equal(badges[0].hidden,true);assert.equal(buttons[1].attrs['aria-expanded'],'true');
 buttons[0].events.click();await new Promise(setImmediate);assert.equal(players.length,2);assert.equal(players[1].options.channel,'kingninhow');assert(players[0].paused);assert.equal(badges[1].hidden,false,'Presence survives player switching');
 players[0].listeners.online();assert.equal(badges[1].hidden,false,'Ignore old player events after switching');players[1].listeners.online();assert.equal(badges[0].hidden,false);
 nodes.get('twitch-close-player').events.click();assert(nodes.get('twitch-watch-panel').hidden);assert(players[1].paused);assert.equal(nodes.get('twitch-player').frame,null);assert(buttons[0].focused);
 nodes.get('twitch-player').parentElement.clientWidth=320;buttons[1].events.click();await new Promise(setImmediate);assert.equal(players.length,2,'Narrow screen uses direct Twitch link');assert.equal(nodes.get('twitch-mobile-note').hidden,false);assert.equal(nodes.get('twitch-mobile-link').href,'https://www.twitch.tv/kingstwv');
 location.hash='#quests';events.hashchange.forEach(fn=>fn());assert(nodes.get('community-live').hidden);assert(nodes.get('twitch-watch-panel').hidden);location.hash='#inicio';events.hashchange.forEach(fn=>fn());assert.equal(nodes.get('community-live').hidden,false);
 const html=fs.readFileSync('public/index.html','utf8');assert.equal((html.match(/id="community-live"/g)||[]).length,1);assert(!html.includes('id="community-live-kingstwv"'));assert(html.includes('id="twitch-watch-panel" class="twitch-watch-panel" hidden'));for(const c of ['kingninhow','kingstwv'])assert(html.includes('data-watch-stream="'+c+'"'));for(const f of ['app','servers'])assert(fs.readFileSync('public/'+f+'.js','utf8').includes("getElementById('community-live')"),'Both channels move as one unit in the shared classic/Mythera home');
 assert(html.indexOf('id="community-live"')<html.indexOf('class="intro home-hero"'),'Lives appear before the hero');assert(html.includes('Acompanhe<br>nossas lives.'));assert(html.includes('aria-label="Twitch"'));assert.equal((html.match(/profile_image-300x300.png/g)||[]).length,2);
 console.log('PASS: single compact panel, both channels, lazy shared player, loading races, independent status, close/pause, mobile fallback and shared home relocation');
})().catch(error=>{console.error(error);process.exitCode=1;});
