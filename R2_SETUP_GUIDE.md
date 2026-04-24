

# 🚀 Cloudflare R2 Setup Guide

Complete step-by-step guide to set up video uploads using Cloudflare R2.

---

## 📋 What You'll Need

- Cloudflare account (free tier works!)
- 5 minutes of your time
- Your Cloudflare Account ID: `1df95eb7feda5b3b11847c2fe7781163`

---

## Step 1: Access R2 Dashboard

**Direct link:** https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2

Or manually:
1. Log in to Cloudflare Dashboard
2. Click **"R2"** in the left sidebar
3. If prompted, click **"Purchase R2"** (it's free to start!)

---

## Step 2: Create R2 Bucket

1. Click **"Create bucket"** button
2. **Bucket name:** `portfolio-videos` (must be this exact name)
3. **Location:** Choose closest to your users (e.g., "Automatic" or your region)
4. Click **"Create bucket"**

✅ Your bucket is created!

---

## Step 3: Enable Public Access

⚠️ **IMPORTANT:** Videos need to be publicly accessible to display on your site.

1. Click on your **"portfolio-videos"** bucket
2. Go to **"Settings"** tab
3. Scroll to **"Public access"** section
4. Click **"Allow Access"** or **"Connect Domain"**
5. Choose **"R2.dev subdomain"** (free option)
6. Click **"Enable"**

You'll get a public URL like:
```
https://pub-05fd648bde18471d96916d91334d69f0.r2.dev
```

✅ Save this URL - you'll need it in Step 5!

---

## Step 4: Create R2 Access Keys

⚠️ **CRITICAL:** You need **R2 Access Keys**, NOT regular API tokens!

**Common mistake:** Creating an API token (starts with `cfat_`) - this won't work!

### Creating the Correct Keys:

**Direct link:** https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2/api-tokens

1. Click **"Manage R2 API Tokens"** or **"Create API Token"**
2. Look for option to create **"R2 Token"** or **"R2 Access Keys"**
3. **Token name:** `portfolio-videos-access`

4. **Permissions:**
   - Select: **"Object Read & Write"** ✅
   - (NOT "Admin" unless you want that)

5. **Apply to buckets:**
   - Select: **"Apply to specific buckets only"**
   - Choose: ✅ **portfolio-videos**

6. **TTL:** Forever (or 1 year)

7. Click **"Create API Token"**

### ✅ What Success Looks Like:

You should see **TWO keys**:

```
Access Key ID:     A3K5JKLM7BNOP2QRS9T           (20 characters)
Secret Access Key: wxyz123abc456def789...         (40 characters)
```

### ❌ Wrong Keys Look Like:

```
cfat_rssLFe9j2KWohbc6dIEQ0JevC6JHy9BFRUcZRQG2800630d7  (53 characters - TOO LONG!)
```

If you see `cfat_`, you created the wrong type! Go back and look for "R2 Access Keys" or "R2 Token" option.

⚠️ **CRITICAL:** Copy both keys NOW - the secret won't be shown again!

---

## Step 5: Configure Your .env File

Open your `.env` file and add these:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=portfolio-videos
R2_ENDPOINT=https://abc123.r2.cloudflarestorage.com
```

**Replace with your actual values from Steps 5 & 6!**

---

### Step 6: Get Your Account ID

1. Go back to Cloudflare dashboard home
2. Look at the right sidebar
3. Find **"Account ID"**
4. Click to copy it
5. Should look like: `a1b2c3d4e5f6g7h8i9j0`

---

### Step 7: Add to Your App

Open your `.env` file and add these:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=portfolio-videos
R2_ENDPOINT=https://abc123.r2.cloudflarestorage.com
```

**Replace with your actual values from Steps 5 & 6!**

---

### Step 8: Test It!

That's it! Now tell me you're done and I'll test the upload system.

---

## 📝 Quick Checklist

Before you tell me you're done, make sure you have:

- [ ] ✅ Created R2 bucket
- [ ] ✅ Named it (e.g., `portfolio-videos`)
- [ ] ✅ Enabled public access on bucket
- [ ] ✅ Created API token with Read & Write permissions
- [ ] ✅ Copied Access Key ID
- [ ] ✅ Copied Secret Access Key  
- [ ] ✅ Copied R2 endpoint URL
- [ ] ✅ Copied Account ID
- [ ] ✅ Added all values to `.env` file

---

## 🆘 Troubleshooting

### "I don't see R2 in my dashboard"
- Make sure you're logged into Cloudflare
- R2 is under "Storage & Databases" or just "R2"
- Try searching "R2" in the top search bar

### "It's asking for payment info"
- The free tier doesn't require a card
- But you may need to add one to activate (they won't charge)
- Free tier = 10GB storage, unlimited bandwidth

### "I lost my API keys"
- No problem! Delete the old token
- Create a new one
- Copy the new keys

### "Public access won't enable"
- Make sure you're in bucket Settings
- Look for "Public access" or "Bucket access"
- Contact Cloudflare support if stuck (they're fast!)

### "What if I use all 10GB?"
- Very unlikely! 10GB = ~20-50 videos
- If you do: You pay $0.015/GB for additional
- Example: 20GB total = $0.15/month for the extra 10GB

---

## 🎯 What Happens Next

Once you've completed setup:

1. **I'll build the video upload system** (20 mins)
2. **Users can upload videos directly** from their device
3. **Videos automatically upload to your R2 bucket**
4. **You get CDN URLs** for each video
5. **Display in portfolio grid** with play buttons
6. **Unlimited views** - zero bandwidth fees!

---

## 💰 Cost Reminder

**Your setup costs: $0**

**Monthly costs:**
- First 10GB: **FREE**
- 10-50GB: **$0.60/month** (40GB × $0.015)
- 50-100GB: **$1.35/month** (90GB × $0.015)
- Bandwidth: **FREE** (always!)

**Most portfolio sites stay in free tier forever!**

---

## 🚀 Ready to Continue?

Once you've:
1. Created the bucket
2. Got your API credentials
3. Added them to `.env`

Just say **"Done!"** or **"R2 is set up!"** and I'll build the video upload system! 🎉

---

## 📞 Need Help?

**Stuck on a step?**
- Tell me which step
- I'll give more detailed instructions
- Or troubleshoot with you

**Want me to simplify something?**
- Just ask!
- I can break it down further

**Screenshots would help?**
- I can describe exactly what to click
- Walk through any confusing parts

Let's get your video hosting set up! 💪


