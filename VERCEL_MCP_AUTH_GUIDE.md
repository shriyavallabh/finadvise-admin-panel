# 🔐 Vercel MCP Authentication Setup

## Quick Fix for Claude's Vercel MCP

### Option 1: Create a Vercel Access Token

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/account/tokens
   ```

2. **Create New Token:**
   - Click "Create Token"
   - Name: "Claude MCP Integration"
   - Scope: Full Access
   - Expiration: No Expiration
   - Click "Create"
   - Copy the token (starts with `vc_`)

3. **Set Environment Variable in Terminal:**
   ```bash
   export VERCEL_AUTH_TOKEN="your_token_here"
   ```

4. **Restart Claude Desktop:**
   - Completely quit Claude
   - Reopen Claude
   - The MCP should now work!

### Option 2: Use Vercel CLI (Alternative)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link Your Project:**
   ```bash
   cd /Users/shriyavallabh/Desktop/mvp/admin-panel
   vercel link
   ```

4. **Get Your Token:**
   ```bash
   cat ~/.vercel/auth.json
   ```
   Copy the token value

### Option 3: Direct API Deployment

If MCP still doesn't work, you can deploy directly:

```bash
curl -X POST https://api.vercel.com/v13/deployments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "finadvise-admin-panel",
    "gitSource": {
      "type": "github",
      "repo": "shriyavallabh/finadvise-admin-panel",
      "ref": "main"
    }
  }'
```

## Your Deployment URLs

Once authenticated, you can access:

- **Production:** `https://finadvise-admin-panel.vercel.app`
- **GitHub Repo:** `https://github.com/shriyavallabh/finadvise-admin-panel`
- **Vercel Dashboard:** `https://vercel.com/shriyavallabhs-projects`

## What Vercel MCP Can Do

Once authenticated, I can:
- ✅ Deploy your project instantly
- ✅ Check deployment status
- ✅ View build logs
- ✅ Manage environment variables
- ✅ Configure domains
- ✅ Monitor performance
- ✅ Roll back deployments

## Current Status

- ✅ GitHub repo created and code pushed
- ✅ All build errors fixed
- ✅ Vercel connected to GitHub
- ❌ MCP authentication needs token
- 🔄 Auto-deploy enabled on git push

## Next Steps

1. Create a Vercel token using Option 1 above
2. Set the environment variable
3. Restart Claude
4. Use MCP commands like:
   - `mcp__vercel__deploy_to_vercel`
   - `mcp__vercel__list_deployments`
   - `mcp__vercel__get_deployment`

---

**Created:** January 21, 2025
**Status:** Awaiting Token Setup