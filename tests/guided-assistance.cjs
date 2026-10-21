const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const w={I18n:{lang:'es',t:x=>x}};w.window=w;vm.createContext(w);
for(const f of ['rooms/room-02/problems','rooms/room-05/boss','classroom/assistance'])vm.runInContext(fs.readFileSync('src/'+f+'.js','utf8'),w);
// Help must not read final answer keys, even when a problem has numeric solutions.
for(const q of w.PHYSICS_PROBLEMS){const guarded={id:q.id,get solution(){throw Error('solution leaked')},get fields(){throw Error('answers leaked')}};const text=w.EpikSolutions.text({room:{roulette:true},roulette:{current:guarded}});assert(text.includes('='));assert(!/≈/.test(text));assert(w.EpikSolutions.rouletteSetups[q.id]);}
// The reduced quadratic must retain both true intersections for all 20 variants.
for(const s of w.EricVariants.bank){const text=w.EpikSolutions.text({room:{boss:true},boss:{puzzle:{support:s}}});assert(!text.includes('Las raíces son'));assert(text.includes('x²'));assert(text.includes('Ya está factorizada:'));for(const [root] of s.intersections)assert(text.includes('(x'+(root<0?' + ':' − ')+Math.abs(root)+')'));const [a,b]=s.intersections.map(p=>p[0]);for(const [x,y] of s.intersections){assert(Math.abs(x*x-(a+b)*x+a*b)<1e-10);assert(Math.abs(s.line(x)-y)<1e-10);}}
w.EpikSolutions.cannon=()=>{throw Error('numeric solution should not be used')};
for(const targetX of [10,12,15]){const text=w.EpikSolutions.text({room:{physics:true},lab:{room:{physics:{targetX,originX:2,metersPerCell:2,targetHeight:3,height:1,gravity:9.81,maxEnergy:200}},loaded:{mass:.5}}});assert(text.includes(String((targetX-2)*2)+'·tan'));assert(!/energía|energy|E =| J\b/.test(text));assert(text.includes('30°, 45° o 60°'));assert(text.includes('tan(θ)'));assert(text.includes('cos²(θ)'));assert(text.includes('Elige y fija tú un ángulo'));assert(text.includes('v₀ = √['));assert(text.endsWith('Usa grados en tu calculadora.'));}
console.log('PASS: six guided setups never read answer keys, all 20 boss quadratics preserve the solutions, cannon guidance follows moving targets without computing the answer.');

// Consecutive misses move only in depth, repeatedly, including after wraparound.
vm.runInContext(fs.readFileSync('src/rooms/room-01/projectile.js','utf8'),w);
const physics={originX:2,metersPerCell:1,targetHeight:3,height:1,gravity:9.81,tolerance:.1,maxDistance:37};
const target=new w.CannonTarget(physics);
for(let attempt=1;attempt<=33;attempt++){
 const before=physics.targetX;assert.equal(target.miss(),attempt%3===0);
 assert.equal(physics.targetX,target.positions[Math.floor(attempt/3)%target.positions.length]);
 if(attempt%3!==0)assert.equal(physics.targetX,before);
 assert.equal(physics.targetHeight,3);assert.equal(target.misses,attempt%3);
 // Numerical check of the displayed rearrangement, for several freely chosen angles.
 for(const degrees of [30,45,60]){const D=target.distance,dy=physics.targetHeight-physics.height,a=degrees*Math.PI/180;
  const v=Math.sqrt(physics.gravity*D*D/(2*Math.cos(a)**2*(D*Math.tan(a)-dy)));
  assert(w.Projectile.evaluate(v,degrees,physics).hit);
 }
}
console.log('PASS: 33 consecutive misses cycle the target every third shot; isolated speed formula hits at three chosen angles.');

// Substitute the validator's physical answers into the equations actually displayed.
// This catches transcription/sign errors when simplifying the six guided setups.
const rouletteVariables={1:['d','t'],2:['t','x'],3:['v','h'],4:['t','R'],5:['y','v_y'],6:['h_max','t'],7:['D','v_media'],8:['θ₁','θ₂'],9:['v','Δx'],10:['t','v']};
for(const q of w.PHYSICS_PROBLEMS){
 const vars=Object.fromEntries(rouletteVariables[q.id].map((name,i)=>[name,q.fields[i][2]]));
 const evaluate=side=>{
  const expr=side.replace(new RegExp(Object.keys(vars).sort((a,b)=>b.length-a.length).join('|'),'g'),name=>'('+vars[name]+')').replaceAll('arcsen','asin').replaceAll('√','sqrt').replaceAll('·','*').replaceAll('−','-').replaceAll('²','**2').replaceAll('°','').replace(/(\d|\))\(/g,'$1*(');
  return Function('sen','sqrt','asin','return ('+expr+')')(degrees=>Math.sin(degrees*Math.PI/180),Math.sqrt,x=>Math.asin(x)*180/Math.PI);
 };
 for(const line of w.EpikSolutions.rouletteSetups[q.id].split('\n')){
  const [left,right]=line.split(';')[0].split('=');assert(Math.abs(evaluate(left)-evaluate(right))<1e-4,'Simplified roulette equation '+q.id+': '+line);
 }
}
console.log('PASS: all 12 simplified roulette equations agree with the six challenges’ validated answers.');
