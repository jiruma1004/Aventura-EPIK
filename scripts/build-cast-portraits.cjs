/* Derivatives of the approved atlas: no external service or runtime dependency. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync:run}=require('node:child_process');
const dir=path.resolve(__dirname,'../assets/cast'),tmp=path.resolve(__dirname,'../../cast-build');fs.mkdirSync(tmp,{recursive:true});
const ff=a=>run('ffmpeg',['-v','error','-y',...a]);
for(const id of (process.argv.length>2?process.argv.slice(2):['angelica','paola','karla','eric','ivan-medieval','jose-medieval'])){
 for(let f=0;f<4;f++)ff(['-i',path.join(dir,id+'.webp'),'-vf',`crop=160:160:${f*256+48}:12,scale=192:192:flags=neighbor`,'-frames:v','1',path.join(tmp,id+f+'.png')]);
 ff(['-framerate','1','-i',path.join(tmp,id+'%d.png'),'-vf','tile=4x1','-frames:v','1','-c:v','libwebp','-lossless','1',path.join(dir,id+'-portrait.webp')]);
}
console.log('Requested 4-frame portraits exported.');
