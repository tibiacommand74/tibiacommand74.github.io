'use strict';
// Classic progression; base mana is 400 in pre-7.6 Tibia, not the later 1600.
const CALC_VOCATIONS={Knight:{skills:[1.1,1.1,1.1,1.1,1.4,1.1,1.1],magic:3},Paladin:{skills:[1.2,1.2,1.2,1.2,1.1,1.1,1.1],magic:1.4},Druid:{skills:[1.5,1.8,1.8,1.8,1.8,1.5,1.1],magic:1.1},Sorcerer:{skills:[1.5,2,2,2,2,1.5,1.1],magic:1.1}};
const CALC_SKILLS=[['Fist fighting',50],['Club fighting',50],['Sword fighting',50],['Axe fighting',50],['Distance fighting',30],['Shielding',100],['Fishing',20]];
let calculatorMode='level';
const calculatorValues={};
function progressionNeed({vocation,skill,current,target,progress,rate,magic=false}){
 const profile=CALC_VOCATIONS[vocation],minimum=magic?0:10;
 if(!profile||!Number.isInteger(current)||!Number.isInteger(target)||current<minimum||target<=current||target>(magic?100:200)||![progress,rate].every(Number.isFinite)||progress<0||progress>=100||rate<=0||(!magic&&(!Number.isInteger(skill)||!CALC_SKILLS[skill])))throw Error('Confira a vocação, o objetivo acima do atual, o progresso de 0 a 99,99% e a rate maior que zero.');
 const base=magic?400:CALC_SKILLS[skill][1],factor=magic?profile.magic:profile.skills[skill];
 const step=level=>Math.floor(base*Math.pow(factor,magic?level:level-10));
 let remaining=step(current)*(1-progress/100);
 for(let level=current+1;level<target;level++)remaining+=step(level);
 const units=Math.ceil(remaining/rate);
 if(!Number.isSafeInteger(units))throw Error('Esse objetivo excede a precisão da estimativa. Escolha um nível menor.');
 return units;
}
function calcHours(minutes){return `${fmt(Math.floor(minutes/60))}h ${minutes%60}min`;}
function renderCalculator(el){
 el.innerHTML=title('Calculadora de evolução','Planeje seu level, skills e magic level.')+`<div class="tc-links"><a href="#mana">Mana e produção de runas</a><a href="#equipamentos">Comparador de equipamentos</a></div><div class="calc-tabs" role="group" aria-label="Tipo de cálculo">${[['level','Level / XP'],['skills','Skills'],['magic','Magic Level']].map(([id,label])=>`<button type="button" class="action ${calculatorMode===id?'':'secondary'}" data-calculator="${id}" aria-pressed="${calculatorMode===id}">${label}</button>`).join('')}</div><div id="calculator-panel"></div>`;
 el.querySelectorAll('[data-calculator]').forEach(button=>button.onclick=()=>{saveCalculatorValues();calculatorMode=button.dataset.calculator;renderCalculator(el);});
 const panel=$('#calculator-panel');
 if(calculatorMode==='level'){
 panel.innerHTML=`<div class="calculator"><form class="form-panel" id="xp-form"><div class="fields"><label>Nível atual<input id="current" type="number" min="1" max="10000" value="8"></label><label>Nível desejado<input id="target" type="number" min="2" max="10000" value="50"></label><label>Progresso do nível (%)<input id="progress" type="number" min="0" max="99.99" step="0.1" value="0"></label><label>XP por hora (já com rates)<input id="hour" type="number" min="1" value="30000"></label></div><p style="color:var(--muted);font-size:14px;line-height:1.7">Use a experiência por hora que você realmente consegue na hunt. O tempo é uma estimativa sem pausas.</p></form><div class="result" aria-live="polite"><p class="eyebrow">SEU PRÓXIMO OBJETIVO</p><div id="xp-result"></div></div></div>`;
 restoreCalculatorValues();$('#xp-form').oninput=calculate;$('#xp-form').onsubmit=e=>e.preventDefault();calculate();return;
 }
 const magic=calculatorMode==='magic';
 panel.innerHTML=`<div class="calculator"><form class="form-panel" id="training-form"><div class="fields"><label>Vocação<select id="train-vocation">${Object.keys(CALC_VOCATIONS).map(v=>`<option>${v}</option>`).join('')}</select></label>${magic?'':`<label>Skill<select id="train-skill">${CALC_SKILLS.map(([name],i)=>`<option value="${i}" ${i===2?'selected':''}>${name}</option>`).join('')}</select></label>`}<label>${magic?'Magic level':'Skill'} atual<input id="train-current" type="number" min="${magic?0:10}" max="${magic?99:199}" value="${magic?0:50}" required></label><label>${magic?'Magic level':'Skill'} desejado<input id="train-target" type="number" min="${magic?1:11}" max="${magic?100:200}" value="${magic?10:60}" required></label><label>Progresso atual (%)<input id="train-progress" type="number" min="0" max="99.99" step="0.1" value="0" required></label><label>Rate de ${magic?'magic level':'skills'} do servidor<input id="train-rate" type="number" min="0.01" step="0.01" value="1" required></label><label>${magic?'Mana gasta':'Tentativas válidas'} por hora<input id="train-hour" type="number" min="1" step="1" value="${magic?600:1800}" required></label></div><p class="calc-note">${magic?'Informe a mana que você realmente gasta por hora com magias e runas, incluindo regeneração e consumíveis.':'O tempo depende das tentativas que contam para a skill. Erros de ataque, pausas e o método de treino podem alterar esse ritmo. Distância pode registrar mais de uma tentativa por ataque.'} A rate 1 significa 1×; use 2 para 2×.</p><p class="calc-note">Base clássica 7.4. Servidores com fórmulas próprias podem ter resultados diferentes. O progresso é a porcentagem já concluída até o próximo avanço.</p></form><div class="result" aria-live="polite"><p class="eyebrow">SEU PRÓXIMO OBJETIVO</p><div id="training-result"></div></div></div>`;
 restoreCalculatorValues();$('#training-form').oninput=calculateTraining;$('#training-form').onsubmit=e=>e.preventDefault();calculateTraining();
}
function saveCalculatorValues(){const form=$('#calculator-panel form');if(form)calculatorValues[calculatorMode]=Object.fromEntries([...form.querySelectorAll('input,select')].map(node=>[node.id,node.value]));}
function restoreCalculatorValues(){for(const [id,value] of Object.entries(calculatorValues[calculatorMode]||{})){const node=$('#'+id);if(node)node.value=value;}}
function calculateTraining(){const result=$('#training-result');try{
 const magic=calculatorMode==='magic',vocation=$('#train-vocation').value,skill=magic?0:Number($('#train-skill').value),current=Number($('#train-current').value),target=Number($('#train-target').value),progress=Number($('#train-progress').value),rate=Number($('#train-rate').value),hour=Number($('#train-hour').value);
 if([...$('#training-form').querySelectorAll('input')].some(input=>input.value.trim()==='')||!Number.isFinite(hour)||hour<=0)throw Error('Preencha os campos e informe um ritmo por hora maior que zero.');
 const units=progressionNeed({vocation,skill,current,target,progress,rate,magic}),minutes=Math.ceil(units/hour*60);
 if(!Number.isSafeInteger(minutes))throw Error('Esse objetivo excede a precisão da estimativa. Escolha um nível menor.');
 const name=magic?'Magic Level':CALC_SKILLS[skill][0];
 result.innerHTML=`<div class="big">${fmt(units)}</div><p>${magic?'mana restante para gastar':'tentativas válidas restantes'}</p><h3>${calcHours(minutes)}</h3><p>Tempo estimado sem pausas.</p><p>${name}: ${current} → ${target}<br>${vocation} · rate ${rate.toLocaleString('pt-BR')}×<br>${fmt(hour)} ${magic?'mana':'tentativas'} por hora.</p>`;
 return {units,minutes};
 }catch(error){result.innerHTML=`<p class="error">${esc(error.message)}</p>`;return null;}}
