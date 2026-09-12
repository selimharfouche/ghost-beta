import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const id='310463c3-c942-41ea-a921-5a58fbe63bab';
const out='docs/site';
fs.mkdirSync(`${out}/recordings`,{recursive:true});
for(let i=1;i<=3;i++) fs.copyFileSync(`runs/${id}/ghost-${i}/browser.webm`,`${out}/recordings/ghost-${i}.webm`);
const font='/System/Library/Fonts/Supplemental/Arial.ttf';
let filter=`setpts=(PTS-STARTPTS)/3,scale=1280:800,pad=1280:940:0:100:color=0x0b1411,drawtext=fontfile=${font}:text='GHOST / MIRA - CURIOUS EXPLORER':x=30:y=20:fontsize=25:fontcolor=white,drawtext=fontfile=${font}:text='Continuous browser recording | 3x speed | Planted-bug demo':x=30:y=910:fontsize=17:fontcolor=0xb8c5bc`;
const captions=[
 [0,9.4,'Astra observes the page and chooses its first journey.'],
 [9.4,12.4,'Ghost opens the planner and enters a synthetic trip name.'],
 [12.4,16.4,'Ghost tries Create trip. Watch the response.'],
 [16.4,20.2,'BUG EVIDENCE: no trip appears and no error is shown.'],
 [20.2,28.8,'Ghost checks My trips, then explores the comparison page.'],
 [28.8,33.4,'Ghost chooses Help without a predefined test case.'],
 [33.4,39.3,'BUG FOUND: Help returns 404. This is an intentional demo defect.'],
 [39.3,48.5,'Ghost returns to the app and continues exploring.'],
 [48.5,58.92,'Ghost tests search. The destination cards do not filter.']
];
fs.mkdirSync('work/video-build',{recursive:true});
for(const [i,c] of captions.entries()){
 const file=`work/video-build/continuous-${i}.txt`;fs.writeFileSync(file,c[2]);
 filter+=`,drawtext=fontfile=${font}:textfile=${file}:x=30:y=49:fontsize=19:fontcolor=0xcbf78b:enable='between(t,${c[0]},${c[1]})'`;
}
execFileSync('ffmpeg',['-y','-i',`${out}/recordings/ghost-1.webm`,'-vf',filter,'-an','-c:v','libx264','-profile:v','baseline','-level','3.1','-pix_fmt','yuv420p','-r','25','-crf','21','-movflags','+faststart',`${out}/ghost-demo-compatible.mp4`],{stdio:'ignore'});
execFileSync('ffmpeg',['-y','-i',`${out}/ghost-demo-compatible.mp4`,'-c:v','libvpx-vp9','-crf','33','-b:v','0',`${out}/ghost-demo.webm`],{stdio:'ignore'});
execFileSync('ffmpeg',['-y','-ss','8','-i',`${out}/ghost-demo-compatible.mp4`,'-frames:v','1',`${out}/video-poster.jpg`],{stdio:'ignore'});
fs.copyFileSync(`${out}/ghost-demo-compatible.mp4`,'docs/assets/ghost-demo.mp4');
fs.copyFileSync(`${out}/ghost-demo-compatible.mp4`,`${out}/ghost-demo.mp4`);
console.log('Continuous footage exported; original recordings preserved.');
