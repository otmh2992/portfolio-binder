# 🚀 Supabase Setup Guide

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (it's FREE!)
3. Sign up with GitHub, Google, or email
4. Create a new project:
   - Choose a **Project Name** (e.g., "Portfolio Binder")
   - Set a **Database Password** (save this!)
   - Choose a **Region** (pick closest to you)
   - Click "Create new project"

⏱️ Wait 2-3 minutes for your database to spin up...

---

## Step 2: Get Your API Keys

1. Once your project is ready, go to **Settings** (gear icon on left sidebar)
2. Click **API** in the settings menu
3. You'll see two keys:
   - **Project URL** - copy this
   - **anon public** key - copy this too

---

## Step 3: Add Keys to Your Project

In your Webflow project, add these environment variables:

1. Go to your Webflow **Apps** dashboard
2. Find this app and click **Settings**
3. Add these **Environment Variables**:

```
PUBLIC_SUPABASE_URL = https://ljlmsnqdtwhrrdbxgptz.supabase.co
PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbG1zbnFkdHdocnJkYnhncHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDY5NzgsImV4cCI6MjA5MjE4Mjk3OH0.kh3WIgs81NP7nXXYsK0T-uBmOlDQjNAl26o68FfY1sw

```

---

## Step 4: Create the Portfolio Table

1. In Supabase, click **Table Editor** (database icon on left)
2. Click "Create a new table"
3. Name it: **portfolio**
4. **Disable** "Enable Row Level Security" (for now - we'll secure it later)
5. Add these columns:

| Column Name | Type | Default Value | Nullable | Notes |
|-------------|------|---------------|----------|-------|
| id | uuid | gen_random_uuid() | ❌ No | Primary Key (auto-created) |
| created_at | timestamptz | now() | ❌ No | Auto-created |
| name | text | - | ❌ No | Portfolio item title |
| slug | text | - | ❌ No | URL-friendly version |
| description | text | - | ✅ Yes | Item description |
| image_url | text | - | ✅ Yes | Image URL |
| image_alt | text | - | ✅ Yes | Image alt text |
| tags | text[] | - | ✅ Yes | Array of tags |
| featured | boolean | false | ✅ Yes | Is this featured? |
| order | int4 | 0 | ✅ Yes | Display order |

6. Click **Save**

---

## Step 5: Enable Storage for Images (Optional)

1. Click **Storage** (folder icon on left)
2. Click "Create a new bucket"
3. Name it: **portfolio-images**
4. Make it **Public** (so images can be displayed)
5. Click **Save**

---

## Step 6: Add Some Test Data

1. Go back to **Table Editor** → **portfolio** table
2. Click "Insert row"
3. Add a test portfolio item:
   ```
   name: "Test Project"
   slug: "test-project"
   description: "This is a test portfolio item"
   image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"
   image_alt: "Abstract art"
   featured: true
   ```
4. Click **Save**

---

## Step 7: Test the Connection

Once you've added your environment variables in Webflow:

1. The app will automatically restart
2. Refresh your portfolio page
3. You should see your test portfolio item appear!

---

## 🎉 You're Done!

Your portfolio is now powered by Supabase instead of Webflow CMS.

### What's Next?

- Add more portfolio items through the Supabase dashboard
- I can build you a custom admin panel for easier content management
- Set up Row Level Security for better data protection
- Add user authentication if you want users to submit portfolios

---

## 🆘 Troubleshooting

**Items not showing up?**
- Check that your environment variables are correct
- Make sure RLS is disabled on the portfolio table (for now)
- Check browser console for errors

**Images not loading?**
- Make sure the image URLs are publicly accessible
- Or use Supabase Storage and get public URLs from there

---

**Need help?** Just ask me! 🙋‍♂️
