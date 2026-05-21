# 🚀 Phase 1: Database Foundation Setup

## ✅ What We're Building:

A complete database for your filmmaker crowdfunding platform with:
- 👥 User profiles (filmmakers & backers)
- 🎬 Portfolio items (films, projects, showreels)
- 💰 Crowdfunding campaigns
- 🎁 Pledge tiers & rewards
- 💳 Payment tracking (Stripe-ready)
- 💬 Comments & interactions
- 👤 User follows

---

## 📋 Quick Setup (10 minutes):

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" - **FREE**
3. Sign up with GitHub/Google/Email
4. Create new project:
   - **Name**: "Filmmaker Platform" (or whatever you want)
   - **Database Password**: Create one & SAVE IT!
   - **Region**: Choose closest to you
   - Click "Create project"

⏱️ Wait 2-3 minutes for database to spin up...

---

### Step 2: Run Database Schema

1. Once project is ready, click **SQL Editor** (icon on left sidebar)
2. Click **+ New query**
3. Open the file `PHASE_1_DATABASE_SCHEMA.sql` in this project
4. **Copy the ENTIRE contents**
5. **Paste into Supabase SQL Editor**
6. Click **Run** (or press Cmd/Ctrl + Enter)

✅ You should see: "Success. No rows returned"

---

### Step 3: Get Your API Keys

1. Go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL** - copy this
   - **anon public** key - copy this

---

### Step 4: Add Keys to Webflow

**Option A: Local Development (.env file)**
```env
PUBLIC_SUPABASE_URL=https://ljlmsnqdtwhrrdbxgptz.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbG1zbnFkdHdocnJkYnhncHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDY5NzgsImV4cCI6MjA5MjE4Mjk3OH0.kh3WIgs81NP7nXXYsK0T-uBmOlDQjNAl26o68FfY1sw

```

**Option B: Webflow Deployment**
1. Go to Webflow **Apps** dashboard
2. Find your app → **Settings**
3. Add **Environment Variables**:
   ```
   PUBLIC_SUPABASE_URL = https://ljlmsnqdtwhrrdbxgptz.supabase.co
   PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbG1zbnFkdHdocnJkYnhncHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDY5NzgsImV4cCI6MjA5MjE4Mjk3OH0.kh3WIgs81NP7nXXYsK0T-uBmOlDQjNAl26o68FfY1sw

   ```

---

### Step 5: Verify Setup

1. In Supabase, click **Table Editor**
2. You should see these tables:
   - ✅ users
   - ✅ portfolios
   - ✅ campaigns
   - ✅ pledge_tiers
   - ✅ pledges
   - ✅ campaign_updates
   - ✅ comments
   - ✅ follows

3. Click on **users** table
4. You should see 1 demo user (John Doe)

---

## 🎯 What Each Table Does:

| Table | Purpose | Example |
|-------|---------|---------|
| **users** | Filmmaker & backer profiles | John Doe, filmmaker |
| **portfolios** | Individual projects/films | "My Short Film", "Documentary 2024" |
| **campaigns** | Crowdfunding campaigns | "Fund My Feature Film - $50k goal" |
| **pledge_tiers** | Reward levels | "$25 - Digital Download", "$100 - Producer Credit" |
| **pledges** | Actual contributions | Sarah backed $50 on Campaign X |
| **campaign_updates** | News from creators | "We hit 50% funding!" |
| **comments** | User feedback | "This looks amazing!" |
| **follows** | User connections | Alice follows Bob |

---

## 🗄️ Database Structure:

```
users
├── portfolios (many)
│   └── campaigns (many)
│       └── pledge_tiers (many)
│           └── pledges (many)
└── pledges (many - as backer)
```

---

## 📊 Key Features Built-In:

### Automatic Calculations:
- ✅ Campaign funding totals update when pledge is made
- ✅ Backer counts auto-increment
- ✅ Timestamps auto-update on edits

### Data Integrity:
- ✅ Can't delete user if they have campaigns (cascade protection)
- ✅ Unique usernames & emails
- ✅ Valid status values enforced
- ✅ Can't follow yourself

### Performance:
- ✅ Indexed for fast searches
- ✅ Optimized queries for common lookups
- ✅ Efficient data relationships

---

## 🧪 Test Data Included:

The schema includes 1 demo filmmaker:
- **Username**: johndoe
- **Email**: demo@filmmaker.com
- **Name**: John Doe
- **Role**: Filmmaker (verified)

You can use this to test features before adding your real data.

---

## 🔒 Security Notes:

**Row Level Security (RLS) is currently DISABLED**

This means:
- ✅ Easy to develop & test
- ⚠️ Anyone can read/write data
- 🔐 We'll enable security in Phase 2 with Memberstack

**For now this is fine since it's development!**

---

## 🎬 Next Steps:

Once database is set up:

✅ **Phase 1 Complete!** - Database foundation ready

🔜 **Phase 2: User Profiles**
- Build user profile pages
- Upload your filmmaker's portfolio
- Create profile UI components

🔜 **Phase 3: Crowdfunding**
- Build campaign pages
- Add pledge flow
- Integrate Stripe

---

## 🆘 Troubleshooting:

### "Error running query"
- Make sure you copied the ENTIRE SQL file
- Check for any connection issues
- Try refreshing Supabase dashboard

### "Relation already exists"
- This means tables were already created
- Safe to ignore, or drop tables and re-run

### "Can't see any tables"
- Make sure query ran successfully
- Check you're in the correct project
- Refresh the Table Editor

### API keys not working
- Double-check you copied the full key (they're long!)
- Make sure no extra spaces
- Use the **anon public** key, not the service role key

---

## 📝 What's Next?

You're ready to:
1. ✅ Start building user profile pages
2. ✅ Create portfolio components  
3. ✅ Upload your filmmaker's data
4. ✅ Build crowdfunding campaign UI

---

**Database ready?** Let me know and we'll move to Phase 2! 🎉

Or if you hit any issues, just ask! 🙋‍♂️
