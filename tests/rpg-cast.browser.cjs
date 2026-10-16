/* Regression: the shared cast keeps its frames, route ownership and scene clocks. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.url())});
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
  await page.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true)});
  const before=await page.evaluate(()=>{const now=classroom.session.now();classroom.session.now=()=>now;return classroom.session.csv()});
  const scenes={
   'ignitia-intercepcion':[0,2,5,8,10,18,20,24,26,36,40,48,55,61],
   'intercepcion-espacial':[1,10,18,23,29,37],
   'ignitia-launch':[1,6,12,20,29,34],
   'ceremonia-ignitia':[1,9,17,25,34,39],
   'ceremonia-karla':[1,9,17,25,34,39],
   'ivan-descenso':[1,4,8,13,18,25,30],
   'eric-fuga':[1,8,14],
   'aplausos-finales':[1,5,10]
  };
  for(const [id,times] of Object.entries(scenes)){
   const result=await page.evaluate(async({id,times})=>{
    cinematics.play(id);await cinematics.ready;
    const loaded=cinematics.assets.sceneReady(id),start=cinematics.assets.jobs.size;
    for(const t of times){cinematics.time=t;cinematics.visualTime=t;cinematics.draw()}
    const end=cinematics.assets.jobs.size;cinematics.close();return {loaded,start,end};
   },{id,times});
   assert(result.loaded,id+' must decode all required art');
   assert.equal(result.start,result.end,id+' must not request images while changing poses');
  }
  // An empty/opaque tile or a missing mouth frame is visible even if playback does not throw.
  const frames=await page.evaluate(async()=>{
   const results=[],canvas=document.createElement('canvas');canvas.width=256;canvas.height=320;
   const c=canvas.getContext('2d',{willReadFrequently:true});
   for(const key of ['castAngelica','castPaola','castKarla','castEric','castIvan','castJose']){
    const im=cinematics.images[key];
    for(let frame=0;frame<16;frame++){
     c.clearRect(0,0,256,320);RPGCast.draw(c,im,'idle',0,128,304,284,{frame});
     const rgba=c.getImageData(0,0,256,320).data;let solid=0,clear=0;
     for(let i=3;i<rgba.length;i+=4){solid+=rgba[i]>160;clear+=rgba[i]===0}
     results.push({key,frame,solid,clear});
    }
   }
   canvas.width=384;canvas.height=320;
   // The new action sheets use wider cells than the dialogue/base cast.
   for(const key of ['ericAir','ericRun','ericImpact','paolaClass']){
    const im=await cinematics.assets.request(key);
    if(im.naturalWidth!==1536||im.naturalHeight!==640)throw Error(key+' action atlas dimensions');
    for(let frame=0;frame<8;frame++){
     c.clearRect(0,0,384,320);RPGCast.action(c,im,frame,192,304,284);
     const rgba=c.getImageData(0,0,384,320).data;let solid=0,clear=0;
     for(let i=3;i<rgba.length;i+=4){solid+=rgba[i]>160;clear+=rgba[i]===0}
     results.push({key,frame,solid,clear});
    }
   }
   canvas.width=canvas.height=128;
   const portrait=cinematics.images.radioJose,mouth=[];
   for(const time of [0,.125,.25,.375]){RPGCast.portrait(canvas,portrait,true,time);mouth.push(canvas.dataset.frame)}
   RPGCast.portrait(canvas,portrait,false,0);
   return {results,mouth,closed:canvas.dataset.frame};
  });
  for(const f of frames.results){assert(f.solid>2000,JSON.stringify(f));assert(f.clear>10000,JSON.stringify(f))}
  assert.deepEqual(frames.mouth,['0','2','3','2']);assert.equal(frames.closed,'0');
  assert.equal(await page.evaluate(()=>classroom.session.csv()),before,'Gallery previews must not change metrics');
  await page.evaluate(()=>{cinematics.bloopers??=new EpikBloopers();cinematics.bloopers.open(()=>{})});
  for(let index=0;index<5;index++){
   assert(await page.evaluate(async index=>{const b=cinematics.bloopers;b.show(index);await b.ready;for(const time of [0,1,3,4,6,8,11,13]){b.time=time;b.draw()}return !b.failed},index));
  }
  await page.evaluate(()=>cinematics.bloopers.close());
  // Radio lettering remains readable in portrait and landscape; text is translated before typing.
  for(const viewport of [{width:390,height:844},{width:844,height:390}]){
   await page.setViewportSize(viewport);
   await page.evaluate(async()=>{cinematics.play('ignitia-intercepcion');await cinematics.ready;cinematics.time=19.1;cinematics.draw();cinematics.time=23.9;cinematics.draw()});
   assert(await page.locator('#cast-radio').isVisible());
   const fits=await page.evaluate(()=>{const a=document.querySelector('#cast-radio').getBoundingClientRect(),b=document.querySelector('.cinema-screen').getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1&&a.top>=b.top&&a.bottom<=b.bottom+1});
   assert(fits,'Radio fits '+JSON.stringify(viewport));
   const english=await page.evaluate(()=>{I18n.lang='en';cinematics.draw();const text=document.querySelector('#cast-radio p').textContent;I18n.lang='es';return text});
   assert.match(english,/trajectory is still stable/);
   await page.evaluate(()=>cinematics.close());
  }
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('PASS: eight scene variants, 128 transparent frames including the four new action sheets, mouth/idle, all five bloopers, no draw-time downloads, gallery metrics unchanged, mobile radio, no browser errors.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
