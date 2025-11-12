# StudioLinux Admin Panel - Complete Setup & Deployment

A secure, OAuth-backed admin panel for creating and publishing articles to StudioLinux via GitHub.

## What's New

- ✅ **Secure OAuth flow** - No PAT tokens in your browser
- ✅ **Article creation UI** - Visual form for all article metadata
- ✅ **Image optimization** - Automatic resizing & WebP generation
- ✅ **Cloudflare Workers backend** - Handles OAuth token exchange
- ✅ **Homepage featured articles** - Flag articles to appear on the homepage
- ✅ **Page bundle support** - Articles store images locally with auto-resizing

## Architecture

```
User Browser
    ↓
┌─────────────────────┐
│ /admin/login        │
│ (Hugo static page)  │
└──────────┬──────────┘
           ↓
    [GitHub OAuth]
           ↓
┌─────────────────────┐
│ Cloudflare Worker   │ (authenticates, exchanges code for token)
│ /api/auth/callback  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Cloudflare KV       │ (stores token with 1-hour TTL)
└─────────────────────┘
           ↓
    [User publishes article]
           ↓
┌─────────────────────┐
│ GitHub REST API     │ (commits article to repo)
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Cloudflare Pages    │ (triggers rebuild)
│ (Hugo build)        │
└─────────────────────┘
```

## Setup Steps

### 1. Create GitHub OAuth App

Visit https://github.com/settings/developers and create a new OAuth app:

- **Application name**: `StudioLinux Admin`
- **Homepage URL**: `https://studiolinux.com`
- **Authorization callback URL**: `https://studiolinux.com/api/auth/callback`

Save the **Client ID** and **Client Secret**.

### 2. Set Up Cloudflare KV Namespaces

Go to your Cloudflare dashboard → **Workers & Pages → KV** and create:

- `studiolinux-tokens-prod` (production namespace)
- `studiolinux-tokens-preview` (for local testing)

Note the namespace IDs (shown as a long alphanumeric string).

### 3. Configure wrangler.toml

Edit `/wrangler.toml`:

```toml
[env.production]
vars = { GITHUB_CLIENT_ID = "YOUR_GITHUB_CLIENT_ID" }

[[env.production.kv_namespaces]]
binding = "TOKENS"
id = "YOUR_PROD_KV_ID"
preview_id = "YOUR_PREVIEW_KV_ID"
```

### 4. Store OAuth Secret

```bash
cd /home/yama/studio
npm install
wrangler secret put GITHUB_CLIENT_SECRET --env production
```

Paste your GitHub Client Secret when prompted.

### 5. Deploy the Worker

```bash
wrangler deploy --env production
```

Verify it works by visiting:
- https://studiolinux.com/api/auth/login (should return an `authUrl`)

### 6. Test the Admin Panel

1. Visit https://studiolinux.com/admin/login
2. Click **Authenticate with GitHub**
3. Authorize the app
4. You should see the article creation form

## Using the Admin Panel

### Create a New Article

1. **Login** via GitHub OAuth (one-click)
2. **Fill in the form**:
   - Title (required)
   - Section (Home/Posts, Linux in Our Lives, Tutorials, Tools)
   - Categories (comma-separated)
   - Tags (comma-separated)
   - Excerpt (brief summary)
   - Featured (checkbox to mark as featured)
   - Publish to Homepage (checkbox to feature on home)
   - Featured image (optional; will be auto-resized to JPEG + WebP variants)
   - Content (Markdown)
3. **Preview** to check formatting
4. **Publish** to commit to GitHub
5. Site rebuilds automatically in ~2 minutes

### Article Structure

Articles are created as **page bundles** in GitHub:

```
content/
  posts/
    my-article-title/
      index.md          (article with front matter)
      featured.jpg      (optional image, auto-resized)
```

### Front Matter

The admin form generates YAML front matter like:

```yaml
---
title: "My Article Title"
date: "2025-11-10T14:30:00Z"
categories: ["Education", "Government"]
tags: ["linux", "open-source"]
excerpt: "Brief summary..."
featured_image: "featured.jpg"
featured: true
published_on_home: true
---
```

## Image Processing

When you upload a featured image:

1. Hugo automatically resizes it during build:
   - **Small**: 400px (mobile)
   - **Medium**: 800px (tablet)
   - **Large**: 1200px (desktop)

2. Creates two formats:
   - **JPEG** (fallback) with q=75 quality
   - **WebP** (modern browsers) with q=75 quality

3. The page uses responsive `<picture>` tag with `srcset`:
   ```html
   <picture>
     <source type="image/webp" srcset="..." />
     <img src="..." srcset="..." />
   </picture>
   ```

Result: Smaller, optimized images for faster loading on Cloudflare Pages.

## Troubleshooting

### "OAuth error: The redirect_uri does not match"

- Verify your GitHub OAuth app **Authorization callback URL** is exactly:
  ```
  https://studiolinux.com/api/auth/callback
  ```

### "Token not found or expired"

- The 1-hour token has expired. Log in again.

### "Cannot find module '@cloudflare/workers-types'"

```bash
npm install
```

### "Error initiating OAuth: 404"

- Worker is not deployed. Run:
  ```bash
  wrangler deploy --env production
  ```

### "Failed to publish: GitHub API error: Not Found"

- Your GitHub PAT/OAuth token doesn't have repo write access.
- Log out and log in again to refresh the token.

## Security

- ✅ **No PAT in browser** - OAuth token never stored in localStorage
- ✅ **Short-lived tokens** - 1-hour TTL automatically expires
- ✅ **Secure state handling** - State tokens prevent CSRF attacks
- ✅ **HTTPS only** - All communications encrypted
- ✅ **KV storage** - Tokens stored server-side, never exposed to client

**Best Practice**: Rotate your GitHub OAuth app Client Secret periodically.

## File Layout

```
/home/yama/studio/
  content/admin/login.md           ← Admin page content
  layouts/admin/admin.html         ← Admin UI template
  static/admin/admin.js            ← Admin logic (OAuth flow, form)
  static/admin/admin.css           ← Admin styling
  functions/src/index.ts           ← Cloudflare Worker (OAuth handler)
  wrangler.toml                    ← Worker configuration
  package.json                     ← Node dependencies
  tsconfig.json                    ← TypeScript config
  ADMIN_SETUP.md                   ← This guide
```

## Next Steps

- **Extend permissions**: Add logic to `functions/src/index.ts` to only allow specific GitHub users
- **Add article templates**: Create starter templates for different article types
- **Rate limiting**: Prevent abuse by rate-limiting article creation per user
- **Article history**: Store article versions in GitHub, add edit functionality
- **Media library**: Build a UI to browse and manage all uploaded images

## Support

For issues:
1. Check Cloudflare Workers dashboard for error logs
2. Check browser console (F12) for client-side errors
3. Verify wrangler.toml configuration
4. Ensure GitHub OAuth app credentials are correct

---

**Ready to go live?** Follow the deployment steps above and start creating articles!
