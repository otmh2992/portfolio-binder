# 🎬 Complete System Flow - Portfolio Binder

## Overview

This document explains how all the pieces work together, from homepage to filmmaker pages.

---

## 🗺️ User Journey Map

```
VISITOR LANDS ON HOMEPAGE
        ↓
Sees "Featured Work" portfolio grid
(PortfolioGridSupabase component)
        ↓
Clicks on a portfolio item
        ↓
Redirected to filmmaker's profile page
(/filmmaker/[username])
        ↓
Sees filmmaker's info + all their work
(UserProfile component)
        ↓
Can navigate back via NavBar
```

---

## 📁 File Structure

```
src/
├── pages/
│   ├── index.astro                    # Homepage with portfolio grid
│   ├── filmmaker/
│   │   └── [username].astro           # Dynamic filmmaker pages
│   ├── login.astro                    # Authentication (future)
│   └── submit.astro                   # Submit work form
│
├── components/
│   ├── NavBar.tsx                     # Navigation (used everywhere)
│   ├── PortfolioGridSupabase.tsx      # Portfolio grid (homepage)
│   └── UserProfile.tsx                # Filmmaker profile display
│
├── lib/
│   ├── supabase.ts                    # Supabase client + types
│   ├── base-url.ts                    # Base path for deployment
│   └── types.ts                       # TypeScript definitions
│
└── layouts/
    └── main.astro                     # Global layout + styles
```

---

## 🔄 Data Flow

### 1. Homepage (index.astro)

```astro
---
import PortfolioGridSupabase from '../components/PortfolioGridSupabase';
import NavBar from '../components/NavBar';
---

<NavBar client:load />
<PortfolioGridSupabase client:load />
```

**What Happens:**
1. Page loads
2. `PortfolioGridSupabase` component mounts
3. Fetches portfolios from Supabase `portfolios` table
4. Renders grid with clickable links
5. Each link points to `/filmmaker/[user_id]`

---

### 2. Portfolio Grid Component (PortfolioGridSupabase.tsx)

```tsx
// Fetches data
const { data } = await supabase
  .from('portfolios')
  .select('*')
  .order('created_at', { ascending: false });

// Renders as clickable links
{items.map((item) => (
  <a href={`${baseUrl}/filmmaker/${item.user_id}`}>
    <img src={item.thumbnail_url} />
    <h3>{item.title}</h3>
  </a>
))}
```

**Key Features:**
- ✅ Caches data (localStorage + in-memory)
- ✅ Shows loading skeleton
- ✅ Handles errors gracefully
- ✅ Uses `baseUrl` for correct paths

---

### 3. Filmmaker Page ([username].astro)

```astro
---
const { username } = Astro.params; // Gets username from URL
---

<NavBar client:load />
<UserProfile username={username!} client:load />
```

**What Happens:**
1. URL like `/filmmaker/filmmaker1` extracts `username`
2. Passes it to `UserProfile` component
3. Component fetches user data + their portfolios

---

### 4. User Profile Component (UserProfile.tsx)

```tsx
// Fetch user by username
const { data: userData } = await supabase
  .from('users')
  .select('*')
  .eq('username', username)
  .single();

// Fetch their portfolios
const { data: portfolioData } = await supabase
  .from('portfolios')
  .select('*')
  .eq('user_id', userData.id);
```

**Displays:**
- ✅ Profile header (avatar, name, bio, location)
- ✅ Role badge (filmmaker, producer, etc.)
- ✅ Social links (website, Instagram, etc.)
- ✅ Portfolio grid (all their work)
- ✅ Edit buttons (if viewing own profile)

---

## 🗄️ Database Relationships

```
users table                    portfolios table
┌────────────────┐             ┌────────────────┐
│ id (UUID)      │◄───────────│ user_id (FK)   │
│ username       │             │ id (UUID)      │
│ email          │             │ title          │
│ full_name      │             │ description    │
│ bio            │             │ thumbnail_url  │
│ avatar_url     │             │ tags[]         │
│ role           │             │ featured       │
└────────────────┘             └────────────────┘
     ONE                            MANY
     ↑                               ↓
  One user can have many portfolios
```

**Foreign Key Constraint:**
```sql
portfolios.user_id REFERENCES users.id ON DELETE CASCADE
```

This means:
- ✅ Each portfolio must belong to a valid user
- ✅ If a user is deleted, their portfolios are auto-deleted
- ✅ Maintains data integrity

---

## 🔗 URL Structure

### Development
```
http://localhost:3000/
http://localhost:3000/filmmaker/filmmaker1
```

### Production (Webflow)
```
https://plan-z.webflow.io/portfolio-binder/
https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker1
```

**Why `baseUrl`?**
- ✅ Works in both environments
- ✅ No hardcoded paths
- ✅ Easy to change mount point
- ✅ Prevents broken links

---

## 🎨 Styling & Theming

### Global Styles (src/styles/global.css)
```css
/* Uses Webflow design tokens */
--background: var(--_apps---colors--background);
--foreground: var(--_apps---colors--foreground);
--primary: var(--_apps---colors--primary);

/* Portfolio grid styles */
.asymmetric-grid { ... }
.portfolio-item { ... }

/* Texture backgrounds */
.grey-texture { ... }
```

### Layout (layouts/main.astro)
```astro
<!-- Imports global styles -->
import '../../generated/fonts.css';
import '../site-components/global.css';
import '../styles/global.css';
```

**Key Features:**
- ✅ Consistent design system
- ✅ Dark mode support
- ✅ Responsive grid
- ✅ Texture backgrounds

---

## 🔐 Authentication Flow (Future)

Currently **disabled** for public viewing. To enable:

### 1. Uncomment RLS in Schema
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
```

### 2. Add Policies
```sql
-- Public can view published portfolios
CREATE POLICY "Public read published"
  ON portfolios FOR SELECT
  USING (status = 'published');

-- Users can manage own portfolios
CREATE POLICY "Users manage own"
  ON portfolios FOR ALL
  USING (auth.uid() = user_id);
```

### 3. Update Components
```tsx
// In NavBar.tsx - already set up!
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  // Show profile menu
} else {
  // Show login/signup
}
```

---

## 📊 Performance Optimizations

### 1. Caching Strategy
```tsx
// PortfolioGridSupabase.tsx
const CACHE_TTL = 300000; // 5 minutes

// Try localStorage first
const cached = localStorage.getItem(localStorageKey);
if (cached && !expired) {
  return cachedData;
}

// Then fetch from Supabase
const { data } = await supabase.from('portfolios').select('*');
```

### 2. Database Indexes
```sql
-- Fast username lookups
CREATE INDEX idx_users_username ON users(username);

-- Fast user portfolio queries
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);

-- Fast tag searches
CREATE INDEX idx_portfolios_tags ON portfolios USING GIN(tags);
```

### 3. Image Loading
```tsx
<img 
  src={item.thumbnail_url}
  loading="lazy"        // Only load when visible
  decoding="async"      // Don't block rendering
/>
```

---

## 🧪 Testing Checklist

### Homepage
- [ ] Portfolio grid loads
- [ ] Images display correctly
- [ ] Hover effects work
- [ ] Clicking item redirects to filmmaker page

### Filmmaker Page
- [ ] Profile info displays
- [ ] Avatar shows (or initials fallback)
- [ ] Bio and location appear
- [ ] Portfolio grid shows user's work
- [ ] Empty state shows if no portfolios

### Navigation
- [ ] NavBar appears on all pages
- [ ] Logo links to homepage
- [ ] All menu items work
- [ ] Submit Work button accessible

### Errors
- [ ] 404 page for invalid usernames
- [ ] Error message if database unreachable
- [ ] Loading states show correctly

---

## 🚀 Deployment Process

1. **Code Changes** (already done ✅)
   - Updated PortfolioGridSupabase with links
   - Added baseUrl imports
   - Updated NavBar and UserProfile

2. **Database Setup** (you need to do)
   - Run `complete-database-schema.sql` in Supabase
   - Verify tables created
   - Check sample data exists

3. **Deploy App** (you need to do)
   - Click "Deploy" in Webflow
   - Wait for build
   - Test live site

4. **Verify** (after deployment)
   - Visit homepage
   - Click portfolio item
   - Check filmmaker page loads
   - Test navigation

---

## 🐛 Common Issues & Fixes

### Issue: 404 on filmmaker pages
**Solution:** Deploy the app (code changes aren't live yet)

### Issue: "Profile Not Found"
**Solution:** Run the database schema SQL in Supabase

### Issue: Links go to wrong URL
**Solution:** Check `astro.config.mjs` base path matches deployment

### Issue: Images don't load
**Solution:** Verify `thumbnail_url` in database is valid

### Issue: Slow loading
**Solution:** Check network tab, verify caching works

---

## 📝 Next Development Steps

### Phase 1: Core Features ✅
- [x] Homepage portfolio grid
- [x] Filmmaker profile pages
- [x] Navigation system
- [x] Database schema

### Phase 2: Authentication (Next)
- [ ] User signup/login
- [ ] Session management
- [ ] Protected routes
- [ ] Edit profile

### Phase 3: Upload System
- [ ] Video upload form
- [ ] Cloudflare R2 integration
- [ ] Thumbnail generation
- [ ] Progress indicators

### Phase 4: Social Features
- [ ] Like/favorite portfolios
- [ ] Comment system
- [ ] Follow filmmakers
- [ ] Activity feed

### Phase 5: Crowdfunding
- [ ] Project campaigns
- [ ] Payment integration
- [ ] Backer rewards
- [ ] Progress tracking

---

## 🎯 Key Takeaways

1. **Homepage** = Portal to all filmmakers
2. **Filmmaker Pages** = Individual portfolios
3. **Links** = Powered by `user_id` in database
4. **Navigation** = Consistent across all pages
5. **Data** = Stored in Supabase, cached for speed

---

You're now ready to test the complete flow! 🎉
