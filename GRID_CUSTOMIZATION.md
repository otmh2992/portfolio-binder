# 🎛️ Grid Customization Guide

## Quick Reference: What You Can Control

| Property | Where to Edit | Current Value | Easy to Change? |
|----------|---------------|---------------|-----------------|
| **Gap between items** | `global.css` | 1.5rem (24px) | ✅ Very Easy |
| **Items per row** | `global.css` | 6 columns (desktop) | ✅ Very Easy |
| **Row height** | `global.css` | 200px | ✅ Very Easy |
| **Item padding** | `global.css` | None (0px) | ✅ Very Easy |
| **Overlay padding** | `global.css` | 1.5rem (24px) | ✅ Very Easy |
| **Container padding** | `index.astro` | 1rem (16px) | ✅ Very Easy |
| **Item sizes (spans)** | `PortfolioGrid.tsx` | Pattern-based | ⚠️ Moderate |
| **Border radius** | `global.css` | var(--radius-lg) | ✅ Very Easy |
| **Border thickness** | `global.css` | 1px | ✅ Very Easy |

## 📐 Spacing Between Items (Gap)

### Current Settings
```css
/* Mobile */
gap: 1rem;      /* 16px */

/* Tablet */
gap: 1.25rem;   /* 20px */

/* Desktop (768px+) */
gap: 1.5rem;    /* 24px */
```

### How to Change
**File**: `src/styles/global.css`  
**Find**: `.asymmetric-grid`

```css
/* Make gaps smaller (tighter grid) */
.asymmetric-grid {
  gap: 0.5rem;  /* 8px - very tight */
}

/* Make gaps larger (more breathing room) */
.asymmetric-grid {
  gap: 2rem;    /* 32px - spacious */
}

/* Different gaps for different screens */
@media (min-width: 1024px) {
  .asymmetric-grid {
    gap: 3rem;  /* 48px on desktop only */
  }
}
```

### Popular Presets
```css
/* Minimal (tight grid) */
gap: 0.5rem;

/* Comfortable (current) */
gap: 1.5rem;

/* Spacious */
gap: 2.5rem;

/* Extra spacious */
gap: 4rem;

/* Pinterest-style (horizontal ≠ vertical) */
column-gap: 1rem;
row-gap: 1.5rem;
```

## 📊 Items Per Row (Columns)

### Current Settings
```css
/* Mobile: Flexible (fills screen) */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* Tablet (640px+): Flexible 2-3 columns */
grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

/* Medium (768px+): Fixed 4 columns */
grid-template-columns: repeat(4, 1fr);

/* Desktop (1024px+): Fixed 6 columns */
grid-template-columns: repeat(6, 1fr);
```

### How to Change
**File**: `src/styles/global.css`  
**Find**: `.asymmetric-grid` media queries

```css
/* FEWER ITEMS PER ROW (bigger items) */

@media (min-width: 768px) {
  .asymmetric-grid {
    grid-template-columns: repeat(3, 1fr);  /* 3 columns instead of 4 */
  }
}

@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(4, 1fr);  /* 4 columns instead of 6 */
  }
}

/* MORE ITEMS PER ROW (smaller items) */

@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(8, 1fr);  /* 8 columns instead of 6 */
  }
}

@media (min-width: 1280px) {
  .asymmetric-grid {
    grid-template-columns: repeat(10, 1fr); /* 10 columns on extra-wide screens */
  }
}
```

### Popular Layouts

#### **Classic Masonry (3 columns)**
```css
@media (min-width: 768px) {
  .asymmetric-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(3, 1fr);  /* Keep 3 columns even on desktop */
  }
}
```

#### **Pinterest-style (4-5 columns)**
```css
@media (min-width: 768px) {
  .asymmetric-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

#### **Dense Grid (8+ columns)**
```css
@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(8, 1fr);
    grid-auto-rows: 150px;  /* Smaller rows for dense grid */
    gap: 0.75rem;           /* Tighter gaps */
  }
}
```

## 📏 Row Height

### Current Settings
```css
/* Mobile */
grid-auto-rows: 200px;

/* Tablet */
grid-auto-rows: 180px;

/* Medium */
grid-auto-rows: 220px;

/* Desktop */
grid-auto-rows: 200px;
```

### How to Change
**File**: `src/styles/global.css`

```css
/* Taller rows (more vertical space) */
.asymmetric-grid {
  grid-auto-rows: 250px;  /* Each row is 250px tall */
}

/* Shorter rows (more compact) */
.asymmetric-grid {
  grid-auto-rows: 150px;
}

/* Responsive heights */
@media (min-width: 768px) {
  .asymmetric-grid {
    grid-auto-rows: 180px;  /* Medium on tablet */
  }
}

@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-auto-rows: 300px;  /* Large on desktop */
  }
}
```

### Height + Columns Combos

**Small Dense Grid:**
```css
grid-template-columns: repeat(8, 1fr);
grid-auto-rows: 120px;
gap: 0.5rem;
```

**Large Showcase Grid:**
```css
grid-template-columns: repeat(3, 1fr);
grid-auto-rows: 300px;
gap: 2rem;
```

**Tall Portrait Grid:**
```css
grid-template-columns: repeat(4, 1fr);
grid-auto-rows: 280px;  /* Favors vertical images */
gap: 1rem;
```

## 🎨 Padding Inside Items

### Current: No Internal Padding
Images fill the entire card space.

### How to Add Padding
**File**: `src/styles/global.css`  
**Find**: `.portfolio-item`

```css
/* Add padding inside each item */
.portfolio-item {
  padding: 1rem;  /* 16px padding inside */
}

/* Add padding only around the image */
.portfolio-item-inner {
  padding: 0.75rem;
}

/* Different padding for different sizes */
.portfolio-item {
  padding: 0.5rem;  /* Default */
}

/* Target only large items (if you want) */
.portfolio-item[style*="span 2"] {
  padding: 1.5rem;  /* More padding for big items */
}
```

### Padding + Image Effects

**Card-style with padding:**
```css
.portfolio-item {
  padding: 1rem;
  background: var(--card);
}

.portfolio-item-inner {
  border-radius: calc(var(--radius-lg) - 4px);
  overflow: hidden;
}
```

**Photo frame effect:**
```css
.portfolio-item {
  padding: 2rem;
  background: var(--background);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}

.portfolio-image {
  border: 4px solid var(--muted);
}
```

## 📦 Container Padding (Outer Spacing)

### Current Settings
**File**: `src/pages/index.astro`

```astro
<div class="container mx-auto px-4 py-12">
  <!-- px-4 = 1rem = 16px horizontal padding -->
  <!-- py-12 = 3rem = 48px vertical padding -->
</div>
```

### How to Change
**File**: `src/pages/index.astro`

```astro
/* No padding (full bleed) */
<div class="container mx-auto px-0 py-0">

/* Comfortable (current) */
<div class="container mx-auto px-4 py-12">

/* Spacious */
<div class="container mx-auto px-8 py-16">

/* Responsive padding */
<div class="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-16">
```

## 🎯 Overlay Padding

The hover overlay text has its own padding.

### Current Settings
```css
.portfolio-overlay {
  padding: 1.5rem;  /* Desktop */
}

@media (max-width: 767px) {
  .portfolio-overlay {
    padding: 1rem;  /* Mobile */
  }
}
```

### How to Change
**File**: `src/styles/global.css`

```css
/* More text space */
.portfolio-overlay {
  padding: 2.5rem;
}

/* Compact text */
.portfolio-overlay {
  padding: 0.75rem;
}

/* Asymmetric padding (more bottom) */
.portfolio-overlay {
  padding: 1rem 1.5rem 2rem 1.5rem;
  /* top | right | bottom | left */
}
```

## 🔢 Item Size Patterns (Advanced)

This controls HOW MANY grid cells each item spans (its visual size).

### Current Pattern
**File**: `src/components/PortfolioGrid.tsx`  
**Find**: `getItemSize` function

```typescript
const patterns = [
  { rows: 2, cols: 2 }, // 1. Large square
  { rows: 1, cols: 1 }, // 2. Small square
  { rows: 2, cols: 1 }, // 3. Tall rectangle
  { rows: 1, cols: 2 }, // 4. Wide rectangle
  { rows: 1, cols: 1 }, // 5. Small square
  { rows: 2, cols: 1 }, // 6. Tall rectangle
  { rows: 1, cols: 1 }, // 7. Small square
  { rows: 2, cols: 2 }, // 8. Large square
  { rows: 1, cols: 2 }, // 9. Wide rectangle
  { rows: 1, cols: 1 }, // 10. Small square
];
```

### Custom Patterns

**All Same Size (Regular Grid):**
```typescript
const patterns = [
  { rows: 1, cols: 1 }, // Every item is 1×1
];
```

**More Variety:**
```typescript
const patterns = [
  { rows: 3, cols: 3 }, // Huge featured item
  { rows: 1, cols: 1 },
  { rows: 1, cols: 1 },
  { rows: 2, cols: 2 }, // Large
  { rows: 1, cols: 2 }, // Wide
  { rows: 2, cols: 1 }, // Tall
  { rows: 1, cols: 1 },
  { rows: 2, cols: 3 }, // Extra wide
];
```

**Portrait Focus (Tall Items):**
```typescript
const patterns = [
  { rows: 2, cols: 1 }, // Tall
  { rows: 3, cols: 1 }, // Extra tall
  { rows: 2, cols: 1 },
  { rows: 1, cols: 1 }, // Small accent
  { rows: 2, cols: 1 },
];
```

**Landscape Focus (Wide Items):**
```typescript
const patterns = [
  { rows: 1, cols: 2 }, // Wide
  { rows: 1, cols: 3 }, // Extra wide
  { rows: 1, cols: 2 },
  { rows: 1, cols: 1 }, // Small accent
  { rows: 1, cols: 2 },
];
```

**Hero Pattern (First Item Dominates):**
```typescript
const patterns = [
  { rows: 3, cols: 3 }, // First item is HUGE
  { rows: 1, cols: 1 }, // Then all small
  { rows: 1, cols: 1 },
  { rows: 1, cols: 1 },
  { rows: 1, cols: 1 },
];
```

## 🎨 Complete Preset Examples

### **1. Pinterest Classic**
```css
/* In global.css */
.asymmetric-grid {
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 180px;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: 200px;
    gap: 1.25rem;
  }
}
```

### **2. Gallery Showcase**
```css
/* In global.css */
.asymmetric-grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 300px;
  gap: 2rem;
}

.portfolio-item {
  padding: 1.5rem;
  background: var(--background);
  box-shadow: 0 8px 16px rgb(0 0 0 / 0.1);
}
```

### **3. Dense Thumbnail Grid**
```css
/* In global.css */
.asymmetric-grid {
  grid-template-columns: repeat(8, 1fr);
  grid-auto-rows: 120px;
  gap: 0.5rem;
}

.portfolio-item {
  border-radius: 4px;
}
```

### **4. Magazine Layout**
```css
/* In global.css */
.asymmetric-grid {
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 250px;
  gap: 1.5rem;
}

/* In PortfolioGrid.tsx - use Hero pattern */
const patterns = [
  { rows: 2, cols: 3 }, // Lead story
  { rows: 2, cols: 2 },
  { rows: 1, cols: 1 },
  { rows: 1, cols: 1 },
];
```

## 🛠️ Quick Change Cheat Sheet

### Want bigger items?
→ **Reduce** columns: `repeat(4, 1fr)` → `repeat(3, 1fr)`

### Want more items visible?
→ **Increase** columns: `repeat(6, 1fr)` → `repeat(8, 1fr)`

### Want tighter layout?
→ **Reduce** gap: `gap: 1.5rem;` → `gap: 0.75rem;`

### Want more breathing room?
→ **Increase** gap: `gap: 1.5rem;` → `gap: 2.5rem;`

### Want taller items?
→ **Increase** row height: `grid-auto-rows: 200px;` → `grid-auto-rows: 280px;`

### Want all same size?
→ Change pattern in `PortfolioGrid.tsx` to only `{ rows: 1, cols: 1 }`

### Want random sizes?
→ Generate random patterns:
```typescript
const getItemSize = () => {
  const sizes = [
    { rows: 1, cols: 1 },
    { rows: 2, cols: 1 },
    { rows: 1, cols: 2 },
    { rows: 2, cols: 2 },
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
};
```

## 📱 Responsive Design Tips

### Mobile-First Approach
```css
/* Start with mobile (default) */
.asymmetric-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

/* Tablet */
@media (min-width: 640px) {
  .asymmetric-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .asymmetric-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5rem;
  }
}
```

### Keep Proportions Consistent
If you change columns, adjust row height proportionally:

```css
/* 6 columns = 200px rows (1:1 ratio) */
grid-template-columns: repeat(6, 1fr);
grid-auto-rows: 200px;

/* 3 columns = 400px rows (keep 1:1 ratio) */
grid-template-columns: repeat(3, 1fr);
grid-auto-rows: 400px;

/* 8 columns = 150px rows (keep 1:1 ratio) */
grid-template-columns: repeat(8, 1fr);
grid-auto-rows: 150px;
```

## 🎬 See Changes Live

After making changes:

1. Save the file
2. The dev server auto-reloads
3. See changes instantly (no build needed!)
4. Test on different screen sizes using browser DevTools

---

**Need more help?** Check out `PORTFOLIO_SETUP.md` for general setup.
