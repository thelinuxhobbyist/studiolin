# Quick Reference: StudioLinux Admin Panel

## URLs

- **Admin Login**: https://studiolinux.com/admin/login
- **GitHub OAuth App**: https://github.com/settings/developers
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Repository**: https://github.com/thelinuxhobbyist/studiolin

## Configuration Files

| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare Worker config (GitHub Client ID, KV namespace IDs) |
| `package.json` | Node dependencies for Worker |
| `functions/src/index.ts` | OAuth handler code |
| `content/admin/login.md` | Admin page content |
| `layouts/admin/admin.html` | Admin UI template |
| `static/admin/admin.js` | Admin form & GitHub API logic |
| `static/admin/admin.css` | Admin styling |

## One-Time Setup

```bash
# 1. Install dependencies
cd /home/yama/studio
npm install

# 2. Store GitHub OAuth Client Secret
wrangler secret put GITHUB_CLIENT_SECRET --env production

# 3. Deploy Worker
wrangler deploy --env production
```

## Article Sections

When creating an article, choose one:

| Section | Usage |
|---------|-------|
| `posts` | Main articles (appear on homepage) |
| `linux-in-our-lives` | Long-form features & stories |
| `tutorials` | Step-by-step guides |
| `tools` | Tools & resources |

## Front Matter Generated

The admin form creates this YAML front matter:

```yaml
---
title: "Article Title"
date: "2025-11-10T20:28:00Z"
categories: ["Category1", "Category2"]      # if provided
tags: ["tag1", "tag2"]                      # if provided
excerpt: "Brief summary..."                 # if provided
featured_image: "featured.jpg"              # if image uploaded
featured: true                              # if checked
published_on_home: true                     # if checked
---
```

## Image Handling

- ✅ Upload a JPG/PNG image with the article
- ✅ Hugo automatically creates:
  - JPEG versions: 400w, 800w, 1200w (q=75)
  - WebP versions: 400w, 800w, 1200w (q=75)
- ✅ Page uses responsive srcset and picture element
- ✅ Images cached by Cloudflare CDN

## Common Tasks

### Create an Article

1. Go to https://studiolinux.com/admin/login
2. Click **Authenticate with GitHub**
3. Authorize the app
4. Fill in the form
5. Upload optional featured image
6. Click **Publish Article**
7. Wait ~2 minutes for site rebuild

### Edit an Article

Currently: Edit the markdown file in GitHub directly or use `git` locally.

Future: Add edit UI to admin panel.

### Delete an Article

Delete the article's folder from GitHub:

```
content/posts/article-title/
```

### View Article Build Logs

Cloudflare Pages → deployments → click latest → view logs

## Troubleshooting

### "Error initiating OAuth: 404"

Worker not deployed.

```bash
wrangler deploy --env production
```

### "Token not found or expired"

Log in again (tokens expire after 1 hour).

### "Failed to publish: Not Found"

GitHub token doesn't have repo access. Log in again.

### "Cannot read property 'replace' of undefined"

Title or content field is empty. Fill in all required fields.

## Technical Details

- **Backend**: Cloudflare Workers (TypeScript)
- **Token Storage**: Cloudflare KV (1-hour TTL)
- **Auth Flow**: GitHub OAuth 2.0
- **Image Processing**: Hugo image resources + WebP
- **Deployment**: GitHub → Cloudflare Pages → Auto-rebuild

## File Tree

```
/home/yama/studio/
├── content/
│   ├── admin/
│   │   └── login.md              ← Admin page
│   ├── posts/
│   ├── tutorials/
│   └── ...
├── layouts/
│   ├── admin/
│   │   └── admin.html            ← Admin UI template
│   ├── partials/
│   │   └── featured-image.html   ← Image processing & WebP
│   └── ...
├── static/
│   └── admin/
│       ├── admin.js              ← Form & GitHub API
│       └── admin.css             ← Styling
├── functions/
│   ├── src/
│   │   └── index.ts              ← OAuth handler (Worker)
│   ├── wrangler.toml             ← Worker config
│   └── package.json              ← Dependencies
└── ...
```

## Helpful Links

- [Deployment Guide](DEPLOYMENT.md)
- [Setup Instructions](ADMIN_SETUP.md)
- [Implementation Summary](ADMIN_SUMMARY.md)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

**Questions?** Check DEPLOYMENT.md for detailed troubleshooting.
