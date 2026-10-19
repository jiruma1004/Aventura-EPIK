const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);load(rooms.findIndex(r=>r.physics));document.querySelector('#maze-notice').hidden=true});
 assert.deepEqual(await p.locator('#angle option').evaluateAll(options=>options.map(o=>o.value)),['30','45','60']);
 const initial=await p.locator('#cannon-target-live').innerText();assert(initial.includes('31 m'));assert(initial.includes('4.5 m'));assert(initial.includes('1.2 m'));
 const help=await p.evaluate(()=>cannonTargetHint(lab.room.physics));assert(help.includes('incógnita'));assert(help.includes('Voltea hacia atrás'));
 await p.evaluate(()=>{for(let i=0;i<3;i++)lab.target.miss();lab.update()});assert((await p.locator('#cannon-target-live').innerText()).includes('25 m'));
 await p.evaluate(()=>lab.reset(rooms[index]));
 assert.equal(await p.locator('#launch-mode').count(),0);assert.equal(await p.locator('#energy').count(),0);
 for(const [v,a,valid] of [[3,30,true],[4,45,true],[1,60,true],[30,30,true],[0,45,false],[31,45,false],[4,35,false],[4,90,false]]){
  assert.equal(await p.evaluate(([v,a])=>{lab.v.value=String(v);lab.a.value=String(a);lab.az.value='0';lab.update();return lab.valid&&Object.values(lab.result).filter(x=>typeof x==='number').every(Number.isFinite)},[v,a]),valid);
 }
 for(const [v,explodes] of [[20,false],[20.01,true]]){
  const result=await p.evaluate(v=>{lab.reset(rooms[index]);lab.v.value=String(v);lab.a.value='45';lab.az.value='0';lab.selected=1;lab.loadAmmo();let exploded=false;const launched=lab.launch(()=>{},()=>exploded=true);return {exploded,launched,limit:lab.room.physics.maxEnergy}},v);
  assert.equal(result.limit,200);assert.equal(result.exploded,explodes);assert.equal(result.launched,!explodes);
 }
 await p.evaluate(()=>{lab.reset(rooms[index]);lab.v.value='4';lab.a.value='30';lab.az.value='0';lab.selected=0;lab.loadAmmo();if(!lab.launch(()=>{}))throw Error('low-speed shot rejected');lab.tick(10)});assert(await p.evaluate(()=>lab.shot.done));
 for(const choice of [0,1]){
  const before=await p.evaluate(choice=>{load(rooms.findIndex(r=>r.conceptual));document.querySelector('#maze-notice').hidden=true;maze.restoreCheckpoint(3);window.selectedExit=maze.doors.find(d=>d.branch&&d.choice===choice);return renderer.exitPortals(rooms[index],false)},choice);assert.deepEqual(before,[]);
  const portal=await p.evaluate(()=>{maze.choose(selectedExit,player);Object.assign(player,{x:46,y:selectedExit.y+.5,angle:0,pitch:0});renderer.draw(rooms[index],player,false,0,1000,null,null);return renderer.exitPortals(rooms[index],false)});
  assert.deepEqual(portal,[{x:48.25,y:choice===0?6:10}]);await p.waitForTimeout(150);
  const rendered=await p.evaluate(()=>{const c=renderer.ctx,orig=c.drawImage.bind(c);let n=0;c.drawImage=(img,...args)=>{if(img===renderer.art.portalOpen)n++;orig(img,...args)};renderer.draw(rooms[index],player,false,0,1000,null,null);c.drawImage=orig;return n});assert(rendered>10,'chosen maze portal is visible');await p.locator('#game').screenshot({path:'/tmp/epik-maze-portal-'+choice+'.png'});
  await p.evaluate(()=>{player.x=48.26;maze.tick(.01,player)});assert(await p.evaluate(()=>maze.finished),'portal crossing completes maze');
 }
 await p.evaluate(()=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:23.7,y:7.5,angle:0,pitch:0})});
 assert.deepEqual(await p.evaluate(()=>renderer.exitPortals(rooms[index],false)),[]);
 assert.deepEqual(await p.evaluate(()=>renderer.exitPortals(rooms[index],true)),[{x:25.02,y:7}]);
 await p.evaluate(()=>renderer.draw(rooms[index],player,true,0,1000,null,null));await p.locator('#game').screenshot({path:'/tmp/epik-boss-portal.png'});
 const slices=await p.evaluate(()=>{const c=renderer.ctx,orig=c.drawImage.bind(c);let count=0;c.drawImage=(img,...args)=>{if(img===renderer.art.portalOpen)count++;orig(img,...args)};renderer.draw(rooms[index],player,true,0,1000,null,null);c.drawImage=orig;return count});assert(slices>10,'portal rendered with actual seal texture');
 assert.deepEqual(errors,[]);console.log('PASS low-speed/elevation shots, invalid bounds, exact 200 J boundary, both maze exits and unlocked boss portal rendering');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
