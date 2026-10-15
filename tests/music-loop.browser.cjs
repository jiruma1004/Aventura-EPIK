const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto((process.env.EPIK_TEST_URL||'http://127.0.0.1:8767')+'/?dev=1');
 const result=await page.evaluate(async()=>{const track=Sound.tracks.stand;await new Promise((resolve,reject)=>{if(track.readyState>=1)return resolve();track.addEventListener('loadedmetadata',resolve,{once:true});track.addEventListener('error',reject,{once:true});track.load()});const duration=track.duration,samples=[0,.6,1.2,duration-1.8,duration-.9,duration].map(currentTime=>Sound.loopGain({duration,currentTime}));return{duration,loop:track.loop,samples};});
 assert.equal(result.loop,true);assert(result.duration>149&&result.duration<151);assert.deepEqual(result.samples.map(n=>Math.round(n*100)/100),[0,.5,1,1,.5,0]);assert.deepEqual(errors,[]);
 console.log('PASS: every background track keeps native looping with a natural 1.8s exit and 1.2s return.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
