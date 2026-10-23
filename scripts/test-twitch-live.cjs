'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),events={},intervals=[],players=[],scripts=[];
for(const suffix of ['', '-kingstwv'])for(const id of ['community-live','twitch-player','twitch-mobile-note','twitch-status','twitch-live-banner'])elements.set(id+suffix,{hidden:false,dataset:{},parentElement:{clientWidth:400},frame:null,replaceChildren(){this.frame=null;},querySelector(){return this.frame;}});
const badges=[{dataset:{},hidden:true},{dataset:{twitchLiveBadge:'kingstwv'},hidden:true}];
const document={hidden:false,getElementById:id=>elements.get(id),querySelectorAll:()=>badges,addEventListener:(type,fn)=>(events[type]??=[]).push(fn),createElement:()=>({}),head:{appendChild:script=>scripts.push(script)}};
const location={hostname:'tibiacommand74.com',hash:'#inicio'};
const window={addEventListener:(type,fn)=>(events[type]??=[]).push(fn)};
const env={window,document,location,setTimeout:()=>1,clearTimeout(){},setInterval:fn=>intervals.push(fn)};vm.createContext(env);
vm.runInContext(fs.readFileSync('public/twitch-live.js','utf8'),env);
assert.equal(scripts.length,1,'One shared Twitch SDK');
function Player(id,options){this.id=id;this.options=options;this.listeners={};this.addEventListener=(event,fn)=>this.listeners[event]=fn;elements.get(id).frame={};players.push(this);}
Object.assign(Player,{ONLINE:'online',OFFLINE:'offline',ENDED:'ended'});env.Twitch=window.Twitch={Player};scripts[0].onload();
assert.equal(players.length,2);assert.deepEqual(players.map(p=>p.options.channel),['kingninhow','kingstwv']);
for(const p of players){assert.equal(p.options.autoplay,false);assert.equal(p.options.muted,true);assert.equal(p.options.parent[0],location.hostname);}
players[1].listeners.online();assert.equal(elements.get('community-live-kingstwv').dataset.liveState,'online');assert.equal(badges[1].hidden,false);assert.equal(badges[0].hidden,true);assert.equal(elements.get('twitch-live-banner-kingstwv').hidden,false);assert.equal(elements.get('twitch-live-banner').hidden,true);
players[0].listeners.online();players[1].listeners.offline();assert.equal(badges[0].hidden,false);assert.equal(badges[1].hidden,true);
intervals.forEach(fn=>fn());assert.equal(players.filter(p=>p.options.channel==='kingninhow').length,1,'Do not interrupt confirmed live');assert.equal(players.filter(p=>p.options.channel==='kingstwv').length,2);
location.hash='#quests';events.hashchange.forEach(fn=>fn());assert(elements.get('community-live').hidden);assert(elements.get('community-live-kingstwv').hidden);
location.hash='#inicio';for(const suffix of ['', '-kingstwv'])elements.get('twitch-player'+suffix).parentElement.clientWidth=320;events.hashchange.forEach(fn=>fn());for(const suffix of ['', '-kingstwv']){assert(elements.get('twitch-player'+suffix).hidden);assert.equal(elements.get('twitch-mobile-note'+suffix).hidden,false);}
const html=fs.readFileSync('public/index.html','utf8');for(const channel of ['kingninhow','kingstwv'])assert(html.includes('https://www.twitch.tv/'+channel));assert(html.includes('twitch-live.js?v=20261023-streamers'));
console.log('PASS: two Twitch channels, independent live status/banners, one SDK, muted/no autoplay, live continuity, home navigation and mobile fallback');
