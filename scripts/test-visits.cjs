const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const code=fs.readFileSync('public/visits.js','utf8');
async function setup(url,values={}){
 const map=new Map(Object.entries(values)),calls=[],nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',disabled:false});return nodes.get(id)};
 const env={document:{getElementById:node},location:{href:url},history:{replaceState(...a){env.replaced=a[2]}},localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},window:{addEventListener(){}},URL,Date,JSON,Number,AbortSignal,crypto:{randomUUID:()=> '9e0f23ab-024f-46d1-98fc-a3045fba3149'},fetch:async(url,options)=>{calls.push(options.body?JSON.parse(options.body):{action:'read'});return {ok:true,json:async()=>({ok:true,total:5})}}};vm.createContext(env);vm.runInContext(code,env);await new Promise(r=>setImmediate(r));return{env,map,calls,node};
}
(async()=>{
 let s=await setup('https://tibiacommand74.github.io/?interno=1#calculadora');assert.equal(s.map.get('tc74-exclude-visits'),'1');assert.equal(s.calls[0].action,'read');assert.equal(s.env.replaced,'/#calculadora');assert(s.node('visit-preference').textContent.includes('não são contados'));
 s=await setup('https://tibiacommand74.github.io/',{'tc74-exclude-visits':'1'});assert.equal(s.calls[0].action,'read');
 s=await setup('https://tibiacommand74.github.io/');assert.equal(s.calls[0].action,'visit');const saved=s.map.get('tc74-visit-session');let repeat=await setup('https://tibiacommand74.github.io/',{'tc74-visit-session':saved});assert.equal(repeat.calls[0].id,s.calls[0].id);
 await s.node('visit-toggle').onclick();assert.equal(s.calls.at(-1).action,'exclude');assert.equal(s.map.get('tc74-exclude-visits'),'1');assert.equal(s.node('visit-count').textContent,'5');
 let expired=JSON.parse(saved);expired.started-=31*60*1000;s=await setup('https://tibiacommand74.github.io/',{'tc74-visit-session':JSON.stringify(expired)});assert(JSON.parse(s.map.get('tc74-visit-session')).started>expired.started);
 console.log('PASS: internal link excludes before counting, persistent preference, session reuse and footer toggle');
})().catch(e=>{console.error(e);process.exitCode=1});
