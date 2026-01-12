# Submit Image API - Integration Guide

Submit images to any StaticDAM instance via PR from external apps.

## Quick Start

```typescript
async function submitToStaticDAM(siteUrl: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${siteUrl}/api/submit-image`, {
    method: 'POST',
    body: formData
  })
  return res.json()
}

// Usage
const { success, pr_url } = await submitToStaticDAM(
  'https://staticdam-sourceday.netlify.app',
  fileInput.files[0]
)
```

## User Flow

1. User clicks "Submit to StaticDAM"
2. User enters target repo (e.g. `superfunteam/staticdam-sourceday`) or selects from saved list
3. User fills in title/metadata (your UI)
4. Your app calls the API → returns PR URL
5. User clicks PR link to review/merge

## Endpoint Pattern

Each StaticDAM deployment has its own endpoint:

```
https://{repo-name}.netlify.app/api/submit-image
```

| Repo | API URL |
|------|---------|
| `superfunteam/staticdam-sourceday` | `https://staticdam-sourceday.netlify.app/api/submit-image` |
| `superfunteam/staticdam-photos` | `https://staticdam-photos.netlify.app/api/submit-image` |

> If the site uses a custom domain (e.g. `sourceday.staticdam.com`), use that instead.

## API Reference

**Method**: `POST`
**Content-Type**: `multipart/form-data`

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `file` | Yes | File | Image file (max 25MB). Supported: JPEG, PNG, WebP, GIF, TIFF |
| `subfolder` | No | String | Path within `assets/` (default: `"incoming"`) |
| `filename` | No | String | Override filename |
| `category` | No | JSON array | e.g. `["portrait", "warehouse"]` |
| `person` | No | JSON array | e.g. `["Jimmy", "Marcus"]` |
| `tags` | No | JSON array | e.g. `["2025", "product-shot"]` |
| `product` | No | JSON array | e.g. `["widget-pro"]` |

### Response

**Success (200)**:
```json
{
  "success": true,
  "pr_url": "https://github.com/superfunteam/staticdam-sourceday/pull/1",
  "branch": "submit/incoming-1704067200000",
  "filename": "assets/incoming/photo.jpg"
}
```

**Error (4xx/5xx)**:
```json
{
  "success": false,
  "error": "File too large (max 25MB)"
}
```

## Full Integration Example

```typescript
interface SubmitOptions {
  subfolder?: string
  filename?: string
  category?: string[]
  person?: string[]
  tags?: string[]
  product?: string[]
}

interface SubmitResult {
  success: boolean
  pr_url?: string
  branch?: string
  filename?: string
  error?: string
}

// Convert GitHub repo to Netlify URL
function repoToSiteUrl(repo: string): string {
  const repoName = repo.split('/')[1]
  return `https://${repoName}.netlify.app`
}

async function submitToStaticDAM(
  siteUrl: string,
  file: File,
  options: SubmitOptions = {}
): Promise<SubmitResult> {
  const formData = new FormData()
  formData.append('file', file)

  if (options.subfolder) formData.append('subfolder', options.subfolder)
  if (options.filename) formData.append('filename', options.filename)
  if (options.category?.length) formData.append('category', JSON.stringify(options.category))
  if (options.person?.length) formData.append('person', JSON.stringify(options.person))
  if (options.tags?.length) formData.append('tags', JSON.stringify(options.tags))
  if (options.product?.length) formData.append('product', JSON.stringify(options.product))

  const res = await fetch(`${siteUrl}/api/submit-image`, {
    method: 'POST',
    body: formData
  })

  return res.json()
}

// Example usage with user input
const userInput = {
  repo: 'superfunteam/staticdam-sourceday',
  file: fileInput.files[0],
  tags: ['2025', 'product-shot'],
  category: ['products']
}

const siteUrl = userInput.repo.startsWith('http')
  ? userInput.repo
  : repoToSiteUrl(userInput.repo)

const result = await submitToStaticDAM(siteUrl, userInput.file, {
  tags: userInput.tags,
  category: userInput.category
})

if (result.success) {
  window.open(result.pr_url)
}
```

## cURL Example

```bash
SITE_URL="https://staticdam-sourceday.netlify.app"

curl -X POST "${SITE_URL}/api/submit-image" \
  -F "file=@photo.jpg" \
  -F "subfolder=products" \
  -F 'tags=["2025","new-arrivals"]'
```

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `No file provided` | Missing file field | Ensure `file` is in FormData |
| `File too large (max 25MB)` | Image exceeds limit | Compress before upload |
| `Invalid image type` | Not JPEG/PNG/WebP/GIF/TIFF | Convert to supported format |
| `GitHub App not configured` | Target site misconfigured | Contact DAM admin |
| `CORS error` | Wrong URL | Verify site URL exists |

## Notes

- CORS enabled - works from any origin
- No authentication required (moderation via PR review)
- Each StaticDAM instance is independent
- Metadata in PR description can be embedded to EXIF after merge
