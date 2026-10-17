const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');
await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);mission.restart();classroom.session.start();load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;boss.stopAttacks();});
await p.evaluate(async()=>{Object.assign(player,{x:7,y:6,angle:.12,pitch:.18});await boss.eric.decode();renderer.draw(rooms[index],player,opened,0,0);boss.draw(renderer,player,renderer.actors);});await p.locator('#game').screenshot({path:'/tmp/epik-machinery-overview.png'});
await p.evaluate(()=>{Object.assign(player,{x:10.1,y:2.2,angle:0,pitch:0});keys.add('w');boss.tick(.01,player,renderer,rooms[index],opened);});assert(await p.locator('#boss-panel').isVisible());assert.equal(await p.evaluate(()=>keys.size),0);assert((await p.locator('#boss-panel').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('8, 60, 48'),'hologram keeps its green surface over global console theme');
await p.locator('#boss-close').click();await p.evaluate(()=>boss.tick(.01,player,renderer,rooms[index],opened));assert(await p.locator('#boss-panel').isHidden(),'closing does not immediately reopen');
await p.evaluate(()=>{player.x=8;boss.tick(.01,player,renderer,rooms[index],opened);player.x=10.1;boss.tick(.01,player,renderer,rooms[index],opened);renderer.draw(rooms[index],player,opened,0,0);boss.draw(renderer,player,renderer.actors);});assert(await p.locator('#boss-panel').isVisible());await p.screenshot({path:'/tmp/epik-laser-hologram.png'});
await p.locator('#boss-x').fill('0');await p.locator('#boss-y').fill('0');await p.locator('#boss-form button').click();assert.equal(await p.evaluate(()=>boss.puzzle.cuts[0]),false);
const roots=await p.evaluate(()=>boss.puzzle.support.intersections);
for(let i=0;i<2;i++){
 if(i)await p.evaluate(()=>{Object.assign(player,{x:10.1,y:12.8,angle:0});boss.tick(.01,player,renderer,rooms[index],opened);});
 await p.locator('#boss-x').fill(String(roots[i][0]));await p.locator('#boss-y').fill(String(roots[i][1]));await p.locator('#boss-form button').click();assert.equal(await p.evaluate(i=>boss.puzzle.cuts[i],i),true);
}
assert(await p.evaluate(()=>boss.puzzle.solved));
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;boss.stopAttacks();Object.assign(player,{x:10.1,y:2.2,angle:0});boss.tick(.01,player,renderer,rooms[index],opened);});
assert(await p.locator('#boss-panel').isVisible());const rect=await p.locator('#boss-panel').boundingBox();assert(rect.x>=0&&rect.x+rect.width<=390);await p.locator('#boss-form button').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/epik-laser-mobile.png'});
assert.deepEqual(errors,[]);console.log('PASS automatic near-console opening, close/re-entry latch, invalid and valid coordinates, both cuts, mobile hologram and cached hardware render.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
