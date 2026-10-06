const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('public/downloads.js','utf8');
function setup(fetch){const count={isConnected:true,textContent:''},status={textContent:''},root={querySelector:s=>s.includes('-count]')?count:status},env={window:{},fetch,AbortSignal,Date};vm.createContext(env);vm.runInContext(source,env);return{count,status,root,refresh:()=>env.window.refreshProgramDownloads(root)}}
const asset=(n,name='Tibia-Command-Desktop-Setup-0.34.0.exe')=>({name,state:'uploaded',download_count:n});
(async()=>{
 let calls=0;
 const ok=setup(async()=>{calls++;return{ok:true,json:async()=>[{assets:[asset(3),asset(90,'source.zip')]},{assets:[asset(5,'Tibia-Command-Desktop-Setup-0.35.0.exe')]},{draft:true,assets:[asset(10)]}]}});
 await Promise.all([ok.refresh(),ok.refresh()]);assert.equal(ok.count.textContent,'8');assert.equal(calls,1);await ok.refresh();assert.equal(calls,1);
 let pages=0;const paged=setup(async()=>({ok:true,json:async()=>++pages===1?Array.from({length:100},()=>({assets:[asset(1)]})):[{assets:[asset(2)]}]}));await paged.refresh();assert.equal(paged.count.textContent,'102');assert.equal(pages,2);
 for(const fetch of [async()=>({ok:false}),async()=>({ok:true,json:async()=>[{assets:[asset(-1)]}]}),async()=>{throw Error('offline')}]){const fail=setup(fetch);await fail.refresh();assert.equal(fail.count.textContent,'—');assert.match(fail.status.textContent,/indisponível/)}
 console.log('PASS: soma de instaladores, exclusão de ZIPs e rascunhos, paginação, cache e falhas sem contagem falsa');
})().catch(e=>{console.error(e);process.exitCode=1});
