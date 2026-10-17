const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),w={};w.window=w;vm.createContext(w);
for(const f of ['src/cinematics/rpg-cast.js','src/rooms/room-06/interception.js','src/cinematics/space-interception.js','src/cinematics/library.js'])vm.runInContext(fs.readFileSync(f,'utf8'),w);
const S=w.SpaceInterception,P=w.InterceptionPhysics,example=S.plan();assert(!example.selected);assert(P.evaluate(example.params,0).hit);
const params={...P.initial,delay:20,duration:110},epoch=50,target=P.eric(epoch+params.delay+params.duration),solved=P.aimAt(params,target.x,target.y),source={ready:true,params:solved,launchEpoch:epoch};
const plan=S.plan(source);assert(plan.selected);assert.equal(plan.epoch,epoch);assert.notEqual(plan.params,source.params);const original=plan.params.speed;source.params.speed=3;assert.equal(plan.params.speed,original,'La película conserva una copia de la ruta');
const waiting=S.position(plan,10/130);assert.equal(waiting.ours.x,0);assert(waiting.eric.x>P.eric(epoch).x,'Eric avanza durante el retraso');
const end=S.position(plan,1);assert(Math.hypot(end.ours.x-end.eric.x,end.ours.y-end.eric.y)<1e-8);assert(Number.isFinite(end.rotation));assert.equal(S.phase(17),'impact');assert.equal(S.phase(20),'parachute');assert.equal(S.phase(27),'cell-entry');assert.equal(S.phase(34),'captured');
const calls=[];w.Sound={play:(name)=>calls.push(name),stop(){},selectBackground(){},tone(){},click(){}};
const cinema=Object.create(w.CinematicLibrary.prototype);cinema.item={id:'intercepcion-espacial'};cinema.cues=new Set();cinema.time=17.1;cinema.audio();cinema.audio();assert.equal(calls.filter(n=>n==='explosion').length,1,'El impacto solo suena una vez');
// The current Eric atlas has detached fragments outside these body bounds.
const art={complete:true,naturalWidth:1536,naturalHeight:640};let drawn;
const ctx={save(){},restore(){},translate(){},rotate(){},scale(){},drawImage(...args){drawn=args;}};
const scene=new w.SpaceCinematic({ctx,images:{ericAir:art}});
scene.drawEric(5,0,100,80);assert.equal(drawn[0],art);assert.deepEqual(drawn.slice(1,5),[469,320,192,320]);assert.equal(drawn[6],-304,'Foot anchor is unchanged');
scene.drawEric(2,0,100,80);assert.deepEqual(drawn.slice(1,5),[844,0,203,320]);
scene.drawEric(0,0,100,80);assert.deepEqual(drawn.slice(1,5),[0,0,384,320]);
assert(w.CINEMATICS.some(c=>c.id==='intercepcion-espacial'));assert.equal(new Set(w.CINEMATICS.map(c=>c.id)).size,w.CINEMATICS.length);
console.log('OK: ruta real y ejemplo, reloj compartido, copia sin mutación, intercepción, fases, audio único y recortes limpios sin desplazar los anclajes de Eric.');
