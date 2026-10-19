const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const p=await b.newPage({viewport:{width:1100,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);load(rooms.findIndex(r=>r.roulette));document.querySelector('#maze-notice').hidden=true;document.querySelector('#game').focus();});
assert(await p.evaluate(()=>canPlay()));
await p.keyboard.down('w');await p.keyboard.press('h');
assert(await p.locator('#paola-dialog').isVisible());assert(await p.evaluate(()=>keys.has('w')),'help must preserve held movement');
const walk=await p.evaluate(()=>{const before={x:player.x,y:player.y};tick(last+40);return Math.hypot(player.x-before.x,player.y-before.y)});assert(walk>.01,'actual player moves while Paola speaks');await p.keyboard.up('w');
await p.locator('#paola-close').click();await p.locator('#ask-paola').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'game');
await p.keyboard.down('a');assert(await p.evaluate(()=>keys.has('a')));await p.keyboard.up('a');await p.locator('#paola-skip').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'game');
await p.locator('#paola-close').click();await p.locator('#paola-formula-open').click();assert(await p.locator('#paola-formula-content').isVisible());await p.keyboard.down('s');assert(await p.evaluate(()=>keys.has('s')));await p.keyboard.up('s');
for(const viewport of [{width:1024,height:768},{width:844,height:390},{width:390,height:844}]){
 await p.setViewportSize(viewport);await p.selectOption('#touch-mode','touch');await p.evaluate(()=>touch.sync());assert(await p.locator('#touch-stick').isVisible());
 const panel=await p.locator('#paola-dialog').boundingBox(),stick=await p.locator('#touch-stick').boundingBox();assert(panel.y+panel.height<=stick.y,`help overlaps joystick at ${viewport.width}`);
 const x=stick.x+stick.width/2,y=stick.y+stick.height/2;
 await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x,y-30);assert(await p.evaluate(()=>touch.forward>.1),'joystick usable during help');
 const move=await p.evaluate(()=>{const before={x:player.x,y:player.y};tick(last+40);return Math.hypot(player.x-before.x,player.y-before.y)});assert(move>.01);await p.mouse.up();
}
const rates=await p.evaluate(()=>({normal:EpikDifficulty.profiles.normal,easy:EpikDifficulty.profiles.easy,flame:EricFlameWave.config}));
assert(Math.abs(10.8/rates.normal.potionInterval-1.1)<1e-10);assert(Math.abs(16.2/rates.easy.potionInterval-1.1)<1e-10);assert(Math.abs(22.8/rates.flame.interval-1.1)<1e-10);assert.equal(rates.easy.flameEnabled,false);
await p.screenshot({path:'/tmp/paola-help-movement-mobile.png'});assert.deepEqual(errors,[]);console.log('PASS keyboard held/new input, dialogue buttons, formulary, live joystick without overlap at tablet/mobile sizes, +10% attack cadence');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
