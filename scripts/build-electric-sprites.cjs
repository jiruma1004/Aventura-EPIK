/* Register the four generated cells on fixed anchors, preserving image alpha.
   Source sheets and exact prompts: ../eric-electricity-2026-10-17/source. */
const path=require('node:path'),fs=require('node:fs'),{execFileSync:run}=require('node:child_process');
const root=path.resolve(__dirname,'..'),library=path.resolve(root,'../eric-electricity-2026-10-17');
const ff=args=>run('ffmpeg',['-v','error','-y',...args],{maxBuffer:80*1024*1024});
for(const name of ['eric-stunned','divergence-spark']){
 const input=path.join(library,'source',name+'.png'),dir=path.join(library,'frames',name);fs.mkdirSync(dir,{recursive:true});
 const {width:W,height:H}=JSON.parse(run('ffprobe',['-v','error','-show_entries','stream=width,height','-of','json',input])).streams[0],rgba=ff(['-i',input,'-f','rawvideo','-pix_fmt','rgba','-']),bounds=[];
 for(let i=0;i<4;i++){
  const x0=Math.floor(i%2*W/2),y0=Math.floor(Math.floor(i/2)*H/2),x1=Math.floor((i%2+1)*W/2),y1=Math.floor((Math.floor(i/2)+1)*H/2);let l=x1,r=x0,t=y1,b=y0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(rgba[(y*W+x)*4+3]>180){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  l=Math.max(x0,l-8);r=Math.min(x1-1,r+8);t=Math.max(y0,t-8);b=Math.min(y1-1,b+8);bounds.push([l,t,r-l+1,b-t+1]);
 }
 const body=name==='eric-stunned',cw=body?384:128,ch=body?320:128,scale=Math.min((body?284:112)/Math.max(...bounds.map(b=>b[3])),(body?350:112)/Math.max(...bounds.map(b=>b[2])));
 for(let i=0;i<4;i++){const [x,y,w,h]=bounds[i],dw=Math.round(w*scale),dh=Math.round(h*scale),dx=Math.floor((cw-dw)/2),dy=body?304-dh:Math.floor((ch-dh)/2);ff(['-i',input,'-vf',`crop=${w}:${h}:${x}:${y},scale=${dw}:${dh}:flags=neighbor,format=rgba,pad=${cw}:${ch}:${dx}:${dy}:color=0x00000000`,'-frames:v','1',path.join(dir,i+'.png')]);}
 ff(['-i',path.join(dir,'%d.png'),'-vf','tile=4x1','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast',name+'-v1.webp')]);
 console.log(name,fs.statSync(path.join(root,'assets/cast',name+'-v1.webp')).size,'bytes');
}
