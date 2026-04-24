# 🔧 Video Upload Troubleshooting Guide

## Quick Diagnostic Steps

### Step 1: Check R2 Configuration
Visit: **`/api/test-r2`**

This will show:
- ✅ Which environment variables are set
- ✅ If R2 client can be created
- ✅ Test key generation

**Expected output:**
```json
{
  "status": "ready",
  "environment": {
    "CLOUDFLARE_ACCOUNT_ID": "✅ Set (1df95eb7...)",
    "R2_ACCESS_KEY_ID": "✅ Set (cfat_rss...)",
    "R2_SECRET_ACCESS_KEY": "✅ Set (hidden)",
    "R2_BUCKET_NAME": "✅ Set (portfolio-videos)",
    "R2_PUBLIC_URL": "✅ Set (https://pub-...)"
  },
  "r2Config": {
    "clientCreated": "✅ R2 client created successfully",
    "keyGeneration": "✅ Key generation works: ..."
  }
}
```

---

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading again
4. Look for error messages

**Common errors you might see:**

#### "R2 configuration error"
**Cause:** Missing environment variables  
**Fix:** Check .env file has all R2 credentials

#### "Failed to upload to R2: Access Denied"
**Cause:** Bucket permissions or wrong credentials  
**Fix:** See "Fix Bucket Permissions" below

#### "Network error"
**Cause:** Connection issue or CORS  
**Fix:** Check bucket CORS settings

---

### Step 3: Check Server Logs
Look in the terminal where your dev server is running for messages like:
```
[Upload] Starting video upload...
[Upload] File received: { name: '...', type: '...', size: ... }
[Upload] Creating R2 client...
[Upload] R2 client created successfully
[Upload] Uploading to R2...
```

If it stops at a certain point, that tells us where the issue is.

---

## 🔑 Most Likely Issues

### Issue 1: Bucket Not Configured for Public Access

Your R2 bucket needs to allow public access for the videos to be viewable.

**Fix:**
1. Go to [Cloudflare Dashboard → R2](https://dash.cloudflare.com/?to=/:account/r2)
2. Click on **"portfolio-videos"** bucket
3. Go to **Settings** tab
4. Under **"Public Access"**, make sure it's enabled
5. Should show: `https://pub-05fd648bde18471d96916d91334d69f0.r2.dev`

---

### Issue 2: Wrong Access Key Permissions

Your R2 Access Keys might not have write permissions.

**Fix:**
1. Go to [Cloudflare Dashboard → R2](https://dash.cloudflare.com/?to=/:account/r2)
2. Click **"Manage R2 API Tokens"**
3. Find your token (starts with `cfat_rss...`)
4. Check permissions:
   - ✅ Must have **"Object Read & Write"**
   - ✅ Applied to bucket: **"portfolio-videos"**

If wrong, create a new token with correct permissions.

---

### Issue 3: CORS Configuration

If uploading from browser, R2 needs CORS headers.

**Fix:**
1. Go to your bucket settings
2. Find **"CORS Policy"** section
3. Add this policy:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

### Issue 4: Bucket Name Mismatch

Check your bucket name is exactly: **`portfolio-videos`**

**Verify in .env:**
```bash
R2_BUCKET_NAME="portfolio-videos"
```

**Verify in Cloudflare:**
- Should match exactly (case-sensitive)

---

## 🩺 Detailed Diagnostics

### Test R2 Connection Manually

Visit: `/api/test-r2` to see:

```json
{
  "status": "ready",  // Should be "ready", not "error"
  "environment": {
    // All should show ✅
  },
  "r2Config": {
    "clientCreated": "✅ ...",  // Important!
    "keyGeneration": "✅ ..."   // Important!
  }
}
```

If you see any ❌ or "error" status, that's your issue.

---

### Manual Upload Test (Advanced)

Try uploading using the AWS SDK directly:

```bash
npm install -g @aws-sdk/client-s3

# Then test upload
node -e "
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://1df95eb7feda5b3b11847c2fe7781163.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'cfat_rssLFe9j2KWohbc6dIEQ0JevC6JHy9BFRUcZRQG2800630d7',
    secretAccessKey: '84861742681e18368acec106f0b2981810326318d53915f3a4a85b4a90f90e54'
  }
});

const command = new PutObjectCommand({
  Bucket: 'portfolio-videos',
  Key: 'test-file.txt',
  Body: Buffer.from('Hello World')
});

client.send(command)
  .then(() => console.log('✅ Upload successful!'))
  .catch(err => console.error('❌ Upload failed:', err.message));
"
```

---

## 🔍 What Error Message Did You See?

### "Failed to upload video"
**Generic error. Check:**
1. Browser console for details
2. Server logs for specifics
3. `/api/test-r2` for config issues

### "R2 configuration error: Missing R2 configuration"
**Missing .env variables**
```bash
# Make sure all these exist in .env:
CLOUDFLARE_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
R2_PUBLIC_URL="..."
```

### "Access Denied" or "403 Forbidden"
**Permissions issue. Fix:**
1. Check Access Key has "Object Read & Write"
2. Check bucket exists
3. Check bucket name matches
4. Recreate Access Key if needed

### "Network error during upload"
**Connection issue. Check:**
1. Internet connection
2. Cloudflare R2 status
3. CORS configuration
4. Firewall/proxy blocking request

### "Invalid response from server"
**Server error. Check:**
1. Server logs in terminal
2. `/api/test-r2` endpoint
3. Restart dev server

---

## 🚀 Step-by-Step Fix Process

### 1. Verify Configuration
```bash
# Check .env file
cat .env | grep R2

# All variables should have values (no empty quotes)
```

### 2. Test R2 Connection
Visit: `/api/test-r2`
- Status should be "ready"
- All checks should show ✅

### 3. Check Bucket Settings
- Public access enabled
- Correct name
- CORS configured

### 4. Verify Access Keys
- Has write permissions
- Applied to correct bucket
- Not expired

### 5. Try Small File First
- Upload a tiny video (< 10MB)
- Check if it works
- If yes, issue is with large files
- If no, issue is with configuration

### 6. Check Browser Network Tab
- Open DevTools → Network
- Filter: "upload-video"
- Try upload
- Check response status and body

---

## 💡 Quick Fixes

### Restart Dev Server
Sometimes helps:
```bash
# Kill and restart
npm run dev
```

Or use the restart button in your development environment.

### Clear Browser Cache
Hard refresh:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Recreate R2 Access Keys
If all else fails:
1. Delete old access keys
2. Create new ones with "Object Read & Write"
3. Update .env with new credentials
4. Restart dev server

---

## 📊 Current Configuration

Based on your .env:

```
✅ Account ID: 1df95eb7feda5b3b11847c2fe7781163
✅ Bucket: portfolio-videos
✅ Public URL: https://pub-05fd648bde18471d96916d91334d69f0.r2.dev
✅ Access Key: cfat_rss... (set)
✅ Secret: *** (hidden but set)
```

All credentials appear to be configured correctly!

---

## 🎯 Next Steps

1. **Visit `/api/test-r2`** - Check if config is valid
2. **Check browser console** - See exact error message
3. **Check server logs** - See where upload fails
4. **Report back** with:
   - Error message from browser
   - Output from `/api/test-r2`
   - Server log messages

Then I can give you a specific fix! 🔧

---

## 🆘 Still Stuck?

Share with me:

1. **Error message** you see in the UI
2. **Browser console output** (F12 → Console)
3. **Server logs** (terminal output)
4. **`/api/test-r2` response**

I'll help you fix it immediately! 😄
