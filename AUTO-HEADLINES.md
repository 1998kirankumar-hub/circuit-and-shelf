# Automated tech & gaming headlines

- Source: public RSS/Atom feeds from Engadget, Xbox Wire, PlayStation Blog, 9to5Google, and Ars Technica.
- GitHub Actions checks for recent headlines on a 30-minute **schedule** (`17,47 * * * *`, UTC). GitHub does not guarantee exact scheduling, and may delay or skip scheduled runs. Public-repository workflows can be disabled after 60 days without repository activity.
- The updater preserves the last working list if feeds fail. It commits only when the list changes, avoiding unnecessary commits.
- The homepage reads `content/headlines.json` **directly from raw.githubusercontent.com**. This avoids rebuilding the Cloudflare Pages site 48 times per day, which would exceed the free plan's 500-build monthly allowance.
- Only source-attributed, linked **headlines** are shown. Original stories are hosted by the publishers; we do not copy or summarize their full articles, and headline links are labeled as external.
- New posts in `content/posts/` remain editorially written and do **not** publish automatically. The headlines widget is distinct from our original editorial content.
- RSS is a best-effort service; external feeds can change format, be blocked, or disappear. The homepage shows a neutral error message if live data is unavailable.
- The homepage fetches public JSON on load and while left open every 30 minutes. Actual freshness also depends on the publisher's feed, GitHub Actions timing and GitHub's cache.
- No API keys or paid third-party services are required.

## Where to monitor
[GitHub Actions: Refresh tech headlines](https://github.com/1998kirankumar-hub/circuit-and-shelf/actions/workflows/refresh-headlines.yml)

## Troubleshooting
1. Open the workflow run logs in GitHub Actions. Check for `HTTP 403`, `No usable feeds`, or Git push errors.
2. The job needs `contents: write`. If the repository's Actions settings deny write access, enable the appropriate token permissions or adjust the repository settings.
3. You can use `Run workflow` in GitHub Actions to test an immediate refresh.
4. If the site shows an error, ensure the GitHub repository is public and that `main/content/headlines.json` is available through `https://raw.githubusercontent.com/1998kirankumar-hub/circuit-and-shelf/main/content/headlines.json`.
5. A change to the actual website source requires a Cloudflare Pages Git deployment after it has been connected. The scheduled news data refresh does not require a Cloudflare redeploy.
