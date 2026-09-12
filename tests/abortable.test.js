import {test} from 'node:test';
import assert from 'node:assert/strict';
import {abortable} from '../src/abortable.js';
test('a stuck provider cannot prevent cancellation',async()=>{
 const controller=new AbortController();
 const result=abortable(new Promise(()=>{}),controller.signal);
 controller.abort(new Error('Stop run'));
 await assert.rejects(result,/Stop run/);
});
