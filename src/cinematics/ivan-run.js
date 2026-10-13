/* A full gait: legs alternate in opposite phases, with counter-swinging arms.
   Keep the head facing the route; never mirror a whole frame to fake a step. */
window.IvanRun={
 pose(time,fps=2.25){const phase=time*Math.PI*2*fps,swing=Math.cos(phase)*.62;return {nearLeg:swing,farLeg:-swing,nearArm:-swing*.9,farArm:swing*.9,bob:Math.abs(Math.sin(phase))*5};},
 draw(c,image,time,x,feet,height,{speed=2.25,flip=false}={}){
  if(!image?.complete||!image.naturalWidth)return false;
  const p=this.pose(time,speed),k=height/284;
  c.save();c.translate(x,feet-p.bob*k);c.scale(flip?-k:k,k);c.imageSmoothingEnabled=false;
  const part=(i,x,y,h,angle=0,pivot=.4)=>{const [sx,sy,sw,sh]=IvanRunParts[i],w=h*sw/sh;c.save();c.translate(x,y);c.rotate(angle);c.drawImage(image,sx,sy,sw,sh,-w*pivot,0,w,h);c.restore();};
  part(2,13,-190,94,p.farArm);
  part(4,8,-131,131,p.farLeg);
  part(3,-12,-131,131,p.nearLeg);
  part(0,0,-284,167,.035,.5);
  part(1,-29,-193,96,p.nearArm);
  c.restore();return true;
 }
};
