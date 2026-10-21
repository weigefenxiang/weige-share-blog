'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const vm = require('node:vm')
const fs = require('node:fs')
const code = fs.readFileSync('themes/butterfly/source/js/weig-gitalk2-upload.js','utf8')
const host = fs.readFileSync('themes/butterfly/source/js/weig-gitalk2.js','utf8')
function boot(token, transport) {
  const client = { window: {}, URL, DOMException,
    localStorage: { getItem: key => key === 'GT_ACCESS_TOKEN' ? token : null },
    fetch: transport ?? (async () => ({ ok: true, json: async () => ({ url: 'https://files.weigshare.com/pic.png' }) }))
  }
  vm.runInNewContext(code,client,{timeout:250})
  return client.window.WEIG_GITALK_UPLOAD
}
test('missing or off-domain upload service fails closed', () => {
  const b=boot('ghu_'+'a'.repeat(28))
  for(const url of ['','http://uploads.weigshare.com/api/upload','https://evil.example/api/upload','https://uploads.weigshare.com/admin','https://user:pass@uploads.weigshare.com/api/upload','https://uploads.weigshare.com/api/upload?token=bad']) {
    assert.equal(b.create(url),null)
  }
  assert.equal(typeof b.create('https://uploads.weigshare.com/api/upload'),'function')
  assert.match(host,/if \(uploader\) options\.onUploadFile = uploader/)
})
test('missing GitHub session is rejected before network',async()=>{
  let called=0
  const bridge=boot(null,async()=>{called++;return {ok:true}})
  await assert.rejects(bridge.create('https://uploads.weigshare.com/api/upload')([{name:'a.png',type:'image/png',size:123}]),/GitHub login/)
  assert.equal(called,0)
})
test('confirmed file types yield image and file Markdown kinds, without uploading invalid types',async()=>{
  const calls=[]
  const b=boot('ghu_'+'z'.repeat(30),async(uri,opts)=>{
    calls.push({uri,opts})
    return {ok:true,json:async()=>({url:'https://assets.weigshare.com/files/'+calls.length})}
  })
  const upload=b.create('https://uploads.weigshare.com/api/upload')
  const progress=[]
  const uploaded=await upload([
    {name:'diagram.png',type:'image/png',size:125},
    {name:'guide.pdf',type:'application/pdf',size:180}
  ],{onProgress:(done,total)=>progress.push([done,total])})
  assert.equal(uploaded.length,2)
  assert.equal(uploaded[0].kind,'image')
  assert.equal(uploaded[1].kind,'file')
  assert.equal(calls.length,2)
  assert.equal(calls[0].opts.headers.Authorization.startsWith('Bearer ghu_'),true)
  assert.equal(calls[0].opts.redirect,'error')
  assert.deepEqual(Array.from(progress[1]),[305,305])
  await assert.rejects(upload([{name:'bad.svg',type:'image/svg+xml',size:100}]),/Unsupported/)
  assert.equal(calls.length,2)
})
