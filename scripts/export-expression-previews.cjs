/* Call expression-polish.browser.cjs first: it renders the actual runtime gait. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync:run}=require('node:child_process');
const root=path.resolve(__dirname,'..'),lib=path.resolve(root,'../astralia-animation-library/actions'),previews=path.resolve(root,'../previews/expression-polish');
const ff=a=>run('ffmpeg',['-v','error','-y',...a]);
const dir=path.join(lib,'gifs/ivan-run-rig-v3');fs.mkdirSync(dir,{recursive:true});
ff(['-framerate','18','-i',path.join(previews,'run-%d.png'),'-filter_complex','split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-loop','0',path.join(dir,'run.gif')]);
const out=path.join(lib,'gifs/paola-help-close');fs.mkdirSync(out,{recursive:true});
const temp=path.resolve(root,'../cast-build/help-preview');fs.mkdirSync(temp,{recursive:true});
for(const [i,f] of [0,2,3,2,0,0,1,0].entries())ff(['-i',path.join(root,'assets/cast/paola-help-close.webp'),'-vf',`crop=192:192:${f*192}:0`,'-frames:v','1',path.join(temp,i+'.png')]);
ff(['-framerate','6','-i',path.join(temp,'%d.png'),'-filter_complex','split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-loop','0',path.join(out,'talk.gif')]);
fs.copyFileSync(path.join(root,'assets/cast/paola-help-close.webp'),path.join(lib,'sprites/paola-help-close.webp'));
console.log('Exported actual articulated gait and shoulder-up talking portrait.');
