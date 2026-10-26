/**
 * Scheduled headline aggregator for Circuit & Shelf.
 * Stores only publisher headlines, original article URLs, source and publication time.
 * Does not scrape or republish article bodies, images, excerpts, or commentary.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SOURCES = [
  { name: 'Engadget', category: 'Technology', url: 'https://www.engadget.com/rss.xml', domains: ['engadget.com'] },
  { name: 'Xbox Wire', category: 'Gaming', url: 'https://news.xbox.com/en-us/feed/', domains: ['news.xbox.com'] },
  { name: 'PlayStation Blog', category: 'Gaming', url: 'https://blog.playstation.com/feed/', domains: ['blog.playstation.com'] },
  { name: '9to5Google', category: 'Phones & AI', url: 'https://9to5google.com/feed/', domains: ['9to5google.com'] },
  { name: 'Ars Technica', category: 'Technology', url: 'https://feeds.arstechnica.com/arstechnica/index', domains: ['arstechnica.com', 'feeds.arstechnica.com'] }
];

const MAX_AGE_MS = 10 * 24 * 60 * 60 * 1000;
const MAX_FUTURE_MS = 30 * 60 * 1000;

export function cleanText(text = '') {
  const cdata = String(text).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  const stripped = cdata.replace(/<[^>]*>/g, '');
  return stripped.replace(/&#(x[0-9a-f]+|\d+);/gi, (_,code) => {
    const value = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1),16) : parseInt(code,10);
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : '';
  }).replace(/&(?:amp|quot|apos|lt|gt|nbsp|#39);/gi, match => ({
    '&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' ','&#39;':"'"
  })[match.toLowerCase()] ?? match).replace(/\s+/g, ' ').trim();
}
function readTag(entry, tag) {
  const match = entry.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}\\s*>`, 'i'));
  return cleanText(match?.[1] ?? '');
}
export function parseFeed(xml, source, now = Date.now()) {
  const output = [];
  const items = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi)];
  for (const [, ,entry] of items) {
    const title = readTag(entry, 'title');
    let url = readTag(entry, 'link');
    if (!url) url = entry.match(/<link\b[^>]*\bhref\s*=\s*['"]([^'"]+)['"][^>]*\/?\s*>/i)?.[1] ?? '';
    url = cleanText(url);
    let validUrl;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || !source.domains.some(d => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`))) continue;
      parsed.hash = '';
      for (const key of [...parsed.searchParams.keys()]) if (/^utm_|^fbclid$|^gclid$/i.test(key)) parsed.searchParams.delete(key);
      validUrl = parsed.toString();
    } catch { continue; }
    const rawDate = readTag(entry,'pubDate') || readTag(entry,'published') || readTag(entry,'updated') || readTag(entry,'dc:date');
    const pub = new Date(rawDate).getTime();
    if (!Number.isFinite(pub) || pub < now - MAX_AGE_MS || pub > now + MAX_FUTURE_MS) continue;
    if (title.length < 12 || title.length > 220) continue;
    output.push({ title, url: validUrl, source: source.name, category: source.category, publishedAt: new Date(pub).toISOString() });
  }
  return output.slice(0, 12);
}

export function buildEdition(stories, previous = null, now = new Date()) {
  const seen = new Set();
  const normalized = stories.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).filter(s => {
    const key = s.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Avoid one publisher crowding out every other source.
  const counts = new Map();
  const next = normalized.filter(s => {
    const count = counts.get(s.source) ?? 0;
    if (count >= 5) return false;
    counts.set(s.source,count + 1);
    return true;
  }).slice(0, 12);
  if (!next.length) return previous;
  // If no headline changed, don't create unnecessary commits or imply freshness.
  if (previous && JSON.stringify(previous.items) === JSON.stringify(next)) return previous;
  return { updatedAt: now.toISOString(), items: next };
}

async function download(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(source.url, {signal: controller.signal, headers:{'User-Agent':'CircuitAndShelfHeadlineBot/1.0 (+https://github.com/1998kirankumar-hub/circuit-and-shelf)','Accept':'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'}});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    if (xml.length > 3_000_000) throw new Error('Oversized feed');
    const items = parseFeed(xml,source);
    console.log(`${source.name}: ${items.length} eligible headlines`);
    return items;
  } finally {clearTimeout(timeout);}
}

export async function update() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const out = path.join(root,'content/headlines.json');
  const old = JSON.parse(fs.readFileSync(out,'utf8'));
  const results = await Promise.allSettled(SOURCES.map(download));
  const stories = [];
  let successful = 0;
  results.forEach((r,i)=> {
    if(r.status==='fulfilled'){ successful++; stories.push(...r.value); }
    else console.warn(`Feed unavailable: ${SOURCES[i].name}: ${String(r.reason).slice(0,200)}`);
  });
  if (successful === 0 || stories.length === 0) {
    console.warn('No usable feeds this run. Keeping previous headlines rather than publishing empty content.');
    if (!old.items?.length) process.exitCode=1;
    return false;
  }
  const next = buildEdition(stories,old);
  if (JSON.stringify(old) !== JSON.stringify(next)) {
    fs.writeFileSync(out,JSON.stringify(next,null,2)+'\n');
    console.log(`Saved ${next.items.length} linked publisher headlines.`);
    return true;
  }
  console.log('No new headlines; existing edition preserved.');
  return false;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  update().catch(error=>{console.error(error);process.exitCode=1});
}
