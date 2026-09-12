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
 if(label==='Enable accessibility'){title='Ghost enables accessible controls.';detail='This exposes the canvas app to automated interaction.';}
 if(label==='Document'){title='Ghost decides to create a document.';detail='Nobody provided a test script for this journey.';}
 if(s.action.action==='fill'){title='Ghost enters its own synthetic test content.';detail='Watch the text appear in the real application.';}
 if(/Create/.test(label)){title='Ghost creates the document.';detail='It checks whether the editor opens as expected.';}
 if(/Edit|Source|Markdown/.test(label)){title='Ghost explores the editing tools.';detail='It discovers how to change and preview a document.';}
 if(/Export/.test(label)){title='Ghost inspects the export options.';detail='Opening the menu does not prove that a download works.';}
 if(s.action.action==='fill'){title='Ghost writes its own test content.';detail='Watch the real editor respond to the text it enters.';}
 if(label==='Return to editor'){title='Ghost checks the formatted result.';detail='It looks at what the application actually rendered.';}
 if(label==='PDF document (.pdf)'){title='Ghost tries the PDF export option.';detail='This records the interaction, not a verified downloaded file.';}
 if(i===0){title='Meet Ghost: an AI beta tester.';detail='This is markerpad.app. It is not our planted-bug demo.';}
 const txt=`${work}/${i}.txt`,sub=`${work}/${i}-detail.txt`;
 fs.writeFileSync(txt,title);fs.writeFileSync(sub,detail);
 const frames=Math.round((end-start)*25);
 const zoom=s.action.action==='fill';
 const sourceEditing=label.includes('Markdown Source');
 const camera=zoom?`scale=1920:1200,zoompan=z='1+0.25*max(0,min(1,min(on/18,(${frames}-1-on)/18)))':x='${sourceEditing ? '0' : 'iw/2-iw/zoom/2'}':y='${sourceEditing ? '0' : 'min(ih-ih/zoom,max(0,750-ih/zoom/2))'}':d=1:s=1280x800:fps=25`:'scale=1280:800';
 const vf=`${camera},pad=1280:980:0:130:color=0x0b1411,drawtext=fontfile=${font}:textfile=${txt}:x=30:y=25:fontsize=30:fontcolor=white,drawtext=fontfile=${font}:textfile=${sub}:x=30:y=75:fontsize=23:fontcolor=0xcbf78b,drawtext=fontfile=${font}:text='MARKERPAD.APP | Real browser footage | Edited highlights | Actions at 1x':x=30:y=946:fontsize=18:fontcolor=0xb8c5bc`;
 const clip=`${work}/${i}.mp4`;execFileSync('ffmpeg',['-y','-ss',String(start),'-i',`${out}/recordings/markerpad-ghost-1.webm`,'-t',String(end-start),'-vf',vf,'-an','-c:v','libx264','-profile:v','baseline','-level','3.1','-pix_fmt','yuv420p','-r','25','-crf','21',clip],{stdio:'ignore'});clips.push(`file '${i}.mp4'`);
}
fs.writeFileSync(`${work}/list.txt`,clips.join('\n'));
execFileSync('ffmpeg',['-y','-f','concat','-safe','0','-i',`${work}/list.txt`,'-c','copy','-movflags','+faststart',`${out}/real-demo.mp4`],{stdio:'ignore'});
execFileSync('ffmpeg',['-y','-i',`${out}/real-demo.mp4`,'-c:v','libvpx-vp9','-crf','33','-b:v','0',`${out}/real-demo.webm`],{stdio:'ignore'});
execFileSync('ffmpeg',['-y','-ss','2','-i',`${out}/real-demo.mp4`,'-frames:v','1',`${out}/real-poster.jpg`],{stdio:'ignore'});
for(const name of ['ghost-demo.mp4','ghost-demo-compatible.mp4'])fs.copyFileSync(`${out}/real-demo.mp4`,`${out}/${name}`);
fs.copyFileSync(`${out}/real-demo.webm`,`${out}/ghost-demo.webm`);
fs.copyFileSync(`${out}/real-demo.mp4`,'docs/assets/ghost-demo.mp4');
console.log('Real app demo exported from actual action timestamps.');
