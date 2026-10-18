'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const publisher='pub-4619458292527815',source='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-'+publisher;
function verify(file,expected){const html=fs.readFileSync(file,'utf8'),scripts=[...html.matchAll(/<script\b[^>]*src="([^"]*adsbygoogle\.js[^"]*)"[^>]*><\/script>/g)];assert.equal(scripts.length,expected,file);if(expected){assert.equal(scripts[0][1],source,file);assert(/\basync\b/.test(scripts[0][0]));assert(scripts[0][0].includes('crossorigin="anonymous"'));assert(html.indexOf(scripts[0][0])<html.indexOf('</head>'));}}
verify('public/index.html',1);let pages=0,excluded=0;
for(const section of ['quests','hunts','criaturas','itens','magias','npcs']){const root='public/'+section;const walk=folder=>{for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isDirectory())walk(file);else if(entry.name==='index.html'){const withdrawn=fs.readFileSync(file,'utf8').includes('noindex,follow');verify(file,withdrawn?0:1);withdrawn?excluded++:pages++;}}};walk(root);}
assert(pages>1300);assert(excluded>0);for(const file of ['contato','privacidade','termos','previa-inferna'])verify('public/'+file+'.html',0);
assert.equal(fs.readFileSync('public/ads.txt','utf8').trim(),'google.com, '+publisher+', DIRECT, f08c47fec0942fa0');assert(fs.readFileSync('public/index.html','utf8').includes('content="ca-'+publisher+'"'));
console.log(`PASS: AdSense once in head of home + ${pages} content pages; ${excluded} withdrawn pages and institutional pages excluded; publisher matches ads.txt`);
