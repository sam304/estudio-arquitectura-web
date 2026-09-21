const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=path.resolve(__dirname,'..');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&e.name!=='.git'?walk(path.join(d,e.name)):e.isFile()?[path.join(d,e.name)]:[])}
const files=walk(root).filter(f=>f.endsWith('.html'));
let links=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' h1');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,file+' duplicate IDs');
 const base=new URL(html.match(/<base href="([^"]+)"/)[1],'https://local.test/'+path.relative(root,file).split(path.sep).join('/'));
 for(const m of html.matchAll(/\b(?:href|src|srcset)="([^"]+)"/g)){
  if(m[0].startsWith('href')&&m[1]===html.match(/<base href="([^"]+)"/)[1])continue;
  const refs=m[0].startsWith('srcset')?m[1].split(',').map(candidate=>candidate.trim().split(/\s+/)[0]):[m[1]];
  for(const ref of refs){
  const url=new URL(ref,base);if(url.origin!=='https://local.test')continue;
  let dest=path.join(root,decodeURIComponent(url.pathname));if(fs.existsSync(dest)&&fs.statSync(dest).isDirectory())dest=path.join(dest,'index.html');
  assert(fs.existsSync(dest),`${path.relative(root,file)} -> ${m[1]}`);
  if(url.hash)assert(fs.readFileSync(dest,'utf8').includes(`id="${url.hash.slice(1)}"`),file+' broken fragment');links++;
  }
 }
 assert(!/<(?:h3|option)>\s*(Gestión de proyectos|Project management)/i.test(html),file+' sixth service');
 if(html.includes('data-inquiry='))assert(html.includes('<fieldset disabled>'),file+' inactive form');
}
for(const prefix of ['','en/']){
 for(const route of ['index.html','servicios/index.html']){const h=fs.readFileSync(path.join(root,prefix+route),'utf8');assert.equal((h.match(/<ol class="service-index[^]*?<\/ol>/)[0].match(/<li>/g)||[]).length,5);}
 const h=fs.readFileSync(path.join(root,prefix+'regularizacion/index.html'),'utf8');assert(/<h2>(Primero, entender la situación\.|Start by understanding the situation\.)<\/h2><ol class="process-list">/.test(h));
}
console.log(`${files.length} HTML pages; ${links} local links/assets checked; headings, IDs, five-service indexes, disabled previews and regularization process OK.`);

// Exercise the real adapter with a minimal DOM and mocked backend. No external requests.
const js=fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8');
async function scenario({endpoint='api/test',available='true',resource=true,result={ok:true,downloadUrl:'download/token'},status=200,networkError=false,pending=false}){
 const fieldset={disabled:true},message={textContent:''},button={disabled:false};
 const download={hidden:true,removeAttribute(k){delete this[k]}};
 const form={dataset:{inquiry:resource?'resource':'service',endpoint,available,resource:'test',service:'servicios/asesoria/'},querySelector(s){return s==='fieldset'?fieldset:s==='[role="status"]'?message:s==='button[type="submit"]'?button:download},addEventListener(n,f){this.submit=f},reportValidity(){return true},setAttribute(){},removeAttribute(){}};
 let calls=0,release;
 const ctx={document:{documentElement:{lang:'es'},baseURI:'https://local.test/',querySelector(){return null},querySelectorAll(s){return s==='form[data-inquiry]'?[form]:[]}},location:{origin:'https://local.test'},URL,AbortController,setTimeout,clearTimeout,FormData:class{*[Symbol.iterator](){yield ['name','Test'];yield ['email','test@example.invalid']}},fetch:async()=>{calls++;if(pending)await new Promise(r=>release=r);if(networkError)throw Error('offline');return {ok:status<400,json:async()=>result}}};
 vm.runInNewContext(js,ctx);
 const event={preventDefault(){}};
 const first=form.submit(event);if(pending){await form.submit(event);assert.equal(calls,1);release();}await first;
 return {fieldset,message,button,download,calls};
}
(async()=>{
 let r=await scenario({endpoint:''});assert(r.fieldset.disabled);assert.equal(r.calls,0);
 r=await scenario({available:'false'});assert(r.fieldset.disabled);assert.equal(r.calls,0);
 r=await scenario({endpoint:'https://elsewhere.test/api'});assert.equal(r.calls,0);
 for(const opts of [{status:500},{networkError:true},{result:{ok:false}},{result:{ok:true}},{result:{ok:true,downloadUrl:'javascript:alert(1)'}},{result:{ok:true,downloadUrl:'https://elsewhere.test/file'}}]){r=await scenario(opts);assert(r.download.hidden);assert(r.message.textContent.includes('No se pudo'));assert(!r.button.disabled)}
 r=await scenario({});assert(!r.download.hidden);assert.equal(r.download.href,'https://local.test/download/token');
 r=await scenario({resource:false});assert(r.fieldset.disabled);assert(r.message.textContent.includes('recibida'));
 await scenario({pending:true});console.log('Adapter: disabled/unavailable/off-origin, network and HTTP failures, unconfirmed/missing/unsafe downloads, successful enquiry/download, and duplicate submission checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
