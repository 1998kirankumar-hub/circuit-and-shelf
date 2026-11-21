import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const out=path.join(process.cwd(),'dist');const files=[];const BASE_PATH=process.env.SITE_BASE_PATH||'';
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,item.name);if(item.isDirectory())walk(f);else files.push(f)}}
walk(out);
const htmls=files.filter(x=>x.endsWith('.html'));
assert.equal(htmls.length,10,'Expected homepage, 4 stories, 4 info pages and 404');
let links=0;
for(const f of htmls){const html=fs.readFileSync(f,'utf8');assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/<meta name="description"/);assert.match(html,/<h1[ >]/);assert.match(html,/<nav id="primary-nav"/);assert.match(html,/<main id="main">/);assert.match(html,/<footer/);
  for(const [,attr,url] of html.matchAll(/\b(href|src)="([^"]+)"/g)){
    if(!url.startsWith('/')||url.startsWith('//'))continue;
    const rel=url.split('#')[0].split('?')[0];if(!rel)continue;
    const local=BASE_PATH&&rel.startsWith(BASE_PATH+'/')?rel.slice(BASE_PATH.length):rel;
    const dest=local.endsWith('/')?path.join(out,local,'index.html'):path.join(out,local);
    assert.ok(fs.existsSync(dest),`${f}: broken ${attr} -> ${url}`);links++;
  }
  if(f.includes('/articles/')){assert.match(html,/application\/ld\+json/);assert.match(html,/class="prose"/);assert.match(html,/class="toc"/)}
}
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');assert.match(home,/id="story-search"/);assert.match(home,/data-filter="Gaming"/);assert.match(home,/data-filter="Guides"/);
for(const name of ['favicon.svg','console.svg','checklist.svg','devices.svg','cost.svg','og.png','site.js','site.css'])assert.ok(fs.existsSync(path.join(out,'assets',name)),`Missing ${name}`);
const content=fs.readFileSync(path.join(out,'privacy/index.html'),'utf8');assert.ok(content.includes('Advertising and Google Analytics are not enabled'));
console.log(`PASS: ${htmls.length} pages, ${links} valid local links/assets, SEO tags, article schema, homepage filters, privacy notice.`);

assert.match(home,/id="newswire-list"/,'Homepage needs linked headlines widget');
assert.match(home,/id="newswire-status"/);
assert.ok(fs.existsSync(path.join(process.cwd(),'scripts/update-headlines.mjs')));
assert.ok(fs.existsSync(path.join(process.cwd(),'content/headlines.json')));

// Catch broken browser JavaScript that a link-only test cannot detect.
for (const script of ['assets/site.js','dist/assets/site.js']) {
 const result=spawnSync(process.execPath,['--check',script],{encoding:'utf8'});
 assert.equal(result.status,0,`Invalid JavaScript in ${script}: ${result.stderr}`);
}
if (BASE_PATH){
 const built=fs.readFileSync(path.join(out,'index.html'),'utf8');
 assert.match(built,new RegExp(`href="${BASE_PATH}/assets/site.css"`));
 assert.match(built,new RegExp(`href="${BASE_PATH}/#articles"`));
 assert.match(built,/rel="canonical"/);
}
