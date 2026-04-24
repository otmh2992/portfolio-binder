# 🎬 Video Upload System - Complete Setup Guide

## 🎯 What We Built

A complete video upload system that allows filmmakers to:
- Upload large video files (up to 5GB)
- Track upload progress in real-time
- Automatically save portfolio entries to Supabase
- Stream videos efficiently from Cloudflare R2

---

## 🏗️ System Architecture

```
USER (Browser)
  ↓
REACT COMPONENT (VideoUpload.tsx)
  ↓
ASTRO API (/api/upload-video) - Gets presigned URL
  ↓
CLOUDFLARE R2 - Direct upload from browser
  ↓
ASTRO API (/api/submit-portfolio) - Saves metadata
  ↓
SUPABASE DATABASE - Stores portfolio info
  ↓
HOMEPAGE - Displays videos in grid
```

---

## 📋 Prerequisites

Before you can use the video upload system, you need:

### 1. **Cloudflare R2 Storage**
   - Cloudflare account
   - R2 bucket created
   - Access keys generated

### 2. **Supabase Database**
   - Supabase project created
   - `portfolios` table exists
   - User authentication working

---

## 🔧 Environment Variables Required

Add these to your `.env` file:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_r2_access_key_here
R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 📊 Database Schema

Make sure your `portfolios` table has these columns:

```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
```

---

## 🎨 Files Created

### **1. React Component**
`src/components/VideoUpload.tsx`
- Upload form with title, description, category
- File picker with validation
- Real-time progress bar
- Success/error messages

### **2. API Endpoints**

**`src/pages/api/upload-video.ts`**
- Generates presigned R2 upload URL
- Validates user authentication
- Creates unique filenames
- Returns video/thumbnail URLs

**`src/pages/api/submit-portfolio.ts`**
- Saves portfolio metadata to Supabase
- Links video to user account
- Creates unique slug for portfolio item

### **3. Submit Page**
`src/pages/submit.astro`
- Full-page upload interface
- Submission guidelines
- Link back to gallery

### **4. Navigation Update**
`src/components/NavBar.tsx`
- Added "Submit Work" button
- Always visible to all users

---

## 🚀 How to Use

### **For Users (Filmmakers):**

1. **Navigate to Submit Page**
   - Click "Submit Work" button in navbar
   - Or go directly to `/submit`

2. **Fill Out Form**
   - **Title** (required): Name of your work
   - **Description** (optional): Tell us about your project
   - **Category** (required): Select from dropdown
   - **Video File** (required): Choose your video

3. **Upload**
   - Click "Upload Video" button
   - Watch progress bar (shows percentage)
   - Wait for success message

4. **View Your Work**
   - Video automatically appears on homepage
   - Accessible at `/filmmaker/your-username`

---

## 🔒 How It Works (Technical)

### **Step 1: User Submits Form**
```typescript
// VideoUpload.tsx validates:
- File is a video (checks MIME type)
- File under 5GB
- Title and category provided
```

### **Step 2: Request Upload URL**
```typescript
// POST /api/upload-video
- Checks user is logged in (via Supabase Auth)
- Generates unique filename (timestamp + random)
- Creates presigned R2 URL (valid 1 hour)
- Returns: uploadUrl, videoUrl, thumbnailUrl, slug
```

### **Step 3: Upload Directly to R2**
```typescript
// Browser uploads file via XMLHttpRequest
- Direct upload to Cloudflare R2
- Tracks progress with xhr.upload.progress
- No file goes through your server (saves bandwidth!)
```

### **Step 4: Save to Database**
```typescript
// POST /api/submit-portfolio
- Saves metadata to Supabase portfolios table
- Links video URL to user ID
- Creates unique slug for URL
```

### **Step 5: Display on Homepage**
```typescript
// PortfolioGridSupabase.tsx fetches from Supabase
- Queries portfolios table
- Displays in grid layout
- Video player loads from R2
```

---

## 📁 R2 Bucket Structure

Your R2 bucket will organize files like this:

```
your-bucket/
├── videos/
│   ├── 1713709200000-a3f9k2-my-short-film.mp4
│   ├── 1713709500000-b8x1m4-documentary.mov
│   └── ...
└── thumbs/
    ├── 1713709200000-a3f9k2-my-short-film.jpg
    ├── 1713709500000-b8x1m4-documentary.jpg
    └── ...
```

**Filename Format:** `timestamp-random-sanitized-title.ext`

---

## 🎥 Supported Video Formats

- **MP4** (recommended - best compatibility)
- **MOV** (Apple format)
- **AVI** (older format)
- **WebM** (web-optimized)
- Any format with MIME type starting with `video/`

---

## ⚙️ Configuration Options

### **Change Max File Size**

In `VideoUpload.tsx`, line 21:
```typescript
const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
// Change to 10GB:
const maxSize = 10 * 1024 * 1024 * 1024;
```

### **Change Upload URL Expiration**

In `upload-video.ts`, line 105:
```typescript
const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// 3600 = 1 hour, change to 2 hours:
const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 7200 });
```

### **Add More Categories**

In `VideoUpload.tsx`, lines 76-83:
```typescript
<SelectContent>
  <SelectItem value="short-film">Short Film</SelectItem>
  <SelectItem value="documentary">Documentary</SelectItem>
  {/* Add your own: */}
  <SelectItem value="tutorial">Tutorial</SelectItem>
  <SelectItem value="vlog">Vlog</SelectItem>
</SelectContent>
```

---

## 🐛 Troubleshooting

### **Problem: "Missing R2 configuration"**
**Solution:** Check your `.env` file has all R2 variables

### **Problem: "Unauthorized. Please log in."**
**Solution:** User must be logged in to upload. Redirect to `/login`

### **Problem: Upload fails at 100%**
**Solutions:**
1. Check R2 bucket CORS settings allow PUT requests
2. Verify presigned URL hasn't expired
3. Check R2 storage quota

### **Problem: Video doesn't appear on homepage**
**Solution:** 
1. Check Supabase `portfolios` table for the entry
2. Verify `video_url` is correct
3. Clear browser cache

### **Problem: Progress bar stuck**
**Solution:** 
1. Check network connection
2. Try smaller file first
3. Check browser console for errors

---

## 🔐 Security Features

✅ **User Authentication** - Only logged-in users can upload
✅ **Presigned URLs** - Temporary upload links (1 hour expiration)
✅ **Direct Upload** - Files never touch your server
✅ **File Validation** - Type and size checked before upload
✅ **Unique Filenames** - Prevents overwrites and conflicts
✅ **Database Links** - Videos tied to user accounts

---

## 💰 Cost Estimate

**For 100 filmmaker uploads (500MB average each):**

| Service | Usage | Cost |
|---------|-------|------|
| Cloudflare R2 Storage | 50GB stored | ~$0.75/month |
| R2 Class B Operations | 100 uploads | ~$0.001 |
| R2 Egress | Free (first 10GB/month) | $0.00 |
| Supabase Database | 100 rows | Free tier |
| **Total** | | **< $1/month** |

---

## 🎯 Next Steps

### **Immediate:**
1. ✅ Video upload working
2. ⏳ Add thumbnail generation (optional)
3. ⏳ Add video preview before upload
4. ⏳ Add drag-and-drop file upload

### **Future Enhancements:**
- Video transcoding (convert to web-optimized formats)
- Multiple file upload
- Edit uploaded videos
- Delete videos
- Video analytics (views, plays)
- Comments on videos

---

## 📖 Related Documentation

- `SUPABASE_SETUP.md` - Database setup
- `R2_SETUP_GUIDE.md` - Cloudflare R2 configuration
- `PHASE_1_SETUP_GUIDE.md` - Overall system architecture

---

## ✅ Testing Checklist

Before going live:

- [ ] Upload small video (< 10MB) - Should complete fast
- [ ] Upload large video (> 100MB) - Check progress bar works
- [ ] Try without login - Should show "Unauthorized"
- [ ] Upload with wrong file type (e.g., .txt) - Should reject
- [ ] Upload file > 5GB - Should show error
- [ ] Check video appears on homepage after upload
- [ ] Check video plays correctly in browser
- [ ] Verify video URL in Supabase database
- [ ] Test on different browsers (Chrome, Firefox, Safari)

---

## 🆘 Getting Help

If you encounter issues:

1. Check browser console for errors (`F12` → Console tab)
2. Check Supabase logs (Dashboard → Logs)
3. Check R2 bucket exists and has correct permissions
4. Verify all environment variables are set
5. Test with smaller file first

---

**🎉 You're ready to accept filmmaker submissions!**
