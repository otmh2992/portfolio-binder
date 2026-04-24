# ✅ Getting Started Checklist

Follow this checklist to get your video platform running!

---

## 📋 Phase 1: Setup Services (30 minutes)

### **1. Supabase Setup** ⏱️ 10 mins

- [ ] Go to https://supabase.com
- [ ] Create free account
- [ ] Create new project
- [ ] Copy `Project URL` and `Anon Key`
- [ ] Go to SQL Editor
- [ ] Run the schema from `PHASE_1_DATABASE_SCHEMA.sql`
- [ ] Verify `users` and `portfolios` tables exist
- [ ] Test by creating a dummy user in Auth → Users

**📖 Detailed guide:** `SUPABASE_SETUP.md`

---

### **2. Cloudflare R2 Setup** ⏱️ 15 mins

- [ ] Go to https://cloudflare.com
- [ ] Create free account (or log in)
- [ ] Navigate to R2 in sidebar
- [ ] Click "Create bucket"
- [ ] Name it: `portfolio-videos`
- [ ] Click "Manage R2 API Tokens"
- [ ] Create API token with Read & Write permissions
- [ ] Copy: `Access Key ID`, `Secret Access Key`, `Account ID`
- [ ] Go to bucket settings → Public Access → Enable
- [ ] Go to CORS policy → Add configuration (see guide)

**📖 Detailed guide:** `R2_QUICK_SETUP.md`

---

### **3. Environment Variables** ⏱️ 5 mins

- [ ] Open `.env` file in your project
- [ ] Add Supabase credentials:
  ```env
  SUPABASE_URL=https://xxxxx.supabase.co
  SUPABASE_ANON_KEY=eyJhbGc...
  ```
- [ ] Add Cloudflare R2 credentials:
  ```env
  CLOUDFLARE_ACCOUNT_ID=abc123
  R2_ACCESS_KEY_ID=xxxxxxxxxxxx
  R2_SECRET_ACCESS_KEY=yyyyyyyyyyyy
  R2_BUCKET_NAME=portfolio-videos
  R2_PUBLIC_URL=https://portfolio-videos.abc123.r2.cloudflarestorage.com
  ```
- [ ] Save file
- [ ] **DO NOT** commit `.env` to git!

---

## 🧪 Phase 2: Test Locally (15 minutes)

### **4. Install Dependencies** ⏱️ 2 mins

```bash
npm install
```

- [ ] Wait for installation to complete
- [ ] Check for any errors

---

### **5. Start Dev Server** ⏱️ 1 min

```bash
npm run dev
```

- [ ] Server starts on `http://localhost:3000`
- [ ] No errors in terminal
- [ ] Open browser to `http://localhost:3000`

---

### **6. Test Authentication** ⏱️ 5 mins

- [ ] Visit `http://localhost:3000/signup`
- [ ] Create test account:
  - Email: `test@example.com`
  - Password: `TestPassword123!`
  - Username: `testfilmmaker`
  - Full Name: `Test User`
- [ ] Check Supabase Dashboard → Auth → Users
- [ ] Verify user was created
- [ ] Log out
- [ ] Log back in at `/login`
- [ ] Should see your username in navbar

---

### **7. Test Video Upload** ⏱️ 7 mins

- [ ] Click "Submit Work" in navbar
- [ ] Fill out form:
  - Title: `Test Video`
  - Description: `This is a test upload`
  - Category: `Short Film`
  - Video: Upload a small video file (< 50MB recommended for test)
- [ ] Click "Upload Video"
- [ ] Watch progress bar
- [ ] Wait for success message
- [ ] Go to homepage (`/`)
- [ ] Verify video appears in grid
- [ ] Click play button
- [ ] Verify video plays

**If upload fails, check:**
1. R2 credentials in `.env`
2. R2 bucket CORS settings
3. Browser console for errors (`F12`)

---

## 🔍 Phase 3: Verify Everything Works (10 minutes)

### **8. Database Check** ⏱️ 3 mins

- [ ] Go to Supabase Dashboard
- [ ] Click "Table Editor"
- [ ] Open `users` table
- [ ] Verify your test user exists
- [ ] Open `portfolios` table
- [ ] Verify your test video entry exists
- [ ] Check `video_url` field has R2 URL
- [ ] Check `user_id` matches your user

---

### **9. R2 Storage Check** ⏱️ 3 mins

- [ ] Go to Cloudflare Dashboard
- [ ] Navigate to R2 → Buckets
- [ ] Open `portfolio-videos` bucket
- [ ] Click into `videos/` folder
- [ ] Verify your video file exists
- [ ] Note the filename (timestamp-random-name.mp4)
- [ ] Copy the full URL
- [ ] Paste in new browser tab
- [ ] Verify video downloads or plays

---

### **10. Frontend Check** ⏱️ 4 mins

- [ ] Homepage displays video grid
- [ ] Video thumbnail visible (or placeholder)
- [ ] Hover over video shows overlay
- [ ] Click video opens player
- [ ] Video plays smoothly
- [ ] No console errors (`F12`)
- [ ] Test on different browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari (if on Mac)

---

## 🐛 Phase 4: Troubleshooting (If Needed)

### **Common Issues:**

#### **❌ "Missing Supabase configuration"**
**Fix:**
1. Check `.env` has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Restart dev server (`Ctrl+C`, then `npm run dev`)

#### **❌ "Missing R2 configuration"**
**Fix:**
1. Check `.env` has all R2 variables
2. Verify Account ID is correct (24 characters)
3. Restart dev server

#### **❌ Upload fails with CORS error**
**Fix:**
1. Go to R2 bucket settings
2. Add CORS policy (see `R2_QUICK_SETUP.md`)
3. Make sure `http://localhost:3000` is in AllowedOrigins
4. Wait 1 minute for changes to propagate

#### **❌ Video doesn't appear on homepage**
**Fix:**
1. Check Supabase `portfolios` table has entry
2. Check `video_url` is not null
3. Clear browser cache (`Ctrl+Shift+R`)
4. Check browser console for errors

#### **❌ Video won't play**
**Fix:**
1. Check R2 public access is enabled
2. Try opening video URL directly in browser
3. Check video file format is supported (MP4 recommended)
4. Try smaller video file first

---

## 🎨 Phase 5: Customize (Optional)

### **11. Branding** ⏱️ 5 mins

- [ ] Update site title in `src/layouts/main.astro` (line 12)
  ```astro
  <title>Your Platform Name</title>
  ```
- [ ] Update navbar logo in `src/components/NavBar.tsx` (line 71)
  ```tsx
  <h1 className="text-2xl font-bold">YOUR BRAND</h1>
  ```
- [ ] Change primary color in Webflow Designer

---

### **12. Add Sample Content** ⏱️ 10 mins

- [ ] Upload 3-5 sample videos
- [ ] Use different categories
- [ ] Add good descriptions
- [ ] Test grid layout looks good
- [ ] Verify all videos play

---

### **13. Content Guidelines** ⏱️ 5 mins

- [ ] Update submission guidelines in `src/pages/submit.astro`
- [ ] Add your specific rules
- [ ] Add contact info
- [ ] Add terms of service link

---

## 🚀 Phase 6: Go Live (Optional)

### **14. Deploy to Cloudflare Pages**

- [ ] Push code to GitHub
  ```bash
  git add .
  git commit -m "Initial video platform"
  git push
  ```
- [ ] Go to Cloudflare Dashboard
- [ ] Click "Pages"
- [ ] Click "Create a project"
- [ ] Connect to GitHub repository
- [ ] Build settings:
  - Build command: `npm run build`
  - Build output: `dist`
- [ ] Add environment variables (same as `.env`)
- [ ] Deploy!
- [ ] Wait 2-3 minutes
- [ ] Visit your live URL

---

### **15. Final Production Checks**

- [ ] Test signup on production
- [ ] Test upload on production
- [ ] Update CORS to include production domain
- [ ] Update Supabase redirect URLs
- [ ] Test on mobile devices
- [ ] Share with beta testers
- [ ] Monitor Cloudflare Analytics
- [ ] Check Supabase logs for errors

---

## 📊 Phase 7: Monitor & Scale

### **16. Weekly Checks**

- [ ] Check Supabase usage (Database → Usage)
- [ ] Check R2 storage size (R2 → Metrics)
- [ ] Review upload success rate
- [ ] Check for user-reported issues
- [ ] Monitor costs (should be < $1/month)

---

### **17. Monthly Checks**

- [ ] Review analytics (views, uploads, users)
- [ ] Backup database (Supabase → Settings → Backups)
- [ ] Update dependencies (`npm update`)
- [ ] Test all features still work
- [ ] Plan new features based on feedback

---

## 📚 Documentation Reference

| Document | What It Covers |
|----------|---------------|
| `VIDEO_UPLOAD_SETUP.md` | Complete upload system guide |
| `R2_QUICK_SETUP.md` | Cloudflare R2 configuration |
| `SUPABASE_SETUP.md` | Database setup |
| `WHAT_EACH_SERVICE_DOES.md` | Service explanations (you read this!) |
| `ARCHITECTURE_DIAGRAM.md` | Visual system overview |
| `SYSTEM_COMPLETE.md` | Full feature list |
| `GETTING_STARTED_CHECKLIST.md` | This file |

---

## ✅ Success Criteria

You're ready to launch when:

- [ ] Test user can sign up
- [ ] Test user can upload video
- [ ] Video appears on homepage within 1 minute
- [ ] Video plays smoothly
- [ ] No errors in browser console
- [ ] No errors in Supabase logs
- [ ] R2 storage shows uploaded file
- [ ] Database shows portfolio entry
- [ ] Cost estimate looks correct
- [ ] You understand what each service does

---

## 🆘 Need Help?

### **Check These First:**
1. Browser console (`F12` → Console)
2. Network tab (`F12` → Network)
3. Supabase logs (Dashboard → Logs)
4. Cloudflare logs (Dashboard → Analytics → Logs)

### **Common Debug Steps:**
1. Restart dev server
2. Clear browser cache
3. Check `.env` file
4. Verify all services configured
5. Test with smaller file
6. Try different browser

### **Still Stuck?**
- Read the relevant documentation file
- Check Supabase documentation
- Check Cloudflare R2 documentation
- Review error messages carefully

---

## 🎯 Quick Start (TL;DR)

If you just want to get started fast:

```bash
# 1. Setup (see Phase 1 for details)
- Create Supabase project
- Create R2 bucket
- Add credentials to .env

# 2. Install & Run
npm install
npm run dev

# 3. Test
- Sign up at /signup
- Upload at /submit
- View at /

# Done! 🎉
```

---

## 📈 Next Steps After Launch

Once everything works:

1. **Add More Features:**
   - Search & filter
   - User profiles
   - Comments
   - Likes

2. **Improve Performance:**
   - Add video thumbnails
   - Implement lazy loading
   - Add caching

3. **Marketing:**
   - Share with filmmaker communities
   - Create landing page
   - Add SEO
   - Social media integration

4. **Monetization:**
   - Crowdfunding integration
   - Premium features
   - Paid submissions

---

**🎉 Good luck with your video platform!**

**Remember:** Start small, test thoroughly, then scale up! 🚀
