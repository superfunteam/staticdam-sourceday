# StaticDAM

**Your images. Your metadata. Your rules.**

StaticDAM is a modern Digital Asset Management system that stores everything in Git. No expensive subscriptions. No proprietary databases. No vendor lock-in. Just your files, organized exactly how you want them.

---

## Who Is This For?

You're a marketing team, creative agency, or business that manages images—product photos, team headshots, campaign assets, brand materials. You need a place to organize them, tag them, search them, and share them with your team.

You've probably looked at enterprise DAM systems like Bynder, Brandfolder, or Canto. You've seen the price tags: $30,000 to $100,000 per year. You've sat through the sales demos with features you'll never use. You've wondered: *"Do we really need all this?"*

**You don't.**

StaticDAM gives you what you actually need: a beautiful interface to browse your images, smart filtering by category/person/tag/product, one-click downloads in any format, and metadata that travels with your files forever.

---

## The Problem with Traditional DAM Systems

### They're Expensive

Enterprise DAM software charges per user, per asset, per GB, per feature. A mid-size marketing team can easily spend $50,000/year just to store and organize images. That's money that could go toward actually creating content.

### Your Data Is Trapped

When you add tags and categories in a traditional DAM, that information goes into their proprietary database. Want to switch providers? Good luck exporting those tags. Want to use your images in another tool? The metadata stays behind. You're locked in.

### They're Overcomplicated

Most DAM systems were built for enterprise workflows you'll never need. Approval chains. Asset versioning. Rights management. Workflow automation. AI tagging. Integration marketplaces. You end up paying for 100 features to use 5.

---

## How StaticDAM Is Different

### Your Images Live in Git

Git is the same technology developers use to track every change to their code. It's battle-tested, free, and gives you superpowers:

- **Full history**: See who changed what, when, and why
- **Undo anything**: Accidentally deleted something? Roll it back
- **Bulletproof backups**: Your images are stored on GitHub's infrastructure
- **Free or cheap**: GitHub offers generous free tiers and affordable paid plans

*Think of Git like Google Docs' version history, but for your entire image library.*

### Metadata Lives Inside Your Images

Here's the magic: when you tag an image in StaticDAM, that tag is written directly into the image file itself using industry-standard EXIF data. The same metadata format that professional cameras and tools like Adobe Lightroom use.

This means:
- **Your tags travel with your files forever**
- **Open any image in any tool and the metadata is there**
- **Switch systems anytime without losing your organization**
- **No database to corrupt, crash, or lose**

### No Database Means Nothing to Break

Traditional DAM systems need servers, databases, backups, security patches, and ongoing maintenance. StaticDAM needs... a folder of images and a free Netlify account.

There's literally no database. The manifest (a simple index file) is regenerated automatically from your images whenever something changes. If anything ever goes wrong, just regenerate it.

### Open Source Means Freedom

StaticDAM's code is completely open source. You can see exactly how it works. You can modify it. You can host it yourself. You're never at the mercy of a vendor's roadmap, pricing changes, or business decisions.

---

## What You Can Do

### Browse and Search

Your entire image library in a clean, responsive grid. Filter by:
- **Folder**: Your natural directory structure
- **Category**: Portrait, landscape, product, lifestyle, etc.
- **Person**: Who's in the image
- **Tags**: Any descriptive keywords you want
- **Product**: What products are featured

Each filter shows a count of matching images, so you always know what you're working with.

### View in Detail

Click any image to open the lightbox. Navigate with arrow keys or swipe on mobile. See every detail:
- File name, dimensions, size
- Camera and date information
- All your custom metadata

### Download Any Format You Need

Need a smaller version for the web? A different file format? Just choose what you want:
- **Formats**: JPEG, WebP, AVIF, PNG
- **Size**: Any width up to 4096 pixels
- **Quality**: Dial in the compression

Downloads are generated on-demand—your original files stay pristine.

### Edit Metadata Through the UI

No command line required. Select images, click edit, and update:
- Categories
- People
- Tags
- Products

Changes are saved directly to the image files and synced to Git automatically.

### Share Direct Links

Every image has a shareable permalink. Send it to a colleague, embed it in a document, or reference it in your project management tool.

### Track Every Change

Because everything lives in Git, you have a complete audit trail. Who added that tag? When was this image uploaded? What did the metadata look like last month? It's all there in the commit history.

---

## How It Works

Let's demystify the technology. Here's what happens under the hood:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. Your images live in a GitHub repository                    │
│      (Think: a special folder in the cloud)                     │
│                                                                 │
│   2. StaticDAM reads metadata directly from image files         │
│      (No separate database needed)                              │
│                                                                 │
│   3. You browse and edit through a beautiful web interface      │
│      (Works on any device)                                      │
│                                                                 │
│   4. Edits are saved back to the image files                    │
│      (And automatically tracked in Git)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

When you edit metadata through the web interface:
1. Your change is sent to a small cloud function
2. The function tells GitHub to update the image file
3. The metadata is written directly into the image's EXIF data
4. The manifest is automatically regenerated
5. Everyone sees the updated tags immediately

It's all automatic. You just click, type, and save.

---

## For Developers

### Open Source (Free Forever)

StaticDAM is MIT licensed. Clone it, fork it, modify it, deploy it—it's yours.

**Requirements:**
- GitHub account (free)
- Netlify account (free tier works great)
- Node.js 18+ for local development
- A developer who can follow setup instructions

**Get the code:**

```bash
# Clone the repository
git clone https://github.com/your-org/staticdam.git
cd staticdam

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open http://localhost:5173 and you're running.

### Adding Your Images

Drop your images into the `/assets` folder. Organize them in subfolders however you like:

```
/assets
├── products/
│   ├── laptop-silver.jpg
│   └── laptop-black.jpg
├── team/
│   ├── sarah-headshot.jpg
│   └── marcus-headshot.jpg
└── campaigns/
    └── summer-2024/
        ├── hero-banner.jpg
        └── social-square.jpg
```

### Adding Metadata

You can add metadata using exiftool (a free command-line tool):

```bash
# Add a category
exiftool -IPTC:SupplementalCategories="product" laptop-silver.jpg

# Add a person
exiftool -XMP-iptcExt:PersonInImage="Sarah Chen" sarah-headshot.jpg

# Add tags
exiftool -IPTC:Keywords="summer" -IPTC:Keywords="outdoor" hero-banner.jpg

# Add a product reference
exiftool -XMP-lr:HierarchicalSubject="MacBook Pro" laptop-silver.jpg
```

Or just use the web interface after deployment—it's much easier.

### Building the Manifest

Generate the searchable index from your images:

```bash
pnpm run build:manifest
```

This reads the EXIF data from every image and creates `data/manifest.json`.

### Generating Thumbnails

Create optimized thumbnails for faster loading:

```bash
pnpm run generate:thumbnails
```

### Deploying to Netlify

1. Push your repository to GitHub
2. Connect the repo to Netlify
3. Set the build command: `pnpm build`
4. Set the publish directory: `site/dist`
5. Configure your environment variables (see below)
6. Deploy

**Required Environment Variables:**

```
SHARED_WRITE_PASSWORD     # Password for editing (your team shares this)
SESSION_SIGNING_KEY       # Random key for secure sessions
GITHUB_APP_ID            # For the metadata editing feature
GITHUB_INSTALLATION_ID   # For the metadata editing feature
GITHUB_PRIVATE_KEY       # For the metadata editing feature
REPO_OWNER               # Your GitHub username or org
REPO_NAME                # Your repository name
PUBLIC_BASE_URL          # Your deployed site URL
```

The README in the repository has detailed setup instructions for the GitHub App.

### Project Structure

```
/assets/              # Your original images (with EXIF metadata)
/assets-thumbs/       # Generated thumbnails (auto-created)
/data/manifest.json   # Generated index (auto-created)
/site/                # React frontend (Vite + Tailwind)
/netlify/functions/   # API endpoints for downloads and editing
/scripts/             # Build scripts
```

---

## Concierge Service

**Don't want to DIY? We'll do it for you.**

For teams that want StaticDAM up and running without the technical setup, we offer a complete done-for-you service.

### What's Included ($12,000 one-time)

- **Complete setup and deployment** — We configure everything from scratch
- **GitHub repository** — Properly configured with all the automation
- **Netlify deployment** — Custom domain, SSL, the works
- **Initial asset migration** — We'll help move your existing images over
- **Metadata migration** — Bring your existing tags and categories
- **Team training session** — Live walkthrough so your team knows exactly how to use it
- **1 year of priority support** — Direct access for questions and help

### Who It's For

- Teams without a developer to handle setup
- Organizations that value time over tinkering
- Anyone who wants it done right the first time

### After Year One

After your first year, you can continue on your own (it's your code and data, forever), or extend support at $2,400/year.

**Interested?** Contact us at [hello@staticdam.com](mailto:hello@staticdam.com)

---

## Pricing

| | Open Source | Concierge |
|---|:---:|:---:|
| **Price** | Free | $12,000 |
| **Setup** | Do it yourself | Done for you |
| **Support** | Community (GitHub Issues) | 1 year priority support |
| **Hosting** | You manage (Netlify free tier works) | Configured for you |
| **Updates** | Pull from repo yourself | We handle it |
| **Customization** | Unlimited (it's your code) | Included in setup |

**Ongoing costs with either option:**
- GitHub: Free for most teams
- Netlify: Free tier is generous; paid plans start at $19/month if needed
- Domain: ~$12/year if you want a custom domain

Compare that to $30,000-$100,000/year for enterprise DAM software.

---

## Frequently Asked Questions

### Is my data safe in Git?

Yes. GitHub is trusted by millions of developers and companies worldwide. Your repository can be private, and you can enable additional security features like branch protection. Plus, because it's Git, you have a complete backup on every computer that clones the repo.

### Can I migrate from Brandfolder/Bynder/Canto?

Yes. Export your images (you can usually do this in bulk), and we can help map your existing taxonomy to StaticDAM's metadata fields. The concierge service includes migration assistance.

### What file types are supported?

**Images:** JPEG, PNG, WebP, AVIF, HEIC, TIFF
**Videos:** MP4, MOV, WebM, AVI (with animated thumbnail previews)

Any format that supports EXIF metadata works great.

### Can multiple people edit at once?

Yes. The system uses a shared password for write access. Multiple team members can browse, download, and edit. Git handles any conflicts gracefully—in practice, they're rare since you're editing metadata, not the images themselves.

### What if I need help after year one?

You have several options:
- Extend support for $2,400/year
- Use GitHub Issues for community support (free)
- Hire any developer—it's standard React/Node.js code

### Can I customize the interface?

Absolutely. It's open source React code with Tailwind CSS. Change colors, add your logo, modify the layout—whatever you need.

### What about access control?

StaticDAM uses a simple model: public read access (anyone with the URL can view), and password-protected write access (for editing metadata). If you need more complex permissions, you can modify the code or host it behind your existing auth system.

### Do I need technical skills to use it day-to-day?

No. Once set up, StaticDAM is as easy to use as any photo gallery app. Browse, search, click to view, download what you need. Editing metadata is just filling out a simple form.

Setting it up requires developer skills, which is why we offer the concierge service.

---

## Get Started

**Ready to take control of your digital assets?**

### Option 1: Free and Open Source

Head to our [GitHub repository](https://github.com/your-org/staticdam), clone the code, and follow the setup guide. Perfect if you have a developer on your team.

### Option 2: Let Us Handle It

Email [hello@staticdam.com](mailto:hello@staticdam.com) to discuss the concierge service. We'll have you up and running in days, not weeks.

---

*StaticDAM is built by people who were tired of paying enterprise prices for simple problems. We believe your images and metadata belong to you—not locked in someone else's database.*
