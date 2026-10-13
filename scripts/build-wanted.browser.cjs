/* Compose the printable poster frames from the approved portrait strips. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage();await p.goto(process.env.EPIK_TEST_BASE_URL||'http://127.0.0.1:8767');
 const data=await p.evaluate(async()=>{
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=768;const c=canvas.getContext('2d');
  for(const [i,id] of ['karla','eric'].entries()){
   const image=new Image();image.src=id==='karla'?'assets/cast/karla-wanted-head-v1.webp':'assets/cast/'+id+'-portrait.webp';await image.decode();c.save();c.translate(i*512,0);
   const paper=c.createLinearGradient(0,0,512,768);paper.addColorStop(0,'#e1d0a3');paper.addColorStop(.45,'#eadbb7');paper.addColorStop(1,'#cdb58b');
   c.fillStyle=paper;c.beginPath();c.moveTo(18,10);for(let x=18;x<495;x+=17)c.lineTo(x,12+Math.sin(x*7)*4);c.lineTo(499,750);for(let x=492;x>10;x-=17)c.lineTo(x,753+Math.sin(x*3)*4);c.closePath();c.fill();
   c.strokeStyle='#695338';c.lineWidth=2;c.strokeRect(37,35,438,688);c.strokeRect(48,45,416,669);
   c.strokeStyle='#94794f';c.beginPath();c.moveTo(70,178);c.lineTo(442,178);c.moveTo(70,594);c.lineTo(442,594);c.stroke();
   c.fillStyle='#d1bd98';c.fillRect(90,199,332,382);c.imageSmoothingEnabled=false;c.filter='grayscale(1) sepia(.25)';c.drawImage(image,0,0,id==='karla'?image.naturalWidth:192,id==='karla'?image.naturalHeight:192,74,204,364,364);c.filter='none';
   c.fillStyle='#806743';for(let k=0;k<18;k++){c.globalAlpha=.025+(k%3)*.01;c.fillRect(52+(k*71)%402,65+(k*137)%630,1+(k%4),30);}c.restore();
  }
  return canvas.toDataURL('image/webp',.94).split(',')[1];
 });fs.writeFileSync(path.resolve(__dirname,'../assets/cast/wanted-v2.webp'),Buffer.from(data,'base64'));console.log('Updated Karla and Eric wanted portraits.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
