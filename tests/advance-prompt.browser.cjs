const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const p=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);window.testAdvance={el:document.querySelector("#advance-prompt"),update:AdvancePrompt.prototype.update}});
for(const flag of ['trial','physics','roulette','corridor','boss','measurement']){
 await p.evaluate(flag=>{load(rooms.findIndex(r=>r[flag]),'preview');testAdvance.update({opened:false,maze:null,playing:true})},flag);assert(await p.locator('#advance-prompt').isHidden());
 await p.evaluate(()=>testAdvance.update({opened:true,maze:null,playing:true}));assert(await p.locator('#advance-prompt').isVisible());assert.equal(await p.locator('#advance-prompt').textContent(),'Adelante');
 await p.evaluate(()=>testAdvance.update({opened:true,maze:null,playing:false}));assert(await p.locator('#advance-prompt').isHidden());
}
await p.evaluate(()=>{load(rooms.findIndex(r=>r.conceptual),'preview');const door=maze.doors.find(d=>d.stage===maze.stage&&d.correct);maze.choose(door,player);testAdvance.update({opened:false,maze,playing:true})});assert(await p.locator('#advance-prompt').isVisible(),'opened maze door gets an advance cue');
await p.evaluate(()=>{maze.stage++;testAdvance.update({opened:false,maze,playing:true})});assert(await p.locator('#advance-prompt').isHidden(),'old door does not mark the next challenge ready');
await p.evaluate(()=>{I18n.set('en');testAdvance.update({opened:true,maze:null,playing:true})});assert.equal(await p.locator('#advance-prompt').textContent(),'Go ahead');
await p.setViewportSize({width:390,height:844});const box=await p.locator('#advance-prompt').boundingBox();assert(box.x>=0&&box.x+box.width<=390);assert.equal(await p.locator('#advance-prompt').evaluate(e=>getComputedStyle(e).pointerEvents),'none');assert.deepEqual(errors,[]);console.log('PASS exits, maze doors without answer disclosure, hidden during overlays, English and mobile');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
