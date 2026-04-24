# ⚡ Quick Deployment Commands

Copy and paste these commands in order:

---

## 1️⃣ **Install Wrangler (if not already installed)**

```bash
npm install -g wrangler
```

---

## 2️⃣ **Login to Cloudflare**

```bash
wrangler login
```

---

## 3️⃣ **Set Production Secrets**

```bash
wrangler secret put SUPABASE_ANON_KEY
```
Paste: `sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI`

```bash
wrangler secret put R2_ACCESS_KEY_ID
```
Paste: `2fd207bd802c6b213eddd3cd2a5eb740`

```bash
wrangler secret put R2_SECRET_ACCESS_KEY
```
Paste: `56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77`

```bash
wrangler secret put TMDB_API_KEY
```
Paste: `1a0bcc84947a194003b9185b4da517ea`

---

## 4️⃣ **Build & Deploy**

```bash
npm run build && wrangler deploy
```

---

## 5️⃣ **Add Custom Domain**

```bash
wrangler domains add planzzz.com
```

---

## ✅ **Done!**

Your site will be live at:
- `https://planzzz.com`
- `https://portfolio-binder.your-account.workers.dev`

---

## 🔄 **To Update Later:**

```bash
npm run build && wrangler deploy
```

That's it! 🎉
