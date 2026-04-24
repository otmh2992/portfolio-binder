# 🎬 Filmmaker Pages Setup Guide

## What's Been Fixed

✅ Portfolio items are now clickable links  
✅ Clicking an item takes you to `/filmmaker/[username]`  
✅ Filmmaker profile pages show user info + their portfolio  
✅ All navigation uses correct `baseUrl` for deployment  
✅ NavBar component integrated across all pages  

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Run the Database Schema

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy the entire contents of `complete-database-schema.sql`
5. Paste it into the query editor
6. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

This will create:
- ✅ **users** table (for filmmaker profiles)
- ✅ **portfolios** table (updated schema with user_id)
- ✅ Sample data (3 filmmakers, 8 portfolio items)
- ✅ Performance indexes
- ✅ Auto-updating timestamps

---

### Step 2: Deploy Your App

1. In the Webflow sidebar, click **"Deploy"**
2. Wait for deployment to complete
3. Visit your live site

---

## 🧪 Testing the Filmmaker Pages

Once deployed, you can test with the sample data:

**Sample Filmmaker URLs:**
- `https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker1`
- `https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker2`
- `https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker3`

**What You'll See:**
- ✅ Filmmaker profile with avatar, bio, location
- ✅ Their portfolio grid of work
- ✅ Clicking a portfolio item from the homepage goes to their profile
- ✅ Navigation works correctly across all pages

---

## 📊 Database Schema Overview

### Users Table
```
- id (UUID, primary key)
- username (unique, for URLs)
- email (unique)
- full_name
- bio
- avatar_url
- location
- website
- role (filmmaker, producer, viewer, admin)
- social links (instagram, twitter, youtube, vimeo)
```

### Portfolios Table (Updated)
```
- id (UUID, primary key)
- user_id (links to users table)
- title
- description
- video_url
- thumbnail_url
- tags (array)
- category
- featured (boolean)
- views, likes (integers)
- status (draft, published, archived)
```

---

## 🎨 Sample Users

The schema includes 3 sample filmmakers:

1. **Alex Rivera** (@filmmaker1) - Documentary filmmaker from LA
2. **Jordan Lee** (@filmmaker2) - Cinematographer from NYC
3. **Sam Chen** (@filmmaker3) - Editor from Austin

Each has 2-3 portfolio items with real Unsplash images.

---

## 🔗 How the Linking Works

### Homepage → Filmmaker Page
```tsx
// In PortfolioGridSupabase.tsx
<a href={`${baseUrl}/filmmaker/${item.user_id}`}>
  {/* Portfolio item */}
</a>
```

### Filmmaker Page Displays
```tsx
// In UserProfile.tsx
1. Fetches user by username from users table
2. Fetches all portfolios where user_id matches
3. Displays profile info + portfolio grid
```

---

## ⚙️ Navigation Structure

All pages now use consistent navigation:

```
NavBar Component
├── Home (/)
├── Explore (/explore)
├── About (/about)
├── Admin (/admin) - if logged in
├── Submit Work (/submit)
└── User Menu (if authenticated)
    ├── View Profile (/filmmaker/[username])
    ├── Settings (/settings)
    ├── Upload Work (/upload)
    └── Log Out
```

---

## 🐛 Troubleshooting

### "Profile Not Found" Error
- ✅ Make sure the database schema has been run
- ✅ Check that the `users` table exists in Supabase
- ✅ Verify sample data was inserted

### 404 Page Errors
- ✅ Make sure you've deployed after the code changes
- ✅ Check that the URL includes `/portfolio-binder` base path
- ✅ Verify the username exists in the database

### Portfolio Items Don't Show
- ✅ Check the `portfolios` table has data
- ✅ Verify `user_id` matches a user in `users` table
- ✅ Check browser console for errors

### Links Go to Wrong Place
- ✅ Clear browser cache
- ✅ Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- ✅ Verify `baseUrl` is set correctly in deployment

---

## 🎯 Next Steps

Now that filmmaker pages work, you can:

1. ✅ **Add more users** - Insert into `users` table
2. ✅ **Link portfolios** - Use `user_id` to link work to filmmakers
3. ✅ **Customize profiles** - Add bio, avatar, social links
4. ✅ **Enable authentication** - Uncomment RLS policies in schema
5. ✅ **Build upload system** - Let filmmakers add their own work

---

## 📝 Adding Your Own Users

To add a new filmmaker:

```sql
-- In Supabase SQL Editor
INSERT INTO users (email, username, full_name, bio, role, location)
VALUES (
  'filmmaker@example.com',
  'myusername',
  'My Full Name',
  'I make awesome films!',
  'filmmaker',
  'City, State'
);
```

Then add their portfolio:

```sql
-- Get the user_id first
SELECT id FROM users WHERE username = 'myusername';

-- Insert portfolio item (replace <user_id> with actual UUID)
INSERT INTO portfolios (user_id, title, description, thumbnail_url, tags, featured)
VALUES (
  '<user_id>',
  'My First Film',
  'An amazing short film',
  'https://images.unsplash.com/photo-example?w=800',
  ARRAY['short film', 'drama'],
  true
);
```

---

## ✅ You're Ready!

Your filmmaker pages are now live and working! 🎉

Test the links from the homepage and explore the profiles.
