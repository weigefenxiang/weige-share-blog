'use strict'
const assert=require('node:assert/strict')
const fs=require('node:fs')
const path=require('node:path')
const {spawnSync}=require('node:child_process')
const root=path.resolve(__dirname,'..')
const file=path.join(root,'public/zh-CN/gitalk2-eval/runtime-config.js')
const command=path.join(root,'tools/render-gitalk2-auth-config.cjs')
const original=fs.readFileSync(file)
const baseEnv={...process.env,WEIG_GITALK_CLIENT_ID:'',WEIG_GITALK_PROXY_ORIGIN:'',GITHUB_CLIENT_SECRET:'SHOULD_NEVER_BE_EXPOSED'}
function run(id,proxy) {
  const env={...baseEnv,WEIG_GITALK_CLIENT_ID:id,WEIG_GITALK_PROXY_ORIGIN:proxy}
  return spawnSync(process.execPath,[command],{cwd:root,env,encoding:'utf8'})
}
try {
  let result=run('','')
  assert.equal(result.status,0,result.stderr)
  assert.match(fs.readFileSync(file,'utf8'),/"enabled":false/)
  result=run('Iv1ValidPublic123','https://example-gitalk.workers.dev')
  assert.equal(result.status,0,result.stderr)
  const enabled=fs.readFileSync(file,'utf8')
  assert.match(enabled,/"enabled":true/)
  assert.match(enabled,/"clientID":"Iv1ValidPublic123"/)
  assert.match(enabled,/"proxy":"https:\/\/example-gitalk\.workers\.dev"/)
  assert.doesNotMatch(enabled,/SHOULD_NEVER_BE_EXPOSED|GITHUB_CLIENT_SECRET|PRIVATE_KEY|SESSION_ENCRYPTION_KEY/)
  result=run('Iv1ValidPublic123','')
  assert.notEqual(result.status,0)
  result=run('Iv1ValidPublic123','http://example-gitalk.workers.dev')
  assert.notEqual(result.status,0)
  result=run('Iv1ValidPublic123','https://gitalk-proxy.aispin-abf.workers.dev')
  assert.notEqual(result.status,0)
  result=run('Iv1ValidPublic123','https://example-gitalk.workers.dev/oauth/token')
  assert.notEqual(result.status,0)
  console.log('Gitalk auth public config enabled/disabled/security contracts: PASS')
} finally {
  // Restore the original built artifact. Never alter user-provided env config.
  fs.writeFileSync(file,original)
}
