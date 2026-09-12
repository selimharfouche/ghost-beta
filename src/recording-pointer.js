// Recording aid: follows real mouse events; never receives input or enters the control list.
export function installRecordingPointer() {
  const mount = async () => {
    if (window !== window.top) return;
    const position = await window.__ghostRecordingPosition();
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
    const shadow = host.attachShadow({mode:'closed'});
    shadow.innerHTML = `<style>:host{pointer-events:none}#pointer{position:absolute;left:0;top:0;filter:drop-shadow(0 2px 3px #0008);transform:translate(0,0)}.ring{position:absolute;border:4px solid #8fdb42;background:#c9f78b55;border-radius:50%;width:40px;height:40px;margin:-20px;animation:pulse .7s ease-out forwards}@keyframes pulse{from{transform:scale(.4);opacity:1}to{transform:scale(1.6);opacity:0}}</style><svg id="pointer" width="28" height="34" viewBox="0 0 28 34"><path d="M2 2L2 26L9 20L15 32L21 29L15 18L25 17Z" fill="#cbf78b" stroke="#101b13" stroke-width="2"/></svg>`;
    const pointer = shadow.querySelector('#pointer');
    pointer.style.transform = `translate(${position.x}px,${position.y}px)`;
    document.documentElement.append(host);
    document.addEventListener('mousemove', e => {
      pointer.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    }, true);
    document.addEventListener('mousedown', e => {
      const ring=document.createElement('div');ring.className='ring';
      ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';
      shadow.append(ring);setTimeout(()=>ring.remove(),750);
    }, true);
  };
  if(document.documentElement) mount();
  else document.addEventListener('DOMContentLoaded',mount,{once:true});
}

export async function moveRecordingPointer(page, locator, from) {
  await locator.scrollIntoViewIfNeeded();
  const box=await locator.boundingBox();
  if(!box) return;
  const to={x:box.x+box.width/2,y:box.y+box.height/2};
  for(let i=1;i<=30;i++) {
    const t=i/30, eased=t*t*(3-2*t);
    await page.mouse.move(from.x+(to.x-from.x)*eased,from.y+(to.y-from.y)*eased);
    await new Promise(resolve=>setTimeout(resolve,16));
  }
  Object.assign(from,to);
}
