const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:8769')+'/?dev=1');
 const dir=path.resolve(__dirname,'../../previews/guidance-polish');fs.mkdirSync(dir,{recursive:true});
 await page.locator('#story-student-name').fill('Prueba');await page.locator('input[value=easy]').check();
 await page.evaluate(async()=>{prologue.started=true;prologue.step=3;prologue.renderPage();await prologue.images.ivan.decode();prologue.drawFace()});
 await page.locator('#adventure-intro').screenshot({path:path.join(dir,'ivan-newspaper.png')});
 await page.evaluate(()=>prologue.finish(true));
 await page.evaluate(async()=>{cinematics.bloopers??=new EpikBloopers();cinematics.bloopers.open(()=>{});cinematics.bloopers.show(4);await cinematics.bloopers.ready;cinematics.bloopers.time=4.4;cinematics.bloopers.draw()});
 await page.locator('#epik-bloopers').screenshot({path:path.join(dir,'karla-tea.png')});
 await page.evaluate(()=>{cinematics.bloopers.close();EpikDifficulty.select('easy');load(rooms.findIndex(r=>r.physics),'preview');document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:1.35,y:4,angle:Math.atan2(-.5,2.15),pitch:0})});await page.waitForTimeout(100);
 await page.locator('#game').screenshot({path:path.join(dir,'cannon-prompt.png')});
 await page.evaluate(()=>{EpikDifficulty.select('normal');load(rooms.findIndex(r=>r.trial),'preview');document.querySelector('#maze-notice').hidden=true;document.querySelector('#question-bubble').hidden=true;trial.finished=true;trial.stage=5;Object.assign(player,{x:14.5,y:3.85,angle:0,pitch:0})});await page.waitForTimeout(100);
 await page.locator('#game').screenshot({path:path.join(dir,'castle-sign.png')});
 const state=await page.evaluate(()=>({potion:EpikDifficulty.profiles.easy.potionInterval,tea:CINEMA_ASSETS.karlaTea,ivan:prologue.images.ivan.src}));
 assert.equal(state.potion,16.2);assert.match(state.tea,/karla-tea-villain-v6\.png/);assert.match(state.ivan,/ivan-front-newspaper-v2/);assert.deepEqual(errors,[]);
 console.log('PASS: villain tea sheet, adult Iván newspaper, 16.2s easy potions, cannon prompt and castle sign.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
