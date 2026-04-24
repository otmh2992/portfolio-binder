# 🔧 Quick Fix - Run This Migration

## The Problem
You have an existing `portfolios` table, so we need to **update** it, not create a new one.

## ⚠️ IMPORTANT - Close Other SQL Tabs First!

The error `column "status" does not exist` is happening because one of your other SQL tabs is trying to run a query that uses `status`.

### Before Running the Migration:

1. **Close these tabs** (or at least don't run them):
   - "Find User by Email" 
   - "Portfolio Indexing & Query Tuning"
   - "List Portfolio Index Definitions"
   - "Portfolio Binder Schema"

2. **Open a NEW tab** in SQL Editor

---

## ✅ Step-by-Step Instructions

### 1. Close Old Tabs
- In Supabase SQL Editor, close all existing tabs (or just don't run them)
- Click **"+ New Query"** to open a fresh tab

### 2. Run the Migration
- Open the file: `migrate-existing-database.sql`
- Copy the **entire contents**
- Paste into your **new, clean SQL tab**
- Click **"Run"** (or press Cmd/Ctrl + Enter)

### 3. Check Results
You should see output like:
```
✅ Migration Complete!

Users created: 3
Portfolios with users: 8
Portfolios without users: 0

username     | full_name    | portfolio_count
-------------|--------------|----------------
filmmaker1   | Alex Rivera  | 3
filmmaker2   | Jordan Lee   | 3
filmmaker3   | Sam Chen     | 2
```

---

## What This Migration Does

✅ Creates `users` table (for filmmaker profiles)  
✅ Adds missing columns to your existing `portfolios` table  
✅ Renames `name` → `title` (if needed)  
✅ Renames `image_url` → `thumbnail_url` (if needed)  
✅ Adds `user_id`, `video_url`, `category`, `views`, `likes`  
✅ Links your existing portfolios to sample users  
✅ Does NOT add `status` column (to avoid conflicts)  

---

## After Migration

### Deploy Your App
1. Click **"Deploy"** in Webflow
2. Wait for build
3. Test the site!

### Test URLs
```
Homepage:
https://plan-z.webflow.io/portfolio-binder/

Filmmaker Pages:
https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker1
https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker2
https://plan-z.webflow.io/portfolio-binder/filmmaker/filmmaker3
```

---

## If You Still Get Errors

### "column already exists"
✅ This is fine! The script handles it with `IF NOT EXISTS`

### "constraint already exists"
✅ Also fine! Script checks before adding

### Still getting "status" error
❌ You're running code from one of the old tabs!
- Close ALL tabs
- Open a completely new one
- Try again

---

## Next Steps

Once migration is done:
1. ✅ Deploy the app
2. ✅ Click portfolio items on homepage
3. ✅ See filmmaker profile pages
4. ✅ Everything works!

---

## Summary

**Do This:**
1. Close old SQL tabs
2. Open NEW tab
3. Run `migrate-existing-database.sql`
4. Deploy app
5. Test!

**Don't Do This:**
- Don't run old queries that reference `status`
- Don't try to run multiple migrations
- Don't skip closing old tabs
