export function abortable(promise, signal) {
  if (signal.aborted) return Promise.reject(signal.reason || new Error('Cancelled'));
  return new Promise((resolve,reject)=>{
    const stop=()=>reject(signal.reason || new Error('Cancelled'));
    signal.addEventListener('abort',stop,{once:true});
    Promise.resolve(promise).then(resolve,reject).finally(()=>signal.removeEventListener('abort',stop));
  });
}
