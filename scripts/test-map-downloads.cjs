const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('public/downloads.js','utf8');
const names=['minimap-tibia74.zip','minimapa-hunts-quests-tibia74.zip'];
function setup(fetch){
 const cards=names.map(name=>({dataset:{mapDownload:name},isConnected:true,count:{textContent:''},status:{textContent:''},querySelector(s){return s.includes('-count]')?this.count:this.status;}}));
 const root={querySelectorAll:()=>cards};
 const env={window:{},fetch,AbortSignal,Date};vm.createContext(env);vm.runInContext(source,env);
 return {cards,refresh:()=>env.window.refreshMapDownloads(root)};
}
function release(a,b){return{assets:names.map((name,i)=>({name,state:'uploaded',download_count:i?b:a}))};}
(async()=>{
 let calls=0;
 const ok=setup(async()=>{calls++;return{ok:true,json:async()=>release(7,19)}});
 await Promise.all([ok.refresh(),ok.refresh()]);
 assert.deepEqual(ok.cards.map(c=>c.count.textContent),['7','19']);assert.equal(calls,1);
 await ok.refresh();assert.equal(calls,1);
 for(const fetch of [async()=>({ok:false}),async()=>({ok:true,json:async()=>release(-1,2)}),async()=>({ok:true,json:async()=>({assets:[]})}),async()=>{throw Error('offline')}]) {
  const fail=setup(fetch);await fail.refresh();
  assert.deepEqual(fail.cards.map(c=>c.count.textContent),['—','—']);
  assert.match(fail.cards[0].status.textContent,/indisponível/);
 }
 const area=fs.readFileSync('public/downloads-area.js','utf8');
 for(const name of names)assert.ok(area.includes('data-map-download="'+name+'"'));
 assert.equal((area.match(/data-map-download-count/g)||[]).length,2);
 assert.ok(area.includes('window.refreshMapDownloads?.(el)'));
 console.log('PASS: contagens independentes, cache concorrente, falhas sem números falsos e dois cards conectados');
})().catch(e=>{console.error(e);process.exitCode=1});
