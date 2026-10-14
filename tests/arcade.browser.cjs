const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>requestAnimationFrame=()=>0);
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:8769')+'/?dev=1');
 await page.locator('#story-student-name').fill('Estudiante de prueba');
 await page.click('#story-skip');assert(await page.locator('#adventure-intro').isVisible(),'Must select experience before starting');
 await page.locator('input[value=easy]').check();
 const dir=path.resolve(__dirname,'../../previews/arcade');fs.mkdirSync(dir,{recursive:true});
 await page.evaluate(async()=>{await Promise.all(Object.values(prologue.images).map(im=>im.decode()));prologue.drawFace();});
 await page.screenshot({path:path.join(dir,'easy-start.png')});
 await page.setViewportSize({width:390,height:844});await page.locator('input[value=easy]').scrollIntoViewIfNeeded();assert(await page.locator('input[value=easy]').isVisible());
 assert(await page.evaluate(()=>document.querySelector('#adventure-intro').scrollWidth<=document.querySelector('#adventure-intro').clientWidth+1));
 await page.setViewportSize({width:1280,height:850});
 await page.click('#story-skip');assert.equal(await page.evaluate(()=>EpikDifficulty.mode),'easy');
 await page.evaluate(()=>{document.querySelector('#maze-notice').hidden=true;arrival.finish();});
 assert.match(await page.locator('.concept-instruction').innerText(),/último tablón/);
 // Actual land/death/respawn path, including recovery and absent wrong planks.
 for(const easy of [true,false]){
 const state=await page.evaluate(easy=>{
  EpikDifficulty.select(easy?'easy':'normal');newClassroomGame();document.querySelector('#maze-notice').hidden=true;
  for(let n=0;n<2;n++){const p=trial.platforms().find(p=>p.stage===n&&p.answer===trial.question.answer);Object.assign(player,{x:p.x+.75,y:p.y+.7,jumpHeight:0});trial.land(player);}
  const safe=trial.platforms().find(p=>p.stage===1&&p.answer===true);
  const bad=trial.platforms().find(p=>p.stage===2&&p.answer!==trial.question.answer);Object.assign(player,{x:bad.x+.75,y:bad.y+.7,jumpHeight:0});trial.land(player);respawn();
  recovery.enabled=true;recovery.save();const saved=JSON.parse(localStorage.getItem(EpikRecovery.key));
  return {x:player.x,y:player.y,safe:{x:safe.x+.75,y:safe.y+.7},stage:trial.stage,badSupported:trial.supports(bad.x+.75,bad.y+.7),mode:saved.session.difficulty,savedX:saved.world.checkpoint.position.x};
 },easy);
 assert.equal(state.stage,2);assert(!state.badSupported);assert.equal(state.x,easy?state.safe.x:2.5);assert.equal(state.savedX,state.x);assert.equal(state.mode,easy?'easy':'normal');
 if(easy){await page.reload();await page.click('#recovery-yes');assert.equal(await page.evaluate(()=>EpikDifficulty.mode),'easy');assert.equal(await page.evaluate(()=>player.x),state.x);}
 }
 // Speeds and attack schedules for both profiles, with no fire in easy mode.
 const modes=await page.evaluate(()=>['normal','easy'].map(mode=>{
  EpikDifficulty.select(mode);load(2);document.querySelector('#maze-notice').hidden=true;
  const speed=maze.speed;load(3);const speedSymbols=corridor.speed,interval=corridor.spawnInterval;
  load(4);document.querySelector('#maze-notice').hidden=true;
  let throws=[];boss.potions.onEvent=t=>{if(t==='throw')throws.push(boss.potions.time)};
  const p={x:3,y:7.5,jumpHeight:1};for(let t=0;t<35;t+=.01)boss.potions.tick(.01,p);
  const wave=new EricFlameWave(()=>{});wave.tick(18,p);const firstPhase=wave.phase;
  return {mode,speed,speedSymbols,interval,throws,firstPhase};
 }));
 assert.equal(modes[0].speed,.8751645);assert(Math.abs(modes[1].speed-.7001316)<1e-9);
 assert.equal(modes[0].speedSymbols,1.6);assert(Math.abs(modes[1].speedSymbols-1.28)<1e-9);
 assert(Math.abs(modes[1].interval/modes[0].interval-1.5625)<1e-9);
 assert(Math.abs(modes[0].throws[1]-modes[0].throws[0]-10.8)<.02);
 assert(Math.abs(modes[1].throws[1]-modes[1].throws[0]-16.2)<.02);
 assert.equal(modes[0].firstPhase,'warning');assert.equal(modes[1].firstPhase,'idle');
 // Real encounter cannot leak a flame event in easy mode.
 assert(await page.evaluate(()=>{let flame=false;boss.wave.onEvent=()=>flame=true;for(let i=0;i<600;i++)boss.tick(.1,{x:3,y:7.5,jumpHeight:1},renderer,rooms[index],false);return !flame}));
 // Collision border shrinks; center remains lethal.
 assert(await page.evaluate(()=>{const c=new RelaxCorridor(()=>{});c.symbols=[{x:10,y:4,age:1,text:'π'}];c.spawnClock=99;c.tick(0,{x:10.41,y:4,jumpHeight:0});if(c.caught)return false;c.tick(0,{x:10.38,y:4,jumpHeight:0});return c.caught}));
 // Pursuit warning enters centered once, docks, and stays docked after respawn.
 await page.evaluate(()=>{load(2);mission.resume();document.querySelector('#maze-notice').hidden=true;companions.chaseAnnounced=false;maze.awaken();companions.tick(.01,player,renderer,false,true);renderer.draw(rooms[index],player,false,0,1);});
 assert(await page.locator('#chase-indicator').evaluate(el=>el.classList.contains('chase-intro')));
 await page.screenshot({path:path.join(dir,'pursuit-centered.png')});
 await page.evaluate(()=>companions.tick(3.6,player,renderer,false,true));await page.waitForTimeout(850);
 assert(!await page.locator('#chase-indicator').evaluate(el=>el.classList.contains('chase-intro')));
 await page.screenshot({path:path.join(dir,'pursuit-docked.png')});
 await page.evaluate(()=>{maze.reset();maze.awaken();companions.tick(.1,player,renderer,false,true)});
 assert(!await page.locator('#chase-indicator').evaluate(el=>el.classList.contains('chase-intro')));
 // Render the new actor against the actual world and its single capture pose.
 await page.evaluate(async()=>{await renderer.actors.ivan.decode();maze.enemy={x:player.x+1.6,y:player.y};renderer.draw(rooms[index],player,false,0,1000);renderer.actors.draw(renderer,rooms[index],player,false,1000,maze);});
 await page.locator('#game').screenshot({path:path.join(dir,'ivan-pursuit.png')});
 // Light switches to the laugh clip and the atlas is decoded, not a placeholder.
 await page.evaluate(async()=>{cinematics.play('ivan-descenso');await cinematics.ready;cinematics.time=29;cinematics.draw();});
 await page.locator('.cinema-screen').screenshot({path:path.join(dir,'ivan-allies.png')});
 await page.evaluate(()=>{cinematics.time=28.05;cinematics.draw();});
 const frames=await page.evaluate(()=>[28.05,28.2,28.4].map(t=>RPGCast.frame('laugh',t-28)));assert(new Set(frames).size>1);
 // Display each star tier; all use text equivalents for accessibility.
 const colors=await page.evaluate(()=>{
  const c=cinematics.certificateReverse||new CertificateReverse();
  const parent=document.createElement('div');document.body.append(parent);
  const data=[1,2,3,4,5].map(n=>{const s=c.stars(parent,n);const color=getComputedStyle(s).color;return {color,animation:getComputedStyle(s.firstElementChild,'::after').animationName,label:s.getAttribute('aria-label')};});parent.remove();return data;
 });
 assert.notEqual(colors[0].color,colors[1].color);assert.equal(colors[1].color,colors[2].color);assert.equal(colors[3].color,colors[4].color);assert.notEqual(colors[2].color,colors[3].color);assert.equal(colors[4].animation,'star-glint');assert.match(colors[4].label,/5 de 5/);
 assert.deepEqual(errors,[]);console.log('PASS experience choice, normal/easy checkpoints, broken planks, recovery, both speeds and schedules, no easy flame, collision margin and one-time warning.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
