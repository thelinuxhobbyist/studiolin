# StudioLinux Admin Setup Guide

This guide walks you through setting up the admin panel and deploying the Cloudflare Worker for secure GitHub OAuth authentication.

## Prerequisites

- Cloudflare account (free tier is sufficient)
- GitHub account with admin access to the `thelinuxhobbyist/studiolin` repository
- Node.js 18+ installed locally
- `wrangler` CLI installed (`npm install -g wrangler`)

## Step 1: Create a GitHub OAuth App

1. Go to **GitHub Settings → Developer settings → OAuth Apps** (or https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: `StudioLinux Admin`
   - **Homepage URL**: `https://studiolinux.com`
   - **Authorization callback URL**: `https://studiolinux.com/api/auth/callback`
4. Click **Create OAuth Application**
5. Copy the **Client ID** and **Client Secret** — you'll need these next.

## Step 2: Create Cloudflare KV Namespaces

1. Log in to your Cloudflare dashboard
2. Go to **Workers & Pages → KV**
3. Create two namespaces:
   - `studiolinux-tokens-prod` (production)
   - `studiolinux-tokens-preview` (for testing)
4. Note the namespace IDs (shown in the list)

## Step 3: Configure wrangler.toml

Edit `wrangler.toml` in the repo root and fill in your values:

```toml
[env.production]
vars = { GITHUB_CLIENT_ID = "YOUR_GITHUB_CLIENT_ID_HERE" }

[[env.production.kv_namespaces]]
binding = "TOKENS"
id = "YOUR_PROD_KV_ID_HERE"
preview_id = "YOUR_PREVIEW_KV_ID_HERE"
```

## Step 4: Add the GitHub Secret

Run this command to store the OAuth Client Secret securely:

```bash
wrangler secret put GITHUB_CLIENT_SECRET --env production
```

Paste your GitHub Client Secret when prompted.

## Step 5: Deploy the Worker

```bash
npm install
wrangler deploy --env production
```

This will deploy the OAuth handler to `https://studiolinux.com/api/auth/login` and `https://studiolinux.com/api/auth/callback`.

## Step 6: Test the Admin Panel

1. Visit `https://studiolinux.com/admin/login` in your browser
2. Click **Authenticate with GitHub**
3. You'll be redirected to GitHub to authorize the app
4. After authorization, you'll be redirected back to the admin panel
5. The form should appear, ready for creating articles

## Troubleshooting

### "OAuth error: The redirect_uri does not match"
- Check that your **Authorization callback URL** in GitHub OAuth App settings is exactly `https://studiolinux.com/api/auth/callback`

### "Token not found or expired"
- The token stored in Cloudflare KV has expired (1-hour TTL). Try logging in again.

### "Error initiating OAuth"
- Ensure the Worker is deployed and the URL `https://studiolinux.com/api/auth/login` returns a valid `authUrl` response.

### "Failed to fetch user info"
- This is a non-blocking warning. The admin will still work, but the username won't display.

## How It Works

1. **Client clicks "Authenticate with GitHub"** → Worker generates a GitHub OAuth URL
2. **GitHub redirects user** → Redirects to `/api/auth/callback` with authorization code
3. **Worker exchanges code for token** → Uses GitHub OAuth API to get access token
4. **Token stored in KV** → Token stored with 1-hour expiration for security
5. **User redirected to admin** → With token ID in URL fragment
6. **Client retrieves token** → Calls Worker `/api/auth/token/:id` to get the actual token
7. **Admin form uses token** → Commits new articles to GitHub

## Creating Articles

1. Fill in the article form (title, section, content, etc.)
2. Optionally upload a featured image
3. Click **Publish Article**
4. The article is committed to GitHub as a page bundle
5. Cloudflare Pages rebuilds the site automatically

## Security Notes

- Tokens are stored in Cloudflare Workers KV with a 1-hour TTL
- The token is **never** stored in the browser (no localStorage)
- Token is held only in sessionStorage during the user's session
- After logout or browser close, the token is discarded
- OAuth Client Secret is stored securely in Wrangler and never exposed

## Next Steps

- Add more OAuth scopes if you need to manage other GitHub features
- Extend the Worker to add user permission checks (e.g., only allow specific GitHub users)
- Add rate limiting to prevent abuse of the article creation endpoint
