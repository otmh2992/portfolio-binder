# 🎬 Transloadit Auto-Convert Setup Guide

## ✅ **What We Just Installed:**

**Transloadit** - Automatic video conversion service
- **Free tier:** 10GB encoding/month (~200 videos)
- **Converts:** ANY format → H.264 MP4
- **Handles:** iPhone MOV, AVI, MKV, ProRes, HEVC - everything!

---

## 📝 **Step 1: Sign Up for Transloadit (FREE)**

### **1. Go to Transloadit:**
👉 **https://transloadit.com/signup/**

### **2. Create free account:**
- No credit card required for free tier
- 10GB encoding/month included

### **3. Verify email**

---

## 🔑 **Step 2: Get Your API Keys**

### **1. After login, go to:**
👉 **https://transloadit.com/c/template-credentials/**

Or navigate: **Dashboard → Credentials**

### **2. Find your credentials:**
You'll see:
```
Auth Key: abc123def456...
Auth Secret: xyz789...
```

### **3. Copy both values** (you'll need them next)

---

## ⚙️ **Step 3: Add Credentials to Your .env File**

### **1. Open your `.env` file**

### **2. Add these lines at the bottom:**
```bash
# Transloadit (Free tier: 10GB/month auto video conversion)
TRANSLOADIT_KEY=your_auth_key_here
TRANSLOADIT_SECRET=your_auth_secret_here
```

### **3. Replace with your actual values:**
```bash
# Example (use YOUR actual keys):
TRANSLOADIT_KEY=abc123def456ghi789
TRANSLOADIT_SECRET=xyz789abc123def456
```

### **4. Save the file**

---

## 🪣 **Step 4: Set Up R2 Storage in Transloadit**

Transloadit needs permission to upload converted videos to your R2 bucket.

### **1. Go to Transloadit Template Credentials:**
👉 **https://transloadit.com/c/template-credentials/**

### **2. Click "Add Credentials"**

### **3. Select "Amazon S3" type** (R2 is S3-compatible)

### **4. Fill in the form:**

```
Name: r2_credentials
Type: Amazon S3

Access Key ID: [Your R2_ACCESS_KEY_ID from .env]
Secret Access Key: [Your R2_SECRET_ACCESS_KEY from .env]
Bucket: portfoliovideos
Region: auto
Endpoint: [Your R2_ENDPOINT from .env]
```

**Where to find these values?**
- Open your `.env` file
- Copy the R2 values you set up earlier

**Example:**
```
Access Key ID: abc123...
Secret Access Key: def456...
Bucket: portfoliovideos
Region: auto
Endpoint: https://1234567890.r2.cloudflarestorage.com
```

### **5. Click "Save Credentials"**

---

## 🔄 **Step 5: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ **Step 6: Test It Out!**

### **1. Go to your submission form:**
http://localhost:3000/

### **2. Try uploading an incompatible video:**
- iPhone MOV file
- AVI file
- Any non-MP4 format

### **3. What happens:**
```
Before: ❌ "Cannot upload this video - convert first"

After: ✅ "Converting video..." 
       → Transloadit converts to H.264
       → Uploads to R2
       → Everyone can watch!
```

---

## 💰 **Free Tier Limits:**

| Metric | Free Tier | What It Means |
|--------|-----------|---------------|
| **Encoding** | 10GB/month | ~200 videos (avg 50MB each) |
| **Storage** | N/A | Uses your R2 (already free) |
| **Bandwidth** | N/A | Uses your R2 (already free) |

**When you exceed 10GB:**
- Conversions will pause
- OR upgrade to paid plan ($49/month for 250GB)

---

## 📊 **How to Monitor Usage:**

### **Check your Transloadit dashboard:**
👉 **https://transloadit.com/c/billing/**

You'll see:
- GB used this month
- Videos processed
- Remaining quota

---

## 🎯 **What Happens Now:**

### **Before (Strict Blocking):**
```
User uploads iPhone MOV
→ ❌ "Cannot upload - convert to MP4 first"
→ User must manually convert
→ 2-3 minutes extra work
```

### **After (Auto-Convert):**
```
User uploads iPhone MOV
→ ✅ "Converting video..."
→ Transloadit converts to H.264 MP4
→ Uploads to R2
→ 30 seconds - 2 minutes (automatic)
→ User sees: "Upload complete!"
```

---

## 🔧 **Supported Formats (Automatic Conversion):**

Transloadit can convert:
- ✅ **MOV** (iPhone, QuickTime, ProRes)
- ✅ **AVI** (old format)
- ✅ **MKV** (OBS, streaming software)
- ✅ **WMV** (Windows Media)
- ✅ **FLV** (Flash video)
- ✅ **HEVC/H.265** (any container)
- ✅ **WebM** (already streamable, but can standardize)
- ✅ **3GP** (old mobile)
- ✅ **MPEG** (various)
- ✅ **ProRes** (professional)
- ✅ **DNxHD** (professional)

**Basically: ANYTHING → H.264 MP4**

---

## ⚠️ **Important Notes:**

### **Conversion Time:**
- Short video (1 min): ~30 seconds
- Medium video (5 min): ~1-2 minutes
- Long video (10 min): ~2-4 minutes

### **File Size Changes:**
- HEVC (50MB) → H.264 (~100MB) - Larger but compatible
- AVI (200MB) → H.264 (~80MB) - Usually smaller
- MOV/ProRes (1GB) → H.264 (~200MB) - Much smaller

### **User Experience:**
- User uploads file
- Sees progress bar
- Gets notification when conversion complete
- Video appears in portfolio

---

## 🎨 **Next Steps After Setup:**

Once you've added your Transloadit keys and restarted:

1. **I'll update the VideoUpload component** to use Transloadit
2. **Remove strict blocking** for MOV/AVI files
3. **Show conversion progress** to users
4. **Handle webhook notifications** when conversion completes

---

## ❓ **Troubleshooting:**

### **"Invalid credentials" error:**
- Double-check TRANSLOADIT_KEY and TRANSLOADIT_SECRET in `.env`
- Make sure there are no extra spaces
- Restart dev server after changing `.env`

### **"Cannot store to R2" error:**
- Check R2 credentials are set up in Transloadit dashboard
- Name must be exactly: `r2_credentials`
- Endpoint must include `https://`

### **Free tier exceeded:**
- Check usage at: https://transloadit.com/c/billing/
- Either wait for next month or upgrade to paid

---

## 🚀 **Ready to Continue:**

Once you've completed steps 1-5 above, tell me and I'll:

1. ✅ Update VideoUpload component to use Transloadit
2. ✅ Remove format restrictions (accept MOV, AVI, etc.)
3. ✅ Add conversion progress UI
4. ✅ Handle webhook for completion notification

---

## 📋 **Quick Checklist:**

- [ ] Signed up at transloadit.com
- [ ] Got Auth Key and Auth Secret
- [ ] Added keys to `.env` file
- [ ] Created R2 credentials in Transloadit dashboard (named `r2_credentials`)
- [ ] Restarted dev server
- [ ] Ready for me to integrate! 🎬

**Let me know when you're ready!** 😊
