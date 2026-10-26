# Circuit & Shelf

**An original, India-focused gaming and gadget editorial website.** Responsive, static and built with no third-party dependencies. Designed for GitHub source control and Cloudflare Pages hosting (with an optional paid Vercel alternative).

## Contents
- Editorial homepage with featured story and filterable/searchable article grid
- Four fully written, distinct articles in Markdown
- About, privacy, contact and editorial disclosure pages
- Responsive light/dark design, keyboard-friendly navigation, semantic HTML
- Search/SEO metadata, structured data, social image and automatically generated sitemap, robots.txt and RSS feed after site URL is known
- Automatically refreshed publisher headline links, checked approximately every 30 minutes by GitHub Actions (no copied story bodies; no Cloudflare rebuild per headline sync)
- A `npm test` suite for generated pages and internal links

## Build and local preview

Requires Node.js 18+.

```bash
npm run check
python3 -m http.server 8080 -d dist
```

Visit `http://localhost:8080`. The `dist` folder is generated automatically.

## Recommended: publish to GitHub + Cloudflare Pages
1. Connect the GitHub app in ChatGPT or upload this folder to a new GitHub repository named `circuit-and-shelf`.
2. In the Cloudflare dashboard select **Workers & Pages → Create application → Pages → Connect to Git**. Authorize the repository, select **main**, use build command `npm run build`, and output directory `dist`.
3. Deploy. Cloudflare assigns a `*.pages.dev` domain. Set the `SITE_URL` environment variable in the project to that **exact production URL** (`https://YOUR-ASSIGNED-SITE.pages.dev`) or a custom domain and redeploy. That enables canonical URLs, `sitemap.xml`, `feed.xml` and the sitemap declaration in `robots.txt`.
4. Open and test the public domain, then verify it in Google Search Console and submit `/sitemap.xml`.
5. Before AdSense application, finish a monitored editorial contact method and review the privacy policy for the final hosting and cookie setup. After AdSense approval, add the **real** publisher ID and any consent mechanisms required by Google and local laws.

**Why Cloudflare Pages?** The site is intended for monetization. Vercel's **free Hobby plan is explicitly limited to non-commercial use and does not permit AdSense advertisements**. Use Vercel only with an appropriate paid commercial plan. GitHub Pages is not the chosen host here—GitHub only stores versioned source files.

Cloudflare deployment guide: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

**IMPORTANT:** Connection of external accounts and AdSense verification/approval requires the site owner's authorization; this repository contains no user credentials or fictitious AdSense identifiers. There is no guarantee of approval, search traffic or earnings.

## Adding articles
1. Add a Markdown file to `content/posts/<slug>.md` with one top-level heading and `##` sections.
2. Add its metadata entry to `content/articles.json`.
3. Run `npm run check`, then push changes to GitHub to deploy automatically if GitHub/Vercel integration is active.

## Editorial workflow
AI tools assisted article drafting, site development and research. The copy avoids invented hands-on benchmarks, fake buyer experiences and fictional review testimonials. Current prices, policies and availability should be verified and dated before making specific claims. Any actual product photography or test results should be supported by original evidence.

## Licence
Site copy and graphics: All rights reserved to the site owner, subject to verification of any external references. Code: may be adapted by the site owner.

## Headline automation

Read [AUTO-HEADLINES.md](AUTO-HEADLINES.md). Scheduled GitHub Actions checks publisher RSS feeds roughly every 30 minutes; the homepage requests latest public JSON from the GitHub raw endpoint, separate from our manually edited articles. GitHub schedules can be delayed and the RSS publishers can have outages.
