const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={Image:class{}};world.window=world;vm.createContext(world);vm.runInContext(fs.readFileSync('src/rooms/room-05/stun.js','utf8'),world);
let pickups=0;const spark=new world.EricSpark(()=>pickups++),far={x:3,y:7.5},near={x:14.4,y:7.5};
spark.tick(19.99,far);assert.equal(spark.flightAge,-1);spark.tick(.01,far);assert.equal(spark.flightAge,0);
spark.tick(1.19,far);assert(!spark.ready);Object.assign(near,spark.landing);spark.tick(.02,near);assert.equal(pickups,1);assert.equal(spark.left,15);
assert.equal(spark.tick(14,far),0);assert.equal(spark.tick(2,far),1);
spark.tick(2.79,far);assert.equal(spark.flightAge,0,'Second release at 40 seconds, including stun time');
Object.assign(near,spark.landing);spark.tick(1.21,near);assert.equal(pickups,2);assert.equal(spark.left,15);
const saved=spark.snapshot(),restored=new world.EricSpark(()=>{});restored.restore(saved,4);assert.equal(restored.left,11);assert.equal(restored.cycle,saved.cycle);assert.deepEqual(restored.landing,saved.landing);
restored.cancel();assert.equal(restored.left,0);assert.equal(restored.cycle,saved.cycle);
const other=new world.EricSpark(()=>{});other.tick(40.5,far);assert.equal(other.flightAge,.5);assert.equal(other.cycle,.5);other.tick(20,far);assert.equal(other.flightAge,.5,'Only newest uncollected spark remains');
other.restore({version:2,age:20,attacks:3,flightAge:2,left:0});assert(other.ready);assert.equal(other.cycle,0);
other.restore({age:20,used:true,left:9},3);assert.equal(other.left,6);assert.equal(other.flightAge,-1);
other.restore({age:14,used:false,left:0});assert(other.ready);
assert.throws(()=>other.restore({...saved,cycle:20}));assert.throws(()=>other.restore({...saved,flightAge:-2}));
console.log('PASS: 20-second spark cycle, flight, repeated pickups, 15s stun, save recovery and legacy migration.');

vm.runInContext(fs.readFileSync('src/rooms/room-05/room.js','utf8'),world);const map=world.ESCAPE_ROOMS[0].map;
let seed=921;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const randomSpark=new world.EricSpark(()=>{},rng),positions=new Set();
for(let i=0;i<1000;i++){
 const previous={...randomSpark.landing};randomSpark.tick(20,far);const p=randomSpark.landing;
 assert(world.EricSpark.safeLanding(p));for(const dx of [-.7,0,.7])for(const dy of [-.7,0,.7])assert.equal(map[Math.floor(p.y+dy)][Math.floor(p.x+dx)],0,'Pickup and surrounding floor must be walkable');assert(Math.hypot(p.x-previous.x,p.y-previous.y)>=2);assert(Math.hypot(p.x-far.x,p.y-far.y)>=1.5);
 positions.add(p.x+','+p.y);randomSpark.flightAge=world.EricSpark.flight;assert.equal(randomSpark.position().y,p.y);
}
assert(positions.size>990);const fallback=new world.EricSpark(()=>{},()=>NaN);fallback.tick(20,far);assert(world.EricSpark.safeLanding(fallback.landing));
assert.throws(()=>other.restore({...saved,landing:{x:20,y:7.5}}));
console.log('PASS: 1000 safe varied landings, separation from player/last point, two-axis flight and saved position.');
