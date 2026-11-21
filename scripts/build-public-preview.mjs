import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dist = path.join(root, 'dist');
const preview = path.join(root, 'preview');
const repo = process.env.GITHUB_REPOSITORY || '1998kirankumar-hub/circuit-and-shelf';
const prefix = `/${repo}/main/preview`;
if (!fs.existsSync(path.join(dist,'index.html'))) throw new Error('Build first (npm run build).');
fs.rmSync(preview,{recursive:true,force:true});
fs.cpSync(dist,preview,{recursive:true});
for(const extra of ['_headers','.nojekyll']) fs.rmSync(path.join(preview,extra),{force:true});
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(ent.name.endsWith('.html')){
  let html=fs.readFileSync(p,'utf8');
  html=html.replace('<head>','<head><meta name="robots" content="noindex,nofollow">');
  html=html.replace(/\b(href|src)="([^"]+)"/g,(original,attr,value)=>{
    if(!value.startsWith(prefix))return original;
    const tail=value.slice(prefix.length);
    if(!tail||tail==='/') value=`${prefix}/index.html`;
    else if(tail.startsWith('/#'))value=`${prefix}/index.html${tail.slice(1)}`;
    else if(tail.endsWith('/'))value+='index.html';
    return `${attr}="${value}"`;
  });
  fs.writeFileSync(p,html);
}}}
walk(preview);
fs.writeFileSync(path.join(preview,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Public preview snapshot generated. This is a non-indexed temporary viewer, not production hosting.');
