const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);mission.restart();classroom.session.start()});
async function enter(calc,truth){await p.evaluate(({calc,truth})=>{classroom.newSession();classroom.session.start();load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true;Object.assign(corridor.guardian,{calculationId:calc,truthful:truth});corridor.guardian.questionBags[2]=GUARDIAN_QUESTIONS.map(q=>q.id).filter(id=>id!==calc);Object.assign(player,{x:60,y:4.5,angle:0});corridor.tick(.01,player)},{calc,truth});assert(await p.locator('#guardian-panel').isHidden());await p.evaluate(()=>{Object.assign(player,{x:61.5,y:4.5});corridor.tick(.01,player)});assert(await p.locator('#guardian-panel').isVisible());}
async function answer(value){await p.locator(`#guardian-fields input[value="${value}"]`).check();await p.locator('#guardian-form button').click();}
// Every seal can use either speaker independently. Reopening and saves never reroll.
await enter('circle','book');
await p.evaluate(()=>{
 const g=corridor.guardian;
 for(const first of ['book','rodrigo'])for(const second of ['book','rodrigo'])for(const third of ['book','rodrigo']){
  g.truthful=first;g.voiceOrder=[second,third];
  for(let stage=0;stage<3;stage++){
   g.stage=stage;g.renderQuestion();const q=g.question,who=[first,second,third][stage];
   if(document.querySelector('#guardian-voice-'+who+' p').textContent!==I18n.t(q.trueLine))throw Error('Wrong speaker assignment');
   const saved=g.snapshot();g.restore(saved);
   if(JSON.stringify(g.voiceOrder)!==JSON.stringify([second,third])||g.question.trueLine!==q.trueLine)throw Error('Voices changed after recovery');
  }
 }
 g.stage=0;g.solved=false;const legacy={...g.snapshot(),version:2,draft:{choice:'book'}};delete legacy.voiceOrder;g.restore(legacy);
 if(g.stage!==0||Object.keys(g.draft).length)throw Error('Obsolete first-seal answer survived migration');
 g.stage=2;if(g.question.hint!==GUARDIAN_FOLLOWUPS.circle.hint)throw Error('Calculation guidance changed');
 g.stage=0;if(g.question.hint.length>85||/aceleración|velocidad/.test(g.question.hint))throw Error('Paola reveals first riddle');
 g.stage=1;if(g.question.hint!==GUARDIAN_CALCULATIONS.circle.hint)throw Error('First calculation must retain helpful guidance');
});
for(const calc of ['circle','position','drone'])for(const truth of ['book','rodrigo']){
 await enter(calc,truth);
 assert.equal(await p.locator('#guardian-fields input[type=number]').count(),0);
 await p.evaluate(()=>document.querySelector('#eric-ready-yes').click());assert.equal(await p.evaluate(()=>opened),false);
 // An answer cannot be submitted after stepping away, even if the DOM stays open.
 await p.evaluate(()=>{player.x=60;document.querySelector('#guardian-form').elements.choice.value=corridor.guardian.truthful;corridor.guardian.submit()});assert.equal(await p.evaluate(()=>corridor.guardian.stage),0);
 await p.evaluate(()=>player.x=61.5);
 await answer(truth==='book'?'rodrigo':'book');assert.equal(await p.evaluate(()=>corridor.guardian.stage),0);
 await answer(await p.evaluate(()=>corridor.guardian.question.answer));assert.equal(await p.evaluate(()=>corridor.guardian.stage),1);
 await p.evaluate(()=>corridor.guardian.submit());assert.equal(await p.evaluate(()=>corridor.guardian.stage),1,'duplicate submit cannot skip a seal');
 await p.locator('#guardian-next').click();await answer(await p.evaluate(()=>{const q=corridor.guardian.question;return q.choices.find(([id])=>id!==q.answer)[0]}));assert.equal(await p.evaluate(()=>corridor.guardian.stage),1,'earned seal persists');await answer(await p.evaluate(()=>corridor.guardian.question.answer));
 await p.locator('#guardian-next').click();assert.equal(await p.locator('#guardian-fields input[type=radio]').count(),4);assert.equal(await p.locator('#guardian-fields input[type=number]').count(),0);
 const right={circle:'a',position:'c',drone:'b'}[await p.evaluate(()=>corridor.guardian.calculationId)];await answer(right);assert.equal(await p.evaluate(()=>corridor.guardian.stage),3);assert.equal(await p.evaluate(()=>opened),false,'collision closed while gate animates');
 await p.evaluate(()=>corridor.tick(1.4,player));assert.equal(await p.evaluate(()=>opened),false);assert(Math.abs(await p.evaluate(()=>corridor.guardian.gateProgress)-.5)<.001);
 await p.evaluate(()=>corridor.tick(1.41,player));assert(await p.evaluate(()=>opened));assert(await p.evaluate(()=>classroom.solved()));
}
// Recover the exact seal, voices, calculation variant and penalty.
await enter('drone','rodrigo');await p.evaluate(()=>{for(const r of ADVENTURE_ORDER){if(r.corridor)break;classroom.session.state(r.id).solved=true;}classroom.session.preview=false;recovery.enabled=true;});await answer('rodrigo');await p.locator('#guardian-next').click();
for(let i=0;i<3;i++)await answer(await p.evaluate(()=>{const q=corridor.guardian.question;return q.choices.find(([id])=>id!==q.answer)[0]}));assert(await p.locator('#guardian-palma').isVisible());await p.locator('#guardian-palma').click();assert(await p.locator('#extra-help-panel').isVisible());await p.evaluate(()=>{classroom.aid.close();recovery.save()});await p.reload();await p.evaluate(()=>document.querySelector('#epik-dev')?.close());await p.locator('#recovery-yes').click();
assert.equal(await p.evaluate(()=>corridor.guardian.stage),1);assert.equal(await p.evaluate(()=>corridor.guardian.truthful),'rodrigo');assert.equal(await p.evaluate(()=>player.x),61.5);assert(await p.evaluate(()=>classroom.session.state('room-04').assisted));await p.evaluate(()=>corridor.tick(.01,player));await answer(await p.evaluate(()=>corridor.guardian.question.answer));await p.locator('#guardian-next').click();
async function draw(){await p.evaluate(async()=>{const g=corridor.guardian;await Promise.all([g.statue,g.rodrigo,g.frame,g.leaves,g.fountain].map(i=>i.decode()));renderer.draw(rooms[index],player,opened,0,0);if(renderer.outdoor.rpgCastle)await renderer.outdoor.rpgCastle.decode();renderer.draw(rooms[index],player,opened,0,0);corridor.draw(renderer,player,renderer.actors);renderer.outdoor.draw(renderer,rooms[index],player,renderer.actors,0);});}
await draw();await p.locator('.scene-view').screenshot({path:'/tmp/epik-twin-dialogue.png'});
await p.evaluate(()=>corridor.guardian.close());await draw();await p.locator('#game').screenshot({path:'/tmp/epik-twin-gate.png'});
await p.evaluate(()=>interact());await answer({circle:'a',position:'c',drone:'b'}[await p.evaluate(()=>corridor.guardian.calculationId)]);await p.evaluate(()=>{corridor.tick(1,player);recovery.save()});await p.reload();await p.evaluate(()=>document.querySelector('#epik-dev')?.close());await p.locator('#recovery-yes').click();assert.equal(await p.evaluate(()=>corridor.guardian.stage),3);assert.equal(await p.evaluate(()=>opened),false);await p.evaluate(()=>corridor.tick(2,player));assert(await p.evaluate(()=>opened));await draw();await p.locator('#game').screenshot({path:'/tmp/epik-twin-open.png'});
assert.equal(await p.evaluate(()=>EpikRanks.room(classroom.session,rooms[index]).stars),1);
await p.evaluate(()=>{Object.assign(player,{x:67.4,y:4.5,angle:0});keys.add('w');for(let i=0;i<12;i++)tick(last+40);keys.clear()});assert(await p.evaluate(()=>!!rooms[index].boss));
await p.setViewportSize({width:390,height:844});await enter('position','book');await draw();await p.screenshot({path:'/tmp/epik-twin-mobile.png'});const boxes=await p.locator('.guardian-voice').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));assert(boxes.every(r=>r.x>=0&&r.x+r.w<=390));assert(boxes[0].x+boxes[0].w<=boxes[1].x+2,'mobile voices do not overlap');await p.locator('#guardian-form button').scrollIntoViewIfNeeded();
// Restore the original newspaper layout while retaining the exact approved portrait image.
await p.setViewportSize({width:1280,height:900});await p.evaluate(async()=>{corridor.guardian.close();prologue.done=false;prologue.started=true;prologue.step=3;prologue.renderPage();await prologue.images.ivan.decode();prologue.drawFace();prologue.reveal();document.querySelector('#story-name-box').hidden=true;document.querySelector('#adventure-intro').showModal()});await p.locator('.story-portrait').screenshot({path:'/tmp/epik-paper-restored.png'});assert(await p.locator('.missing-headline').isVisible());assert(await p.evaluate(()=>prologue.images.ivan.src.includes('ivan-newspaper-approved-b.webp')));
assert.deepEqual(errors,[]);console.log('PASS six guardian/variant combinations, three multiple-choice seals, tile-only answers, duplicate-click guard, hints/Palma/recovery, animated collision gate, physical exit, mobile voices and restored newspaper.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
