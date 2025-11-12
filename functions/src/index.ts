// Cloudflare Worker: GitHub OAuth exchange and token management
// This Worker exchanges a GitHub authorization code for a token.
// The token is stored in KV and returned to the client (for use in API calls).

export interface Env {
  TOKENS: KVNamespace;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://studiolinux.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);

    // POST /api/auth/login - redirect to GitHub OAuth
    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const state = Math.random().toString(36).substring(7);
      const clientId = env.GITHUB_CLIENT_ID;
      const redirectUri = 'https://studiolinux.com/api/auth/callback';
      const scope = 'repo';
      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
      
      // Store state in KV (short TTL for safety)
      await env.TOKENS.put(`oauth_state:${state}`, '', { expirationTtl: 600 });

      return new Response(JSON.stringify({ authUrl: githubUrl }), {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    // GET /api/auth/callback - GitHub OAuth callback handler
    if (request.method === 'GET' && url.pathname === '/api/auth/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code || !state) {
        return new Response('Missing code or state', { status: 400 });
      }

      // Verify state
      const stateKey = `oauth_state:${state}`;
      const storedState = await env.TOKENS.get(stateKey);
      if (!storedState) {
        return new Response('Invalid or expired state', { status: 400 });
      }
      await env.TOKENS.delete(stateKey);

      // Exchange code for token with GitHub
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: 'https://studiolinux.com/api/auth/callback',
        }),
      });

      const tokenData = await tokenRes.json() as any;
      if (tokenData.error) {
        return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
      }

      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return new Response('No access token received', { status: 400 });
      }

      // Store token in KV with 1 hour TTL
      const tokenId = Math.random().toString(36).substring(7);
      await env.TOKENS.put(`gh_token:${tokenId}`, accessToken, { expirationTtl: 3600 });

      // Redirect back to admin with token ID in URL fragment
      const redirectUrl = `https://studiolinux.com/admin/login#token=${tokenId}`;
      return new Response(null, {
        status: 302,
        headers: { 'Location': redirectUrl },
      });
    }

    // GET /api/auth/token/:id - retrieve stored token (client-side call from admin)
    if (request.method === 'GET' && url.pathname.startsWith('/api/auth/token/')) {
      const tokenId = url.pathname.split('/').pop();
      if (!tokenId) {
        return new Response('Missing token ID', { status: 400, headers: corsHeaders() });
      }

      const token = await env.TOKENS.get(`gh_token:${tokenId}`);
      if (!token) {
        return new Response('Token not found or expired', { status: 404, headers: corsHeaders() });
      }

      return new Response(JSON.stringify({ token }), {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
