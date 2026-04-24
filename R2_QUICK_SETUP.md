# ⚡ Cloudflare R2 - 5 Minute Setup Guide

This guide will help you set up Cloudflare R2 for video storage.

---

## 🎯 What is R2?

Cloudflare R2 is **object storage** (like AWS S3) but **10x cheaper** with **zero egress fees**.

**Perfect for:** Videos, images, large files

---

## 📋 Step-by-Step Setup

### **1. Create Cloudflare Account**

1. Go to https://cloudflare.com
2. Click "Sign Up" (free account works!)
3. Verify your email

---

### **2. Create R2 Bucket**

1. In Cloudflare Dashboard, click **"R2"** in left sidebar
2. Click **"Create bucket"**
3. Enter bucket name: `portfolio-videos` (or any name)
4. Click **"Create bucket"**

📝 **Note:** Bucket names must be unique globally and lowercase

---

### **3. Get Access Keys**

1. In R2 dashboard, click **"Manage R2 API Tokens"**
2. Click **"Create API token"**
3. Configure:
   - **Token name:** `portfolio-app`
   - **Permissions:** Object Read & Write
   - **TTL:** Forever (or set expiration)
4. Click **"Create API Token"**
5. **COPY THESE VALUES** (you'll only see them once!):
   - Access Key ID
   - Secret Access Key
   - Account ID (at top of page)

---

### **4. Get Public URL**

Your R2 public URL format:
```
https://[bucket-name].[account-id].r2.cloudflarestorage.com
```

**Example:**
```
https://portfolio-videos.abc123def456.r2.cloudflarestorage.com
```

To find your exact URL:
1. Go to your bucket settings
2. Look for "Public URL" or "Bucket endpoint"
3. Or construct it using: `bucket-name` + `account-id`

---

### **5. Enable Public Access (Important!)**

1. Go to your bucket settings
2. Click **"Settings"** tab
3. Find **"Public access"** section
4. Click **"Allow Access"**
5. Choose **"Connect Domain"** or use default R2.dev domain

**For testing:** You can use the R2.dev subdomain (free)

---

### **6. Configure CORS (Critical for Uploads!)**

1. In bucket settings, find **"CORS policy"**
2. Add this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

Replace `yourdomain.com` with your actual domain.

---

### **7. Add to .env File**

Update your `.env` file with the values you copied:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=abc123def456
R2_ACCESS_KEY_ID=your_access_key_here
R2_SECRET_ACCESS_KEY=your_secret_key_here
R2_BUCKET_NAME=portfolio-videos
R2_PUBLIC_URL=https://portfolio-videos.abc123def456.r2.cloudflarestorage.com
```

---

### **8. Test Connection**

Run this test to verify your setup works:

```bash
npm run dev
```

Then visit `/api/test-r2` in your browser. You should see:
```json
{
  "success": true,
  "message": "R2 connection successful"
}
```

---

## 🔐 Security Best Practices

✅ **DO:**
- Use separate API tokens for dev and production
- Set API token expiration dates
- Restrict permissions to only what's needed
- Use CORS to restrict upload domains

❌ **DON'T:**
- Share your secret access key
- Commit `.env` file to git
- Use same token for multiple projects
- Make bucket fully public without CORS

---

## 💰 Pricing (as of 2024)

| Operation | Price | Notes |
|-----------|-------|-------|
| Storage | $0.015/GB/month | ~$0.75 for 50GB |
| Class A Operations (uploads) | $4.50 per million | ~$0.001 for 100 uploads |
| Class B Operations (reads) | $0.36 per million | Basically free |
| Egress (downloads) | **FREE** | 🎉 No charges! |

**Free Tier:**
- 10 GB storage/month forever
- 1 million Class A operations
- 10 million Class B operations

**Real Example:**
100 filmmakers upload 500MB videos = 50GB storage
- **Cost:** ~$0.75/month
- **AWS S3 equivalent:** ~$15/month + egress fees

---

## 📁 Bucket Structure Best Practices

Organize your files with prefixes (folders):

```
your-bucket/
├── videos/
│   ├── original/
│   │   └── user123-film-2024.mp4
│   └── transcoded/
│       └── user123-film-2024-720p.mp4
├── thumbs/
│   └── user123-film-2024.jpg
└── images/
    └── user123-avatar.jpg
```

**Benefits:**
- Easy to manage
- Can set different access rules per "folder"
- Simple to backup specific types

---

## 🐛 Common Issues

### **Problem: "Access Denied" errors**
**Solution:** 
1. Check API token has correct permissions
2. Verify CORS settings include your domain
3. Make sure bucket public access is enabled

### **Problem: CORS errors in browser**
**Solution:**
1. Add your domain to CORS AllowedOrigins
2. Include `http://localhost:3000` for development
3. Restart your dev server after CORS changes

### **Problem: Can't find Account ID**
**Solution:**
1. Go to R2 dashboard
2. Look at top right corner
3. Or check URL: `dash.cloudflare.com/[ACCOUNT_ID]/r2`

### **Problem: Upload succeeds but file not accessible**
**Solution:**
1. Check public access is enabled
2. Verify R2_PUBLIC_URL in .env is correct
3. Try accessing file directly in browser

---

## 🔄 Alternative: Custom Domain

Instead of long R2 URLs, use your own domain:

1. In Cloudflare Dashboard → **Domains**
2. Add domain (e.g., `cdn.yourdomain.com`)
3. In R2 bucket → **Settings** → **Custom Domains**
4. Click **"Connect Domain"**
5. Select your domain
6. Update `.env`:

```env
R2_PUBLIC_URL=https://cdn.yourdomain.com
```

**Benefits:**
- Shorter URLs
- Better branding
- Free SSL included

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] R2 bucket created
- [ ] API token created with Read & Write permissions
- [ ] All credentials in `.env` file
- [ ] CORS policy added with your domains
- [ ] Public access enabled on bucket
- [ ] Test upload works from your app
- [ ] Test file is accessible via public URL
- [ ] Video plays in browser

---

## 🚀 Next Steps

Once R2 is set up:

1. ✅ Test video upload from `/submit` page
2. ✅ Verify video appears on homepage
3. ⏳ (Optional) Set up custom domain
4. ⏳ (Optional) Enable automatic backups
5. ⏳ (Optional) Set up lifecycle rules (auto-delete old files)

---

## 📚 Official Documentation

- [R2 Docs](https://developers.cloudflare.com/r2/)
- [R2 API Reference](https://developers.cloudflare.com/r2/api/s3/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)

---

## 🆘 Need Help?

1. Check Cloudflare R2 Logs (Dashboard → Logs)
2. Test with AWS S3 client tools (R2 is S3-compatible)
3. Verify credentials with `aws s3 ls` command

---

**🎉 R2 is ready! Now you can store videos cheaply and stream them fast!**
