'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
let handler,mode='good',calls=[];
const env={Deno:{env:{get:k=>k==='SUPABASE_URL'?'https://auth.example':'server-key'},serve:f=>handler=f},Request,Response,AbortSignal,Set,Number,Error,fetch:async(url,options)=>{calls.push([url,options]);if(url.endsWith('/auth/v1/user'))return Response.json(mode==='unconfirmed'?{id:'member'}:{id:'member',email_confirmed_at:'2026-10-15'},{status:mode==='badtoken'?401:200});if(url.endsWith('community_presence_touch'))return new Response(null,{status:204});return Response.json({registered:2,online:1});}};
vm.createContext(env);vm.runInContext(fs.readFileSync('supabase/functions/community-stats/index.ts','utf8'),env);
const endpoint='https://edge.example/community-stats';
let r=await handler(new Request(endpoint));assert.equal(r.status,200);assert.deepEqual(await r.json(),{registered:2,online:1});
r=await handler(new Request(endpoint,{method:'POST'}));assert.equal(r.status,401);
r=await handler(new Request(endpoint,{headers:{Origin:'https://evil.example'}}));assert.equal(r.status,403);
for(mode of ['badtoken','unconfirmed']){r=await handler(new Request(endpoint,{method:'POST',headers:{authorization:'Bearer fake'}}));assert.equal(r.status,401);}
mode='good';calls=[];r=await handler(new Request(endpoint,{method:'POST',headers:{authorization:'Bearer valid'},body:'{"user_id":"someone-else"}'}));assert.equal(r.status,200);assert.equal(calls[1][1].headers.authorization,'Bearer valid');assert.equal(calls[1][1].body,'{}');
let clock=100000,posts=0,gets=0,fail=false,token='valid';const events={},docEvents={},registered={},online={},status={};
const document={visibilityState:'visible',addEventListener:(n,f)=>docEvents[n]=f,querySelectorAll:s=>s==='[data-members-registered]'?[registered]:s==='[data-members-online]'?[online]:s==='[data-members-status]'?[status]:[registered,online]};
const front={document,window:{CommunityAuth:{token:async()=>token},addEventListener:(n,f)=>events[n]=f},Date:{now:()=>clock},AbortSignal,Number,Error,setInterval:f=>events.tick=f,fetch:async(u,o)=>{if(o.method==='POST'){posts++;return {ok:true};}gets++;return {ok:!fail,json:async()=>({registered:2,online:1})};}};
vm.createContext(front);vm.runInContext(fs.readFileSync('public/community-stats.js','utf8'),front);
const flush=()=>new Promise(r=>setImmediate(r));await flush();await flush();assert.equal(registered.textContent,'2');assert.equal(online.textContent,'1');assert.equal(posts,1);
events.pointerdown();await flush();assert.equal(posts,1);clock+=61000;events.tick();await flush();assert.equal(posts,1,'Inactive member does not refresh presence');events.keydown();await flush();assert.equal(posts,2);
document.visibilityState='hidden';clock+=61000;const before=gets;events.tick();await flush();assert.equal(gets,before,'Background tab pauses');
document.visibilityState='visible';fail=true;docEvents.visibilitychange();await flush();assert.equal(registered.textContent,'—');assert.equal(online.textContent,'—');
const beforeLogout=posts;fail=false;token=null;clock+=61000;events.pointerdown();await flush();assert.equal(posts,beforeLogout,'Logged-out visitors never send presence');
console.log('PASS: public totals; JWT/confirmation; no identity spoofing; throttle, inactivity, hidden tabs and failure state');
})().catch(e=>{console.error(e);process.exit(1);});
