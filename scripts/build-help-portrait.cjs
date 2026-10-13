/* Shoulder-up crop of Paola's approved four facial frames.
   Fixed crop preserves head registration while the mouth/blink changes. */
const path=require('node:path'),fs=require('node:fs'),{execFileSync:run}=require('node:child_process');
const root=path.resolve(__dirname,'..'),temp=path.resolve(root,'../cast-build/paola-help');fs.mkdirSync(temp,{recursive:true});
for(let f=0;f<4;f++)run('ffmpeg',['-v','error','-y','-i',path.join(root,'assets/cast/paola.webp'),'-vf',`crop=112:112:${f*256+72}:12,scale=192:192:flags=neighbor`,'-frames:v','1',path.join(temp,f+'.png')]);
run('ffmpeg',['-v','error','-y','-framerate','1','-i',path.join(temp,'%d.png'),'-vf','tile=4x1','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(root,'assets/cast/paola-help-close.webp')]);
console.log('Paola: four shoulder-up help frames.');
