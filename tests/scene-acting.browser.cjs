const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
 await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true)});
 const gait=await p.evaluate(()=>[4.03,4.18,4.32,4.46].map(t=>IvanLaunchScene.walkPose(t,0)));
 assert.deepEqual(gait.map(g=>g.frame),[0,1,2,3]);assert(gait.every(g=>g.flip),'Walk faces the launch path, toward screen left');
 assert.equal(await p.evaluate(()=>IvanLaunchScene.walkPose(5,Math.PI).flip),false,'Facing follows the camera, not a fixed mirrored sprite');
 const poses=await p.evaluate(()=>({fall:[2.8,3.05,3.4,4.5].map(t=>SceneActing.forest(t)),hammer:[.01,.18,.34,.50].map(t=>SceneActing.hammer(t)),paola:[1,3,5,9,11,13].map(t=>SceneActing.paola(t)),tea:[4.1,4.9,5.5].map(t=>SceneActing.tea(t)),karla:[7.3,8.5].map(t=>SceneActing.tea(t,true))}));
 assert.deepEqual(poses.fall.map(p=>p.phase),['trip','fall','ground','ground']);assert(poses.fall.slice(2).every(p=>p.frame>=6));
 assert.deepEqual(poses.hammer,[0,1,2,3]);assert.deepEqual(poses.tea,[3,4,5]);assert.deepEqual(poses.karla,[6,7]);assert(new Set(poses.paola).size>=5);
 await p.evaluate(()=>{window.actingAssets=new CinemaAssetLoader()});
 const art=await p.evaluate(async()=>{
  const keys={ivanForest:16,ivanWalk:4,joseHammer:8,angelicaTea:8,karlaTea:8,paolaClass:8};
  await Promise.all(Object.keys(keys).map(key=>actingAssets.request(key)));
  const canvas=document.createElement('canvas');canvas.width=384;canvas.height=320;const c=canvas.getContext('2d',{willReadFrequently:true}),frames=[];
  for(const [key,count] of Object.entries(keys))for(let frame=0;frame<count;frame++){
   c.clearRect(0,0,384,320);RPGCast.action(c,actingAssets.images[key],frame,192,304,284);
   const pixels=c.getImageData(0,0,384,320).data;let n=0,minY=320,maxY=0;
   for(let y=0;y<320;y++)for(let x=0;x<384;x++)if(pixels[(y*384+x)*4+3]>160){n++;minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
   frames.push({key,frame,n,height:maxY-minY+1,bottom:maxY});
  }
  return frames;
 });
 assert.equal(art.length,52);for(const f of art){assert(f.n>2000,JSON.stringify(f));assert(f.n<384*320*.9);assert(f.bottom>=301&&f.bottom<=304,JSON.stringify(f))}
 const run=art.find(f=>f.key==='ivanForest'&&f.frame===0),prone=art.find(f=>f.key==='ivanForest'&&f.frame===6);
 assert(prone.height<run.height*.55,'Lying pose keeps its horizontal shape and is not stretched upright');
 // Render the actual world chaser without HUD overlays; it must obey wall occlusion.
 const occlusion=await p.evaluate(async()=>{
  const actor=new RoomActors();await actor.ivan.decode();const canvas=document.createElement('canvas');canvas.id='chase-review';canvas.width=560;canvas.height=440;canvas.style.cssText='position:fixed;inset:10px;z-index:99999;background:#172131';document.body.append(canvas);
  const ctx=canvas.getContext('2d',{willReadFrequently:true}),renderer={ctx,canvas,depths:[]},pos={x:280,y:410,scale:440,depth:2};
  actor.drawIvan(renderer,pos,500,false);const visible=ctx.getImageData(0,0,560,440).data.some((v,i)=>i%4===3&&v>100);
  ctx.clearRect(0,0,560,440);renderer.depths=Array(560).fill(1);actor.drawIvan(renderer,pos,500,false);const hidden=ctx.getImageData(0,0,560,440).data.every((v,i)=>i%4!==3||v===0);
  renderer.depths=[];actor.drawIvan(renderer,pos,500,false);return {visible,hidden};
 });
 assert(occlusion.visible&&occlusion.hidden,'Torso chase remains occluded by walls');
 await p.locator('#chase-review').screenshot({path:'/tmp/poses-chase-clean.png'});
 assert.deepEqual(errors,[]);console.log('PASS: four opposite steps, camera-facing walk, prone fall, hammer cycle, seated tea, suspicious eyes, scolding expressions, 52 transparent action frames and world torso occlusion.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
