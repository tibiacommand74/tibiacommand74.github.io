'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 let attempts=0,clientCreated=0;const queries=[],upserts=[],rows=Array.from({length:1001},(_,i)=>({entry_key:'key:'+String(i).padStart(4,'0'),record:{note:'private'},character:i===1000?'other':'knight',server:'mythera'}));
 const from=table=>{const q={table,filters:[],orders:[],columns:''};queries.push(q);return{select(columns){q.columns=columns;return this;},eq(k,v){q.filters.push([k,v]);return this;},order(k){q.orders.push(k);return this;},async range(start,end){q.range=[start,end];return{data:rows.slice(start,end+1),error:null};},async upsert(batch,options){upserts.push({batch,options});return{error:null};}};};
 const auth={onAuthStateChange(){},initialize:async()=>{},getUser:async()=>({data:{user:{id:'u',user_metadata:{}}}})};
 const env={window:{supabase:{createClient(){clientCreated++;return{auth,from}}}},location:{hash:'',origin:'https://tibiacommand74.com'},URLSearchParams,AbortSignal,setTimeout,
  document:{createElement:()=>({}),head:{append(script){queueMicrotask(()=>script.onload())}}},
  fetch:async(url,options)=>{assert(options.signal instanceof AbortSignal,'Account config must have a timeout');attempts++;if(attempts===1)throw Error('Network unavailable');return{ok:true,json:async()=>({configured:true,url:'https://example.invalid',publishableKey:'test-public'})}}};
 vm.createContext(env);vm.runInContext(fs.readFileSync('public/community-auth.js','utf8'),env);
 assert.equal((await env.window.CommunityAuth.ready()).configured,false);
 assert.equal((await env.window.CommunityAuth.ready()).configured,true,'A temporary failure must allow retry without reload');
 assert.equal((await env.window.CommunityAuth.journalIdentity()).id,'u');assert.equal(attempts,2);assert.equal(clientCreated,1);
 const loaded=await env.window.CommunityAuth.journalLoad('knight','mythera');assert.equal(loaded.length,1001);assert.equal(queries.length,2);assert(queries.every(q=>q.table==='community_journal'&&q.filters.some(([k,v])=>k==='user_id'&&v==='u')&&q.filters.some(([k,v])=>k==='character'&&v==='knight')&&q.filters.some(([k,v])=>k==='server'&&v==='mythera')));assert.equal(queries[1].range[0],1000);
 const characters=await env.window.CommunityAuth.journalCharacters();assert.equal(characters.length,2);assert.equal(characters[1].character,'other');
 await env.window.CommunityAuth.journalSave('u','knight','mythera',rows.slice(0,250).map(r=>[r.entry_key,r.record]));assert.deepEqual(upserts.map(r=>r.batch.length),[100,100,50]);assert(upserts.every(r=>r.batch.every(v=>v.user_id==='u'&&v.character==='knight'&&v.server==='mythera')));await assert.rejects(()=>env.window.CommunityAuth.journalSave('someone-else','knight','mythera',[['key:x',{}]]));
 console.log('PASS: account config timeout, recovery after temporary failure and a single initialized client');
})().catch(error=>{console.error(error);process.exit(1)});
