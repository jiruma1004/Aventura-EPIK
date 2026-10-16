const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const url=(process.env.BASE_URL||'http://127.0.0.1:8765')+'/?dev=1';
 const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);await page.goto(url);
 await page.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish();arrival.finish()});
 assert(await page.locator('#control-tutorial-choice').isVisible());
 assert.equal(await page.evaluate(()=>mission.state),'ready');assert.equal(await page.evaluate(()=>canPlay()),false);
 await page.screenshot({path:'/tmp/epik-tutorial-choice.png'});await page.locator('#control-tutorial-start').click();
 assert(await page.locator('#control-tutorial').isVisible());assert.equal(await page.evaluate(()=>controlTutorial.active&&canPlay()),true);assert.equal(await page.evaluate(()=>mission.state),'ready');
 await page.locator('#game').focus();await page.keyboard.down('w');await page.evaluate(()=>{for(let i=0;i<12;i++)tick(last+40)});await page.keyboard.up('w');await page.waitForTimeout(420);
 assert.equal(await page.evaluate(()=>controlTutorial.current()),'run');
 // Walking alone must not complete the running lesson.
 await page.evaluate(()=>{player.x=2;controlTutorial.tick(player,false);player.x=2.3;controlTutorial.tick(player,false)});await page.waitForTimeout(420);assert.equal(await page.evaluate(()=>controlTutorial.current()),'run');
 await page.locator('#game').focus();await page.keyboard.down('Shift');await page.keyboard.down('w');await page.evaluate(()=>{for(let i=0;i<5;i++)tick(last+40)});await page.keyboard.up('w');await page.keyboard.up('Shift');await page.waitForTimeout(420);
 assert.equal(await page.evaluate(()=>controlTutorial.current()),'look');
 await page.evaluate(()=>{tick(last+40);player.angle+=.3;tick(last+40)});await page.waitForTimeout(420);assert.equal(await page.evaluate(()=>controlTutorial.current()),'jump');
 await page.locator('#game').focus();await page.keyboard.press('Space');await page.waitForTimeout(420);assert.equal(await page.evaluate(()=>controlTutorial.current()),'interact');
 await page.locator('#game').focus();await page.keyboard.press('e');await page.waitForTimeout(420);assert.equal(await page.evaluate(()=>controlTutorial.current()),'finish');
 assert.equal(await page.evaluate(()=>mission.state),'ready');await page.screenshot({path:'/tmp/epik-tutorial-finished.png'});
 await page.locator('#control-tutorial-finish').click();assert.equal(await page.evaluate(()=>mission.state),'running');assert.equal(await page.evaluate(()=>controlTutorial.active),false);assert.equal(await page.evaluate(()=>player.x),2.5);assert(await page.locator('#maze-notice').isVisible());
 const touchContext=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true,deviceScaleFactor:1});const touchPage=await touchContext.newPage();await touchPage.addInitScript(()=>window.requestAnimationFrame=()=>0);await touchPage.goto(url);await touchPage.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish();arrival.finish()});
 assert.match(await touchPage.locator('[data-tutorial-choice-copy]').innerText(),/palanca/i);await touchPage.locator('#control-tutorial-start').click();await touchPage.evaluate(()=>tick(last+16));assert(await touchPage.locator('#touch-controls').isVisible());assert.match(await touchPage.locator('[data-tutorial-title]').innerText(),/bolita/i);await touchPage.screenshot({path:'/tmp/epik-tutorial-touch.png'});
 await touchPage.evaluate(()=>{controlTutorial.tick(player);player.x+=.7;controlTutorial.tick(player)});await touchPage.waitForTimeout(420);assert.equal(await touchPage.evaluate(()=>controlTutorial.current()),'run');
 assert(await touchPage.locator('#touch-run').isVisible());await touchPage.locator('#touch-run').tap();assert.equal(await touchPage.evaluate(()=>touch.sprinting),true);
 await touchPage.evaluate(()=>{controlTutorial.tick(player,touch.sprinting);touch.forward=-1;for(let i=0;i<6;i++)tick(last+40);touch.forward=0});await touchPage.waitForTimeout(420);assert.equal(await touchPage.evaluate(()=>controlTutorial.current()),'look');
 await touchPage.locator('#touch-run').tap();assert.equal(await touchPage.evaluate(()=>touch.sprinting),false);

 assert.deepEqual(errors,[]);await browser.close();console.log('PASS optional control tutorial, paused clock, five verified steps including keyboard and touch sprint, reset and touch-specific guidance');
})().catch(error=>{console.error(error);process.exit(1)});
