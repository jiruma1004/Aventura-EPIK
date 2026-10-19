const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const p=await b.newPage({viewport:{width:1200,height:900}}),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true)});assert(!requests.some(s=>s.includes('epis-farewell-v1')),'farewell does not load during gameplay');
for(const route of ['wave','particle']){
 await p.evaluate(route=>{load(rooms.findIndex(r=>r.rocket));StoryRoute.reset();StoryRoute.choose(route);ignitia.mode='epilogue';ignitia.beginCredits()},route);
 await p.evaluate(()=>ignitia.farewell.prepare());assert(await p.locator('#chapter-ending').isHidden());await p.evaluate(()=>{ignitia.credits.close(true);for(const a of document.querySelector('#chapter-ending-text').getAnimations())a.finish()});
 assert(await p.locator('#chapter-ending').isVisible());assert.equal(await p.evaluate(()=>ignitia.mode),'ending');assert.equal(await p.locator('#epi-farewell-canvas').count(),1);assert.equal(await p.locator('#epi-farewell-replay').count(),1);
 const pose0=await p.evaluate(()=>document.querySelector('#epi-farewell-canvas').toDataURL());await p.evaluate(()=>ignitia.farewell.tick(2.4));const pose2=await p.evaluate(()=>document.querySelector('#epi-farewell-canvas').toDataURL());assert.notEqual(pose0,pose2,'bow uses new poses');await p.evaluate(()=>ignitia.farewell.tick(5));assert.equal(await p.evaluate(()=>ignitia.farewell.age),7);
 await p.locator('#epi-farewell-replay').click();assert.equal(await p.evaluate(()=>ignitia.farewell.age),0);
}
await p.evaluate(()=>{ignitia.farewell.age=2.4;ignitia.farewell.draw()});await p.locator('#chapter-ending').screenshot({path:'/tmp/epi-farewell-desktop.png'});
await p.setViewportSize({width:390,height:844});await p.selectOption('#touch-mode','touch');await p.evaluate(()=>{touch.sync();ignitia.farewell.draw()});await p.locator('#chapter-ending').screenshot({path:'/tmp/epi-farewell-mobile.png'});
for(const id of ['#chapter-ending-text','#epi-farewell-replay']){const box=await p.locator(id).boundingBox();assert(box.x>=0&&box.x+box.width<=390)}
await p.emulateMedia({reducedMotion:'reduce'});await p.evaluate(()=>ignitia.farewell.open());assert.equal(await p.evaluate(()=>ignitia.farewell.animate),false);await p.locator('#epi-farewell-replay').click();assert(await p.evaluate(()=>ignitia.farewell.animate));await p.evaluate(()=>{I18n.set('en')});assert((await p.locator('#chapter-ending-text').innerText()).includes('Thank you'));assert.deepEqual(errors,[]);
if(process.env.RENDER_FAREWELL){
 await p.emulateMedia({reducedMotion:'no-preference'});await p.setViewportSize({width:1040,height:820});await p.selectOption('#touch-mode','desktop');await p.addStyleTag({content:'.scene-view{width:960px!important;height:540px!important;min-height:540px!important}#game{width:960px!important;height:540px!important;min-height:540px!important}'});
 await p.evaluate(()=>{I18n.set('es');ignitia.farewell.open();for(const a of document.querySelector('#chapter-ending-text').getAnimations())a.finish()});fs.mkdirSync('/tmp/epi-farewell-frames',{recursive:true});
 for(let i=0;i<168;i++){await p.evaluate(t=>{ignitia.farewell.age=t;ignitia.farewell.draw()},i/24);await p.locator('#chapter-ending').screenshot({path:`/tmp/epi-farewell-frames/${String(i).padStart(4,'0')}.png`});}
}
await p.evaluate(()=>load(rooms.findIndex(r=>r.trial)));assert(await p.locator('#chapter-ending').isHidden());assert.equal(await p.evaluate(()=>ignitia.farewell.active),false);console.log('PASS both ending routes, lazy single atlas, bow poses and replay, mobile layout, reduced motion, English and cleanup');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
