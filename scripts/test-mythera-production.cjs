'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const setup=new Function('require',fs.readFileSync('scripts/test-server-lab.cjs','utf8')+'\nreturn setup;')(require);
(async()=>{
 const classic=setup(''),my=setup('mythera'),e=my.env;
 assert.equal(classic.env.ServerContext.id,'classic');assert.equal(e.ServerContext.id,'mythera');assert.equal(e.TC74_LAB,false);
 await e.fetch('https://production.example/api/session',{method:'POST'});assert.equal(my.calls,1,'Production network is not blocked');
 const root={};for(const page of ['classificados','feedback','servidores','sobre','programa'])assert.equal(e.MytheraWorkspace.renderPage(page,root),false,'Real service preserved: '+page);
 let delegated=0;e.renderCommunityAccount=async()=>{delegated++;};e.CommunityAuth={journalIdentity:async()=>null};e.location.hash='#conta';vm.runInContext(fs.readFileSync('public/mythera-account.js','utf8'),e);await e.renderCommunityAccount({isConnected:true});assert.equal(delegated,1,'Logged-out users reach the real login gate');
 e.location.hash='#conta/timers';await e.renderCommunityAccount({isConnected:true});assert.equal(delegated,2,'Existing account tools remain available');
 e.JournalAccount={context:()=>({id:'user-a'})};e.LabStorage.setItem('record','private');e.JournalAccount.context=()=>({id:'user-b'});assert.equal(e.LabStorage.getItem('record'),null,'Local activity records are isolated by account');
 const html=fs.readFileSync('public/index.html','utf8');for(const name of ['community-auth','account-page','visits','analytics','twitch-live','community-stats','download-counter-service'])assert(html.includes(name+'.js'),name);assert(!html.includes('lab-account.js'));assert(!html.includes('noindex,nofollow'));assert(html.includes('https://tibiacommand74.com/'));
 console.log('PASS: classic default, Mythera selection, real network/auth/services preserved, login gate, account tools, per-user activity storage, analytics and canonical URL');
})().catch(error=>{console.error(error);process.exit(1);});
