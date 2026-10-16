/* Capture the approved cast inside real UI/scenes, without granting progress. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const p=await browser.newPage({viewport:{width:1280,height:850}}),out=path.resolve(__dirname,'../../cast-refresh-2026-10-16/previews');fs.mkdirSync(out,{recursive:true});
  await p.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await p.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
  await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();document.querySelector('#story-name-box').hidden=true;prologue.started=true});
  for(const [step,name] of [[0,'paola-introduccion'],[1,'eric-introduccion']]){
   await p.evaluate(async step=>{prologue.step=step;prologue.renderPage();await prologue.images[prologue.pages[step].portrait].decode();prologue.elapsed=.125;prologue.reveal()},step);
   await p.locator('#adventure-intro').screenshot({path:path.join(out,name+'.png')});
  }
  await p.evaluate(()=>prologue.finish(true));
  await p.evaluate(async()=>{cinematics.play('intercepcion-espacial');await cinematics.ready;cinematics.time=23;cinematics.draw()});
  await p.locator('#cinema-canvas').screenshot({path:path.join(out,'eric-paracaidas.png')});
  await p.evaluate(()=>{cinematics.time=35;cinematics.draw()});
  await p.locator('#cinema-canvas').screenshot({path:path.join(out,'eric-prision.png')});
  await p.evaluate(()=>cinematics.close());
  await p.evaluate(async()=>{cinematics.play('ceremonia-ignitia');await cinematics.ready;cinematics.time=9;cinematics.visualTime=9;cinematics.draw()});
  await p.locator('#cinema-canvas').screenshot({path:path.join(out,'paola-ceremonia.png')});
  await p.evaluate(()=>{cinematics.close();cinematics.bloopers??=new EpikBloopers();cinematics.bloopers.open(()=>{})});
  for(const [index,time,name] of [[3,2.3,'paola-clase'],[1,1.2,'eric-carrera'],[1,4.6,'eric-choque']]){
   await p.evaluate(async({index,time})=>{const b=cinematics.bloopers;b.show(index);await b.ready;b.time=time;b.draw()},{index,time});
   await p.locator('#epik-bloopers').screenshot({path:path.join(out,name+'.png')});
  }
  console.log('Previews:',out);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
