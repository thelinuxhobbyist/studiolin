# Cloudflare Workers Setup for StudioLinux Admin

This directory contains the Cloudflare Worker code for OAuth token exchange.

## Quick Start

```bash
# Install dependencies
npm install

# Test locally
wrangler dev

# Deploy to production
wrangler deploy --env production
```

## Files

- `src/index.ts` - OAuth handler that exchanges GitHub authorization codes for tokens
- `wrangler.toml` - Configuration (fill in your GitHub app credentials and KV namespace IDs)
- `tsconfig.json` - TypeScript configuration

## Configuration

See `../ADMIN_SETUP.md` for full setup instructions, including:
1. Creating a GitHub OAuth app
2. Setting up Cloudflare KV namespaces
3. Configuring secrets with wrangler
4. Deploying the Worker

## Environment Variables

Set these before deploying:

- `GITHUB_CLIENT_ID` - Your GitHub OAuth app Client ID (in wrangler.toml)
- `GITHUB_CLIENT_SECRET` - Your GitHub OAuth app Client Secret (via `wrangler secret put`)

## KV Namespace

The Worker uses Cloudflare KV to store OAuth tokens with a 1-hour TTL:

- Stores state tokens during OAuth flow (10 min TTL)
- Stores access tokens after exchange (1 hour TTL)

Tokens are automatically cleaned up by KV's expiration.
