import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {installRecordingPointer} from '../src/recording-pointer.js';
test('recording pointer restores its last browser position after navigation', async()=>{
  let position={x:615,y:372};
  async function documentLoad(){
    const pointer={style:{}}, hosts=[];
    const window={__ghostRecordingPosition:async()=>position}; window.top=window;
    const document={documentElement:{append:host=>hosts.push(host)},addEventListener(){},createElement:()=>({style:{},setAttribute(){},attachShadow:()=>({querySelector:()=>pointer})})};
    vm.runInNewContext(`(${installRecordingPointer.toString()})()`,{window,document,setTimeout});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(hosts.length,1);
    return pointer.style.transform;
  }
  assert.equal(await documentLoad(),'translate(615px,372px)');
  position={x:1080,y:33};
  assert.equal(await documentLoad(),'translate(1080px,33px)');
});
