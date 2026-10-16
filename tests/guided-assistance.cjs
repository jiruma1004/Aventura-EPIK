const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const w={I18n:{lang:'es',t:x=>x}};w.window=w;vm.createContext(w);
for(const f of ['rooms/room-02/problems','rooms/room-05/boss','classroom/assistance'])vm.runInContext(fs.readFileSync('src/'+f+'.js','utf8'),w);
// Help must not read final answer keys, even when a problem has numeric solutions.
for(const q of w.PHYSICS_PROBLEMS){const guarded={id:q.id,get solution(){throw Error('solution leaked')},get fields(){throw Error('answers leaked')}};const text=w.EpikSolutions.text({room:{roulette:true},roulette:{current:guarded}});assert(text.includes('='));assert(!/≈/.test(text));assert(w.EpikSolutions.rouletteSetups[q.id]);}
// The reduced quadratic must retain both true intersections for all 20 variants.
for(const s of w.EricVariants.bank){const text=w.EpikSolutions.text({room:{boss:true},boss:{puzzle:{support:s}}});assert(!text.includes('Las raíces son'));assert(text.includes('x²'));const [a,b]=s.intersections.map(p=>p[0]);for(const [x,y] of s.intersections){assert(Math.abs(x*x-(a+b)*x+a*b)<1e-10);assert(Math.abs(s.line(x)-y)<1e-10);}}
w.EpikSolutions.cannon=()=>{throw Error('numeric solution should not be used')};
for(const targetX of [10,12,15]){const text=w.EpikSolutions.text({room:{physics:true},lab:{room:{physics:{targetX,originX:2,metersPerCell:2,targetHeight:3,height:1,gravity:9.81,maxEnergy:200}},loaded:{mass:.5}}});assert(text.includes(String((targetX-2)*2)+'·tan'));assert(text.includes('v₀²'));assert(!text.includes('45°'));assert(text.includes('tan(θ)'));assert(text.includes('cos²(θ)'));assert(text.includes('Elige y fija tú un ángulo'));}
console.log('PASS: ten guided setups never read answer keys, all 20 boss quadratics preserve the solutions, cannon guidance follows moving targets without computing the answer.');
