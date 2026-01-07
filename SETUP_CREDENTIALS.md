# Setup Credentials

## ✅ Environment Variables Set in Netlify

The following have been configured:
- `SHARED_WRITE_PASSWORD` - Plain text password for authentication
- `SESSION_SIGNING_KEY` - JWT signing key
- `REPO_OWNER` - superfunteam
- `REPO_NAME` - staticdam-sourceday
- `PUBLIC_BASE_URL` - https://sourceday.staticdam.com

## 🔑 Your Admin Password

**IMPORTANT: Save this password! It's the only way to edit metadata.**

```
yyL2mwkbe4GC36eQ
```

Use this password when logging in to the Admin interface.

## 🚨 GitHub App Setup Required

You need to install the existing GitHub App on this repo to enable metadata editing.

### Option A: Reuse Existing GitHub App (Recommended)

1. Go to your GitHub App settings: https://github.com/settings/apps
2. Find your existing StaticDAM App
3. Click "Install App" in the sidebar
4. Make sure `superfunteam/staticdam-sourceday` is selected
5. Save

Then copy the GitHub App env vars from your original site:
```bash
# Copy these values from your original Netlify site (staticdam-photos)
netlify env:set GITHUB_APP_ID 'YOUR_APP_ID'
netlify env:set GITHUB_INSTALLATION_ID 'YOUR_INSTALLATION_ID'
netlify env:set GITHUB_PRIVATE_KEY "$(cat path/to/your-private-key.pem)"
```

### Option B: Create New GitHub App

1. Go to: https://github.com/settings/apps/new
2. Fill in:
   - **GitHub App name**: StaticDAM SourceDay Bot
   - **Homepage URL**: https://sourceday.staticdam.com
   - **Webhook**: Uncheck "Active"

3. Set Permissions:
   - **Repository permissions**:
     - Contents: Read & Write
     - Actions: Write
   - **Where can this GitHub App be installed**: Only on this account

4. Click "Create GitHub App"
5. Note the **App ID**
6. Click "Install App" → select `superfunteam/staticdam-sourceday`
7. Note the **Installation ID** from the URL after install
8. Generate and download a **Private Key**

Then set in Netlify:
```bash
netlify env:set GITHUB_APP_ID 'YOUR_APP_ID'
netlify env:set GITHUB_INSTALLATION_ID 'YOUR_INSTALLATION_ID'
netlify env:set GITHUB_PRIVATE_KEY "$(cat ~/Downloads/your-app.*.private-key.pem)"
```

## Testing

1. Visit https://sourceday.staticdam.com
2. Click the lock icon or go to settings
3. Enter password: `yyL2mwkbe4GC36eQ`
4. Try editing metadata on an image

If everything is set up correctly, changes will commit back to GitHub!
