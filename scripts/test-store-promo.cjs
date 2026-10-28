'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('public/store-promo.js','utf8'),key='tc74-command-store-shown';
function open({at='2026-10-28T22:00:00Z',local=new Map(),session=new Map(),denied=false,blocked=false,hash=''}={}){
 const pending=[],listeners={},buttons={};let observe,shown=0,removed=0,modal,closed=false;
 const storage=(map,fail=false)=>({getItem:k=>{if(fail)throw Error('blocked');return map.get(k)||null;},setItem:(k,v)=>{if(fail)throw Error('blocked');map.set(k,v);}});
 const doc={readyState:'complete',hidden:false,activeElement:null,documentElement:{classList:{add(){},remove(){}}},body:{append(el){modal=el;}},addEventListener(){},removeEventListener(){},querySelectorAll:()=>blocked?[{getClientRects:()=>[{}]}]:[],createElement:()=>({setAttribute(){},querySelector:s=>buttons[s]??={addEventListener:(type,fn)=>listeners[s+type]=fn},addEventListener:(type,fn)=>listeners[type]=fn,showModal(){shown++;},close(){closed=true;listeners.close?.();},remove(){removed++;}})};
 class FixedDate extends Date{constructor(...args){super(...(args.length?args:[at]));}}
 const env={document:doc,window:{addEventListener(){},removeEventListener(){}},HTMLDialogElement:function(){},localStorage:storage(local,denied),sessionStorage:storage(session),Intl,Date:FixedDate,location:{hash},getComputedStyle:()=>({visibility:'visible'}),MutationObserver:class{constructor(fn){observe=fn;}observe(){}disconnect(){}},setTimeout:fn=>{pending.push(fn);return pending.length;},clearTimeout(){}};
 env.HTMLDialogElement.prototype.showModal=()=>{};vm.createContext(env);vm.runInContext(code,env);
 return {tick(){pending.splice(0).forEach(f=>f());},unblock(){blocked=false;observe?.();},get shown(){return shown;},get modal(){return modal;},get removed(){return removed;},get closed(){return closed;},click:s=>listeners[s+'click']?.(),local,session};
}
const shared=new Map();let a=open({local:shared});a.tick();assert.equal(a.shown,1);assert.equal(shared.get(key),'2026-10-28');assert(a.modal.innerHTML.includes('https://command-store.pages.dev/'));assert(a.modal.innerHTML.includes('rel="noopener noreferrer"'));a.click('.store-promo-continue');assert(a.closed&&a.removed===1);
// Frequency is shared by pages and uses the Brazilian day, not UTC midnight.
let b=open({local:shared,at:'2026-10-29T01:30:00Z'});b.tick();assert.equal(b.shown,0);
let c=open({local:shared,at:'2026-10-29T03:01:00Z'});c.tick();assert.equal(c.shown,1);
// Storage denial falls back to the session without breaking the site.
const session=new Map();let d=open({denied:true,session});d.tick();assert.equal(d.shown,1);let e=open({denied:true,session});e.tick();assert.equal(e.shown,0);
// Wait for another visible dialog/consent; do not interrupt the account flow.
let f=open({blocked:true});f.tick();assert.equal(f.shown,0);f.unblock();f.tick();assert.equal(f.shown,1);
let g=open({hash:'#conta'});g.tick();assert.equal(g.shown,0);
for(const file of ['public/index.html','public/quests/crusader-helmet/index.html']){const s=fs.readFileSync(file,'utf8');assert(s.includes('/store-promo.js?v=20261028-command'));assert(s.includes('/store-promo.css?v=20261028-command'));}
assert(fs.readFileSync('public/assets/command-store-crest.svg','utf8').includes('data:image/webp;base64,'));
console.log('PASS: daily frequency across pages and Brazilian midnight, close/return, session fallback, consent/dialog deferral, account exclusion and static-page integration');
