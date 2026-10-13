/* Normalize image_gen acting sheets without resizing each pose independently.
   A prone character stays short; the hammer and chair share their actor's scale. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync:run}=require('node:child_process');
const root=path.resolve(__dirname,'..'),lib=path.resolve(root,'../astralia-animation-library/actions');
const temp=path.join(lib,'.build');fs.mkdirSync(temp,{recursive:true});
const specs={
 'karla-ceremony-v2':{columns:4,rows:1,clips:{reserved:[0,0,1,0,2,0,3,3]}},
 'eric-impact-v2':{columns:4,rows:2,clips:{collision:[0,1,2,3,4,5,6,6,7,6]}},
 'ivan-action-v2':{columns:4,rows:3,clips:{panic:[4,5,6,7,6,5],villain:[8,9,8,10,11,10]}},
 'karla-tea-fixed-v2':{columns:4,rows:2,clips:{tea:[0,2,0,3,4,4,5,0],suspicion:[0,6,6,7,7,0]}},
 'karla-tea-legs-v3':{columns:4,rows:2,clips:{tea:[0,2,0,3,4,4,5,0],suspicion:[0,6,6,7,7,0]}},
 'karla-tea-inward-v4':{columns:4,rows:2,clips:{tea:[0,2,0,3,4,4,5,0],suspicion:[0,6,6,7,7,0]}},
 'students-cutouts-v3':{columns:3,rows:2,clips:{blue:[0,0,3,3,0],green:[1,1,4,4,1],brown:[2,5,2,5,2]}},
 'ivan-forest':{columns:4,rows:4,clips:{run:[0,1,2,3],fall:[4,5,6,6,7,7,8,9],battered:[9,10,9,9],chase:[12,13,12,14,12,15]}},
 'ivan-walk':{columns:2,rows:2,clips:{walk_right:[0,1,2,3],walk_left:[0,1,2,3]}},
 'jose-hammer':{columns:4,rows:2,clips:{hammer:[0,1,2,3,0,0],reaction:[4,5,6,6,7,6]}},
 'angelica-tea':{columns:4,rows:2,clips:{tea:[0,2,0,3,4,4,5,0],listen:[0,1,0,6,0]}},
 'karla-tea':{columns:4,rows:2,clips:{tea:[0,2,0,3,4,4,5,0],suspicious:[0,6,6,7,7,0]}},
 'paola-class':{columns:4,rows:2,clips:{scold:[0,1,0,2,3,2,3,4,5,4,6,7]}}
};
const ff=args=>run('ffmpeg',['-v','error','-y',...args],{maxBuffer:100*1024*1024});

// Generated sheets can have slightly uneven rows. Cut in the transparent gutter,
// not through a boot at the mathematical quarter of the image.
function rowCuts(bytes,w,h,rows){
 const ink=new Uint32Array(h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(bytes[(y*w+x)*4+3]>160)ink[y]++;
 const cuts=[0];
 for(let r=1;r<rows;r++){
  const target=Math.round(r*h/rows),reach=Math.round(h/rows*.18);let best=target,score=Infinity;
  for(let y=target-reach;y<=target+reach;y++){const s=ink[y]*1000+Math.abs(y-target);if(s<score){score=s;best=y;}}
  cuts.push(best);
 }
 cuts.push(h);return cuts;
}

for(const [name,spec] of Object.entries(specs).filter(([id])=>process.argv.length<3||process.argv.slice(2).includes(id))){
 const input=path.join(lib,'source',name+'.png'),dir=path.join(temp,name);fs.mkdirSync(dir,{recursive:true});
 const {width:W,height:H}=JSON.parse(run('ffprobe',['-v','error','-show_entries','stream=width,height','-of','json',input])).streams[0];
 const bytes=ff(['-i',input,'-f','rawvideo','-pix_fmt','rgba','-']),cuts=rowCuts(bytes,W,H,spec.rows),bounds=[];
 for(let f=0;f<spec.columns*spec.rows;f++){
  const x0=Math.round(f%spec.columns*W/spec.columns),x1=Math.round((f%spec.columns+1)*W/spec.columns),y0=cuts[Math.floor(f/spec.columns)],y1=cuts[Math.floor(f/spec.columns)+1];
  let l=x1,r=x0,t=y1,b=y0,count=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(bytes[(y*W+x)*4+3]>160){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);count++;}
  if(count<500)throw Error(name+' missing frame '+f);
  bounds.push([l,t,r-l+1,b-t+1]);
 }
 const scale=Math.min(284/Math.max(...bounds.map(b=>b[3])),360/Math.max(...bounds.map(b=>b[2])));
 const metrics=[];
 bounds.forEach(([x,y,w,h],f)=>{
  const dw=Math.round(w*scale),dh=Math.round(h*scale),dx=Math.round((384-dw)/2),dy=304-dh;
  ff(['-i',input,'-vf',`crop=${w}:${h}:${x}:${y},scale=${dw}:${dh}:flags=neighbor,format=rgba,pad=384:320:${dx}:${dy}:color=0x00000000`,'-frames:v','1',path.join(dir,f+'.png')]);
  metrics.push({source:[x,y,w,h],destination:[dx,dy,dw,dh]});
 });
 const rows=Math.ceil(bounds.length/4),sprite=path.join(root,'assets/cast',name+'.webp');
 ff(['-framerate','1','-i',path.join(dir,'%d.png'),'-vf',`tile=4x${rows}`,'-frames:v','1','-c:v','libwebp','-lossless','1',sprite]);
 fs.mkdirSync(path.join(lib,'sprites'),{recursive:true});fs.copyFileSync(sprite,path.join(lib,'sprites',name+'.webp'));
 fs.writeFileSync(path.join(lib,'sprites',name+'.json'),JSON.stringify({cell:[384,320],anchor:[192,304],scale,metrics,clips:spec.clips},null,2));
 const gifs=path.join(lib,'gifs',name);fs.mkdirSync(gifs,{recursive:true});
 for(const [clip,frames] of Object.entries(spec.clips)){
  const list=path.join(dir,clip+'.txt');fs.writeFileSync(list,frames.map(f=>`file '${path.join(dir,f+'.png')}'\nduration ${clip.startsWith('walk')||clip==='run'?.14:.22}`).join('\n')+'\n');
  const prefix=clip==='walk_left'?'[0:v]hflip[v];[v]':'[0:v]';
  ff(['-f','concat','-safe','0','-i',list,'-filter_complex',prefix+'split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-fps_mode','vfr','-loop','0',path.join(gifs,clip+'.gif')]);
 }
 if(name==='ivan-forest')ff(['-i',sprite,'-vf','crop=1536:320:0:960','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast/ivan-chase.webp')]);
 if(name==='ivan-action-v2')ff(['-i',sprite,'-vf','crop=1536:320:0:640','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast/ivan-chase-v2.webp')]);
 console.log('Built',name,bounds.length+' frames');
}
