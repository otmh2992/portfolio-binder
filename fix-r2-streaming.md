# Fix R2 Video Streaming (Download Issue)

## 🔍 The Problem

Videos are downloading instead of streaming because Cloudflare R2 has a **bucket-level setting** that overrides the `Content-Disposition` header we set in code.

## ✅ The Solution

You need to configure your R2 bucket to allow streaming by default.

---

## 📋 Steps to Fix:

### 1️⃣ Go to Cloudflare R2 Bucket Settings
https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2/buckets/portfoliovideos/settings

### 2️⃣ Enable Public Access (if not already)
- Look for **"Public Access"** section
- Make sure **"Allow Access"** is enabled
- You should see your public URL: `pub-05fd648bde18471d96916d91334d69f0.r2.dev`

### 3️⃣ Set Up a Custom Domain (This is the KEY!)

Unfortunately, R2's `.r2.dev` subdomain has limitations. The best solution is to use a **custom domain** or **Cloudflare Workers**.

---

## 🚀 Quick Fix Option 1: Use Cloudflare Workers

Create a Worker that adds the correct headers:

1. Go to **Workers & Pages** in Cloudflare
2. Create a new Worker
3. Use this code:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const objectKey = url.pathname.slice(1);
    
    // Fetch from R2
    const object = await env.R2_BUCKET.get(objectKey);
    
    if (!object) {
      return new Response('Not Found', { status: 404 });
    }
    
    // Return with streaming headers
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata.contentType || 'video/mp4',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=31536000',
      }
    });
  }
}
```

4. Bind your R2 bucket to the worker
5. Add a custom route or use the worker URL

---

## 🎯 Quick Fix Option 2: Update Bucket Transform Rules

1. Go to your R2 bucket settings
2. Look for **"Transform Rules"** or **"HTTP Headers"**
3. Add a header rule:
   - **Header Name**: `Content-Disposition`
   - **Value**: `inline`
   - **Match**: All objects (`*` or `*.mp4`, `*.mov`, `*.webm`)

---

## 💡 Simplest Solution for Now

Since Cloudflare R2's public URL doesn't easily allow header modification without Workers, here are your options:

### Option A: Accept downloads for now
Keep using R2 as-is, and videos will download

### Option B: Use Cloudflare Stream instead
- Designed specifically for video streaming
- Handles all encoding and streaming automatically
- Costs about $5/1000 minutes stored + $1/1000 minutes delivered

### Option C: Set up a Cloudflare Worker (recommended)
- Free tier: 100,000 requests/day
- Adds proper streaming headers
- Works with your existing R2 bucket

---

## 🔧 What I Recommend

Let's set up a simple Cloudflare Worker to proxy your R2 videos with the correct headers. This is:
- ✅ Free (within generous limits)
- ✅ Fast (Cloudflare's edge network)
- ✅ Easy to set up (5 minutes)

Would you like me to guide you through setting up the Worker?
