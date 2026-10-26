import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const out=path.join(process.cwd(),'dist');const files=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,item.name);if(item.isDirectory())walk(f);else files.push(f)}}
walk(out);
const htmls=files.filter(x=>x.endsWith('.html'));
assert.equal(htmls.length,10,'Expected homepage, 4 stories, 4 info pages and 404');
let links=0;
for(const f of htmls){const html=fs.readFileSync(f,'utf8');assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/<meta name="description"/);assert.match(html,/<h1[ >]/);assert.match(html,/<nav id="primary-nav"/);assert.match(html,/<main id="main">/);assert.match(html,/<footer/);
  for(const [,attr,url] of html.matchAll(/\b(href|src)="([^"]+)"/g)){
    if(!url.startsWith('/')||url.startsWith('//'))continue;
    const rel=url.split('#')[0].split('?')[0];if(!rel)continue;
    const dest=rel.endsWith('/')?path.join(out,rel,'index.html'):path.join(out,rel);
    assert.ok(fs.existsSync(dest),`${f}: broken ${attr} -> ${url}`);links++;
  }
  if(f.includes('/articles/')){assert.match(html,/application\/ld\+json/);assert.match(html,/class="prose"/);assert.match(html,/class="toc"/)}
}
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');assert.match(home,/id="story-search"/);assert.match(home,/data-filter="Gaming"/);assert.match(home,/data-filter="Guides"/);
for(const name of ['favicon.svg','console.svg','checklist.svg','devices.svg','cost.svg','og.png','site.js','site.css'])assert.ok(fs.existsSync(path.join(out,'assets',name)),`Missing ${name}`);
const content=fs.readFileSync(path.join(out,'privacy/index.html'),'utf8');assert.ok(content.includes('Advertising and Google Analytics are not enabled'));
console.log(`PASS: ${htmls.length} pages, ${links} valid local links/assets, SEO tags, article schema, homepage filters, privacy notice.`);
