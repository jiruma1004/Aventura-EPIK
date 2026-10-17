const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={Image:class{}};world.window=world;vm.createContext(world);
for(const file of ['src/rooms/room-05/stun.js','src/rooms/room-05/room.js'])vm.runInContext(fs.readFileSync(file,'utf8'),world);
const map=world.ESCAPE_ROOMS[0].map,far={x:3,y:7.5};let pickups=0;
const spark=new world.EricSpark(()=>pickups++,()=>.5);
assert.equal(spark.interval,30);spark.tick(29.99,far);assert.equal(spark.sparks.length,0);spark.tick(.02,far);assert.equal(spark.sparks.length,1);assert(!spark.ready);
spark.tick(60,far);assert.equal(spark.sparks.length,3,'Uncollected sparks accumulate');assert(spark.ready);
const target={...spark.sparks[0].landing};spark.tick(.01,target);assert.equal(pickups,1);assert.equal(spark.sparks.length,2);assert.equal(spark.left,15);
assert.equal(spark.tick(5,far),0);assert.equal(spark.left,10);spark.tick(.01,spark.sparks[0].landing);assert.equal(spark.left,15,'Refresh to 15, never add to remaining 10');assert.equal(pickups,2);
const saved=spark.snapshot(),restored=new world.EricSpark(()=>{});restored.restore(saved);assert.deepEqual(restored.snapshot(),saved);restored.restore(saved,4);assert.equal(restored.left,11);assert.equal(restored.interval,saved.interval);assert.equal(restored.cycle,saved.cycle);assert.deepEqual(restored.sparks,saved.sparks);
restored.cancel();assert.equal(restored.left,0);assert.equal(restored.sparks.length,saved.sparks.length);
const resume=new world.EricSpark(()=>{},()=>.5);resume.left=15;assert.equal(resume.tick(14,far),0);assert.equal(resume.tick(2,far),1);
const old=new world.EricSpark(()=>{},()=>.5);old.restore({version:4,age:44,cycle:4,flightAge:3,left:0,landing:{x:6,y:9,z:.38}});assert.equal(old.sparks.length,1);assert(old.ready);assert.equal(old.cycle,4);assert.equal(old.sparks[0].landing.x,6);
old.restore({age:20,used:true,left:9},3);assert.equal(old.left,6);assert.equal(old.sparks.length,0);old.restore({age:14,used:false,left:0});assert(old.ready);
for(const invalid of [{...saved,cycle:60},{...saved,interval:5},{...saved,sparks:[{landing:{x:20,y:7.5},flightAge:2}]}])assert.throws(()=>old.restore(invalid));
let seed=921;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const randomSpark=new world.EricSpark(()=>{},rng),positions=new Set();let total=0;
for(let i=0;i<1000;i++){
 const previous={...randomSpark.landing},delay=randomSpark.interval;assert(delay>=20&&delay<=40);total+=delay;
 randomSpark.tick(delay,far);const item=randomSpark.sparks.at(-1),p=item.landing;
 for(const dx of [-.7,0,.7])for(const dy of [-.7,0,.7])assert.equal(map[Math.floor(p.y+dy)][Math.floor(p.x+dx)],0);
 assert(world.EricSpark.safeLanding(p));assert(Math.hypot(p.x-previous.x,p.y-previous.y)>=2);assert(Math.hypot(p.x-far.x,p.y-far.y)>=1.5);positions.add(p.x+','+p.y);
 item.flightAge=world.EricSpark.flight;assert.equal(randomSpark.position(item).y,p.y);
}
assert.equal(randomSpark.sparks.length,1000);assert(positions.size>990);assert(Math.abs(total/1000-30)<1);assert(Math.abs(60000/total-2)<.05);
const fallback=new world.EricSpark(()=>{},()=>NaN);fallback.tick(30,far);assert(world.EricSpark.safeLanding(fallback.landing));
console.log('PASS: 20–40s random intervals (~2/min), accumulating safe pickups, refresh without stacking, recovery and legacy migration.');

old.restore({...saved,version:5,interval:50,cycle:25});assert.equal(old.interval,40);assert.equal(old.cycle,20);assert.equal(old.sparks.length,saved.sparks.length);
