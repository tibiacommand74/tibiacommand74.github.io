'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 let attempts=0,clientCreated=0;
 const auth={onAuthStateChange(){},initialize:async()=>{},getUser:async()=>({data:{user:{id:'u',user_metadata:{}}}})};
 const env={window:{supabase:{createClient(){clientCreated++;return{auth}}}},location:{hash:'',origin:'https://tibiacommand74.com'},URLSearchParams,AbortSignal,setTimeout,
  document:{createElement:()=>({}),head:{append(script){queueMicrotask(()=>script.onload())}}},
  fetch:async(url,options)=>{assert(options.signal instanceof AbortSignal,'Account config must have a timeout');attempts++;if(attempts===1)throw Error('Network unavailable');return{ok:true,json:async()=>({configured:true,url:'https://example.invalid',publishableKey:'test-public'})}}};
 vm.createContext(env);vm.runInContext(fs.readFileSync('public/community-auth.js','utf8'),env);
 assert.equal((await env.window.CommunityAuth.ready()).configured,false);
 assert.equal((await env.window.CommunityAuth.ready()).configured,true,'A temporary failure must allow retry without reload');
 assert.equal((await env.window.CommunityAuth.journalIdentity()).id,'u');assert.equal(attempts,2);assert.equal(clientCreated,1);
 console.log('PASS: account config timeout, recovery after temporary failure and a single initialized client');
})().catch(error=>{console.error(error);process.exit(1)});
