import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const id=process.argv[2];
if(!/^[a-f0-9-]{36}$/.test(id||'')) throw Error('Supply completed run ID');
const run=JSON.parse(fs.readFileSync(`runs/${id}/run.json`,'utf8'));
if(run.status!=='completed') throw Error('Run must finish first');
const out='docs/site',work='work/real-video',font='/System/Library/Fonts/Supplemental/Arial.ttf';
fs.mkdirSync(work,{recursive:true});fs.mkdirSync(`${out}/recordings`,{recursive:true});
for(const g of run.ghosts) fs.copyFileSync(`runs/${id}/${g.id}/browser.webm`,`${out}/recordings/markerpad-${g.id}.webm`);
const ghost=run.ghosts[0],zero=Date.parse(ghost.videoStartedAt),clips=[];
const sec=at=>(Date.parse(at)-zero)/1000;
let previousEnd=0;
for(let i=0;i<ghost.steps.length-1;i++) {
 const s=ghost.steps[i],next=ghost.steps[i+1];
 if(!s.actionAt||s.outcome!=='executed')continue;
 const start=Math.max(previousEnd,sec(s.actionAt)-(i === 0 ? 7 : 1.6)),end=sec(next.at)+(s.action?.label === "Create trip" ? 4 : 2.5);
 if(end<=start)continue;
 previousEnd=end;
 const label=s.action.label||s.action.value||s.action.action;
 let title='Ghost explores MarkerPad, a real web app.';
 let detail='Astra chooses what to try from the interface it sees.';
 if(label==='Decline'){title='Ghost opens a real document editor.';detail='It declines optional analytics and starts exploring.';}
 if(label==='Enable accessibility'){title='Ghost turns on controls it can read.';detail='This lets it navigate the editor using accessible buttons.';}
 if(label==='Document'){title='Ghost decides to create a new document.';detail='Astra chooses this task after looking at the available buttons.';}
 if(s.action.action==='fill'){title='Ghost enters its own synthetic test content.';detail='Watch the text appear in the real application.';}
 if(/Create/.test(label)){title='Ghost creates its test document.';detail='It checks that the new document opens in the editor.';}
 if(/Edit|Source|Markdown/.test(label)){title='Ghost opens the text-formatting editor.';detail='Markdown uses simple symbols to make headings, lists, and tables.';}
 if(/Export/.test(label)){title='Ghost looks for ways to save or share the document.';detail='It opens the export menu to see which formats are available.';}
 if(s.action.action==='fill'){title='Ghost types a note to test formatting.';detail='It tries a heading, a checklist, bold text, a quote, and a table.';}
 if(label==='Return to editor'){title='Ghost checks how the finished note looks.';detail='The editor has turned the typed symbols into formatted content.';}
 if(label==='PDF document (.pdf)'){title='Ghost chooses PDF, a format for sharing documents.';detail='The recording ends here. Download completion was not checked.';}
 if(label==='My Awesome Document'){title='Ghost gives its test document a name.';detail='It uses made-up content while trying the app like a new visitor.';}
 if(i===0){title='Ghost tests MarkerPad, an online document editor.';detail='Astra chooses what to try, then checks what happens.';}
 const txt=`${work}/${i}.txt`,sub=`${work}/${i}-detail.txt`;
 fs.writeFileSync(txt,title);fs.writeFileSync(sub,detail);
 const frames=Math.round((end-start)*25);
 const zoom=s.action.action==='fill';
 const sourceEditing=label.includes('Markdown Source');
 const camera=zoom?`scale=1920:1200,zoompan=z='1+0.25*max(0,min(1,min(on/18,(${frames}-1-on)/18)))':x='${sourceEditing ? '0' : 'iw/2-iw/zoom/2'}':y='${sourceEditing ? '0' : 'min(ih-ih/zoom,max(0,750-ih/zoom/2))'}':d=1:s=1280x800:fps=25`:'scale=1280:800';
 const vf=`${camera},pad=1280:980:0:130:color=0x0b1411,drawtext=fontfile=${font}:textfile=${txt}:x=30:y=25:fontsize=30:fontcolor=white,drawtext=fontfile=${font}:textfile=${sub}:x=30:y=75:fontsize=23:fontcolor=0xcbf78b,drawtext=fontfile=${font}:text='Built by Selim Harfouche using GPT-6 Astra | Edited highlights | Actions at 1x':x=30:y=946:fontsize=18:fontcolor=0xb8c5bc`;
 const clip=`${work}/${i}.mp4`;execFileSync('ffmpeg',['-y','-ss',String(start),'-i',`${out}/recordings/markerpad-ghost-1.webm`,'-t',String(end-start),'-vf',vf,'-an','-c:v','libx264','-profile:v','baseline','-level','3.1','-pix_fmt','yuv420p','-r','25','-crf','21',clip],{stdio:'ignore'});clips.push(`file '${i}.mp4'`);
}
fs.writeFileSync(`${work}/list.txt`,clips.join('\n'));
execFileSync('ffmpeg',['-y','-f','concat','-safe','0','-i',`${work}/list.txt`,'-c','copy','-movflags','+faststart',`${out}/explained-demo.mp4`],{stdio:'ignore'});
execFileSync('ffmpeg',['-y','-i',`${out}/explained-demo.mp4`,'-c:v','libvpx-vp9','-crf','33','-b:v','0',`${out}/explained-demo.webm`],{stdio:'ignore'});
execFileSync('ffmpeg',['-y','-ss','2','-i',`${out}/explained-demo.mp4`,'-frames:v','1',`${out}/explained-poster.jpg`],{stdio:'ignore'});
for(const name of ['ghost-demo.mp4','ghost-demo-compatible.mp4'])fs.copyFileSync(`${out}/explained-demo.mp4`,`${out}/${name}`);
fs.copyFileSync(`${out}/explained-demo.webm`,`${out}/ghost-demo.webm`);
fs.copyFileSync(`${out}/explained-demo.mp4`,'docs/assets/ghost-demo.mp4');
console.log('Real app demo exported from actual action timestamps.');
