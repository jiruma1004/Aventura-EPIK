const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);mission.restart();classroom.newSession();classroom.session.start();load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:61.5,y:4.5,angle:0});corridor.tick(.01,player);});
async function answer(correct){const value=await p.evaluate(correct=>{const q=corridor.guardian.question;return correct?q.answer:q.choices.find(([id])=>id!==q.answer)[0]},correct);await p.locator(`#guardian-fields input[value="${value}"]`).check();await p.locator('#guardian-form button').click();}
for(let stage=0;stage<3;stage++){
 const ids=[await p.evaluate(()=>corridor.guardian.question.id)];
 for(let i=0;i<5;i++){
  const old=await p.evaluate(()=>corridor.guardian.question.id);await answer(false);const now=await p.evaluate(()=>corridor.guardian.question.id);assert.notEqual(now,old);ids.push(now);assert.equal(await p.evaluate(()=>corridor.guardian.stage),stage);assert.equal(await p.locator('#guardian-fields input:checked').count(),0);
  const state=await p.evaluate(()=>{const g=corridor.guardian,s=g.snapshot();g.restore(JSON.parse(JSON.stringify(s)));g.open(player);return {saved:s,now:g.snapshot()};});assert.deepEqual(state.now,state.saved);
  if(i===2)assert(await p.locator('#guardian-palma').isVisible(),'three errors unlock Palma even across variants');
 }
 assert.equal(new Set(ids.slice(0,3)).size,3,'initial bag visits all three questions');
 await answer(true);if(stage<2)await p.locator('#guardian-next').click();
}
await p.evaluate(()=>corridor.tick(3,player));assert(await p.evaluate(()=>opened));
const geometry=await p.evaluate(()=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;boss.stopAttacks();const room=rooms[index],data={before:[],after:[],tiles:[]};for(let x=17.1;x<24;x+=.8)for(const y of [1.2,1.7,2.5,7.5,12.8,13.8]){Object.assign(player,{x,y,jumpHeight:0,jumpVelocity:0});jump();data.before.push(player.jumpVelocity>0);data.tiles.push(room.map[Math.floor(y)][Math.floor(x)]);}ignitia.onEvent('escapeDone');for(const y of [1.2,6.8,7.5,8.2,13.8]){Object.assign(player,{x:20,y,jumpHeight:0,jumpVelocity:0});jump();data.after.push(player.jumpVelocity>0);}return data;});assert(geometry.before.every(v=>!v));assert(geometry.tiles.every(v=>v===3));assert.deepEqual(geometry.after,[false,false,true,false,false]);
for(const y of [1.25,13.75]){await p.evaluate(y=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;boss.stopAttacks();Object.assign(player,{x:16.7,y,angle:0,jumpHeight:0,jumpVelocity:0});keys.add('w');for(let i=0;i<15&&!death;i++)tick(last+40);keys.clear();},y);assert.equal(await p.evaluate(()=>death?.type),'pit','edge path must fall');}
await p.evaluate(async()=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;boss.stopAttacks();Object.assign(player,{x:15.3,y:3.2,angle:.25,pitch:-.1});await boss.eric.decode();renderer.draw(rooms[index],player,opened,0,0);boss.draw(renderer,player,renderer.actors);});await p.locator('#game').screenshot({path:'/tmp/epik-arena-pit.png'});
await p.evaluate(()=>{Object.assign(player,{x:6,y:7.5,angle:0,pitch:.06});renderer.draw(rooms[index],player,opened,0,0);boss.draw(renderer,player,renderer.actors);});await p.locator('#game').screenshot({path:'/tmp/epik-arena-style.png'});
assert.deepEqual(errors,[]);console.log('PASS rotating questions after every error, nonrepeating bags, retained seals and aid counters, exact pool recovery, full-width pit, side-route deaths and central bridge.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
