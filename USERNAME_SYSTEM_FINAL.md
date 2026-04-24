
# 🎬 Film-Based Username System

## Overview

Simple, mysterious, scalable username system for filmmaker identities.

---

## Format

```
[4-digit-code]-[film-slug]
```

### Examples:
- `2947-inception`
- `5031-parasite`
- `8472-casablanca`
- `7264-bladerunner`
- `1829-spiderverse`

---

## User Experience

### Signup Flow:

**Step 1: Basic Info**
```
Email: alex@example.com
Password: ••••••••
Full Name: Alex Rivera
```

**Step 2: Pick Your Film (5 Random Options + Timer)**
```
🎬 Inception (2010) ⭐ 8.8
🎬 Parasite (2019) ⭐ 8.5
🎬 Casablanca (1942) ⭐ 8.5
🎬 The Matrix (1999) ⭐ 8.7
🎬 Pulp Fiction (1994) ⭐ 8.9

[🔄 Show 5 Different Films]
⏱️ New films in 5 sec
```

**Step 3: Username Generation Animation**
```
User clicks "Inception"
↓
[####]-inception  ← Numbers roll like slot machine
↓
[7392]-inception  ← Rolling...
↓
[5841]-inception  ← Rolling...
↓
2947-inception    ← Final! ✨

✅ Username Created!
Profile: /filmmaker/2947-inception
```

---

## Why This Works

### ✅ Benefits:

1. **No Age Collection** → Mysterious artist identities
2. **Film Identity** → Shows taste, creates conversation
3. **Always Unique** → 10,000 combos per film (0000-9999)
4. **Infinite Scale** → 800K films × 10K codes = 8 billion usernames
5. **No Collisions** → Random 4-digit ensures uniqueness
6. **Simple** → Easy to type, remember, share
7. **Fun Signup** → Rolling number animation = engaging UX

### 🎯 Scale:

```
Even if 10,000 people pick "Casablanca":
├─ 0001-casablanca
├─ 0492-casablanca
├─ 8472-casablanca
├─ 9999-casablanca
└─ ... 10,000 unique usernames!
```

---

## Technical Implementation

### Database Schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,  -- Format: ####-film-slug
  full_name TEXT NOT NULL,
  film_title TEXT,  -- The film they selected
  -- ... other fields
);
```

### Username Generation:

```typescript
function generateUsername(filmSlug: string): string {
  const randomCode = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `${randomCode}-${filmSlug}`;
}
```

### Rolling Animation:

- 30 frames @ 50ms each = 1.5 second animation
- Digits settle left-to-right sequentially
- Final number locks in with confirmation

---

## Display Logic

### Profile URLs:
```
/filmmaker/2947-inception
/filmmaker/5031-parasite
/filmmaker/8472-casablanca
```

### Name Display Priority:

```
1. Full Name (Most Prominent)
   → "Alex Rivera"

2. Username (Secondary)
   → "@2947-inception"

3. Film Title (Optional Tag)
   → 🎬 Inception (2010)
```

### Example Card:
```
┌─────────────────────────────────┐
│  Alex Rivera                    │
│  @2947-inception                │
│  🎬 Inception (2010)            │
│  Los Angeles, CA                │
│  ─────────────────────────      │
│  "Independent filmmaker..."     │
└─────────────────────────────────┘
```

---

## Film Selection

### Sources:

1. **Primary:** TMDb API (800,000+ films)
2. **Fallback:** Curated list (80+ iconic films 1942-2024)

### Timer:

- Shows 5 random films
- Auto-refreshes every 5 seconds
- Manual refresh button available
- Countdown visible to user

### Film Data:

```typescript
interface Film {
  title: string;      // "Inception"
  year: number;       // 2010
  slug: string;       // "inception"
  rating?: number;    // 8.8
  posterUrl?: string; // Optional poster
}
```

---

## Sample Users

From `DATABASE_SCHEMA_FINAL.sql`:

```sql
2947-inception    → Alex Rivera (Los Angeles)
5031-parasite     → Jordan Lee (New York)
7264-bladerunner  → Sam Chen (Austin)
```

---

## Next Steps

1. ✅ Username format finalized
2. ✅ Animation implemented
3. ✅ Database schema ready
4. 🔄 Test signup flow
5. 🔄 Deploy to production
6. 🔄 Add authentication integration

---

## FAQ

**Q: What if two people pick the same film?**  
A: The 4-digit code ensures uniqueness (10,000 possible combos per film).

**Q: Can users change their username later?**  
A: No, username is permanent (like Twitter handles). Keeps identity stable.

**Q: Why no birth year?**  
A: Adds mystery, removes age bias, keeps focus on work not demographics.

**Q: What about famous filmmakers?**  
A: They can pick iconic films they admire or films that inspire them.

**Q: How many films are available?**  
A: 800,000+ from TMDb, plus 80+ curated classics as fallback.

---

**Status:** Ready to deploy! 🚀

