const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1280,height:850}}),errors=[],missing=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url())});
 await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
 await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true)});await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 const dir=path.resolve(__dirname,'../../previews/expression-polish');fs.mkdirSync(dir,{recursive:true});
 // No repeated wave or applause from either companion. Angélica retains her gestures.
 for(const [id,karla] of [['ceremonia-ignitia',false],['ceremonia-karla',true]]){
  const stats=await p.evaluate(async({id,karla})=>{
   cinematics.play(id);await cinematics.ready;const original=RPGCast.draw,frames=[];
   RPGCast.draw=function(c,im,pose,t,x,feet,h,options={}){if(im===(karla?cinematics.images.karlaCeremony:cinematics.images.castPaola))frames.push(options.frame);return original.call(this,c,im,pose,t,x,feet,h,options)};
   for(let i=0;i<80;i++){cinematics.time=33.1+i*.04;cinematics.visualTime=cinematics.time;cinematics.draw()}
   RPGCast.draw=original;return frames;
  },{id,karla});
  assert.equal(stats.length,80);assert(stats.every(f=>f>=0&&f<=3),'Reserved celebration never waves/claps');if(!karla)assert(stats.filter(f=>f===1).length>60,'Paola gently smiles eyes closed');
  await p.locator('#cinema-canvas').screenshot({path:path.join(dir,karla?'ceremony-karla.png':'ceremony-paola.png')});await p.evaluate(()=>cinematics.close());
 }
 // Descent remains stern, and mouth animation begins only for the captured dialogue.
 const ericPoses=await p.evaluate(async()=>{cinematics.play('intercepcion-espacial');await cinematics.ready;const original=RPGCast.draw,poses=[];RPGCast.draw=function(c,im,pose,...rest){if(im===cinematics.images.castEric)poses.push(pose);return original.call(this,c,im,pose,...rest)};for(const t of [21,29,35]){cinematics.time=t;cinematics.draw()}RPGCast.draw=original;return poses});
 assert.deepEqual(ericPoses,['idle','idle','talk']);await p.locator('#cinema-canvas').screenshot({path:path.join(dir,'prison-serious.png')});await p.evaluate(()=>cinematics.close());
 // Launch facial frames change while the original cable/rotation path stays active.
 const panic=await p.evaluate(async()=>{cinematics.play('ignitia-intercepcion');await cinematics.ready;const original=RPGCast.action,frames=[];RPGCast.action=function(c,im,f,...rest){if(im===cinematics.images.ivanAction)frames.push(f);return original.call(this,c,im,f,...rest)};for(const t of [8,9.3,12.2,14.3]){cinematics.time=t;cinematics.draw()}RPGCast.action=original;return frames});
 assert.equal(panic.length,4);assert(new Set(panic).size>=3);assert(panic.every(f=>f>=4&&f<=7));await p.locator('#cinema-canvas').screenshot({path:path.join(dir,'rocket-panic.png')});await p.evaluate(()=>cinematics.close());
 await p.evaluate(()=>{cinematics.bloopers??=new EpikBloopers();cinematics.bloopers.open(()=>{})});
 for(const [index,time,name] of [[0,1.8,'ivan-run'],[1,3.13,'eric-impact'],[1,3.35,'eric-recoil'],[1,4.6,'eric-dazed'],[3,2.1,'classroom-listening'],[3,4.3,'student-answer'],[4,1.7,'karla-sipping'],[4,8.7,'karla-suspicious']]){
  await p.evaluate(async({index,time})=>{const b=cinematics.bloopers;b.show(index);await b.ready;b.time=time;b.draw()},{index,time});await p.locator('#epik-bloopers').screenshot({path:path.join(dir,name+'.png')});
 }
 const gait=await p.evaluate(()=>[0,1/4.5].map(t=>IvanRun.pose(t)));
 assert(gait[0].nearLeg>0&&gait[1].nearLeg<0);for(const g of gait){assert.equal(g.nearLeg,-g.farLeg);assert.equal(g.nearArm,-g.farArm)}
 assert.deepEqual(await p.evaluate(()=>[.01,.2,.8,1.8].map(t=>SceneActing.impact(t))),[4,5,6,7]);
 // Eight exported gait views ensure the rig can be previewed as a GIF as well.
 await p.evaluate(async()=>{await cinematics.bloopers.assets.request('ivanRun')});
 for(let i=0;i<8;i++){const png=await p.evaluate(i=>{const c=document.createElement('canvas');c.width=384;c.height=320;IvanRun.draw(c.getContext('2d'),cinematics.bloopers.assets.images.ivanRun,i/18,192,304,260);return c.toDataURL('image/png').split(',')[1]},i);fs.writeFileSync(path.join(dir,'run-'+i+'.png'),Buffer.from(png,'base64'))}
 await p.evaluate(()=>{cinematics.bloopers.close();load(rooms.findIndex(r=>r.conceptual))});
 // The game-over foreground uses exactly ONE cached atlas frame and no world copy.
 const capture=await p.evaluate(async()=>{
  const actors=renderer.actors;await actors.ivan.decode();maze.caught=false;maze.chasing=true;
  Object.assign(maze.enemy,{x:player.x+Math.cos(player.angle)*2,y:player.y+Math.sin(player.angle)*2});let world=0,foreground=0,sourceWidth=0;
  const draw=actors.drawIvan;actors.drawIvan=()=>world++;actors.draw(renderer,rooms[index],player,false,0,maze);const before=world;world=0;maze.caught=true;actors.draw(renderer,rooms[index],player,false,0,maze);actors.drawIvan=draw;
  const c=document.createElement('canvas');c.width=560;c.height=440;c.id='single-capture';c.style.cssText='position:fixed;inset:10px;z-index:99999;background:#172131';document.body.append(c);const ctx=c.getContext('2d'),orig=ctx.drawImage.bind(ctx);ctx.drawImage=(im,...args)=>{foreground++;sourceWidth=im.width;orig(im,...args)};actors.drawIvanCapture(ctx,560,440,.7);
  return {before,world,foreground,sourceWidth};
 });assert.deepEqual(capture,{before:1,world:0,foreground:1,sourceWidth:384});await p.locator('#single-capture').screenshot({path:path.join(dir,'ivan-capture.png')});
 await p.evaluate(async()=>{document.querySelector('#single-capture').remove();load(rooms.findIndex(r=>r.physics));document.querySelector('#maze-notice').hidden=true;await companions.paolaPortrait.decode();companions.help();companions.tickDialogue(.1)});
 assert((await p.locator('#helper-face').boundingBox()).width>=40);assert(await p.locator('#paola-dialog').isVisible());await p.locator('#paola-dialog').screenshot({path:path.join(dir,'paola-help.png')});
 for(const width of [390,844]){await p.setViewportSize({width,height:844});assert(await p.evaluate(()=>{const a=document.querySelector('#paola-dialog').getBoundingClientRect();return a.left>=0&&a.right<=innerWidth+1}),'Help fits mobile');}
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS: restrained ceremonies, serious prison Eric, panic expressions, articulated opposite legs, collision sequence, tea/class reactions, ONE capture sprite, shoulder-up help and mobile fit.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
