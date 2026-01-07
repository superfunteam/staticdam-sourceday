# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static DAM is a Git-native Digital Asset Management system. Images and their metadata (stored in EXIF fields) are committed to Git. A manifest is auto-generated from EXIF data and the frontend displays assets from this manifest.

## Commands

```bash
# Development
pnpm install          # Install all dependencies
pnpm dev              # Start Vite dev server for site

# Building
pnpm build            # Build site for production
pnpm build:manifest   # Regenerate manifest from asset EXIF data (requires exiftool)
pnpm generate:thumbnails  # Generate thumbnails for assets

# Testing & Linting
pnpm test:functions   # Run function tests
pnpm -F site lint     # Lint site code
```

## Architecture

```
/assets/**           # Original images with embedded EXIF metadata
/assets-thumbs/      # Generated thumbnails
/data/manifest.json  # Auto-generated index from EXIF data
/site/               # React SPA (Vite + Tailwind + ShadCN)
/netlify/functions/  # Serverless API endpoints
/scripts/            # Build scripts (TypeScript)
```

**Monorepo workspaces**: `site` and `netlify/functions` (pnpm workspaces)

### Data Flow

1. Images uploaded to `/assets/` with EXIF metadata embedded
2. GitHub Action runs `build-manifest.ts` → extracts EXIF → writes `data/manifest.json`
3. Frontend loads manifest for browsing
4. Metadata edits via UI call `edit-metadata` function → embeds back to EXIF via exiftool

### Metadata Schema

All metadata stored in standard EXIF/IPTC/XMP fields (no prefixes):

| Field | EXIF Location |
|-------|---------------|
| category | `IPTC:SupplementalCategories` |
| person | `XMP-iptcExt:PersonInImage` |
| tags | `IPTC:Keywords` |
| product | `XMP-lr:HierarchicalSubject` |

### Netlify Functions

- `auth-verify.ts` - Session/password verification
- `download-as.ts` - On-demand image resize/transcode
- `edit-metadata.js` - Embed metadata changes to image EXIF

## External Dependencies

- **exiftool** - Required for manifest building and metadata editing
- **ImageMagick** - Used in CI for image processing
- **Sharp** - Node.js image processing for thumbnails/downloads

## Environment Variables (Netlify)

Required for write operations: `SHARED_WRITE_HASH`, `SESSION_SIGNING_KEY`, `GITHUB_APP_ID`, `GITHUB_INSTALLATION_ID`, `GITHUB_PRIVATE_KEY`, `REPO_OWNER`, `REPO_NAME`, `PUBLIC_BASE_URL`
