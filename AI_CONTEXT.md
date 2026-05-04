# Portfolio Binder - AI Context Guide

## 🎯 What This Project Is

**Portfolio Binder** is a video portfolio platform for filmmakers. Users can:
- Create accounts and authenticate
- Upload video portfolios
- Get public portfolio pages at `/filmmaker/[username]`
- Browse featured work on the homepage

**Live Site:** https://planzzz.com

---

## 🛠️ Technology Stack

### Frontend & Framework
- **Astro** - Main framework (server-side rendering)
- **React** - Interactive components (with `client:load` or `client:only="react"` directives)
- **Tailwind CSS** - Styling (uses Webflow design tokens from `generated/webflow.css`)
- **shadcN UI** - Pre-installed component library

### Backend & Hosting
- **Cloudflare Workers** - Serverless hosting (no cost!)
- **Cloudflare R2** - Video storage (S3-compatible, 10GB free)
- **Supabase** - PostgreSQL database + authentication
- **Transloadit** - Video processing and transcoding

### Build & Deployment
- **Wrangler** - Cloudflare deployment tool
- **GitHub** - Code repository backup

---

## 📁 Project Structure

---

## 📄 Important Files Reference

### Configuration Files:
- **`.env`** - Local environment variables (already configured)
- **`.dev.vars`** - Cloudflare dev secrets (already configured)  
- **`wrangler.toml`** - Cloudflare Workers config
- **`astro.config.mjs`** - Astro framework settings

### Key Directories:
- **`src/pages/`** - All website pages (edit these to change pages)
- **`src/components/`** - React components (reusable UI elements)
- **`src/lib/`** - Utility functions (database, storage, etc.)
- **`src/styles/global.css`** - Global styles and custom classes

### Don't Edit These:
- **`generated/`** - Auto-generated Webflow assets (will be overwritten)
- **`node_modules/`** - Installed packages (managed by npm)