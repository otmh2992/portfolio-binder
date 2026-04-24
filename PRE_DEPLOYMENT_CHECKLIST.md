# ✅ Pre-Deployment Checklist

Before running `wrangler deploy`, make sure you've completed these steps:

---

## 🔐 **1. Cloudflare Account Setup**

- [ ] Logged into Cloudflare Dashboard
- [ ] Verified Account ID: `1df95eb7feda5b3b11847c2fe7781163`
- [ ] R2 bucket `portfoliovideos` exists and is accessible
- [ ] Domain `planzzz.com` is added to Cloudflare

---

## 🗄️ **2. Supabase Database Setup**

- [ ] Logged into Supabase Dashboard
- [ ] Project `ljlmsnqdtwhrrdbxgptz` is active
- [ ] Database tables created:
  - [ ] `users` table
  - [ ] `portfolios` table
  - [ ] `profile_images` table (if using)
- [ ] Row Level Security (RLS) policies enabled
- [ ] Authentication enabled (email/password)

---

## 🔑 **3. Environment Variables Collected**

- [ ] `SUPABASE_URL`: `https://ljlmsnqdtwhrrdbxgptz.supabase.co`
- [ ] `SUPABASE_ANON_KEY`: `sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI`
- [ ] `CLOUDFLARE_ACCOUNT_ID`: `1df95eb7feda5b3b11847c2fe7781163`
- [ ] `R2_BUCKET_NAME`: `portfoliovideos`
- [ ] `R2_ACCESS_KEY_ID`: `2fd207bd802c6b213eddd3cd2a5eb740`
- [ ] `R2_SECRET_ACCESS_KEY`: `56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77`
- [ ] `TMDB_API_KEY`: `1a0bcc84947a194003b9185b4da517ea`

---

## 💻 **4. Local Development Tools**

- [ ] Node.js installed (v18+ recommended)
- [ ] npm installed
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Logged into Wrangler (`wrangler login`)

---

## 📦 **5. Project Build**

- [ ] Run `npm install` (if needed)
- [ ] Run `npm run build` successfully
- [ ] No critical errors in build output
- [ ] `dist/` folder created with compiled files

---

## 🔒 **6. Secrets Configuration**

Run these commands and verify success:

```bash
wrangler secret put SUPABASE_ANON_KEY
# Paste: sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI

wrangler secret put R2_ACCESS_KEY_ID
# Paste: 2fd207bd802c6b213eddd3cd2a5eb740

wrangler secret put R2_SECRET_ACCESS_KEY
# Paste: 56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77

wrangler secret put TMDB_API_KEY
# Paste: 1a0bcc84947a194003b9185b4da517ea
```

- [ ] All 4 secrets added successfully
- [ ] Verify: `wrangler secret list` shows 4 secrets

---

## 🌐 **7. Domain Configuration**

- [ ] `planzzz.com` DNS points to Cloudflare nameservers
- [ ] Domain is active in Cloudflare dashboard
- [ ] SSL/TLS certificate is active (Auto for Cloudflare domains)

---

## 🧪 **8. Optional: KV Namespace (for sessions)**

If you want to use KV for session storage:

```bash
# Create KV namespace
wrangler kv:namespace create "SESSION"

# Copy the ID from output and add to wrangler.toml:
# [[kv_namespaces]]
# binding = "SESSION"
# id = "your_kv_namespace_id_here"
```

- [ ] KV namespace created (optional)
- [ ] Added to `wrangler.toml` (optional)

---

## 📋 **9. Configuration Files Review**

Check these files exist and are correct:

- [ ] `wrangler.toml` - Worker configuration
  - Account ID matches
  - Bucket name is correct
  - R2 binding is set
  
- [ ] `.dev.vars` - Local dev variables
  - Contains all 7 environment variables
  - File is in `.gitignore`
  
- [ ] `astro.config.mjs` - Astro config
  - `base: '/portfolio-binder'` is removed (deploying to root)
  - `output: 'server'` is set
  - `adapter: cloudflare()` is configured

---

## 🚀 **10. Ready to Deploy!**

If ALL boxes above are checked, you're ready to deploy:

```bash
wrangler deploy
```

After deployment:

```bash
# Add custom domain
wrangler domains add planzzz.com
```

---

## 🎯 **Post-Deployment Verification**

After running `wrangler deploy`, check:

- [ ] Worker URL provided (e.g., `portfolio-binder.your-account.workers.dev`)
- [ ] Visit worker URL - homepage loads
- [ ] Visit `planzzz.com` - homepage loads (after domain added)
- [ ] Test signup - creates user in Supabase
- [ ] Test login - authenticates successfully
- [ ] Test film selection - shows 5 films
- [ ] Test portfolio upload - saves to R2 bucket
- [ ] Check Cloudflare dashboard - worker is active
- [ ] Check Supabase dashboard - users are being created

---

## ⚠️ **Common Issues & Fixes**

### **Issue: "Invalid binding `SESSION`"**
**Fix:** Add KV namespace (step 8) or ignore (sessions will use cookies)

### **Issue: "Failed to publish"**
**Fix:** 
```bash
wrangler whoami  # Verify logged in
wrangler login   # Re-authenticate if needed
```

### **Issue: "R2 bucket not found"**
**Fix:** Verify bucket name in Cloudflare R2 dashboard matches `wrangler.toml`

### **Issue: "Secrets not found"**
**Fix:**
```bash
wrangler secret list  # Check what's set
wrangler secret put SECRET_NAME  # Re-add missing secrets
```

### **Issue: Domain not routing**
**Fix:** Wait 5-10 minutes for DNS propagation, verify domain is on Cloudflare nameservers

---

## 📊 **Deployment Timeline**

**Total time: ~10-15 minutes**

1. Install Wrangler: 1-2 min
2. Login & verify: 1 min
3. Set secrets: 2-3 min
4. Build project: 1-2 min
5. Deploy: 1-2 min
6. Add domain: 1-2 min
7. Verify: 2-3 min

---

## ✅ **All Set?**

If you've checked all boxes above, run:

```bash
wrangler deploy
```

**Let's launch! 🚀**

---

*Checklist last updated: Migration to Cloudflare complete*
