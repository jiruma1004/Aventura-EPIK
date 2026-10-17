const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={Image:class{}};world.window=world;vm.createContext(world);vm.runInContext(fs.readFileSync('src/rooms/room-05/stun.js','utf8'),world);
let pickups=0;const spark=new world.EricSpark(()=>pickups++),far={x:3,y:7.5},near={x:14.4,y:7.5};
spark.tick(100,far);assert(!spark.ready);assert.equal(spark.flightAge,-1);
for(let cycle=0;cycle<3;cycle++){
 for(let i=0;i<4;i++)spark.attack();assert.equal(spark.flightAge,-1);
 spark.attack();assert.equal(spark.flightAge,0);spark.tick(1.19,far);assert(!spark.ready);spark.tick(.02,far);assert(spark.ready);
 spark.tick(.01,near);assert.equal(pickups,cycle+1);assert.equal(spark.left,15);
 spark.attack();assert.equal(spark.attacks,0);assert.equal(spark.tick(14,near),0);assert.equal(spark.tick(2,far),1);
}
for(let i=0;i<5;i++)spark.attack();spark.tick(2,far);assert(spark.ready);
for(let i=0;i<5;i++)spark.attack();assert.equal(spark.flightAge,0,'Uncollected spark is replaced, never stacked');
spark.attack();const saved=spark.snapshot(),restored=new world.EricSpark(()=>{});restored.restore(saved);assert.deepEqual(restored.snapshot(),saved);
restored.tick(2,near);const active=restored.snapshot();spark.restore(active,4);assert.equal(spark.left,11);assert.equal(spark.attacks,1);spark.cancel();assert.equal(spark.left,0);assert.equal(spark.attacks,1);
spark.restore({age:20,used:true,left:9},3);assert.equal(spark.left,6);assert.equal(spark.flightAge,-1);
spark.restore({age:14,used:false,left:0});assert(spark.ready);spark.restore({age:5,used:false,left:0});assert.equal(spark.flightAge,-1);
assert.throws(()=>spark.restore({...saved,attacks:5}));assert.throws(()=>spark.restore({...saved,flightAge:-2}));
console.log('PASS: recurring five-attack sparks, no timed spawn, 15s stun, single pickup, saved cycles and legacy migration.');
