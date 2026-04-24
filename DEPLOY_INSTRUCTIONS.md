# 🚀 Portfolio Binder - Deployment Instructions

## ✅ YOU'VE CLONED THE CODE - NOW DEPLOY IT!

---

## **STEP 1: Open Terminal in Your Project Folder**

### **Option A: Using VS Code (Recommended)**
1. Open VS Code
2. File → Open Folder
3. Select the `portfolio-binder` folder you just cloned
4. Terminal → New Terminal (or press `` Ctrl + ` ``)

### **Option B: Using Command Prompt**
1. Open File Explorer
2. Navigate to where you cloned the repo (probably `Documents/GitHub/portfolio-binder`)
3. Click in the address bar, type `cmd`, press Enter
4. Command Prompt opens in that folder

---

## **STEP 2: Install Dependencies**

In your terminal, paste this command:

```bash
npm install
```

Press Enter. Wait 2-3 minutes for it to finish.

You'll see lots of text scrolling - that's normal!

---

## **STEP 3: Install Wrangler CLI**

```bash
npm install -g wrangler
```

Wait for it to finish (about 1 minute).

---

## **STEP 4: Login to Cloudflare**

```bash
wrangler login
```

- A browser window will open
- Click "Allow" to authorize
- Return to terminal - you'll see "Successfully logged in"

---

## **STEP 5: Set Your Secrets**

Copy/paste these commands **ONE AT A TIME**:

### Secret 1:
```bash
wrangler secret put SUPABASE_ANON_KEY
```
When prompted, paste: `sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI`

### Secret 2:
```bash
wrangler secret put R2_ACCESS_KEY_ID
```
When prompted, paste: `2fd207bd802c6b213eddd3cd2a5eb740`

### Secret 3:
```bash
wrangler secret put R2_SECRET_ACCESS_KEY
```
When prompted, paste: `56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77`

### Secret 4:
```bash
wrangler secret put TMDB_API_KEY
```
When prompted, paste: `1a0bcc84947a194003b9185b4da517ea`

---

## **STEP 6: Create Environment File**

In your project folder, create a file named `.dev.vars` with this content:

```
SUPABASE_URL=https://rhfuavsuhdfrsvylmqmr.supabase.co
SUPABASE_ANON_KEY=sb_publishable_bIZqKpMB6BzIlKaf0mqEOA_f9OoAiWI
CLOUDFLARE_ACCOUNT_ID=69ce5baea1fc2d60eb72cd5e51cabc55
R2_BUCKET_NAME=portfoliovideos
R2_ACCESS_KEY_ID=2fd207bd802c6b213eddd3cd2a5eb740
R2_SECRET_ACCESS_KEY=56a823ba6081f1b222f87b18f8ae195532a2c60a91e7574a0863647d881ebd77
TMDB_API_KEY=1a0bcc84947a194003b9185b4da517ea
```

---

## **STEP 7: Build Your Project**

```bash
npm run build
```

Wait 1-2 minutes. Should end with "✓ Complete!"

---

## **STEP 8: Deploy to Cloudflare**

```bash
wrangler deploy
```

Wait for deployment (1-2 minutes).

At the end, you'll see:
```
Published portfolio-binder
  https://portfolio-binder.YOUR-ACCOUNT.workers.dev
```

**Copy that URL and test it in your browser!**

---

## **STEP 9: Connect Your Custom Domain**

```bash
wrangler domains add planzzz.com
```

This connects `planzzz.com` to your Worker.

---

## **STEP 10: Visit Your Live Site! 🎉**

Go to: **https://planzzz.com**

Your Portfolio Binder is LIVE!

---

## **🆘 TROUBLESHOOTING**

### "command not found: wrangler"
- Make sure you ran `npm install -g wrangler`
- Close and reopen your terminal
- Try again

### "npm: command not found"
- Node.js didn't install correctly
- Restart your computer
- Try `node --version` - should show v24.15.0

### Build errors
- Make sure you're in the project folder
- Run `npm install` again
- Check for typos in commands

### Deployment fails
- Make sure you ran `wrangler login`
- Check that all 4 secrets were set correctly
- Run `wrangler whoami` to verify login

---

## **NEED HELP?**

Come back to the chat and tell me:
1. Which step you're on
2. What error message you see (copy/paste it)
3. I'll help you fix it!

---

**YOU GOT THIS! 💪**
