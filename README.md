# ✍️ BLOGGER — SEO-Optimized Content Publishing Platform

> **Full-Stack Blogging Platform** | Next.js 15 · React 19 · Tailwind CSS · Prisma · MySQL

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?logo=mysql)](https://mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Overview

**Blogger** is a modern, full-stack content publishing platform designed for creating, managing, and publishing SEO-optimized blog articles. It features an intuitive admin panel for content creators and a fast, accessible public website for readers.

**Perfect for:**
- Personal blogs
- Company news & insights
- Knowledge base platforms
- Content marketing sites
- Educational blogs
---

## 🖼️ Screenshots

### Homepage & Hero Section
![Homepage Hero](/public/screenshots/homepage.png)

### Article Listing Grid
![Article Grid](/public/screenshots/grid.png)

### Individual Article Page
![Individual Article](/public/screenshots/article.png)

### Admin Dashboard
![Admin Dashboard 1](/public/screenshots/admin-1.png)
![Admin Dashboard 2](/public/screenshots/admin-2.png)

### Admin Create Form & SEO Settings
![Admin Form 1](/public/screenshots/form-1.png)
![Admin Form 2](/public/screenshots/form-2.png)

### Performance & SEO (Google Lighthouse)
![Lighthouse Score](/public/screenshots/lighthouse.png)

---

## 📋 Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development Guide](#development-guide)
- [SEO Implementation](#seo-implementation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Key Features

### 🎨 Admin Panel (`/admin`)
- **Create Articles**: Rich text editor with title, content, and metadata
- **Edit Articles**: Update any published or draft article
- **Delete Articles**: With safety confirmation
- **Image Upload**: Drag-and-drop upload (max 5MB, supports JPG/PNG/WebP)
- **Auto-slug Generation**: URL-friendly slugs created from titles
- **SEO Optimization**: 
  - Meta title & description with character counters
  - AI-powered meta description generator (via Claude)
  - Preview metadata before publishing
- **Publish Control**: Toggle publish/draft status instantly
- **Draft System**: Save unpublished articles for later

### 🌐 Public Website
- **Homepage**: Hero section with featured articles grid
- **Article Pages**: Full-width reading experience with cover images
- **Article Features**:
  - Reading time estimation
  - Social share buttons (Twitter/X, LinkedIn)
  - Related articles sidebar
  - Breadcrumb navigation
  - Last updated timestamp
- **Search**: Full-text search across articles (title, content, meta description)
- **Responsive Design**: Mobile-first, optimized for all devices
- **Fast Load Times**: Server-side rendering with static generation

### 🔍 SEO Excellence
- **Dynamic Meta Tags**: Unique title & description per page via `generateMetadata()`
- **OpenGraph Tags**: Perfect social media previews
- **Twitter Card Tags**: Enhanced Twitter/X sharing
- **JSON-LD Structured Data**: Rich snippets for Google
- **Canonical URLs**: Prevents duplicate content issues
- **Auto sitemap.xml**: Updated on every article publish/unpublish
- **robots.txt**: Protects admin and API routes from indexing
- **Semantic HTML**: Proper `<article>`, `<header>`, `<nav>`, `<main>`, `<footer>` tags
- **Image Alt Text**: Automatic inclusion for accessibility

### ⚡ Performance Optimizations
- **Next.js Image Component**: Automatic WebP conversion, lazy loading, responsive sizing
- **Static Site Generation**: Article pages pre-built at deploy time (instant load)
- **Server Components**: Zero JavaScript overhead for content delivery
- **Tailwind CSS**: Utility-first CSS with 4KB gzipped bundle
- **Incremental Static Regeneration (ISR)**: New articles visible within 60 seconds

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, React Hook Form |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MySQL 8 with MariaDB adapter |
| **ORM** | Prisma 7 |
| **Icons** | Heroicons React |
| **Language** | JavaScript (ES6+) |
| **Package Manager** | npm |
| **Hosting** | Vercel |

---

## 📁 Project Structure

```
blogger/
├── app/
│   ├── layout.js                    # Root layout, global styles, metadata
│   ├── page.js                      # Homepage
│   ├── globals.css                  # Global styles + Tailwind
│   ├── robots.js                    # Auto-generates /robots.txt
│   ├── sitemap.js                   # Auto-generates /sitemap.xml
│   ├── admin/
│   │   ├── layout.js                # Admin layout
│   │   ├── page.js                  # Admin dashboard
│   │   └── articles/
│   │       ├── new/
│   │       │   └── page.js          # Create new article
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.js      # Edit existing article
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js       # Login endpoint
│   │   │   └── logout/route.js      # Logout endpoint
│   │   ├── articles/
│   │   │   ├── route.js             # GET all, POST create
│   │   │   └── [id]/route.js        # GET, PUT, DELETE single
│   │   ├── upload/route.js          # Image upload endpoint
│   │   ├── search/route.js          # Full-text search
│   │   └── ai-meta/route.js         # AI meta generator
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.js              # Article detail page
│   ├── search/
│   │   └── page.js                  # Search results page
│   ├── login/
│   │   └── page.js                  # Login page
│   └── rss/
│       └── route.js                 # RSS feed endpoint
├── components/
│   ├── ArticleCard.js               # Article grid item
│   ├── ArticleForm.js               # Create/edit form
│   ├── Header.js                    # Navigation header
│   ├── JsonLd.js                    # JSON-LD schema renderer
│   ├── LogoutButton.js              # Logout button
│   ├── NavigationWrapper.js         # Conditional nav
│   ├── RelatedArticles.js           # Related posts widget
│   └── SearchBar.js                 # Search component
├── lib/
│   ├── aiMeta.js                    # AI meta description generator
│   ├── prisma.js                    # Prisma client singleton
│   ├── readingTime.js               # Reading time calculator
│   └── slugify.js                   # URL slug generator
├── prisma/
│   ├── schema.prisma                # Database schema definition
│   └── migrations/                  # Database migrations
├── public/
│   └── uploads/                     # User-uploaded images
├── middleware.js                    # Auth middleware for admin routes
├── eslint.config.mjs                # ESLint configuration
├── next.config.mjs                  # Next.js configuration
├── postcss.config.mjs               # PostCSS (Tailwind) config
├── prisma.config.ts                 # Prisma config (v7+)
├── tailwind.config.js               # Tailwind CSS config
├── jsconfig.json                    # JavaScript path aliases
├── package.json                     # Dependencies & scripts
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MySQL** 8.0+ (or MariaDB)
- **Git**

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Hemanth094/Blogger.git
cd Blogger
npm install
```

### 2️⃣ Configure Database

Create a `.env.local` file in the project root:

```env
# Database URL
DATABASE_URL="mysql://username:password@localhost:3306/blogger"

# Optional: AI Meta generator (Claude API)
ANTHROPIC_API_KEY="your-claude-api-key"

# Session secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET="your-generated-secret-key"
```

### 3️⃣ Initialize Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Setup Instructions

### Full Development Setup

#### Step 1: Clone Repository
```bash
git clone https://github.com/Hemanth094/Blogger.git
cd Blogger
npm install
```

#### Step 2: Create `.env.local`
```env
# ========== DATABASE ==========
DATABASE_URL="mysql://root:password@localhost:3306/blogger"

# ========== SESSION ==========
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET="your-32-byte-hex-string"

# ========== IMAGE UPLOAD ==========
NEXT_PUBLIC_MAX_FILE_SIZE="5242880"  # 5MB in bytes
```

#### Step 3: Database Setup
```bash
# Create a MySQL database
mysql -u root -p -e "CREATE DATABASE blogger CHARACTER SET utf8mb4;"

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed initial data
npx prisma db seed
```

#### Step 4: Start Development
```bash
npm run dev
```

Visit [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | MySQL connection string |
| `SESSION_SECRET` | ✅ | 32-byte hex string for session signing |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | ❌ | Max upload size in bytes (default: 5MB) |

---

## 📡 API Endpoints

### Articles
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/articles` | List all published articles |
| GET | `/api/articles/[id]` | Get article by ID |
| POST | `/api/articles` | Create new article (admin) |
| PUT | `/api/articles/[id]` | Update article (admin) |
| DELETE | `/api/articles/[id]` | Delete article (admin) |

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout (clears session) |

### Media
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload article image |

### Search & AI
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search?q=query` | Full-text search |
| POST | `/api/ai-meta` | Generate AI meta description |

### Feeds
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rss` | RSS 2.0 feed |
| GET | `/sitemap.xml` | XML sitemap |

---

## 🗄️ Database Schema

### Article Table

```sql
CREATE TABLE Article (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  title           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  content         LONGTEXT NOT NULL,
  image           VARCHAR(500),
  metaTitle       VARCHAR(60),
  metaDescription VARCHAR(160),
  published       BOOLEAN DEFAULT false,
  createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Key Fields
- **slug**: Auto-generated from title, used in URLs
- **metaTitle**: SEO title (max 60 chars)
- **metaDescription**: SEO description (max 160 chars)
- **published**: Controls visibility on public site
- **image**: Cover image URL/path
- **createdAt/updatedAt**: Automatic timestamps

---

## 🧑‍💻 Development Guide

### Adding a New Page

1. Create a file in `app/your-page/page.js`
2. Export a default React component
3. Add metadata if needed via `generateMetadata()`

Example:
```javascript
export const metadata = {
  title: 'My Page',
  description: 'Page description',
};

export default function MyPage() {
  return <main>Page content</main>;
}
```

### Creating API Routes

1. Create `app/api/your-route/route.js`
2. Export handlers: `GET`, `POST`, `PUT`, `DELETE`

Example:
```javascript
export async function GET(request) {
  return Response.json({ message: 'Hello' });
}
```

### Using Database Queries

```javascript
import { prisma } from '@/lib/prisma';

// Get published articles
const articles = await prisma.article.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
});
```

### Authentication Pattern

Sessions are stored in HTTP-only cookies. Check `middleware.js` for protected routes.

```javascript
// In API routes
const session = request.cookies.get('session');
if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
```

---

## 🔍 SEO Implementation

### How It Works

1. **generateMetadata()** — Next.js calls this function at build/render time
2. **Dynamic Values** — Article title, description, image from database
3. **Canonical URLs** — Automatically set to prevent duplicates
4. **JSON-LD** — Article schema included in page HTML
5. **sitemap.xml** — Auto-generated from all published articles
6. **robots.txt** — Blocks admin, API from indexing

### Best Practices

✅ **DO:**
- Keep meta titles 50-60 characters
- Keep meta descriptions 150-160 characters
- Use descriptive article slugs (e.g., `how-to-learn-nextjs`)
- Add cover images to articles
- Use semantic HTML

❌ **DON'T:**
- Stuff keywords in meta tags
- Duplicate meta descriptions across articles
- Use generic titles like "Blog Post"
- Forget alt text on images

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel: https://vercel.com/new
3. Set environment variables in Vercel dashboard
4. Database: Use PlanetScale or Railway
5. Deploy!

```bash
# Setup PlanetScale database
pscale db create blogger

# Connect to PlanetScale
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/blogger"
```

### Deploy to Other Platforms

**Netlify + AWS Lambda:**
```bash
npm run build
# Deploy `out/` directory
```

**Docker:**
```bash
docker build -t blogger .
docker run -p 3000:3000 blogger
```

### Environment for Production
```env
DATABASE_URL="mysql://prod-user:prod-pass@prod-host:3306/blogger"
ANTHROPIC_API_KEY="sk-ant-..."
SESSION_SECRET="your-production-secret"
NODE_ENV="production"
```

---

## 📦 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) file for details.

---

## 💡 Tips & Tricks

### Bulk Edit Articles
Export article data via Prisma Studio:
```bash
npx prisma studio
```

### Generate Test Data
```javascript
// In a Node script
const { prisma } = require('./lib/prisma');
await prisma.article.create({
  data: {
    title: 'Test Article',
    slug: 'test-article',
    content: 'Test content...',
    published: true,
  },
});
```

### Monitor Database
```bash
npx prisma studio  # Web UI for database inspection
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Prisma: Can't reach database` | Check `DATABASE_URL` in `.env.local` |
| `Image upload fails` | Verify `public/uploads/` directory exists and is writable |
| `Meta descriptions not showing` | Ensure article has `published: true` |
| `Search returns no results` | Run `npx prisma generate` after adding data |
| `Admin login fails` | Check session secret is set and valid |

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact via GitHub profile

---

## 🎉 Acknowledgments

Built with modern web best practices for:
- ✅ Performance
- ✅ SEO
- ✅ Accessibility
- ✅ Developer Experience

Happy blogging! 📝
```
│   ├── rss/route.js                 # RSS feed at /rss
│   ├── search/page.js               # Search page (/search?q=...)
│   ├── articles/[slug]/page.js      # Individual article page
│   └── admin/
│       ├── layout.js                # Admin navigation layout
│       ├── page.js                  # Admin dashboard
│       └── articles/
│           ├── new/page.js          # Create article form
│           └── [id]/edit/page.js   # Edit article form
├── app/api/
│   ├── articles/route.js            # GET all, POST create
│   ├── articles/[id]/route.js       # GET one, PUT update, DELETE
│   ├── upload/route.js              # Image upload
│   └── ai-meta/route.js             # AI meta description generator
├── components/
│   ├── ArticleCard.js               # Article card for homepage grid
│   ├── ArticleForm.js               # Reusable create/edit form
│   ├── SearchBar.js                 # Search input component
│   ├── RelatedArticles.js           # Related articles sidebar
│   └── JsonLd.js                    # JSON-LD Article schema
├── lib/
│   ├── prisma.js                    # Prisma client singleton
│   ├── slugify.js                   # Title → URL slug converter
│   ├── readingTime.js               # Reading time calculator
│   └── aiMeta.js                    # AI meta description generator
├── prisma/
│   └── schema.prisma                # Database schema
├── public/
│   └── uploads/                     # Uploaded images (auto-created)
├── .env                             # Environment variables (keep private!)
├── .env.example                     # Template for .env
└── next.config.mjs                  # Next.js configuration
```

---

## Setup Instructions <a name="setup"></a>

### Prerequisites
- Node.js 18+
- MySQL 8 server running locally or in cloud
- npm or yarn

### 1. Clone & Install

```bash
# Navigate to the project
cd blogger

# Install dependencies (already done)
npm install
```

### 2. Set Up MySQL Database

```sql
-- Open MySQL and create a database
CREATE DATABASE blogger_db;
```

### 3. Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env
```

Open `.env` and update:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/blogger_db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
OPENAI_API_KEY=""    # Optional — for AI meta descriptions
```

### 4. Run Database Migration

```bash
# This creates all tables in MySQL
npx prisma migrate dev --name init

# Optional: View your database in a UI
npx prisma studio
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit:
- 🌐 Public site: http://localhost:3000
- 🛠️ Admin panel: http://localhost:3000/admin
- 🗺️ Sitemap: http://localhost:3000/sitemap.xml
- 🤖 Robots: http://localhost:3000/robots.txt
- 📡 RSS Feed: http://localhost:3000/rss

---

## SEO Explanation <a name="seo"></a>

### Why each SEO feature matters:

| Feature | Why it matters |
|---|---|
| **Dynamic `<title>` tags** | The most important on-page SEO element. Each article has a unique title that shows in Google search results. |
| **Meta descriptions** | Appears below the link in Google. A compelling description increases click-through rate (CTR). |
| **Canonical URLs** | Tells Google "this is the official URL" and prevents duplicate content penalties. |
| **OpenGraph tags** | When your articles are shared on Facebook/LinkedIn, these control the preview title, image, and description. |
| **Twitter Cards** | Same as OpenGraph but specifically for Twitter/X link previews. |
| **JSON-LD Article Schema** | Tells Google this page is an Article with structured data — can result in rich snippets (author, date, image in search results). |
| **sitemap.xml** | A map of all your pages. Google uses it to discover and index your articles faster. |
| **robots.txt** | Tells Google which pages NOT to index (admin, API routes). This keeps your public content clean. |
| **Semantic HTML** | Using `<article>`, `<header>`, `<nav>`, etc. helps search engines understand page structure. |
| **Proper heading hierarchy** | One `<h1>` per page, then `<h2>`, `<h3>` — search engines use this to understand article structure. |

---

## Performance & Lighthouse <a name="performance"></a>

### Key optimizations:

| Optimization | Explanation |
|---|---|
| **Next.js `<Image>` component** | Automatically converts to WebP, serves correct size per device, lazy loads off-screen images |
| **Static Generation (`generateStaticParams`)** | Article pages are pre-built at deploy time. Visitors get instant HTML — no server wait |
| **Server Components** | Data fetching happens on the server. Zero JS bundle sent for data fetching logic |
| **`priority` prop on hero images** | Above-the-fold images load first, improving Largest Contentful Paint (LCP) |
| **Font optimization** | Using system fonts via CSS (`-apple-system, ...`) — zero external font request |
| **Compression** | `compress: true` in `next.config.mjs` enables Brotli/gzip compression |

### Core Web Vitals:
- **LCP** (Largest Contentful Paint): Image `priority` + static generation
- **CLS** (Cumulative Layout Shift): `fill` on images with fixed containers prevents layout shift
- **INP** (Interaction to Next Paint): Minimal client JS, server components used everywhere possible

### To check Lighthouse:
1. Open Chrome → Article page → F12 → Lighthouse tab
2. Click "Analyze page load"
3. Target: Performance 85+, SEO 100, Accessibility 90+

---

## API Reference <a name="api"></a>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/articles` | Get all articles |
| `GET` | `/api/articles?published=true` | Get published articles only |
| `GET` | `/api/articles?search=keyword` | Search articles |
| `POST` | `/api/articles` | Create new article |
| `GET` | `/api/articles/:id` | Get single article |
| `PUT` | `/api/articles/:id` | Update article |
| `DELETE` | `/api/articles/:id` | Delete article |
| `POST` | `/api/upload` | Upload image file |
| `POST` | `/api/ai-meta` | Generate AI meta description |

---

## Deployment <a name="deployment"></a>

### Deploy to Vercel (free):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### MySQL in Production (options):
| Provider | Free Tier | Notes |
|---|---|---|
| [Railway](https://railway.app) | 500 hours/month | Easy setup |
| [PlanetScale](https://planetscale.com) | 5GB | MySQL-compatible |
| [Aiven](https://aiven.io) | 1 month trial | Managed MySQL |

### Production Environment Variables (in Vercel dashboard):
```
DATABASE_URL=mysql://user:pass@host:port/dbname
NEXT_PUBLIC_BASE_URL=https://yourdomain.vercel.app
OPENAI_API_KEY=sk-...  (optional)
```

---

---

## License

Built for academic purposes. MIT License.
