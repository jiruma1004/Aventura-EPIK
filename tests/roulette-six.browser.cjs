const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});try{
 for(const encrypted of [false,true]){
 const outer=await b.newPage();const errors=[];outer.on('pageerror',e=>errors.push(e.message));await outer.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await outer.goto(encrypted?process.env.EPIK_DEV_TEST_URL:'http://127.0.0.1:18867/?dev=1');let p=outer;
 if(encrypted){await outer.locator('#password').fill(process.env.EPIK_TEST_PASSWORD);await outer.locator('#unlock button').click();await outer.locator('iframe').waitFor();p=outer.locator('iframe').contentFrame();}
 await p.locator('#epik-dev').waitFor();const ev=(fn,arg)=>p.locator('#game').evaluate(fn,arg);
 const index=await ev(()=>rooms.findIndex(r=>r.roulette));await p.locator('#dev-room').selectOption(String(index));await p.locator('#dev-go').click();
 assert.deepEqual(await ev(()=>PHYSICS_PROBLEMS.map(q=>q.id)),[1,2,6,7,9,10]);
 for(let old=0;old<10;old++){
 const result=await ev((_,old)=>{roulette.reset();const state={rouletteSelected:old,rouletteSpins:2};roulette.syncReset(state);roulette.resumeSelection();const before=roulette.current.id;roulette.restore({current:old+1,selected:old,remaining:[0,1,2,3,4,5,6,7,8,9],solved:[]});return {before,after:roulette.current.id,spins:state.rouletteSpins,spin:roulette.spin(),remaining:roulette.remaining}},old);
 const expected=[1,2,6,7,9,10].includes(old+1)?old+1:9;
 assert.equal(result.before,expected);assert.equal(result.after,expected);assert.equal(result.spins,2);assert.equal(result.spin,false);assert.equal(result.remaining.length,5);assert(result.remaining.every(i=>i>=0&&i<6));
 }
 for(let i=0;i<6;i++){
 const result=await ev((_,i)=>{roulette.reset();roulette.syncReset({rouletteSpins:0,rouletteSelected:null});roulette.remaining=[i];roulette.spin();roulette.tick(4);const angle=(((-Math.PI/2-roulette.angle)%(2*Math.PI))+2*Math.PI)%(2*Math.PI);return {id:roulette.current.id,sector:Math.floor(angle/(2*Math.PI/6)),label:document.querySelector('#problem-level').textContent,palma:EpikSolutions.text({room:rooms[index],roulette})}},i);
 assert.equal(result.sector,i);assert(result.label.startsWith(String(i+1).padStart(2,'0')));assert(result.palma.includes('ecuaciones despejadas'));
 }
 const labels=await ev(()=>{const c=renderer.ctx,original=c.fillText,labels=[];c.fillText=function(t,...a){labels.push(String(t));return original.call(this,t,...a)};try{renderer.drawTable(rooms[index],{x:rooms[index].table.x-2,y:rooms[index].table.y,angle:0,pitch:0},false,roulette,0)}finally{c.fillText=original}return labels.filter(t=>/^\d\d$/.test(t));});
 assert.deepEqual(labels,['01','02','03','04','05','06']);
 assert.deepEqual(errors,[]);console.log('PASS '+(encrypted?'developer':'normal')+': six sectors, pointer matches all six choices, Palma IDs, old saves migrate without extra spins.');await outer.close();
 }
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
