/* Three multiple-choice seals inside the corridor, not an eighth room.
   Saved statements remain stable across retries; no statue has a fixed role. */
window.GUARDIAN_QUESTIONS=[
 {id:'circle',title:'El instante del movimiento',
  text:'Un objeto se mueve según x(t) = −5 sen(ωt), y(t) = 4 − 5 cos(ωt), con ω = 1 rad/s. x e y están en metros y t en segundos. Calcula las componentes de velocidad y aceleración en t = 0 s.',
  fields:[['vx','vₓ(0) · m/s',-5],['vy','vᵧ(0) · m/s',0],['ax','aₓ(0) · m/s²',0],['ay','aᵧ(0) · m/s²',5]],
  hint:'Deriva cada coordenada una vez para obtener la velocidad y otra vez para la aceleración. Sustituye t = 0 al final; conserva los signos.',
  setup:'vₓ = −5·1·cos(1·0)\nvᵧ = 5·1·sen(1·0)\naₓ = 5·1²·sen(1·0)\naᵧ = 5·1²·cos(1·0)\nEvalúa cada expresión. Para estas funciones usa radianes.'},
 {id:'position',title:'Dos maneras de mirar el tiempo',
  text:'Para r(t) = x(t)î + y(t)ĵ: a = 1 m/s, b = 1 m, c = 0.125 m/s² y d = 1 m. Ya sustituidos: x(t) = t + 1; y(t) = 0.125t² + 1. A) Calcula la velocidad media entre t = 2 s y t = 4 s. B) La velocidad instantánea en t = 2 s. C) La rapidez en t = 2 s.',
  fields:[['avgx','A · v̄ₓ · m/s',1],['avgy','A · v̄ᵧ · m/s',.75],['vx','B · vₓ(2) · m/s',1],['vy','B · vᵧ(2) · m/s',.5],['speed','C · rapidez · m/s',Math.sqrt(1.25)]],
  hint:'Para la media, resta las posiciones y divide entre el intervalo de tiempo. Para la instantánea, deriva x(t) e y(t). La rapidez es la magnitud del vector velocidad.',
  setup:'v̄ₓ = [(4 + 1) − (2 + 1)] / (4 − 2)\nv̄ᵧ = [(0.125·4² + 1) − (0.125·2² + 1)] / (4 − 2)\nvₓ = d(t + 1)/dt\nvᵧ = 2·0.125·2\nrapidez = √(vₓ² + vᵧ²)\nTermina las operaciones y escribe los cinco valores pedidos.'},
 {id:'drone',title:'El mensajero del cielo',
  text:'Un dron parte en t = 0 con r₀ = (2, 1) m, v₀ = (3, 4) m/s y aceleración constante a = (1, −2) m/s². En t = 3 s, calcula las dos componentes de la velocidad, la rapidez y las dos componentes de la posición.',
  fields:[['vx','vₓ(3) · m/s',6],['vy','vᵧ(3) · m/s',-2],['speed','Rapidez · m/s',Math.sqrt(40)],['x','x(3) · m',15.5],['y','y(3) · m',4]],
  hint:'Trabaja por componentes: v = v₀ + at y r = r₀ + v₀t + ½at². La rapidez siempre es positiva: obtén la magnitud del vector velocidad.',
  setup:'vₓ = 3 + 1·3\nvᵧ = 4 + (−2)·3\nrapidez = √(vₓ² + vᵧ²)\nx = 2 + 3·3 + ½·1·3²\ny = 1 + 4·3 + ½·(−2)·3²\nResuelve estas operaciones. Revisa el signo de la aceleración vertical.'}
];
// One requested subsection per calculation variant, with plausible distractors.
window.GUARDIAN_CALCULATIONS={
 circle:{text:'x(t) = −5 sen(ωt), y(t) = 4 − 5 cos(ωt), con ω = 1 rad/s; posiciones en metros. ¿Cuáles son las componentes de la velocidad en t = 0 s?',choices:[['a','v = (0, 5) m/s'],['b','v = (5, 0) m/s'],['c','v = (−5, 0) m/s'],['d','v = (−5, 4) m/s']],answer:'c',hint:'Deriva x(t) e y(t) y después sustituye t = 0. No confundas la posición inicial con la velocidad.',setup:'vₓ = −5·1·cos(1·0)\nvᵧ = 5·1·sen(1·0)\nEvalúa en radianes y elige el vector que coincide.'},
 position:{text:'Con a = 1 m/s, b = 1 m, c = 0.125 m/s² y d = 1 m, las funciones quedan x(t) = t + 1; y(t) = 0.125t² + 1. ¿Cuál es la velocidad media entre t = 2 s y t = 4 s?',choices:[['a','v̄ = (1, 0.50) m/s'],['b','v̄ = (1, 0.75) m/s'],['c','v̄ = (4, 2.25) m/s'],['d','v̄ = (0.75, 1) m/s']],answer:'b',hint:'Calcula la posición en los dos instantes. Resta posición final menos inicial y divide cada componente entre 4 − 2.',setup:'v̄ₓ = [(4 + 1) − (2 + 1)] / (4 − 2)\nv̄ᵧ = [(0.125·4² + 1) − (0.125·2² + 1)] / (4 − 2)\nTermina las operaciones y compara el vector con las opciones.'},
 drone:{text:'Un dron tiene velocidad inicial v₀ = (3, 4) m/s y aceleración constante a = (1, −2) m/s². ¿Cuáles son las componentes de su velocidad en t = 3 s?',choices:[['a','v = (6, 2) m/s'],['b','v = (4, 2) m/s'],['c','v = (3, 4) m/s'],['d','v = (6, −2) m/s']],answer:'d',hint:'Aplica v = v₀ + at por separado en x e y. Conserva el signo negativo de la aceleración vertical.',setup:'vₓ = 3 + 1·3\nvᵧ = 4 + (−2)·3\nCalcula las dos componentes y elige el vector correspondiente.'}
};
window.GUARDIAN_GARDEN={start:49,checkpoint:{x:50,y:4.5,angle:0},fountain:{x:56,y:4.5},tile:{x:61.5,y:4.5,size:1.7},statue:{x:66.15,y:3.15},rodrigo:{x:66.15,y:5.85},gate:{x:66.85,y:4.5},exit:67.65};
/* Each seal assigns its own statements. `truthful` is the first seal speaker
   retained for checkpoint compatibility, never a permanent role. */
window.GardenGuardian=class {
 constructor(onEvent){
  this.onEvent=onEvent;this.arrived=false;this.solved=false;this.stage=0;this.truthful=Math.random()<.5?'book':'rodrigo';
  this.voiceOrder=Array.from({length:2},()=>Math.random()<.5?'book':'rodrigo');
  this.calculationId=GUARDIAN_QUESTIONS[Math.floor(Math.random()*GUARDIAN_QUESTIONS.length)].id;
  this.draft={};this.pendingNext=false;this.onTile=false;this.gateProgress=0;this.gateOpened=false;
  const load=file=>{const img=new Image();img.src='assets/garden/'+file;return img;};
  this.statue=load('luis-sentinel.webp');this.rodrigo=load('rodrigo-sentinel.webp');this.fountain=load('fountain.webp');this.frame=load('gate-frame.webp');this.leaves=load('gate-leaves.webp');
  let panel=document.querySelector('#guardian-panel');
  if(!panel){document.querySelector('.scene-view').insertAdjacentHTML('beforeend',`<section id="guardian-panel" class="world-console" hidden aria-label="Acertijos de los guardianes"><button id="guardian-close" class="bubble-fold" aria-label="Cerrar acertijo">×</button><p class="eyebrow">LOS GUARDIANES DE EPITHEA · <span id="guardian-progress"></span></p><h2 id="guardian-title"></h2><p id="guardian-rule">Inscripción de la baldosa: ni el libro ni el pergamino garantizan sabiduría. Juzga cada afirmación; una voz acertada puede extraviarte en el siguiente sello.</p><p id="guardian-question"></p><form id="guardian-form"><div id="guardian-fields"></div><p id="guardian-note" class="guardian-note"></p><button class="primary" type="submit">Presentar mi respuesta</button></form><p id="guardian-feedback" role="status"></p><button id="guardian-next" class="primary" type="button" hidden>Escuchar la siguiente pregunta</button><div class="guardian-help"><button id="guardian-paola" type="button">Pedir una pista a Paola</button><button id="guardian-palma" type="button" hidden>Palma IA · Máximo 1 estrella</button></div></section><aside id="guardian-voice-book" class="guardian-voice" hidden><strong>Luis · Guardián del libro</strong><p></p></aside><aside id="guardian-voice-rodrigo" class="guardian-voice" hidden><strong>Rodrigo · Guardián del pergamino</strong><p></p></aside>`);panel=document.querySelector('#guardian-panel');}
  this.panel=panel;this.panel.hidden=true;this.hideVoices();
  document.querySelector('#guardian-close').onclick=()=>this.close();
  document.querySelector('#guardian-paola').onclick=()=>{this.close();this.onPaola?.();};
  document.querySelector('#guardian-palma').onclick=()=>{this.close();this.onPalma?.();};
  document.querySelector('#guardian-next').onclick=()=>{if(!this.pendingNext||!this.canUse?.()||!this.canAnswer?.())return;this.pendingNext=false;this.renderQuestion();};
  document.querySelector('#guardian-form').onsubmit=e=>{e.preventDefault();this.submit();};
 }
 get question(){
  if(this.stage===0)return {id:'identity',title:'Primer sello · El instante inmóvil',text:'Una esfera tiene velocidad cero en un instante. Sin más datos sobre su movimiento, ¿qué afirmación está justificada?',choices:[['book','La del guardián del libro'],['rodrigo','La de Rodrigo']],answer:this.truthful,hint:'Escucha con cuidado lo que cada uno da por hecho.',setup:'La velocidad describe cómo cambia la posición; la aceleración, cómo cambia la velocidad. ¿Conocer un valor en un solo instante permite saber cómo está cambiando?',trueLine:'La quietud de un instante no demuestra que la aceleración haya cesado.',falseLine:'Si en ese instante no avanza, tampoco cambia su velocidad: su aceleración debe ser cero.'};
  if(this.stage===1)return {id:'displacement',title:'Segundo sello · El regreso del viajero',text:'Un viajero da una vuelta completa a la fuente y vuelve al punto exacto donde empezó. ¿Qué magnitud necesariamente es cero?',choices:[['displacement','El desplazamiento'],['distance','La distancia recorrida'],['speed','La rapidez al llegar']],answer:'displacement',hint:'Dos relatos del mismo viaje no siempre hablan de lo mismo.',setup:'Desplazamiento = posición final − posición inicial. Al regresar, ambas posiciones coinciden. La distancia suma el camino recorrido. Decide cuál de las opciones cumple esto.',trueLine:'Las huellas permanecen, aunque el punto de partida y el de llegada sean uno solo.',falseLine:'Cada paso añadió distancia; por eso también dejó un desplazamiento distinto de cero al regresar.'};
  const q=GUARDIAN_QUESTIONS.find(q=>q.id===this.calculationId);
  const lines={circle:['La velocidad se obtiene derivando la posición respecto al tiempo.','La velocidad se obtiene sumando la posición y el tiempo.'],position:['La velocidad media se calcula restando las posiciones y dividiendo entre el tiempo transcurrido.','La velocidad media se calcula sumando las posiciones y dividiendo entre el tiempo transcurrido.'],drone:['En este problema, la aceleración vertical es negativa. Conserva ese signo.','En este problema, la aceleración vertical es positiva. Cambia ese signo.']}[q.id];
  return {...q,...GUARDIAN_CALCULATIONS[q.id],id:'calculation-'+q.id,title:'Tercer sello · '+q.title,trueLine:lines[0],falseLine:lines[1]};
 }
 near(player){const t=GUARDIAN_GARDEN.tile;return this.arrived&&Math.abs(player.x-t.x)<=t.size/2&&Math.abs(player.y-t.y)<=t.size/2&&(player.jumpHeight||0)<.05;}
 blocks(x,y){return Math.hypot(x-56,y-4.5)<1.22||[GUARDIAN_GARDEN.statue,GUARDIAN_GARDEN.rodrigo].some(p=>Math.hypot(x-p.x,y-p.y)<.48);}
 enter(){if(this.arrived)return;this.arrived=true;this.onEvent('garden');}
 tick(dt,player){
  if(this.solved&&!this.gateOpened){this.gateProgress=Math.min(1,this.gateProgress+dt/2.8);if(this.gateProgress===1){this.gateOpened=true;Sound.tone(520,.25,'sine',.07);this.onEvent('guardian-gate-open');}}
  const onTile=this.near(player);
  if(onTile&&!this.onTile&&!this.solved&&this.canUse?.()){this.onTile=true;this.onEvent('guardian-speaking');this.open(player);}
  if(!onTile){this.onTile=false;this.close();}
  this.updateAid();
 }
 open(player){if(!this.near(player)||!this.canUse?.()||this.solved)return false;this.onTile=true;this.panel.hidden=false;document.querySelector('#world-toast').hidden=true;this.renderQuestion();window.dispatchEvent(new Event('astralia:ui-open'));return true;}
 renderQuestion(){
  const q=this.question;this.renderedId=q.id;
  document.querySelector('#guardian-progress').textContent=`${this.stage} / 3 sellos`;
  document.querySelector('#guardian-title').textContent=I18n.t(q.title);document.querySelector('#guardian-question').textContent=I18n.t(q.text);
  document.querySelector('#guardian-note').textContent=I18n.t(q.choices?'Elige una respuesta. Conservas los sellos que ya has ganado.':'Escribe números sin unidades; puedes redondear a dos decimales.');
  const fields=document.querySelector('#guardian-fields');fields.replaceChildren();fields.classList.toggle('choices',!!q.choices);fields.classList.toggle('calculation',this.stage===2);document.querySelector('#guardian-rule').hidden=this.stage>0;
  if(q.choices){for(const [id,text] of q.choices){const l=document.createElement('label'),i=document.createElement('input'),span=document.createElement('span');i.type='radio';i.name='choice';i.value=id;i.required=true;i.checked=this.draft.choice===id;i.onchange=()=>{this.draft.choice=id;};span.textContent=I18n.t(text);l.append(i,span);fields.append(l);}}
  else for(const [id,label] of q.fields){const l=document.createElement('label'),i=document.createElement('input');l.textContent=I18n.t(label);i.name=id;i.type='number';i.step='any';i.inputMode='decimal';i.required=true;i.value=this.draft[id]??'';i.oninput=()=>{this.draft[id]=i.value;};l.append(i);fields.append(l);}
  document.querySelector('#guardian-feedback').textContent='';document.querySelector('#guardian-form').hidden=this.pendingNext;document.querySelector('#guardian-next').hidden=!this.pendingNext;
  if(this.pendingNext)document.querySelector('#guardian-feedback').textContent=I18n.t('Un sello se ha encendido. Escucha la siguiente prueba.');
  for(const who of ['book','rodrigo']){const voice=document.querySelector('#guardian-voice-'+who);voice.querySelector('p').textContent=I18n.t(who===(this.stage===0?this.truthful:this.voiceOrder[Math.min(this.stage,2)-1])?q.trueLine:q.falseLine);voice.hidden=false;}
  this.updateAid();
 }
 static check(q,values){if(q.choices)return values.choice===q.answer;return q.fields.every(([id,,answer])=>typeof values[id]==='number'&&Number.isFinite(values[id])&&Math.abs(values[id]-answer)<=Math.max(.02,Math.abs(answer)*.01));}
 submit(){
  if(this.solved||this.pendingNext||this.renderedId!==this.question.id||this.panel.hidden||!this.canUse?.()||!this.canAnswer?.())return;
  const form=document.querySelector('#guardian-form');if(!form.reportValidity())return;const q=this.question,values={};
  if(q.choices){values.choice=form.elements.choice.value;this.draft.choice=values.choice;}
  else for(const [id] of q.fields){const raw=form.elements[id].value;this.draft[id]=raw;if(!raw.trim())return;values[id]=Number(raw);}
  const ok=GardenGuardian.check(q,values);this.onAnswer?.(values,ok);
  if(ok){
   this.stage++;this.draft={};Sound.tone(440+this.stage*90,.16,'sine',.07);
   if(this.stage===3){this.solved=true;this.close();Sound.tone(95,.7,'triangle',.06);this.onEvent('guardian-solved');}
   else {this.pendingNext=true;document.querySelector('#guardian-form').hidden=true;document.querySelector('#guardian-next').hidden=false;document.querySelector('#guardian-feedback').textContent=I18n.t('Un sello se ha encendido. Escucha la siguiente prueba.');document.querySelector('#guardian-progress').textContent=`${this.stage} / 3 sellos`;this.onEvent('guardian-progress');this.updateAid();}
  }else{document.querySelector('#guardian-feedback').textContent=I18n.t('El sello permanece apagado. Contrasta las voces con tus conocimientos y vuelve a intentar.');Sound.tone(170,.15,'triangle',.07);this.updateAid();this.onEvent('guardian-answer');}
 }
 updateAid(){document.querySelector('#guardian-palma').hidden=this.pendingNext||!this.canPalma?.();}
 hideVoices(){for(const who of ['book','rodrigo']){const e=document.querySelector('#guardian-voice-'+who);if(e)e.hidden=true;}}
 close(){this.hideVoices();if(!this.panel.hidden){this.panel.hidden=true;document.querySelector('#game').focus({preventScroll:true});}}
 snapshot(){return {version:3,voiceOrder:[...this.voiceOrder],arrived:this.arrived,solved:this.solved,stage:this.stage,truthful:this.truthful,calculationId:this.calculationId,draft:{...this.draft},gateProgress:this.gateProgress};}
 restore(data){
  if(typeof data?.arrived!=='boolean'||typeof data.solved!=='boolean')throw Error('Invalid guardian checkpoint');
  if(data.version!==2&&data.version!==3){if(!GUARDIAN_QUESTIONS.some(q=>q.id===data.questionId))throw Error('Invalid old guardian question');this.calculationId=data.questionId;this.stage=data.solved?3:0;this.arrived=data.arrived;this.solved=data.solved;this.draft={};this.gateProgress=data.solved?1:0;}
  else{if(!Number.isInteger(data.stage)||data.stage<0||data.stage>3||data.solved!==(data.stage===3)||data.solved&&!data.arrived||!['book','rodrigo'].includes(data.truthful)||!GUARDIAN_QUESTIONS.some(q=>q.id===data.calculationId))throw Error('Invalid guardian seals');Object.assign(this,{stage:data.stage,arrived:data.arrived,solved:data.solved,truthful:data.truthful,calculationId:data.calculationId});const ids=this.question.choices?['choice']:this.question.fields.map(f=>f[0]);this.draft=Object.fromEntries(ids.map(id=>[id,String(data.draft?.[id]??'').slice(0,40)]));this.gateProgress=this.solved?Math.max(0,Math.min(1,Number(data.gateProgress)||0)):0;}
  if(data.version===3){if(!Array.isArray(data.voiceOrder)||data.voiceOrder.length!==2||!data.voiceOrder.every(w=>['book','rodrigo'].includes(w)))throw Error('Invalid guardian voices');this.voiceOrder=[...data.voiceOrder];}
  // Old first-seal drafts refer to a different question; keep earned seals.
  if(data.version!==3&&this.stage===0)this.draft={};
  this.gateOpened=this.gateProgress===1;this.pendingNext=false;this.onTile=false;this.close();
 }
 floor(x,y){
  const t=GUARDIAN_GARDEN.tile,dx=Math.abs(x-t.x),dy=Math.abs(y-t.y);
  if(dx<t.size/2&&dy<t.size/2){if(Math.max(dx,dy)>t.size/2-.09)return '#dbbc78';if(Math.abs(dx-dy)<.025)return '#aea484';return '#747c7d';}
  const ring=Math.abs(Math.hypot(x-56,y-4.5)-1.8)<.6,path=Math.abs(y-4.5)<1||ring;
  const seam=((x%.6)+.6)%.6<.035||((y%.5)+.5)%.5<.035;
  return path?(seam?'#80745b':'#b5aa88'):(Math.sin(Math.floor(x*8)*3+Math.floor(y*8)*7)>.4?'#4e6842':'#354e37');
 }
 gateTexture(){
  if(!this.frame.complete||!this.frame.naturalWidth||!this.leaves.complete||!this.leaves.naturalWidth)return null;
  if(!this.gateCanvas){this.gateCanvas=document.createElement('canvas');this.gateCanvas.width=512;this.gateCanvas.height=640;}
  if(this.lastGateProgress===this.gateProgress)return this.gateCanvas;this.lastGateProgress=this.gateProgress;
  const c=this.gateCanvas.getContext('2d');c.clearRect(0,0,512,640);
  // Hinge at the outer edges. Smooth leaf foreshortening reveals the passage.
  const eased=this.gateProgress*this.gateProgress*(3-2*this.gateProgress),span=136*Math.cos(eased*Math.PI*.49),half=this.leaves.naturalWidth/2;
  if(this.gateProgress<1){c.fillStyle='#08111b';c.beginPath();c.moveTo(119,630);c.lineTo(119,263);c.quadraticCurveTo(256,104,393,263);c.lineTo(393,630);c.closePath();c.fill();}
  c.drawImage(this.leaves,0,0,half,this.leaves.naturalHeight,120,168,span,462);
  c.drawImage(this.leaves,half,0,half,this.leaves.naturalHeight,392-span,168,span,462);
  c.drawImage(this.frame,0,0,512,640);return this.gateCanvas;
 }
 draw(r,player,actors,time){
  const props=[{x:56,y:4.5,image:this.fountain,w:2.55,h:1.2},{...GUARDIAN_GARDEN.statue,image:this.statue,w:1.1,h:1.9},{...GUARDIAN_GARDEN.rodrigo,image:this.rodrigo,w:1.1,h:1.9}];
  const gate=this.gateTexture();if(gate)props.push({...GUARDIAN_GARDEN.gate,image:gate,w:3.05,h:3.25});
  const shrub=this.shrub||(this.shrub=this.makeShrub()),bench=this.bench||(this.bench=this.makeOrnament('bench')),orb=this.orb||(this.orb=this.makeOrnament('orb'));
  for(const x of [50.5,53,59,62])for(const y of [2.05,6.95])props.push({x,y,image:shrub,w:1.05,h:.7});
  for(const y of [2.35,6.65]){props.push({x:58.5,y,image:bench,w:1.2,h:.5});props.push({x:51,y,image:orb,w:.5,h:1.1});}
  props.sort((a,b)=>Math.hypot(b.x-player.x,b.y-player.y)-Math.hypot(a.x-player.x,a.y-player.y));
  for(const p of props)if(p.image.width&&p.image.complete!==false)WorldBillboard(r,player,actors,p.image,p.x,p.y,0,p.w,p.h);
  const c=r.ctx;for(let i=0;i<7;i++){const a=i*.89,t=(time*.00045+i*.17)%1,p=actors.project(r,player,56+Math.cos(a)*.5,4.5+Math.sin(a)*.5,1.05+.25*Math.sin(t*Math.PI));if(!p||p.depth<.1||p.depth>(r.depths[Math.floor(p.x/3)*3]??Infinity)+.05)continue;c.fillStyle='#b9f8ee';c.globalAlpha=.35+.4*Math.sin(t*Math.PI);c.fillRect(p.x,p.y,Math.max(1,p.scale*.015),Math.max(2,p.scale*.035));}c.globalAlpha=1;
  // Projected UI remains anchored to each statue; responsive bounds prevent clipping.
  for(const [who,pos] of [['book',GUARDIAN_GARDEN.statue],['rodrigo',GUARDIAN_GARDEN.rodrigo]]){const e=document.querySelector('#guardian-voice-'+who),p=actors.project(r,player,pos.x,pos.y,2.05);if(this.panel.hidden||!p||p.depth<.1){e.hidden=true;continue;}e.hidden=false;const view=r.canvas.getBoundingClientRect(),vw=r.canvas.clientWidth,vh=r.canvas.clientHeight,ew=e.offsetWidth,eh=e.offsetHeight;const px=p.x/r.canvas.width*vw,py=p.y/r.canvas.height*vh;const minX=who==='book'?8:vw/2+4,maxX=who==='book'?vw/2-ew-4:vw-ew-8;e.style.left=Math.max(minX,Math.min(maxX,px-ew/2))+'px';e.style.top=Math.max(8,Math.min(vh*.40-eh,py-eh-12))+'px';e.style.setProperty('--tail',Math.max(12,Math.min(ew-12,px-parseFloat(e.style.left)))+'px');}
  const t=GUARDIAN_GARDEN.tile;
  for(let i=0;i<3;i++){const p=actors.project(r,player,t.x-.4+i*.4,t.y,.025);if(!p||p.depth<.1)continue;c.fillStyle=i<this.stage?'#ffdc7d':'#323b46';c.beginPath();c.arc(p.x,p.y,Math.max(2,p.scale*.07),0,7);c.fill();}
  if(this.arrived&&!this.onTile&&!this.solved){const p=actors.project(r,player,t.x,t.y,.25);if(p&&p.depth>.5&&p.depth<12){c.save();c.textAlign='center';c.font='16px Georgia';c.fillStyle='#102030d9';c.fillRect(p.x-160,p.y-28,320,35);c.fillStyle='#ffe2a4';c.fillText(I18n.t('Pisa la baldosa · Escucha a los guardianes'),p.x,p.y-5,300);c.restore();}}
 }
 makeShrub(){const a=document.createElement('canvas');a.width=160;a.height=140;const c=a.getContext('2d');c.fillStyle='#686757';c.fillRect(15,96,130,40);for(let i=0;i<17;i++){c.fillStyle=['#344d36','#496544','#6b7950'][i%3];c.beginPath();c.arc(22+i*7,72-Math.sin(i*.7)*18,20,0,7);c.fill();}for(let i=0;i<10;i++){c.fillStyle=i%2?'#e2bd81':'#c1a4d3';c.fillRect(25+i*11,57+Math.sin(i*4)*23,5,5);}return a;}
 makeOrnament(kind){const a=document.createElement('canvas');a.width=240;a.height=260;const c=a.getContext('2d');if(kind==='bench'){c.fillStyle='#858375';c.fillRect(14,160,212,28);c.fillRect(24,188,30,60);c.fillRect(186,188,30,60);c.fillStyle='#b5ab90';c.fillRect(8,145,224,25);c.fillRect(20,72,200,64);c.strokeStyle='#6c675c';c.lineWidth=5;for(let x=30;x<220;x+=30)c.strokeRect(x,78,22,48);c.fillStyle='#d2bd83';c.fillRect(16,67,208,10);}else{c.fillStyle='#8f8d80';c.fillRect(86,166,68,70);c.fillRect(58,232,124,20);c.fillStyle='#c7baa0';c.fillRect(70,155,100,20);c.strokeStyle='#c6a660';c.lineWidth=9;c.beginPath();c.ellipse(120,91,75,72,0,0,7);c.stroke();c.lineWidth=5;for(const rotation of [-.6,.6]){c.beginPath();c.ellipse(120,91,35,72,rotation,0,7);c.stroke();}c.fillStyle='#74bcb3';c.beginPath();c.arc(120,91,14,0,7);c.fill();}return a;}
};
