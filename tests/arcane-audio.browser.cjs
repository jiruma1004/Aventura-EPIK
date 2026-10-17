const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage();await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');
 const results=await p.evaluate(async()=>{
  const out=[];for(const name of ['arcaneStun','arcaneNovaCharge','arcaneNovaImpact','muted','cancelled']){
   const ctx=new OfflineAudioContext(1,44100*3,44100);Sound.ctx=ctx;Sound.master=ctx.createGain();Sound.master.gain.value=name==='muted'?0:1;Sound.master.connect(ctx.destination);Sound.enabled=true;
   if(name==='cancelled'){Sound.arcaneNovaCharge();Sound.stopArcaneCharge();}else Sound[name==='muted'?'arcaneStun':name]();
   const data=(await ctx.startRendering()).getChannelData(0);let peak=0,energy=0,tail=0;
   for(let i=0;i<data.length;i++){peak=Math.max(peak,Math.abs(data[i]));energy+=data[i]*data[i];if(i>data.length-1000)tail+=data[i]*data[i];}
   out.push({name,peak,rms:Math.sqrt(energy/data.length),tail,charges:Sound.arcaneCharges?.size||0});
  }return out;
 });for(const r of results){assert(r.peak<.95);assert.equal(r.tail,0);assert.equal(r.charges,0);if(['muted','cancelled'].includes(r.name))assert.equal(r.peak,0);else assert(r.rms>.005);}
 console.log('PASS: arcane effects render, no clipping, silent tail, mute, charge cancellation and node cleanup.',results);
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
