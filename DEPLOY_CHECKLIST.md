# Deployment Checklist

Complete these steps to deploy the admin panel to production.

## Step 1: GitHub OAuth App (5 min)

- [ ] Visit https://github.com/settings/developers
- [ ] Click **New OAuth App**
- [ ] Fill in form:
  - [ ] Application name: `StudioLinux Admin`
  - [ ] Homepage URL: `https://studiolinux.com`
  - [ ] Authorization callback URL: `https://studiolinux.com/api/auth/callback`
- [ ] Create OAuth App
- [ ] Copy **Client ID** to a secure location
- [ ] Copy **Client Secret** to a secure location
- [ ] Keep this page open for Step 2

## Step 2: Cloudflare KV Setup (5 min)

- [ ] Log in to Cloudflare dashboard: https://dash.cloudflare.com/
- [ ] Go to **Workers & Pages → KV**
- [ ] Click **Create a namespace**
- [ ] Name it: `studiolinux-tokens-prod`
- [ ] Click **Create**
- [ ] Click **Create a namespace** again
- [ ] Name it: `studiolinux-tokens-preview`
- [ ] Click **Create**
- [ ] Copy both namespace IDs (long alphanumeric strings)
- [ ] Keep this page open for Step 3

## Step 3: Configure wrangler.toml (3 min)

- [ ] Open `/home/yama/studio/wrangler.toml` in your editor
- [ ] Find line: `vars = { GITHUB_CLIENT_ID = "YOUR_GITHUB_APP_CLIENT_ID" }`
- [ ] Replace `YOUR_GITHUB_APP_CLIENT_ID` with the Client ID from Step 1
- [ ] Find the `[env.production.kv_namespaces]` section
- [ ] Replace `YOUR_PROD_KV_ID` with the prod namespace ID from Step 2
- [ ] Replace `YOUR_PREVIEW_KV_ID` with the preview namespace ID from Step 2
- [ ] Save the file

## Step 4: Install Dependencies (2 min)

- [ ] Open terminal in `/home/yama/studio`
- [ ] Run: `npm install`
- [ ] Wait for completion (should see "added X packages")

## Step 5: Store OAuth Secret (2 min)

- [ ] In terminal, run: `wrangler secret put GITHUB_CLIENT_SECRET --env production`
- [ ] When prompted, paste the **Client Secret** from Step 1
- [ ] Press Enter
- [ ] You should see: `✓ Uploaded secret GITHUB_CLIENT_SECRET`

## Step 6: Deploy Worker (1 min)

- [ ] In terminal, run: `wrangler deploy --env production`
- [ ] Wait for deployment to complete
- [ ] You should see: `✓ Published your Worker` with a URL
- [ ] Verify URL is: `https://studiolinux.com/api/...`

## Step 7: Verify Deployment (2 min)

- [ ] In browser, visit: `https://studiolinux.com/api/auth/login`
- [ ] You should see JSON response with an `authUrl` field
- [ ] If error, check:
  - [ ] `wrangler.toml` values are correct
  - [ ] GitHub OAuth app credentials are correct
  - [ ] KV namespace IDs are correct

## Step 8: Test Admin Panel (5 min)

- [ ] Visit: `https://studiolinux.com/admin/login`
- [ ] You should see the admin UI with a blue "Authenticate with GitHub" button
- [ ] Click the button
- [ ] You'll be redirected to GitHub
- [ ] Click **Authorize** to grant app access
- [ ] You'll be redirected back to the admin page
- [ ] Article creation form should appear
- [ ] Your GitHub username should display in top right

## Step 9: Test Article Creation (5 min)

- [ ] In the admin form, fill in:
  - [ ] Title: `Test Article`
  - [ ] Section: `posts`
  - [ ] Excerpt: `This is a test article`
  - [ ] Content: `# Test\n\nThis is a test article to verify the admin panel works.`
- [ ] Click **Preview** to check formatting
- [ ] Click **Publish Article**
- [ ] Wait for success message
- [ ] Go to https://github.com/thelinuxhobbyist/studiolin
- [ ] Navigate to `content/posts/test-article/`
- [ ] Verify `index.md` file was created with your content
- [ ] Wait ~2 minutes for Cloudflare Pages to rebuild
- [ ] Visit `https://studiolinux.com/` and look for your test article

## Step 10: Clean Up (1 min)

- [ ] Go to GitHub and delete the test article folder
- [ ] Commit the deletion
- [ ] Wait for site rebuild

## Verification Checklist

Once completed, verify:

- [ ] Admin page loads at `/admin/login`
- [ ] GitHub OAuth login works
- [ ] Article form appears when logged in
- [ ] Images can be uploaded
- [ ] Articles publish to GitHub
- [ ] Site rebuilds after publishing
- [ ] New articles appear on site
- [ ] Featured images display correctly
- [ ] Homepage featured section works (if using `published_on_home: true`)

## Troubleshooting

If something doesn't work:

1. **Check Cloudflare Dashboard**
   - Go to Workers → click on `studiolinux-admin`
   - Look at recent requests for errors

2. **Check Browser Console** (Press F12)
   - Look for red error messages
   - Check Network tab for failed requests

3. **Check GitHub**
   - Verify OAuth app credentials are correct
   - Check if articles are being created in repo

4. **Re-read DEPLOYMENT.md**
   - Detailed troubleshooting section
   - Common issues and solutions

## Support

- **Deployment Guide**: See `DEPLOYMENT.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **Setup Instructions**: See `ADMIN_SETUP.md`

---

**After completing this checklist, your admin panel is ready to use!** 🎉

Next steps:
1. Delete the test article
2. Start creating real articles
3. Share the admin link with team members (if applicable)
4. Monitor Cloudflare Workers dashboard for errors
