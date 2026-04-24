# 🏗️ Portfolio Binder - System Architecture

## 📊 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                      https://planzzz.com                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE WORKERS                            │
│                   (portfolio-binder)                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Astro Server                           │  │
│  │  • Renders pages (SSR)                                    │  │
│  │  • Handles API routes                                     │  │
│  │  • Routes requests                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Environment Variables (Encrypted Secrets):                     │
│  • SUPABASE_ANON_KEY                                            │
│  • R2_ACCESS_KEY_ID                                             │
│  • R2_SECRET_ACCESS_KEY                                         │
│  • TMDB_API_KEY                                                 │
└─────────────┬───────────────┬────────────────┬──────────────────┘
              │               │                │
              ▼               ▼                ▼
    ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
    │  Supabase   │  │ Cloudflare   │  │    TMDB     │
    │  Database   │  │   R2 Bucket  │  │     API     │
    └─────────────┘  └──────────────┘  └─────────────┘
```

---

## 🔄 User Journey Flow

### **1. Homepage Visit**
```
User → planzzz.com
  ↓
Cloudflare Worker (Astro)
  ↓
Renders index.astro
  ↓
Fetches portfolios from Supabase
  ↓
Displays portfolio grid with grey texture
```

### **2. User Signup**
```
User → /signup
  ↓
Selects film from TMDB-powered list
  ↓
Generates username (e.g., 1234-pulp-fiction)
  ↓
Creates account in Supabase Auth
  ↓
Stores user data in 'users' table
  ↓
Redirects to homepage (logged in)
```

### **3. Portfolio Upload**
```
User → /submit
  ↓
Uploads video/image
  ↓
Worker receives file
  ↓
Uploads to R2 bucket (portfoliovideos)
  ↓
Saves metadata to Supabase 'portfolios' table
  ↓
File accessible via R2 public URL
```

### **4. Viewing Filmmaker Page**
```
User → /filmmaker/1234-pulp-fiction
  ↓
Worker looks up user by username (Supabase)
  ↓
Fetches user's portfolios (Supabase)
  ↓
Loads media from R2 bucket
  ↓
Renders filmmaker page
```

---

## 🗄️ Database Schema (Supabase)

### **`users` table**
```sql
┌──────────────┬──────────────┬─────────────────────┐
│ Column       │ Type         │ Description          │
├──────────────┼──────────────┼─────────────────────┤
│ id           │ UUID         │ Primary key          │
│ email        │ TEXT         │ User email           │
│ username     │ TEXT         │ Film-based username  │
│ full_name    │ TEXT         │ User's real name     │
│ created_at   │ TIMESTAMP    │ Account creation     │
│ updated_at   │ TIMESTAMP    │ Last update          │
└──────────────┴──────────────┴─────────────────────┘
```

### **`portfolios` table**
```sql
┌──────────────┬──────────────┬─────────────────────┐
│ Column       │ Type         │ Description          │
├──────────────┼──────────────┼─────────────────────┤
│ id           │ UUID         │ Primary key          │
│ user_id      │ UUID         │ FK → users.id        │
│ title        │ TEXT         │ Portfolio title      │
│ description  │ TEXT         │ Portfolio desc       │
│ media_url    │ TEXT         │ R2 file URL          │
│ media_type   │ TEXT         │ 'video' or 'image'   │
│ created_at   │ TIMESTAMP    │ Upload date          │
└──────────────┴──────────────┴─────────────────────┘
```

---

## 📦 Storage Structure (R2)

### **Bucket: `portfoliovideos`**
```
portfoliovideos/
├── videos/
│   ├── [user-id]/
│   │   ├── [portfolio-id]-video.mp4
│   │   ├── [portfolio-id]-video.webm
│   │   └── ...
│   └── ...
├── images/
│   ├── [user-id]/
│   │   ├── [portfolio-id]-image.jpg
│   │   ├── [portfolio-id]-image.png
│   │   └── ...
│   └── ...
└── thumbnails/
    └── [portfolio-id]-thumb.jpg
```

---

## 🔐 Security Layers

### **1. Supabase Row Level Security (RLS)**
```
┌─────────────────────────────────────────────┐
│ users table:                                │
│  • Users can only read their own data       │
│  • Users can update their own profile       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ portfolios table:                           │
│  • Anyone can read published portfolios     │
│  • Users can only create/update their own   │
│  • Users can only delete their own          │
└─────────────────────────────────────────────┘
```

### **2. Cloudflare Worker Secrets**
- All sensitive keys stored as encrypted secrets
- Never exposed in client-side code
- Only accessible by server-side Worker

### **3. R2 Bucket Permissions**
- Public read access for portfolio media
- Write access only via R2 API keys (in Worker)
- CORS configured for web uploads

---

## 🌐 Domain Routing

### **Production:**
```
planzzz.com
  ↓
Cloudflare DNS
  ↓
Cloudflare Workers (portfolio-binder)
  ↓
Astro SSR Application
```

### **Routes:**
```
/                          → Homepage (portfolio grid)
/login                     → Login page
/signup                    → Signup with film selection
/submit                    → Portfolio upload form
/filmmaker/[username]      → Individual filmmaker page
/settings                  → User settings/profile
/api/cms/[collection]      → Legacy CMS routes (unused)
/api/upload-video          → Video upload endpoint
/api/recommend-films       → Film recommendation API
```

---

## 🔄 API Integrations

### **TMDB API (The Movie Database)**
- **Purpose:** Fetch high-rated films for username generation
- **Endpoint:** `https://api.themoviedb.org/3/discover/movie`
- **Usage:** 
  - Get films rated 8.0+
  - Random selection of 5 films
  - Auto-refresh every 5 seconds
  - Slug generation from film titles

### **Supabase API**
- **Purpose:** Authentication & database operations
- **Endpoints:**
  - Auth: `/auth/v1/signup`, `/auth/v1/login`
  - Database: `/rest/v1/users`, `/rest/v1/portfolios`
- **Usage:**
  - User registration/login
  - CRUD operations on portfolios
  - User profile management

### **Cloudflare R2 API**
- **Purpose:** File storage
- **Operations:**
  - Upload videos/images
  - Generate public URLs
  - Delete files
- **SDK:** `@aws-sdk/client-s3` (S3-compatible)

---

## 📈 Performance Optimizations

### **1. Cloudflare Global CDN**
- Static assets cached at 300+ edge locations
- Workers run at the edge (near users)
- Reduced latency worldwide

### **2. Supabase Connection Pooling**
- Efficient database connections
- Auto-scaling based on load
- PostgREST API optimization

### **3. R2 Streaming**
- Direct video streaming from R2
- No intermediate servers
- Bandwidth optimized

### **4. Astro SSR**
- Server-side rendering for SEO
- Client-side hydration for interactivity
- Minimal JavaScript shipped to browser

---

## 🔧 Development vs Production

### **Development (Local)**
```
localhost:3000
  ↓
Astro Dev Server
  ↓
.dev.vars (environment variables)
  ↓
Supabase/R2/TMDB APIs
```

### **Production (Cloudflare)**
```
planzzz.com
  ↓
Cloudflare Workers
  ↓
Wrangler Secrets (encrypted)
  ↓
Supabase/R2/TMDB APIs
```

---

## 🚀 Deployment Pipeline

```
1. Local Development
   ├── npm run dev
   └── Test features

2. Build
   ├── npm run build
   └── Generates dist/ folder

3. Deploy
   ├── wrangler deploy
   └── Uploads to Cloudflare

4. Domain Setup
   ├── wrangler domains add planzzz.com
   └── Maps domain to Worker

5. Live!
   └── https://planzzz.com
```

---

## 💰 Cost Breakdown (Estimated)

### **Cloudflare Workers**
- **Free Tier:** 100,000 requests/day
- **Paid:** $5/month for 10M requests
- **Your needs:** Should stay in free tier initially

### **Cloudflare R2**
- **Free Tier:** 10GB storage, 1M Class A ops/month
- **Paid:** $0.015/GB/month storage
- **Your needs:** ~$1-5/month depending on uploads

### **Supabase**
- **Free Tier:** 500MB database, 2GB bandwidth, 50MB file storage
- **Paid:** $25/month for Pro (more resources)
- **Your needs:** Free tier for MVP, upgrade as you grow

### **TMDB API**
- **Free:** No cost for non-commercial use
- **Rate limits:** Enough for this use case

### **Total Estimated Monthly Cost:**
- **MVP/Launch:** $0-5/month (mostly free tiers)
- **Growth (100 users):** $5-15/month
- **Scale (1000+ users):** $30-50/month

---

## ✅ System Health Checks

### **Before Deploying:**
- [ ] Supabase database accessible
- [ ] R2 bucket created and accessible
- [ ] All secrets configured in Wrangler
- [ ] Build completes without errors
- [ ] Domain DNS configured

### **After Deploying:**
- [ ] Homepage loads on production URL
- [ ] User signup creates records in Supabase
- [ ] Portfolio upload saves to R2
- [ ] Film selection API works
- [ ] Filmmaker pages render correctly

---

**Your system is ready to scale! 🚀**
