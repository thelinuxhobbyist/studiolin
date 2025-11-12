# Admin Panel - GitHub Integration Guide

## 🚀 Quick Start

Your admin panel now has **full GitHub integration**. When you create, edit, or delete articles in the admin panel, they automatically sync to your GitHub repository.

---

## 📋 How to Get Your GitHub Personal Access Token

### Step 1: Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `StudioLinux Admin`
4. Set expiration: **30 days** or **No expiration**
5. **Scopes needed:** Check only **`repo`** (Full control of private repositories)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Save Your Token Securely

- Store it somewhere safe (password manager)
- You'll paste it into the admin panel login form
- Never share it publicly

---

## 🔐 Admin Login Credentials

```
Email:    admin@studiolinux.com
Password: changeme123
```

**⚠️ IMPORTANT:** Change these credentials in `/home/yama/studio/static/admin/admin.js`:

```javascript
const ADMIN_EMAIL = 'your-email@example.com';
const ADMIN_PASSWORD = 'your-secure-password';
```

---

## 📝 Creating Articles

### Step 1: Login
1. Visit `/admin/login`
2. Enter your email and password
3. Paste your **GitHub Personal Access Token**
4. Click **Login**

### Step 2: Fill Article Form

| Field | Required | Notes |
|-------|----------|-------|
| **Title** | ✅ | Article heading |
| **Date** | ❌ | Auto-fills with today's date |
| **Section** | ✅ | Posts, Linux in Our Lives, Tutorials, or Tools |
| **Categories** | ❌ | Comma-separated (e.g., "Linux, DevOps, Tutorial") |
| **Tags** | ❌ | Comma-separated (e.g., "linux, bash, scripting") |
| **Excerpt** | ❌ | Brief summary (shows in article lists) |
| **Featured Image** | ❌ | JPEG, PNG, or WebP (auto-optimized) |
| **Mark as featured** | ❌ | Highlights this article on the site |
| **Publish on homepage** | ❌ | Shows on home page featured section |
| **Content** | ✅ | Full Markdown text |

### Step 3: Preview
Click **Preview** button to see how your content looks before publishing.

### Step 4: Publish
Click **Create Article** to:
1. ✅ Upload image to GitHub (if included)
2. ✅ Create article folder: `content/{section}/{slug}/`
3. ✅ Commit article file: `content/{section}/{slug}/index.md`
4. ✅ Trigger Cloudflare Pages rebuild
5. ✅ Site updates automatically in ~2 minutes

---

## 🔄 What Happens Behind the Scenes

### When You Create an Article

```
Admin Panel (Your Computer)
        ↓
    GitHub API
        ↓
Repository Structure:
content/
├── posts/
│   └── my-new-article/
│       ├── index.md (article content)
│       └── featured-image.jpg (if uploaded)
├── tutorials/
│   └── bash-guide/
│       ├── index.md
│       └── screenshot.png
└── linux-in-our-lives/
    └── article-name/
        └── index.md
        ↓
Cloudflare Pages Webhook
        ↓
Hugo Build
        ↓
Images Optimized (JPEG + WebP)
        ↓
Site Goes Live ✨
```

### File Organization

Articles use **page bundles** - each article is a directory with its content and images together:

```
content/posts/my-great-article/
├── index.md                    # Article with YAML front matter
├── featured-image.jpg          # Auto-resized to 400/800/1200px
└── diagram.png                 # Any other images
```

### Markdown Front Matter

Your article is automatically formatted with YAML front matter:

```yaml
---
title: "My Great Article"
date: "2025-11-10T15:30:00Z"
section: "posts"
categories: ["Linux", "Tutorials"]
tags: ["bash", "scripting", "devops"]
excerpt: "Learn how to write better bash scripts"
featured: false
published_on_home: false
featured_image: "featured-image.jpg"
sector: "featured"
---

# Article content in Markdown

Your article text here...
```

---

## 📸 Image Handling

When you upload an image:

1. **Original:** Stored in article folder
2. **Optimized:** Hugo automatically creates:
   - **JPEG** versions (400px, 800px, 1200px) at quality 75
   - **WebP** versions (same sizes, 40% smaller)
3. **Responsive:** Browser loads the right size for each device
4. **Fast:** CDN caches globally via Cloudflare

---

## ✏️ Editing Articles

**Current version:** Articles are published as-is.

**To edit an article:**
1. Edit the `.md` file directly in GitHub, OR
2. Use the admin panel to create a new version (old one stays in git history)

**To delete an article:**
1. Delete it from GitHub repository manually, OR
2. This will be added to the admin panel in future updates

---

## 🐛 Troubleshooting

### ❌ "GitHub token not configured"
- You didn't paste your Personal Access Token during login
- Go to https://github.com/settings/tokens and create a new one
- Log out and log back in with the token

### ❌ "Invalid token"
- Token has expired (check expiration date in GitHub)
- Token doesn't have `repo` scope (create a new one with proper scope)
- Token was revoked

### ❌ "Article not appearing on site"
- It takes 1-2 minutes to rebuild
- Check your Cloudflare Pages deployment status
- Verify the commit shows up on GitHub

### ❌ "Image upload failed"
- File is too large (try under 5MB)
- File format not supported (use JPEG, PNG, or WebP)
- GitHub API rate limit hit (wait a few minutes)

---

## 🔑 Security Notes

- ✅ Your password is only checked locally (never sent to a server)
- ✅ GitHub token is stored in browser's `localStorage` (cleared on logout)
- ✅ All GitHub API calls use HTTPS
- ✅ Token is only used when you click "Create Article"
- ⚠️ Don't share your admin password or GitHub token
- ⚠️ Use a GitHub Personal Access Token with **only `repo` scope** (not full admin)

---

## 📞 Common Tasks

### Create a blog post in "Posts" section
1. Section: **Posts**
2. Publish on homepage: **✓** (for featured articles)
3. Add your content and image

### Create a tutorial
1. Section: **Tutorials**
2. Add categories: "Linux, Bash, Scripting"
3. Write full tutorial in Markdown

### Feature article on Linux in Our Lives
1. Section: **Linux in Our Lives**
2. Mark as featured: **✓**
3. Publish on homepage: **✓**

### Link to other articles in Markdown
```markdown
Check out my [other article](../other-article-slug/)

Or link to external site: [Google](https://google.com)
```

---

## 📚 Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
***Bold and italic***

- Bullet point
- Another bullet
  - Nested bullet

1. Numbered list
2. Item two
3. Item three

[Link text](https://example.com)

![Alt text](image.jpg)

> Blockquote

`inline code`

\`\`\`
code block
\`\`\`

---
(horizontal line)
```

---

## 🚀 Next Steps

1. **Create a test article** to verify everything works
2. **Check GitHub** to see the commit
3. **Visit your site** to see the article live
4. **Start publishing** your content!

---

## ⚡ Pro Tips

- **Backup your GitHub token** somewhere safe
- **Preview before publishing** (use Preview button)
- **Use descriptive titles** (affects URL slug)
- **Categorize articles** for better organization
- **Add excerpts** for article list previews
- **Use featured images** for visual appeal
- **Write in Markdown** for better formatting
- **Keep articles in folders** (page bundles keep things organized)

---

**Questions?** Check your browser's Developer Tools (F12) → Console for error messages.
