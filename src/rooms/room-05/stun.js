/* Every 20 seconds of active gameplay release one collectible. A new release replaces
   an uncollected spark; checkpoint state preserves the cycle and active stun. */
window.EricSpark=class {
 static interval=20;
 static flight=1.2;
 static duration=15;
 static landing={x:14.4,y:7.5,z:.38};
 constructor(onCollect){
  this.onCollect=onCollect;this.age=0;this.cycle=0;this.flightAge=-1;this.left=0;this.beam=0;
  this.sprite=new Image();this.sprite.src='assets/cast/divergence-spark-v1.webp';
  this.eric=new Image();this.eric.src='assets/cast/eric-stunned-v1.webp';
 }
 get ready(){return this.flightAge>=EricSpark.flight;}
 get active(){return this.left>0;}
 tick(dt,player){
  const paused=Math.min(dt,this.left);this.left=Math.max(0,this.left-dt);this.beam=Math.max(0,this.beam-dt);this.age+=dt;if(this.flightAge>=0)this.flightAge+=dt;
  this.cycle+=dt;
  if(this.cycle>=EricSpark.interval){this.cycle%=EricSpark.interval;this.flightAge=this.cycle;}
  const p=EricSpark.landing;
  if(this.ready&&Math.hypot(player.x-p.x,player.y-p.y)<.65&&(player.jumpHeight||0)<.65){
   this.flightAge=-1;this.left=EricSpark.duration;this.beam=.85;this.onCollect();return 0;
  }
  return dt-paused;
 }
 cancel(){this.left=0;this.beam=0;}
 snapshot(){return {version:3,age:this.age,cycle:this.cycle,flightAge:this.flightAge,left:this.left};}
 restore(data,away=0){
  if(!data)return;
  if(!Number.isFinite(data.age)||data.age<0||!Number.isFinite(data.left)||data.left<0||data.left>EricSpark.duration)throw Error('Invalid spark checkpoint');
  let cycle=0,flightAge=-1;
  if(data.version===3||data.version===2){
   cycle=data.version===3?data.cycle:0;flightAge=data.flightAge;
   if(!Number.isFinite(cycle)||cycle<0||cycle>=EricSpark.interval||!Number.isFinite(flightAge)||(flightAge<0&&flightAge!==-1))throw Error('Invalid spark cycle');
  }else{
   if(typeof data.used!=='boolean'||data.left>0&&!data.used)throw Error('Invalid legacy spark checkpoint');
   // Keep an already released legacy spark; future ones use the 20-second cycle.
   if(!data.used&&data.age>=12)flightAge=data.age-12;
  }
  this.age=data.age;this.cycle=cycle;this.flightAge=flightAge;this.left=Math.max(0,data.left-Math.max(0,away));this.beam=0;
 }
 frame(){return [0,1,2,1,0,3][Math.floor(this.age*6)%6];}
 position(){const t=Math.max(0,Math.min(1,this.flightAge/EricSpark.flight)),p=EricSpark.landing;return {x:23.5+(p.x-23.5)*t,y:p.y,z:2.6+(p.z-2.6)*t+Math.sin(t*Math.PI)*1.2};}
 draw(r,player,actors,head){
  const c=r.ctx;
  if(this.flightAge>=0){
   const p=this.position(),art=RPGCast.textureFrame(this.sprite,Math.floor(this.age*7)%4,{w:128,h:128});
   if(art)WorldBillboard(r,player,actors,art,p.x,p.y,p.z+Math.sin(this.age*3)*.06,.65,.65);
   if(this.ready)this.label(r,player,actors,p, I18n.lang==='en'?'Spark · walk closer':'Chispa · acércate',.9);
  }
  if(this.active)this.label(r,player,actors,head,(I18n.lang==='en'?'STUNNED':'ATURDIDO')+' · '+Math.ceil(this.left)+' s',.25);
  if(this.beam<=0)return;
  const a=actors.project(r,player,EricSpark.landing.x,EricSpark.landing.y,.55)||{x:r.canvas.width*.5,y:r.canvas.height*1.03},b=actors.project(r,player,head.x,head.y,head.z-.7);if(!a||!b)return;
  c.save();c.globalAlpha=Math.min(1,this.beam*3);c.lineJoin='round';
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,phase=reduced?0:Math.floor(this.age*12);
  for(const [width,color] of [[9,'#4bcbd990'],[4,'#98ffff'],[1.5,'#ffffff']]){
   c.lineWidth=width;c.strokeStyle=color;c.beginPath();c.moveTo(a.x,a.y);
   for(let i=1;i<=12;i++){const t=i/12,j=i===12?0:Math.sin(i*12.7+phase)*15;c.lineTo(a.x+(b.x-a.x)*t+j,a.y+(b.y-a.y)*t+j*.6);}c.stroke();
  }c.restore();
 }
 label(r,player,actors,p,text,offset){
  const q=actors.project(r,player,p.x,p.y,p.z+offset);if(!q||q.depth<.2||q.depth>(r.depths[Math.floor(q.x/3)*3]??Infinity)+.1)return;
  const c=r.ctx;c.save();c.font='bold 15px "Astralia RPG", Georgia';c.textAlign='center';const width=c.measureText(text).width+20,x=Math.max(width/2+5,Math.min(r.canvas.width-width/2-5,q.x)),y=Math.max(26,Math.min(r.canvas.height-8,q.y));
  c.fillStyle='#102c39cc';c.strokeStyle='#a6ecda';c.lineWidth=1;c.beginPath();c.roundRect(x-width/2,y-22,width,29,7);c.fill();c.stroke();c.fillStyle='#ddfff2';c.fillText(text,x,y-2);c.restore();
 }
};
