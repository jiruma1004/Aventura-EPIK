/* Reproducible crop/registration/encoding of ImageGen artwork; no redraws.
   Originals and prompts live beside the game in cast-refresh-2026-10-16. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync:run}=require('node:child_process');
const root=path.resolve(__dirname,'..'),library=path.resolve(root,'../cast-refresh-2026-10-16');
const ff=args=>run('ffmpeg',['-v','error','-y',...args],{maxBuffer:100*1024*1024});
const specs={
 'paola-b-v1':{base:true,rows:4,clips:{talk:[0,2,3,2,0,1,0],greet:[0,8,9,8,0],smile:[0,1,1,1,0],walk:[4,5,6,7]}},
 'eric-b-v1':{base:true,rows:4,clips:{talk:[0,2,3,2,0],potion:[0,10,10,0],laugh:[15,3,15,0],walk:[4,5,6,7]}},
 'eric-battle-b-v1':{rows:2,clips:{throw:[0,3,3,4,5,0],talk:[0,1,2,1,0],flame:[0,6,6,0],fall:[0,7,7,7]}},
 'paola-class-b-v1':{rows:2,clips:{classroom:[0,1,0,1,2,3,2,3,4,5,4,6,7]}},
 'eric-air-b-v1':{rows:2,clips:{parachute:[0,1,0,2,0,1],prison:[3,4,4,5,4,5,4,7]}},
 'eric-run-b-v1':{rows:2,gait:true,clips:{run:[0,1,2,3,4,5,6,7]}},
 'eric-impact-b-v1':{rows:2,clips:{impact:[0,1,2,3,4,5,6,6,6,7,6]}}
};
const selected=process.argv.slice(2);
for(const [name,spec] of Object.entries(specs).filter(([name])=>!selected.length||selected.includes(name))){
 const source=path.join(library,'source',name+'.png'),dir=path.join(library,'frames',name);fs.mkdirSync(dir,{recursive:true});
 const {width:W,height:H}=JSON.parse(run('ffprobe',['-v','error','-show_entries','stream=width,height','-of','json',source])).streams[0];
 const rgba=ff(['-i',source,'-f','rawvideo','-pix_fmt','rgba','-']),ink=new Uint32Array(H),cuts=[0];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rgba[(y*W+x)*4+3]>160)ink[y]++;
 for(let r=1;r<spec.rows;r++){
  const target=Math.round(r*H/spec.rows),reach=Math.round(H/spec.rows*.18);let best=target,score=Infinity;
  for(let y=target-reach;y<=target+reach;y++){const s=ink[y]*1000+Math.abs(y-target);if(s<score){best=y;score=s;}}
  cuts.push(best);
 }cuts.push(H);
 const bounds=[];
 for(let f=0;f<4*spec.rows;f++){
  const x0=Math.round(f%4*W/4),x1=Math.round((f%4+1)*W/4),y0=cuts[Math.floor(f/4)],y1=cuts[Math.floor(f/4)+1];
  let l=x1,r=x0,t=y1,b=y0,count=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(rgba[(y*W+x)*4+3]>160){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);count++;}
  if(count<500)throw Error(name+' empty frame '+f);bounds.push([l,t,r-l+1,b-t+1]);
 }
 const cw=spec.base?256:384,metrics=[];
 bounds.forEach(([x,y,w,h],f)=>{
  // Base rows are authored at different scales. Talking frames share one scale.
  // Action sheets share a scale, so crouches/sitting do not grow to standing height.
  const group=spec.base?bounds.slice(Math.floor(f/4)*4,Math.floor(f/4)*4+4):bounds;
  const scale=Math.min(284/Math.max(...group.map(b=>b[3])),(cw-24)/Math.max(...group.map(b=>b[2])));
  const dw=Math.round(w*scale),dh=Math.round(h*scale);let anchor=x+w/2;
  // Anchor on the head rather than the arm outline when talking or gesturing.
  if(spec.base||spec.gait){let sum=0,n=0;for(let yy=y;yy<y+Math.floor(h*.24);yy++)for(let xx=x;xx<x+w;xx++)if(rgba[(yy*W+xx)*4+3]>160){sum+=xx;n++;}if(n)anchor=sum/n;}
  const dx=Math.max(0,Math.min(cw-dw,Math.round(cw/2-(anchor-x)*scale))),dy=304-dh;
  ff(['-i',source,'-vf',`crop=${w}:${h}:${x}:${y},scale=${dw}:${dh}:flags=neighbor,format=rgba,pad=${cw}:320:${dx}:${dy}:color=0x00000000`,'-frames:v','1',path.join(dir,f+'.png')]);
  metrics.push({source:[x,y,w,h],destination:[dx,dy,dw,dh]});
 });
 ff(['-framerate','1','-i',path.join(dir,'%d.png'),'-vf',`tile=4x${spec.rows}`,'-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast',name+'.webp')]);
 fs.writeFileSync(path.join(dir,'metrics.json'),JSON.stringify({cell:[cw,320],anchor:[cw/2,304],metrics},null,2));
 const gifs=path.join(library,'gifs',name);fs.mkdirSync(gifs,{recursive:true});
 for(const [clip,frames] of Object.entries(spec.clips)){
  const list=path.join(dir,clip+'.txt'),fps=clip==='run'?10:clip==='classroom'?5:6;
  fs.writeFileSync(list,frames.map(f=>`file '${path.join(dir,f+'.png')}'\nduration ${1/fps}`).join('\n')+'\n');
  ff(['-f','concat','-safe','0','-i',list,'-filter_complex','split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-fps_mode','vfr','-loop','0',path.join(gifs,clip+'.gif')]);
 }
 if(spec.base){
  for(const type of ['portrait',...(name.startsWith('paola')?['help']:[])]){
   const size=type==='help'?144:176,top=12,left=Math.round((256-size)/2),prefix=path.join(dir,type);
   for(let f=0;f<4;f++)ff(['-i',path.join(dir,f+'.png'),'-vf',`crop=${size}:${size}:${left}:${top},scale=192:192:flags=neighbor`,'-frames:v','1',prefix+f+'.png']);
   ff(['-framerate','1','-i',prefix+'%d.png','-vf','tile=4x1','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast',name+'-'+type+'.webp')]);
  }
 }
 console.log('Built',name,bounds.length+' registered frames');
}
if(!selected.length||selected.includes('eric-cockpit-b-v1'))ff(['-i',path.join(library,'source/eric-cockpit-b-v1.png'),'-vf','scale=512:768:flags=neighbor','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast/eric-cockpit-b-v1.webp')]);
