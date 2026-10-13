'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
let total=0,uncertain=0;
const sitemap=fs.readFileSync('public/sitemap.xml','utf8');
for(const type of ['quests','hunts'])for(const id of fs.readdirSync('public/'+type)){if(id==='index.html')continue;const url=`/${type}/${id}/`,html=fs.readFileSync(path.join('public',url,'index.html'),'utf8');total++;
if(html.includes('Guia fora do catálogo 7.4')){uncertain++;assert(html.includes('noindex,follow'));assert(!sitemap.includes('<loc>https://tibiacommand74.com'+url+'</loc>'));assert(!html.includes('Abrir guia interativo'));continue;}
assert.equal((html.match(/<h1>/g)||[]).length,1,url);assert(html.includes(`rel="canonical" href="https://tibiacommand74.com${url}"`));assert(html.includes('name="description"'));assert(!html.includes('<canvas'),url+' must not show a blank map');assert(!html.includes('data-journal-type'));assert(!html.includes('href="#'));assert(html.includes('Fontes e'));assert(html.includes('Abrir guia interativo e diário'));
const noindex=html.includes('noindex,follow');if(noindex)uncertain++;assert.equal(sitemap.includes(`<loc>https://tibiacommand74.com${url}</loc>`),!noindex);
for(const match of html.matchAll(/href="(\/(?:quests|hunts)\/[^"#]*)"/g))assert(fs.existsSync(path.join('public',match[1],'index.html')),match[1]);
for(const match of html.matchAll(/src="([^"]+)"/g))assert(match[1].startsWith('/')||match[1].startsWith('https://')||match[1].startsWith('data:image/'),url+': '+match[1]);
}
assert.equal(total,112);assert.equal(uncertain,36);assert.equal((sitemap.match(/<loc>/g)||[]).length,82);
const fibula=fs.readFileSync('public/quests/fibula/index.html','utf8');assert(fibula.includes('/#quest-map/fibula/0'));assert(fibula.includes('3940'));assert(fibula.includes('trajetos ainda não foram validados no jogo'));
const source=fs.readFileSync('public/app.js','utf8');const route=source.slice(source.indexOf('function route(){'),source.indexOf("document.addEventListener('click',event=>"));
const calls=[];const ctx={C:{items:[{id:2666}],npcs:[{name:'Dermot'}]},D:{creatures:[{name:'troll'}]},location:{hash:''},QUESTS:[{id:'fibula'}],window:{CLASSIC_HUNTS:[{id:'troll-thais'}],QUEST_ROUTES:{fibula:{}},scrollTo(){}},render:p=>calls.push(['render',p]),detailItem:id=>calls.push(['item',id]),detailNpc:id=>calls.push(['npc',id]),detail:id=>calls.push(['creature',id]),detailQuest:id=>calls.push(['quest',id]),detailHunt:id=>calls.push(['hunt',id]),openQuestRoute:(id,i)=>calls.push(['quest-map',id,i]),openHuntMap:id=>calls.push(['hunt-map',id])};vm.createContext(ctx);vm.runInContext(route,ctx);
for(const [hash,expected] of [['#item/2666',['item',2666]],['#npc/Dermot',['npc','Dermot']],['#creature/troll',['creature','troll']],['#quest/fibula',['quest','fibula']],['#hunt/troll-thais',['hunt','troll-thais']],['#quest-map/fibula/2',['quest-map','fibula',2]],['#hunt-map/troll-thais',['hunt-map','troll-thais']]]){ctx.location.hash=hash;vm.runInContext('route()',ctx);assert.deepEqual(calls.at(-1),expected);}
ctx.location.hash='#quest/unknown';vm.runInContext('route()',ctx);assert.deepEqual(calls.at(-1),['render','inicio']);
assert(fs.readFileSync('public/guide-pages.js','utf8').includes("'mobile-open'"));
console.log('PASS: 76 static guides, 36 withdrawal notices, 82 sitemap URLs, historical exclusions, canonical URLs, direct maps and interactive guide navigation');
