const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
 await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);mission.restart();classroom.newSession();classroom.session.start();});
 // Optional reference renderer supplied by the developer to compare the exact
 // raster output and draw-call count before/after the shared-floor optimization.
 if(process.env.BASELINE_RENDERER){
  await p.evaluate(source=>(0,eval)(source.replace('window.EscapeRenderer =','window.BeforeRenderer =')),fs.readFileSync(process.env.BASELINE_RENDERER,'utf8'));
  const rows=await p.evaluate(()=>{
   const results=[];
   for(const choose of [r=>r.trial,r=>r.physics,r=>r.roulette,r=>r.conceptual,r=>r.corridor,r=>r.boss]){
    const i=rooms.findIndex(choose);if(i<0)continue;load(i);const room=rooms[i];
    // Aim down each room, also testing floor projection during a jump/pitched view.
    player.pitch=.07;player.jumpHeight=.2;
    const c=renderer.ctx,fill=c.fillRect.bind(c);let count=0;c.fillRect=(...args)=>{count++;return fill(...args);};
    BeforeRenderer.prototype.draw.call(renderer,room,player,false,0,1234,lab,roulette);count=0;c.clearRect(0,0,renderer.canvas.width,renderer.canvas.height);BeforeRenderer.prototype.draw.call(renderer,room,player,false,0,1234,lab,roulette);const before=c.getImageData(0,0,renderer.canvas.width,renderer.canvas.height).data,oldCalls=count;
    count=0;c.clearRect(0,0,renderer.canvas.width,renderer.canvas.height);renderer.draw(room,player,false,0,1234,lab,roulette);const after=c.getImageData(0,0,renderer.canvas.width,renderer.canvas.height).data,newCalls=count;c.fillRect=fill;
    let changed=0;for(let n=0;n<before.length;n++)if(before[n]!==after[n])changed++;
    results.push({room:room.id,oldCalls,newCalls,changed});
   }
   return results;
  });
  for(const row of rows){assert.equal(row.changed,0,'Exact floor pixels preserved in '+row.room);assert(row.newCalls<=row.oldCalls);}
  console.log('Floor rendering:',JSON.stringify(rows));
 }
 await p.evaluate(async()=>{load(rooms.findIndex(r=>r.rocket));document.querySelector('#maze-notice').hidden=true;ignitia.reveal();document.querySelector('#ignitia-next').click();await ignitia.rocket.decode();tick(last+16);});
 assert.equal(await p.evaluate(()=>rooms[index].rocket),true);
 await p.locator('.scene-view').screenshot({path:'/tmp/epik-launchpad-desktop.png'});
 const cache=await p.evaluate(()=>{const a=IgnitiaLaunchpad.texture('banner');return a===IgnitiaLaunchpad.texture('banner')});assert(cache);
 // Hidden portraits must not consume draws in the gameplay loop. Visible speech still animates.
 const portraits=await p.evaluate(()=>{let count=0;const fn=ignitia.drawPortrait.bind(ignitia);ignitia.drawPortrait=()=>{count++;fn()};for(let n=0;n<60;n++)ignitia.tick(1/60);const hidden=count;ignitia.speak('Ignitia está lista.');const start=count;ignitia.tick(.12);ignitia.drawPortrait=fn;ignitia.dialog.hidden=true;return {hidden,visible:count-start}});
 assert.equal(portraits.hidden,0);assert(portraits.visible>0);
 assert(await p.evaluate(()=>{Object.assign(player,{x:6.4,y:5.5,angle:0});return ignitia.open(player)}));assert(await p.locator('#rocket-console').isVisible());
 // Analytic intercept remains accepted through the live console's model.
 assert(await p.evaluate(()=>{const p={...InterceptionPhysics.initial,duration:90,delay:0},target=InterceptionPhysics.eric(90);return InterceptionPhysics.evaluate(InterceptionPhysics.aimAt(p,target.x,target.y)).hit}));
 await p.evaluate(()=>ignitia.closeConsole());
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{Object.assign(player,{x:3,y:7.5,angle:0,pitch:0});tick(last+16)});await p.locator('.scene-view').screenshot({path:'/tmp/epik-launchpad-mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS launchpad desktop/mobile, cached ornaments, hidden portrait draws eliminated, visible dialogue, original console access and interception.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
