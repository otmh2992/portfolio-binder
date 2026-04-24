# 🔑 Fix: Creating Correct R2 Access Keys

## The Problem
You created an **API Token** (`cfat_...`) instead of **R2 Access Keys**.

API Tokens are 53 characters, but R2 needs AWS-style access keys (20 characters).

---

## ✅ Solution: Create R2 Access Keys (Not API Token)

### Step 1: Go to R2 Access Keys Page
**Direct link:** https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2/api-tokens

### Step 2: Create R2 Access Keys
1. Look for a button that says **"Create API Token"** or **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. You'll see two options:
   - ❌ **API Token** (wrong - creates cfat_... tokens)
   - ✅ **R2 Token** or **"Use R2 Token"** (correct!)

### Step 3: Configure Permissions
When creating the token:

**Name:** `portfolio-videos-access`

**Permissions:**
- Select: **"Object Read & Write"** or **"Admin Read & Write"**

**Apply to specific buckets:**
- Select: **"Apply to specific buckets only"**
- Choose: **"portfolio-videos"**

**TTL (Expiration):**
- Choose: **"Forever"** or **"1 year"**

### Step 4: Create and Save Keys
Click **"Create API Token"**

You'll see **TWO keys** (this is what we need!):

```
Access Key ID:     abc123def456ghi789jk  (20 characters)
Secret Access Key: xyz789abc123def456ghi789jkl012mno345pqr678  (40 characters)
```

⚠️ **IMPORTANT:** Copy both keys immediately - the secret won't be shown again!

---

## Alternative: Use the R2 Dashboard Directly

If the above doesn't work, try this path:

1. Go to your R2 Overview: https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2
2. In the right sidebar or top menu, look for **"R2 API Tokens"**
3. Click **"Create API Token"**
4. Make sure you're creating **R2-specific credentials**, not general API tokens

The correct keys should look like:
```
Access Key ID: 20 characters (letters and numbers)
Secret Key: 40 characters (letters and numbers)
```

NOT like:
```
cfat_rssLFe9j2KWohbc6dIEQ0JevC6JHy9BFRUcZRQG2800630d7  ❌ (Too long!)
```

---

## 📝 Update Your .env File

Once you have the correct keys, update your `.env`:

```bash
# Replace these lines:
R2_ACCESS_KEY_ID="your-20-character-access-key-here"
R2_SECRET_ACCESS_KEY="your-40-character-secret-key-here"
```

The rest stays the same:
```bash
CLOUDFLARE_ACCOUNT_ID="1df95eb7feda5b3b11847c2fe7781163"
R2_BUCKET_NAME="portfolio-videos"
R2_ENDPOINT="https://1df95eb7feda5b3b11847c2fe7781163.r2.cloudflarestorage.com"
R2_PUBLIC_URL="https://pub-05fd648bde18471d96916d91334d69f0.r2.dev"
```

---

## 🔄 After Updating

1. **Save the `.env` file**
2. **Restart your dev server** (might happen automatically)
3. **Try uploading again**
4. Should work! ✨

---

## 🤔 Still Can't Find R2 Access Keys Option?

Cloudflare recently changed their UI. Try these locations:

### Location 1: R2 Overview Page
https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2

Look for:
- "Manage R2 API Tokens" button
- "R2 API Tokens" in sidebar
- "Create API Token" button

### Location 2: API Tokens Section
https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2/api-tokens

Should show existing tokens and option to create new ones.

### Location 3: Inside Bucket Settings
1. Go to: https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2/buckets/portfolio-videos
2. Click **"Settings"** tab
3. Look for **"API Tokens"** or **"Access Keys"** section

---

## 📸 What You're Looking For

When creating, you should see something like:

```
┌─────────────────────────────────────────┐
│ Create R2 API Token                     │
├─────────────────────────────────────────┤
│                                         │
│ Token name: portfolio-videos-access     │
│                                         │
│ Permissions:                            │
│ ○ Admin Read & Write                    │
│ ● Object Read & Write  ← Select this   │
│ ○ Object Read                           │
│                                         │
│ Apply to:                               │
│ ● Specific buckets only                 │
│   ✓ portfolio-videos                    │
│                                         │
│ TTL: Forever                            │
│                                         │
│        [Cancel]  [Create Token]         │
└─────────────────────────────────────────┘
```

---

## ✅ Success Looks Like

After creation, you'll see:

```
✅ API Token Created Successfully!

Access Key ID: A3K5JKLM7BNOP2QRS9T
Secret Access Key: wxyz123abc456def789ghi012jkl345mno678pqr901

⚠️ Save these credentials now - the secret won't be shown again!

[Download .csv]  [Done]
```

Copy both values into your `.env` file!

---

## 🆘 Need Help?

Let me know if:
1. You can't find where to create R2 Access Keys
2. You see the keys but they're still 53 characters
3. You get a different error after updating

I'll help you through it! 😊
