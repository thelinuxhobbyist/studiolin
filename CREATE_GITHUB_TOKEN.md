# How to Create a GitHub Personal Access Token

## Quick Summary

A **Personal Access Token (PAT)** is like a password that lets the admin panel talk to GitHub and create/update/delete your articles automatically.

---

## 🔐 Step 1: Go to GitHub Settings

**Easiest way:**
1. Visit: https://github.com/settings/tokens

**Or manually:**
1. Go to github.com
2. Click your profile picture (top right corner)
3. Click "Settings"
4. Click "Developer settings" (left sidebar, near the bottom)
5. Click "Personal access tokens"
6. Click "Tokens (classic)"

---

## ✏️ Step 2: Create a New Token

1. Click the green button: **"Generate new token" → "Generate new token (classic)"**

2. Fill in the form:

   | Field | Value |
   |-------|-------|
   | Token name | `StudioLinux Admin` |
   | Expiration | `30 days` (or "No expiration") |

---

## ✓ Step 3: Set Permissions (Scopes)

**Important:** Only enable the `repo` scope. This is the ONLY checkbox you need:

- ✅ **`repo`** - Full control of private repositories
  - This includes everything you need: create, read, update, delete files

**Do NOT check:**
- ❌ `admin:org_hook`
- ❌ `delete_repo`
- ❌ `gist`
- ❌ Any other scope

---

## 🔑 Step 4: Generate and Copy the Token

1. Scroll down and click the green **"Generate token"** button

2. **⚠️ IMPORTANT:** GitHub will show you the token ONE TIME ONLY
   
   It looks like this: `ghp_16cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **COPY IT IMMEDIATELY** - You won't see it again!
   - Click the copy button next to the token
   - Or manually select and copy the entire token string

4. **Save it somewhere safe:**
   - Password manager (best option)
   - Text file (temporary)
   - Anywhere you can find it later

---

## 📝 What If You Lose Your Token?

No problem! Just create a new one:

1. Go to https://github.com/settings/tokens
2. Find the old token in the list
3. Click the red **"Delete"** button
4. Click **"Generate new token (classic)"** again
5. Repeat the steps above

---

## 🔒 Security Best Practices

✓ **DO:**
- Use only the `repo` scope
- Set an expiration date (30 days is good)
- Delete tokens you don't use
- Rotate your tokens monthly
- Store it safely (password manager)

✗ **DON'T:**
- Share your token with anyone
- Commit it to your git repository
- Use admin scope unless necessary
- Keep the same token forever
- Post it online or in Discord

---

## 🎯 Using Your Token in the Admin Panel

Once you have your token:

1. Go to: `http://localhost:1313/admin/login`

2. Enter your credentials:
   ```
   Email:          admin@studiolinux.com
   Password:       changeme123
   GitHub Token:   ghp_16cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Click **"Login"**

4. You're now authenticated! Create your first article.

---

## 📊 What Permissions Does Your Token Have?

With the `repo` scope, the admin panel can:

✅ **Create** new articles and folders  
✅ **Upload** images to your repository  
✅ **Update** existing articles (edit them)  
✅ **Delete** articles and images  
✅ **Commit** changes to your GitHub repository  
✅ **Trigger** Cloudflare Pages rebuilds  

❌ **Cannot:**
- Delete your entire repository
- Change repository settings
- Modify webhooks
- Access private repositories (only works on public)
- Do anything outside the `repo` scope

---

## 🔄 Token Expiration

If your token expires:

1. You'll see an error when trying to create/edit articles
2. Just create a new token following these steps
3. Log out and log back in with the new token
4. Problem solved!

---

## 💡 Pro Tips

- **Refresh monthly:** Create a new token every month for better security
- **Name them:** Use descriptive names like "StudioLinux Admin" so you remember what each token is for
- **Monitor:** Check your tokens list occasionally to see if any look suspicious
- **Browser storage:** Your token is stored in your browser's localStorage (cleared on logout)
- **HTTPS only:** The token is only sent over secure HTTPS connections

---

## ❓ Troubleshooting

### "Error: Invalid token"
- Token expired or deleted
- Solution: Create a new token

### "Error: Insufficient permissions"
- Token doesn't have `repo` scope
- Solution: Create a new token with `repo` scope enabled

### "Error: Token not found"
- You didn't paste the token into the login form
- Solution: Copy token again and paste into "GitHub Personal Access Token" field

### "I can't remember my token"
- GitHub doesn't show it again, but you can delete it and create a new one
- Solution: Create a fresh token

---

## ✅ Next Steps

1. ✓ Create your Personal Access Token
2. ✓ Copy and save it somewhere safe
3. ✓ Go to http://localhost:1313/admin/login
4. ✓ Enter your email, password, and token
5. ✓ Click Login
6. ✓ Create your first article!

---

**Need more help?** Check `ADMIN_GITHUB_GUIDE.md` for the full admin panel guide.
