'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require);
(async()=>{
 const disk=new Map(),cloud=new Map();let offline=false,loadFails=false,user={id:'sync-a'},hold=null;
 const key=(id,c,s)=>JSON.stringify([id,c,s]);
 function connect(e){e.CommunityAuth={journalIdentity:async()=>user,journalSave:async(id,c,s,rows)=>{if(offline)throw Error('offline');if(hold){const wait=hold;hold=null;await wait;}const k=key(id,c,s),r=cloud.get(k)||{};for(const [id,v] of rows)r[id]=JSON.parse(JSON.stringify(v));cloud.set(k,r);},journalLoad:async(c,s)=>{if(offline||loadFails)throw Error('load failed');return Object.entries(cloud.get(key(user.id,c,s))||{}).map(([entry_key,record])=>({entry_key,record}));}};}
 let e=setup('mythera',disk).env;connect(e);await e.JournalAccount.init();await e.JournalAccount.activate('Pilot Knight','mythera');
 e.JournalAccount.write({note:{text:'one'}});loadFails=true;assert.equal(await e.JournalAccount.syncNow(),false,'A failed read must never report completed synchronization, even when writes were accepted');loadFails=false;assert.equal(await e.JournalAccount.syncNow(),true);
 let release;hold=new Promise(r=>release=r);e.JournalAccount.write({note:{text:'two'}});const a=e.JournalAccount.syncNow();await new Promise(r=>setImmediate(r));e.JournalAccount.write({note:{text:'three'}});const b=e.JournalAccount.syncNow();release();await a;assert.equal(await b,true);assert.equal(cloud.get(key(user.id,'pilot knight','mythera')).note.text,'three');assert.equal(e.JournalAccount.status().pending,0);
 offline=true;e.JournalAccount.write({note:{text:'offline change'}});assert.equal(await e.JournalAccount.syncNow(),false);
 e=setup('mythera',disk).env;connect(e);await e.JournalAccount.init();await e.JournalAccount.init();assert.equal(e.JournalAccount.read().note.text,'offline change','Unsent records survive reloading offline');assert(e.JournalAccount.status().pending>0);offline=false;assert(await e.JournalAccount.syncNow());assert.equal(cloud.get(key(user.id,'pilot knight','mythera')).note.text,'offline change');
 await e.JournalAccount.activate('Second Knight','mythera');assert.equal(Object.keys(e.JournalAccount.read()).length,0);user={id:'sync-b'};await e.JournalAccount.init();assert.equal(Object.keys(e.JournalAccount.read()).length,0);assert.equal(await e.JournalAccount.syncNow(),false);
 const classic=setup('classic').env;connect(classic);await classic.JournalAccount.init();await classic.JournalAccount.activate('Other server','miracle');classic.ServerContext.isMythera=true;await classic.JournalAccount.init();assert.equal(classic.JournalAccount.context(),null,'Mythera cannot retain a character from another server');
 console.log('PASS: truthful sync status after failed reads, serialized saves, newest edits retained, offline reload/retry, account/character isolation and Mythera context');
})().catch(e=>{console.error(e);process.exit(1);});
