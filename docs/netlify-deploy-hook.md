# Netlify Deploy Hook Setup

When GitHub Actions update the manifest or thumbnails, commits use `[skip ci]` to prevent infinite loops. This means Netlify doesn't automatically redeploy. To trigger deploys after these updates, we use a Netlify Build Hook.

## How It Works

1. Assets are pushed to `assets/`
2. GitHub Action generates thumbnails → commits with `[skip ci]`
3. GitHub Action rebuilds manifest → commits with `[skip ci]`
4. GitHub Action triggers Netlify deploy via build hook
5. Netlify rebuilds and deploys the site

## Setup Instructions

### 1. Create Build Hook in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Build hooks**
3. Click **Add build hook**
4. Name: `github-action`
5. Branch: `main`
6. Click **Save** and copy the URL

### 2. Add Secret to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NETLIFY_BUILD_HOOK`
5. Value: Paste the build hook URL from Netlify
6. Click **Add secret**

## Workflow Integration

The build hook is triggered in `.github/workflows/build-manifest.yml`:

```yaml
- name: Trigger Netlify deploy
  if: steps.commit.outputs.changed == 'true' && env.NETLIFY_BUILD_HOOK != ''
  env:
    NETLIFY_BUILD_HOOK: ${{ secrets.NETLIFY_BUILD_HOOK }}
  run: |
    curl -X POST -d {} "$NETLIFY_BUILD_HOOK"
```

The deploy only triggers when:
- The manifest actually changed (new/updated assets)
- The `NETLIFY_BUILD_HOOK` secret is configured
