// Admin UI - Email/password login with GitHub integration

const ADMIN_EMAIL = 'admin@studiolinux.com';
const ADMIN_PASSWORD = 'changeme123'; // CHANGE THIS TO YOUR PASSWORD

// GitHub configuration
const GITHUB_OWNER = 'thelinuxhobbyist';
const GITHUB_REPO = 'studiolin';
const GITHUB_BRANCH = 'main';

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return document.querySelectorAll(sel); }
function show(el) { el?.classList.remove('hidden'); }
function hide(el) { el?.classList.add('hidden'); }

// State
let isLoggedIn = false;
let gitHubToken = localStorage.getItem('github_token') || '';

// UI elements
const loginSection = qs('#login-section');
const dashboardSection = qs('#dashboard-section');
const statusBox = qs('#status');
const loginForm = qs('#login-form');
const userEmail = qs('#user-email');
const logoutBtn = qs('#logout-btn');

function setStatus(msg, isError = false, allowHtml = false) {
  if (!statusBox) return;
  if (allowHtml) statusBox.innerHTML = msg;
  else statusBox.textContent = msg;
  statusBox.classList.toggle('error', isError);
  show(statusBox);
  window.scrollTo(0, 0);
}

function clearStatus() {
  if (statusBox) hide(statusBox);
}

// GitHub API helpers
async function githubRequest(method, path, data = null) {
  if (!gitHubToken) {
    throw new Error('GitHub token not configured. Please set your GitHub Personal Access Token.');
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  const options = {
    method,
    headers: {
      'Authorization': `token ${gitHubToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  // Provide clearer error messages for common auth/permission problems
  if (!response.ok) {
    let errorMsg = `GitHub API error: ${response.status}`;
    try {
      const error = await response.json();
      if (error && error.message) errorMsg = error.message;
    } catch (e) {
      // ignore JSON parse errors
    }

    console.error('GitHub API Error:', {
      status: response.status,
      path,
      message: errorMsg
    });

    if (response.status === 401) {
      throw new Error('Bad credentials: your GitHub token is invalid or expired. Please generate a new Personal Access Token with "repo" scope.');
    }
    if (response.status === 403) {
      throw new Error(errorMsg + ' (Permission denied - check token scopes and repo access)');
    }

    throw new Error(errorMsg);
  }

  return await response.json();
}

// Verify the provided GitHub token is valid and has required scopes
async function verifyGitHubToken(token) {
  if (!token) throw new Error('No token provided');

  const res = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (res.status === 401) {
    throw new Error('Bad credentials: invalid or expired GitHub token');
  }

  if (!res.ok) {
    throw new Error(`Failed to validate token: ${res.status}`);
  }

  const scopes = res.headers.get('x-oauth-scopes') || '';
  if (!scopes.toLowerCase().includes('repo')) {
    // token may be missing repo scope which is required for committing
    return { ok: true, warnings: ['Token does not include "repo" scope. Creating/updating files may fail.'] };
  }

  return { ok: true };
}

async function getFileContent(path) {
  try {
    return await githubRequest('GET', path);
  } catch (err) {
    // Return null if file doesn't exist (404)
    if (err.message.includes('404') || err.message.includes('Not Found')) {
      return null;
    }
    throw err;
  }
}

async function createOrUpdateFile(path, content, message) {
  const fileContent = btoa(unescape(encodeURIComponent(content))); // Base64 encode
  
  // Check if file exists
  let existing = null;
  try {
    existing = await getFileContent(path);
  } catch (err) {
    console.warn('Could not fetch existing file:', err);
    existing = null;
  }
  
  const data = {
    message,
    content: fileContent,
    branch: GITHUB_BRANCH
  };

  if (existing && existing.sha) {
    data.sha = existing.sha;
  }

  return await githubRequest('PUT', path, data);
}

async function deleteFile(path, message) {
  const existing = await getFileContent(path);
  
  if (!existing) {
    throw new Error('File not found');
  }

  const data = {
    message,
    branch: GITHUB_BRANCH,
    sha: existing.sha
  };

  return await githubRequest('DELETE', path, data);
}

// Login handler
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus();

  const emailInput = qs('#email')?.value?.trim();
  const passwordInput = qs('#password')?.value;
  const tokenInput = qs('#github-token')?.value?.trim();

  if (emailInput !== ADMIN_EMAIL || passwordInput !== ADMIN_PASSWORD) {
    setStatus('❌ Invalid email or password', true);
    return;
  }

  if (!tokenInput) {
    setStatus('❌ Please enter your GitHub Personal Access Token', true);
    return;
  }

  setStatus('Validating GitHub token...');
  try {
    const result = await verifyGitHubToken(tokenInput);
    if (result && result.warnings && result.warnings.length) {
      setStatus(`⚠️ Token validated but: ${result.warnings.join('; ')}`);
    }

    // token OK — proceed to login
    isLoggedIn = true;
    gitHubToken = tokenInput;
    sessionStorage.setItem('studiolinux_logged_in', 'true');
    sessionStorage.setItem('studiolinux_email', emailInput);
    localStorage.setItem('github_token', tokenInput);

    if (userEmail) userEmail.textContent = emailInput;
    show(dashboardSection);
    hide(loginSection);
    hide(loginForm);
    loadArticles();
    setStatus('✓ Logged in successfully!');
    setTimeout(() => clearStatus(), 2000);
  } catch (err) {
    console.error('Token verification failed', err);
    setStatus(`❌ ${err.message}`, true);
  }
});

logoutBtn?.addEventListener('click', () => {
  isLoggedIn = false;
  gitHubToken = '';
  sessionStorage.removeItem('studiolinux_logged_in');
  sessionStorage.removeItem('studiolinux_email');
  localStorage.removeItem('github_token');
  show(loginSection);
  show(loginForm);
  hide(dashboardSection);
  qs('#email').value = '';
  qs('#password').value = '';
  qs('#github-token').value = '';
  clearStatus();
});

// Slugify helper
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Article list management
async function loadArticles() {
  setStatus('Loading articles...');
  
  try {
    const articlesList = qs('#articles-list');
    if (!articlesList) return;
    
    articlesList.innerHTML = '<p>Loading articles...</p>';
    
    // Placeholder - full implementation would fetch from GitHub
    articlesList.innerHTML = `
      <p>Articles will be synced from your GitHub repository.</p>
      <p>Use the form below to create new articles.</p>
    `;
    
    clearStatus();
  } catch (err) {
    setStatus(`Error loading articles: ${err.message}`, true);
  }
}

// Create new article
const newArticleForm = qs('#new-article-form');
newArticleForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus();
  setStatus('Creating article...');
  
  try {
    const title = qs('[name="title"]')?.value?.trim();
    const section = qs('[name="section"]')?.value?.trim();
    const categories = qs('[name="categories"]')?.value
      ?.split(',')
      .map(c => c.trim())
      .filter(c => c) || [];
    const tags = qs('[name="tags"]')?.value
      ?.split(',')
      .map(t => t.trim())
      .filter(t => t) || [];
    const excerpt = qs('[name="excerpt"]')?.value?.trim() || '';
    const featured = qs('[name="featured"]')?.checked || false;
    const publishToHome = qs('[name="published_on_home"]')?.checked || false;
    const dateInput = qs('[name="date"]')?.value;
    const content = qs('[name="content"]')?.value?.trim();
    const imageFile = qs('[name="image"]')?.files?.[0];

    if (!title) throw new Error('Title is required');
    if (!section) throw new Error('Section is required');
    if (!content) throw new Error('Content is required');

    // Create slug and directory
    const slug = slugify(title);
    const dir = `content/${section}/${slug}`;

    // Build front matter
    const frontMatter = {
      title,
      date: dateInput ? new Date(dateInput).toISOString() : new Date().toISOString(),
    };

    if (section === 'linux-in-our-lives') {
      frontMatter.sector = 'featured';
    }
    if (categories.length) frontMatter.categories = categories;
    if (tags.length) frontMatter.tags = tags;
    if (excerpt) frontMatter.excerpt = excerpt;
    if (featured) frontMatter.featured = true;
    if (publishToHome) frontMatter.published_on_home = true;

    // Handle image upload
    if (imageFile) {
      setStatus('Uploading image to GitHub...');
      const imageName = imageFile.name.replace(/\s+/g, '-').toLowerCase();
      const imageContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      await githubRequest('PUT', `${dir}/${imageName}`, {
        message: `Add featured image for "${title}"`,
        content: imageContent,
        branch: GITHUB_BRANCH
      });

      frontMatter.featured_image = imageName;
    }

    // Build markdown content with proper YAML escaping
    const fmLines = Object.entries(frontMatter).map(([key, value]) => {
      if (Array.isArray(value)) {
        // Arrays in YAML format: key: [item1, item2, ...]
        const items = value.map(v => {
          const escaped = String(v).replace(/"/g, '\\"').replace(/\n/g, '\\n');
          return `"${escaped}"`;
        }).join(', ');
        return `${key}: [${items}]`;
      }
      if (typeof value === 'string') {
        // Escape quotes and newlines in strings
        const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        return `${key}: "${escaped}"`;
      }
      if (typeof value === 'boolean') {
        return `${key}: ${value ? 'true' : 'false'}`;
      }
      // For numbers, dates, etc.
      return `${key}: ${value}`;
    });

    const markdown = `---\n${fmLines.join('\n')}\n---\n\n${content}\n`;

    // Create article file
    setStatus('Committing article to GitHub...');
    const res = await createOrUpdateFile(`${dir}/index.md`, markdown, `Create article: "${title}"`);

    // Show commit + file links so user can verify the GitHub change immediately
    let successMsg = '✓ Article created successfully! It will appear on your site in a few moments.';
    try {
      const commitUrl = res && res.commit && res.commit.html_url ? res.commit.html_url : null;
      const fileUrl = res && res.content && (res.content.html_url || res.content.download_url) ? (res.content.html_url || res.content.download_url) : null;
      const links = [];
      if (commitUrl) links.push(`<a href="${commitUrl}" target="_blank" rel="noopener">View commit on GitHub</a>`);
      if (fileUrl) links.push(`<a href="${fileUrl}" target="_blank" rel="noopener">View file on GitHub</a>`);
      if (links.length) successMsg += '<br>' + links.join(' · ');
    } catch (err) {
      console.warn('Could not extract commit/file URLs from GitHub response', err);
    }

    setStatus(successMsg, false, true);
    newArticleForm.reset();
    await loadArticles();
    setTimeout(() => clearStatus(), 4000);
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`, true);
  }
});

// Preview button
qs('#preview-btn')?.addEventListener('click', () => {
  const title = qs('[name="title"]')?.value?.trim() || 'Preview';
  const content = qs('[name="content"]')?.value || '';
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .preview { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { font-size: 2rem; margin: 1rem 0 0.5rem; border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem; }
    p { margin: 1rem 0; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; margin: 1rem 0; }
    code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="preview">
    <h1>${escapeHtml(title)}</h1>
    <pre>${escapeHtml(content)}</pre>
  </div>
</body>
</html>`;
  const w = window.open();
  w.document.write(html);
});

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
function initAuth() {
  if (sessionStorage.getItem('studiolinux_logged_in') === 'true') {
    isLoggedIn = true;
    gitHubToken = localStorage.getItem('github_token') || '';
    const email = sessionStorage.getItem('studiolinux_email');
    if (userEmail) userEmail.textContent = email;
    show(dashboardSection);
    hide(loginSection);
    hide(loginForm);
    loadArticles();
  } else {
    show(loginSection);
    show(loginForm);
    hide(dashboardSection);
  }
}

window.addEventListener('load', () => {
  // Attempt to clear any browser/autofill-populated sensitive fields.
  try {
    const pwd = qs('#password');
    const token = qs('#github-token');
    if (pwd) pwd.value = '';
    if (token) token.value = '';
    // Some password managers autofill asynchronously; clear again shortly after load.
    setTimeout(() => {
      if (pwd) pwd.value = '';
      if (token) token.value = '';
    }, 250);
  } catch (e) {
    // ignore
  }

  initAuth();
});
