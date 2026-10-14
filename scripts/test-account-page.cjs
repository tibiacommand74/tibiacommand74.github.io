'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
(async()=>{
 let user=null,journal=0,market=[];
 const pane={innerHTML:'',isConnected:true,querySelector:()=>({})};
 const root={innerHTML:'',isConnected:true,dataset:{},classList:{add(){}},querySelector:s=>s==='#account-workspace'?pane:null};
 const context={window:{CommunityAccount:{},JournalAccount:{init:async()=>{}},renderCommunityJournal:()=>journal++,renderClassifieds:(el,options)=>market.push(options)},CommunityAuth:{journalIdentity:async()=>user,token:async()=>'test-token'},location:{hash:'#conta'},document:{getElementById:()=>pane},fetch:async()=>({ok:true,json:async()=>({profile:user.profile})}),String};
 vm.createContext(context);vm.runInContext(fs.readFileSync('public/account-page.js','utf8'),context);
 await context.window.renderCommunityAccount(root);assert(pane.innerHTML.includes('Entrar na minha conta'));assert.equal(market.length,0);assert.equal(journal,0);
 user={id:'test',profile:{alias:'Knight <test>',character:'Knight',server:'Mythera'}};
 await context.window.renderCommunityAccount(root);assert(pane.innerHTML.includes('Knight &lt;test&gt;'));assert(root.innerHTML.includes('aria-label="Minha conta"'));assert(!root.innerHTML.includes('<dialog'));assert.equal(root.dataset.accountUser,'test');
 context.location.hash='#conta/diario';await context.window.renderCommunityAccount(root);assert.equal(journal,1);
 context.location.hash='#conta/anuncios';await context.window.renderCommunityAccount(root);assert.equal(market.at(-1).tab,'mine');assert.equal(market.at(-1).account,true);
 context.location.hash='#conta/perfil';await context.window.renderCommunityAccount(root);assert.equal(market.at(-1).tab,'profile');
 user=null;await context.window.renderCommunityAccount(root);assert(pane.innerHTML.includes('Entrar na minha conta'));assert.equal(market.length,2);
 console.log('PASS: account gate, escaped profile, full-page layout, embedded diary/listings/profile and logged-out access');
})().catch(error=>{console.error(error);process.exit(1);});
