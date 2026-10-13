/* Remove a deliberately flat green production backdrop before atlas normalization.
   Usage: node scripts/key-sprite.cjs input.png output.png */
const {execFileSync}=require('node:child_process');
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Expected input and output PNG paths');
execFileSync('ffmpeg',['-v','error','-y','-i',input,'-vf','format=rgba,colorkey=0x00FF00:0.24:0.06','-frames:v','1',output]);
console.log('Transparent sprite source ready:',output);
