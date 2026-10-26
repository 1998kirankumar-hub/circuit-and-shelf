# Circuit & Shelf: launch gates

Current status: source and static build complete; not published to a public domain yet.

1. Connect site owner's GitHub account. Create a `circuit-and-shelf` repository and push the source files. Set branch to `main`.
2. Configure Cloudflare Pages → **Connect to Git**, production branch `main`, build command `npm run build`, output folder `dist`.
3. Open the actual Cloudflare production URL and verify homepage, four stories, mobile navigation, search, categories, internal links and contact/privacy/disclosure pages.
4. Set **SITE_URL** in Cloudflare Pages build variables to the exact canonical domain and redeploy. Verify `/sitemap.xml`, `/robots.txt`, `/feed.xml` and canonical tags. This URL must be **real** and should not be an invented placeholder.
5. Set up a monitored editorial mailbox before applying for AdSense. Replace the honest contact setup notice with a real address; update the About/contact legal pages where needed.
6. Fact-check all editorial copy at publication date and review any product claims; confirm brand name/domain availability and trademarks before purchasing.
7. Verify the site in Google Search Console and submit the sitemap.
8. Add analytics only if wanted, with accurate disclosure and consent handling.
9. Apply to Google AdSense only once site access, eligibility and content quality requirements are met. After approval, set actual publisher ID, implement ads.txt if instructed, update privacy policy and consent management as applicable, then deploy.
10. Review crawl performance and publish useful original stories regularly. No guaranteed AdSense approval, ranking, traffic or revenue.

For any future paid content, affiliate relationship or advertising, review labels and disclosures before publication.

**Hosting caution:** Vercel Hobby is non-commercial and explicitly prohibits AdSense use. Use Cloudflare Pages here, or Vercel Pro if the owner chooses paid hosting.
