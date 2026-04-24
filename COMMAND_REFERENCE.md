# 🎯 Command Reference - Portfolio Binder

Quick reference for all important commands.

---

## 🚀 **Initial Deployment**

### **1. Install Wrangler**
```bash
npm install -g wrangler
```

### **2. Login to Cloudflare**
```bash
wrangler login
```

### **3. Set Secrets (One-time)**
```bash
# Supabase
wrangler secret put SUPABASE_ANON_KEY
# Paste: sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI

# R2 Access
wrangler secret put R2_ACCESS_KEY_ID
# Paste: 2fd207bd802c6b213eddd3cd2a5eb740

wrangler secret put R2_SECRET_ACCESS_KEY
# Paste: 56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77

# TMDB
wrangler secret put TMDB_API_KEY
# Paste: 1a0bcc84947a194003b9185b4da517ea
```

### **4. Build & Deploy**
```bash
npm run build
wrangler deploy
```

### **5. Add Custom Domain**
```bash
wrangler domains add planzzz.com
```

---

## 🔄 **Regular Development**

### **Start Dev Server**
```bash
npm run dev
```
Access at: `http://localhost:3000`

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build Locally**
```bash
npm run preview
```

### **Deploy Updates**
```bash
npm run build && wrangler deploy
```

---

## 🔍 **Debugging & Monitoring**

### **View Real-time Logs**
```bash
wrangler tail
```

### **List All Secrets**
```bash
wrangler secret list
```

### **Check Wrangler Login Status**
```bash
wrangler whoami
```

### **View Worker Details**
```bash
wrangler deployments list
```

---

## 🗄️ **Database Management (Supabase)**

### **Access Supabase Dashboard**
```
https://supabase.com/dashboard/project/ljlmsnqdtwhrrdbxgptz
```

### **Run SQL Query**
In Supabase Dashboard → SQL Editor:

```sql
-- View all users
SELECT * FROM users;

-- View all portfolios
SELECT * FROM portfolios;

-- Count users
SELECT COUNT(*) FROM users;

-- Find user by username
SELECT * FROM users WHERE username = '1234-pulp-fiction';

-- View user's portfolios
SELECT p.* FROM portfolios p
JOIN users u ON p.user_id = u.id
WHERE u.username = '1234-pulp-fiction';
```

---

## 📦 **R2 Storage Management**

### **List Files in Bucket (via Wrangler)**
```bash
wrangler r2 object list portfoliovideos
```

### **Access R2 Dashboard**
```
https://dash.cloudflare.com/1df95eb7feda5b3b11847c2fe7781163/r2
```

### **Upload File Manually (testing)**
```bash
wrangler r2 object put portfoliovideos/test.jpg --file ./test.jpg
```

### **Delete File**
```bash
wrangler r2 object delete portfoliovideos/test.jpg
```

---

## 🔐 **Security & Secrets**

### **Add/Update Secret**
```bash
wrangler secret put SECRET_NAME
```

### **Delete Secret**
```bash
wrangler secret delete SECRET_NAME
```

### **Rotate TMDB Key**
1. Generate new key at: https://www.themoviedb.org/settings/api
2. Update secret:
```bash
wrangler secret put TMDB_API_KEY
# Paste new key
```

### **Rotate R2 Keys**
1. Create new API token in Cloudflare R2
2. Update secrets:
```bash
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
```

---

## 🌐 **Domain Management**

### **Add Domain**
```bash
wrangler domains add planzzz.com
```

### **List Domains**
```bash
wrangler domains list
```

### **Remove Domain**
```bash
wrangler domains remove planzzz.com
```

---

## 🧹 **Cleanup & Maintenance**

### **Clear Build Cache**
```bash
rm -rf dist node_modules/.vite
npm run build
```

### **Reinstall Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Delete Worker (CAUTION!)**
```bash
wrangler delete
```

---

## 🐛 **Troubleshooting Commands**

### **Problem: Build Fails**
```bash
# Clear cache
rm -rf dist node_modules/.vite

# Reinstall
npm install

# Rebuild
npm run build
```

### **Problem: Deployment Fails**
```bash
# Check login
wrangler whoami

# Re-login if needed
wrangler login

# Check secrets
wrangler secret list

# Try deploying again
wrangler deploy
```

### **Problem: Domain Not Working**
```bash
# Check domain status
wrangler domains list

# Remove and re-add
wrangler domains remove planzzz.com
wrangler domains add planzzz.com
```

### **Problem: Secrets Not Loading**
```bash
# List secrets
wrangler secret list

# Re-add missing secret
wrangler secret put SECRET_NAME
```

---

## 📊 **Status Checks**

### **Check Everything**
```bash
# 1. Wrangler status
wrangler whoami

# 2. Secrets
wrangler secret list

# 3. Deployments
wrangler deployments list

# 4. Domains
wrangler domains list

# 5. Build test
npm run build
```

---

## 🔄 **Complete Update Flow**

When you make changes to the code:

```bash
# 1. Test locally
npm run dev
# Visit http://localhost:3000, test changes

# 2. Build
npm run build
# Check for errors

# 3. Deploy
wrangler deploy
# Wait for deployment to complete

# 4. Verify
# Visit https://planzzz.com
# Test the changes in production
```

---

## 📱 **Useful URLs**

### **Development**
- Local dev: `http://localhost:3000`

### **Production**
- Live site: `https://planzzz.com`
- Worker URL: `https://portfolio-binder.your-account.workers.dev`

### **Dashboards**
- Cloudflare: `https://dash.cloudflare.com/`
- Supabase: `https://supabase.com/dashboard/project/ljlmsnqdtwhrrdbxgptz`
- TMDB: `https://www.themoviedb.org/settings/api`

### **API Endpoints**
- TMDB API: `https://api.themoviedb.org/3/`
- Supabase API: `https://ljlmsnqdtwhrrdbxgptz.supabase.co/rest/v1/`

---

## 🎯 **Most Common Commands**

```bash
# Daily development
npm run dev

# Deploy updates
npm run build && wrangler deploy

# Check logs
wrangler tail

# View secrets
wrangler secret list

# Re-login (if session expires)
wrangler login
```

---

## 📋 **Cheat Sheet**

```bash
# Quick deploy
wrangler deploy

# Quick test local
npm run dev

# Quick check
wrangler whoami && wrangler secret list

# Quick logs
wrangler tail

# Quick domain check
wrangler domains list
```

---

**Copy these commands whenever you need them! 📋**
