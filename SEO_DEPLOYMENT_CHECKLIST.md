# SEO Fixes - Quick Deployment Checklist

## Pre-Deployment (Local Verification)

- [ ] Read `SEO_FIXES_IMPLEMENTATION.md` thoroughly
- [ ] Run `hugo --minify` locally
- [ ] Verify these files exist in `public/`:
  - [ ] `public/robots.txt`
  - [ ] `public/_redirects`
  - [ ] `public/_headers`
  - [ ] `public/sitemap.xml`
- [ ] Test canonical tag on a sample page:
  ```bash
  hugo --minify
  grep -i canonical public/posts/*/index.html | head -1
  ```
  Should show: `<link rel="canonical" href="https://studiolinux.com/posts/..."`

## Deployment (to Cloudflare)

- [ ] Git commit changes:
  ```bash
  git add -A
  git commit -m "fix(seo): Add canonicals, robots.txt, redirects, and URL consolidation"
  git push origin main
  ```
- [ ] Wait for GitHub Actions to complete (check `.github/workflows/hugo-build.yml`)
- [ ] Verify Cloudflare Pages build succeeds

## Post-Deployment (Within 1 Hour)

- [ ] Verify robots.txt:
  ```bash
  curl https://studiolinux.com/robots.txt
  ```
  Should display your robots.txt content

- [ ] Verify canonical tags:
  ```bash
  curl https://studiolinux.com/posts/linux-for-everyone-first-steps/ | grep canonical
  ```
  Should show: `<link rel="canonical" href="https://studiolinux.com/posts/linux-for-everyone-first-steps/" />`

- [ ] Verify www redirect:
  ```bash
  curl -I https://www.studiolinux.com/
  ```
  Should show HTTP 301 redirect to https://studiolinux.com/

- [ ] Verify sitemap:
  ```bash
  curl https://studiolinux.com/sitemap.xml | head -20
  ```
  Should display valid XML with URLs

- [ ] Test HTTP redirect:
  ```bash
  curl -I http://studiolinux.com/
  ```
  Should show HTTP 301 redirect to HTTPS

- [ ] Clear DNS cache (optional):
  ```bash
  # On macOS:
  sudo dscacheutil -flushcache
  ```

## Google Search Console (24-48 Hours After)

- [ ] Login to Google Search Console
- [ ] Go to Sitemaps section
- [ ] Submit: `https://studiolinux.com/sitemap.xml`
- [ ] Go to Coverage report - note the baseline (duplicates, not indexed, etc.)
- [ ] Go to URL Inspection tool
- [ ] Test 5-10 URLs from `/posts/` section
  - Each should show "Canonical tag detected"
  - Verify canonical points to https://studiolinux.com/[url]
- [ ] Request indexing for homepage: `https://studiolinux.com/`
- [ ] Request indexing for `/posts/` section: `https://studiolinux.com/posts/`

## Monitoring (Next 14 Days)

### Day 1-3
- [ ] Check Search Console Coverage daily
- [ ] Watch for any new 5xx errors (should be ZERO)
- [ ] Verify no "Duplicate without user-selected canonical" new entries

### Day 3-7
- [ ] Coverage should show decrease in duplicates
- [ ] Check URL Inspection for 5-10 pages:
  - Should show "Page is indexed"
  - Should show "Canonical tag" = https://studiolinux.com/[url]
- [ ] Review Performance report for CTR changes

### Day 7-14
- [ ] Duplicate pages should be nearly eliminated from index
- [ ] Rankings should start to improve (signals consolidating)
- [ ] Monitor crawl stats - should be more efficient
- [ ] Check for any unexpected indexing issues

## Files Modified/Created

✅ **Modified:**
- `layouts/_default/baseof.html` - Added canonical tag and noindex partial
- `hugo.yaml` - Added SITEMAP output format and sitemap config

✅ **Created:**
- `static/robots.txt` - Crawl control and sitemap pointer
- `static/_redirects` - URL consolidation and HTTPS enforcement
- `static/_headers` - Cache control and security headers
- `layouts/sitemap.xml` - Clean sitemap template
- `layouts/partials/noindex.html` - Noindex control system
- `content/admin/login.md` - Updated with noindex flag (already done)
- `SEO_FIXES_IMPLEMENTATION.md` - Full documentation
- `SEO_DEPLOYMENT_CHECKLIST.md` - This file

## Rollback Plan (If Issues Arise)

If something breaks after deployment:

1. **Revert files:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Check what broke:**
   - 5xx errors? Check `_headers` cache control settings
   - Pages not found? Check `_redirects` format
   - Canonical issues? Check `baseof.html` template syntax

3. **Restore selectively:**
   - Keep canonical tags (low risk)
   - Remove _redirects if causing issues
   - Disable _headers cache control
   - Restore old sitemap config

---

## Success Criteria

✅ **Mission accomplished when:**
1. Zero 5xx errors for 24+ hours
2. Robots.txt properly served
3. All pages show correct canonical tag
4. www/http variants redirect correctly
5. Sitemap generates with clean URLs
6. Google Search Console shows decreasing duplicates
7. No ranking drops in Performance report

---

**Deployment Status:** Ready  
**Date:** December 29, 2025  
**Risk Level:** Low (SEO best practices, no breaking changes)
