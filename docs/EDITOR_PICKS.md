Editor Picks and Trending — quick notes
=====================================

This short note explains how the "Editor's Pick" feature works on this Hugo site and how to re-enable the (currently deferred) Trending feature later.

How Editor's Picks work
- When creating or editing a post, add the following to the post's front matter to mark it as an editor pick:

```yaml
recommended: "editor"
thumbnail: "/images/your-thumbnail.png" # optional
```

- The homepage template selects posts where `recommended: "editor"` and renders up to 4 picks.
- No runtime view-counts are required for editor picks.

How Trending was implemented previously (deferred)
- A prototype used client-side pings and a serverless function to collect per-post view counts (dev-only, in-memory demo). For production on Cloudflare Pages we'd recommend one of:

  1. Durable Objects (Cloudflare Workers) — atomic counters, best consistency and real-time accuracy.
  2. Workers KV or Pages Functions + KV — simpler but eventual consistency; acceptable for approximate ranking.
  3. CI or build-time import — export analytics to `data/trending.yaml` during CI and use that for static builds (no serverless required).

- To re-enable Trending:
  - Add back the client-side view ping on single post pages (the repo previously had `static/js/view-counter.js`).
  - Deploy a serverless endpoint (Durable Object / KV / Pages Function) to accept pings and return top-N views.
  - Update `layouts/index.html` to request the live trending list (or fall back to a static `data/trending.yaml`).

Security & anti-abuse
- Always add basic rate-limiting or origin checks for any public view-counter endpoint. Durable Objects + Cloudflare Firewall rules give robust protection. If using build-time imports, server-side analytics avoids abuse vectors entirely.

Example front matter snippet

```yaml
title: "Example Post"
date: 2025-10-21
draft: false
recommended: "editor"
thumbnail: "/images/example-thumb.png"
tags: ["Linux", "Tutorial"]
```

If you'd like, I can add a small README section or a short contributor guide with a checklist for releasing Editor's Picks and rolling out Trending when you're ready.

-- notes: studio{linux} team
