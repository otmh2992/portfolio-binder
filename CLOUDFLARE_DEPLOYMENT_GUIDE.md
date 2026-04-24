# 🚀 Cloudflare Deployment Guide for Portfolio Binder

## ✅ Prerequisites Completed
- ✅ Supabase account and database configured
- ✅ Cloudflare account with R2 bucket (`portfoliovideos`)
- ✅ Domain: `planzzz.com` connected to Cloudflare
- ✅ All environment variables collected

---

## 📋 Deployment Steps

### **STEP 1: Install Wrangler CLI**

Open your terminal and run:

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

---

### **STEP 2: Login to Cloudflare**

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

---

### **STEP 3: Set Production Secrets**

These sensitive keys should NEVER be committed to git. Set them using Wrangler:

```bash
wrangler secret put SUPABASE_ANON_KEY
```
When prompted, paste: `sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI`

```bash
wrangler secret put R2_ACCESS_KEY_ID
```
When prompted, paste: `2fd207bd802c6b213eddd3cd2a5eb740`

```bash
wrangler secret put R2_SECRET_ACCESS_KEY
```
When prompted, paste: `56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77`

```bash
wrangler secret put TMDB_API_KEY
```
When prompted, paste: `1a0bcc84947a194003b9185b4da517ea`

---

### **STEP 4: Build the Project**

```bash
npm run build
```

This compiles your Astro site for Cloudflare Workers.

---

### **STEP 5: Deploy to Cloudflare Workers**

```bash
wrangler deploy
```

This will:
- Upload your built application
- Configure environment variables
- Set up R2 bucket bindings
- Deploy to Cloudflare's global network

---

### **STEP 6: Configure Custom Domain**

After deployment, you'll get a `*.workers.dev` URL (e.g., `portfolio-binder.your-account.workers.dev`)

To use your custom domain (`planzzz.com`):

#### **Option A: Via Cloudflare Dashboard**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Workers & Pages**
3. Find your deployed worker (`portfolio-binder`)
4. Click **Settings** → **Domains & Routes**
5. Click **Add Custom Domain**
6. Enter: `planzzz.com`
7. Click **Add Domain**

#### **Option B: Via Wrangler CLI**
```bash
wrangler domains add planzzz.com
```

---

### **STEP 7: Verify Deployment**

Visit your site:
- Custom domain: `https://planzzz.com`
- Worker URL: `https://portfolio-binder.your-account.workers.dev`

Check:
- ✅ Homepage loads
- ✅ Portfolio grid displays
- ✅ Login/Signup works
- ✅ Film selection works
- ✅ NavBar shows correct links

---

## 🔧 Troubleshooting

### **Issue: Build Fails**
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

### **Issue: Environment Variables Not Working**
```bash
# List all secrets
wrangler secret list

# Re-add a specific secret
wrangler secret put VARIABLE_NAME
```

### **Issue: R2 Bucket Not Accessible**
Check your R2 bucket permissions:
1. Go to Cloudflare Dashboard → R2
2. Click on `portfoliovideos` bucket
3. Verify public access settings (should allow read for public URLs)

### **Issue: Domain Not Routing**
1. Check DNS settings in Cloudflare
2. Ensure `planzzz.com` is pointing to Cloudflare nameservers
3. Wait 5-10 minutes for DNS propagation

---

## 🔄 Updating the Site

After making code changes:

```bash
# 1. Build the updated code
npm run build

# 2. Deploy the update
wrangler deploy
```

Changes will be live within seconds!

---

## 📊 Monitoring

View logs and analytics:

```bash
# Real-time logs
wrangler tail

# View analytics in dashboard
# Go to: Cloudflare Dashboard → Workers & Pages → portfolio-binder → Analytics
```

---

## 🛡️ Security Checklist

- ✅ `.dev.vars` is in `.gitignore` (never commit secrets!)
- ✅ All sensitive keys stored as Wrangler secrets
- ✅ R2 bucket has proper CORS configuration
- ✅ Supabase Row Level Security (RLS) enabled

---

## 📝 Important Files

- `wrangler.toml` - Cloudflare Workers configuration
- `.dev.vars` - Local development secrets (NEVER commit!)
- `astro.config.mjs` - Astro configuration
- `src/lib/base-url.ts` - URL routing configuration

---

## 🎉 You're Ready!

Your Portfolio Binder app is now configured for Cloudflare deployment!

**Next Steps:**
1. Run `wrangler login`
2. Set secrets with `wrangler secret put`
3. Build with `npm run build`
4. Deploy with `wrangler deploy`
5. Add custom domain `planzzz.com`

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Wrangler logs: `wrangler tail`
3. Check Cloudflare dashboard for errors
4. Verify all secrets are set: `wrangler secret list`

**Common Commands:**
```bash
wrangler login          # Authenticate
wrangler secret list    # List all secrets
wrangler secret put X   # Add/update secret
wrangler deploy         # Deploy app
wrangler tail           # View real-time logs
wrangler dev            # Test locally
```

---

**Let's ship it! 🚀**
