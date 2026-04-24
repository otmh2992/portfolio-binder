# Portfolio Customization Guide

## Overview
Your portfolio supports extensive customization beyond just colors. This guide covers textures, layouts, animations, and more.

---

## 🎨 Texture Customization

### Available Texture Classes

#### 1. **Subtle Grain Texture** (Default)
```html
<div class="grainy-texture">
  <!-- Your content -->
</div>
```
- Light grain overlay (3% opacity)
- Works on any background
- Adds subtle analog feel

#### 2. **Heavy Grain Texture**
```html
<div class="grainy-texture grainy-texture-heavy">
  <!-- Your content -->
</div>
```
- Stronger grain effect (8% opacity)
- More pronounced texture
- Great for hero sections

#### 3. **Colored Grain**
```html
<!-- Primary colored grain -->
<div class="grainy-texture grainy-texture-primary">
  <!-- Your content -->
</div>

<!-- Secondary colored grain -->
<div class="grainy-texture grainy-texture-secondary">
  <!-- Your content -->
</div>
```
- Tinted grain using theme colors
- Subtle brand color integration
- Uses blend modes for natural look

#### 4. **Paper Texture**
```html
<div class="paper-texture">
  <!-- Your content -->
</div>
```
- Mimics paper/canvas texture
- Perfect for cards and sections
- Slightly stronger than basic grain

#### 5. **Gradient + Grain**
```html
<div class="gradient-grain">
  <!-- Your content -->
</div>
```
- Combines subtle gradient with texture
- Background to muted color gradient
- Organic, non-digital feel

---

## 🎨 Color Customization

All colors are defined in `generated/webflow.css` and can be customized in your Webflow design system:

### Primary Colors
- `--primary`: Main brand color (#0073e6)
- `--primary-foreground`: Text on primary background
- `--secondary`: Secondary accent color
- `--secondary-foreground`: Text on secondary

### Surface Colors
- `--background`: Page background
- `--foreground`: Main text color
- `--card`: Card backgrounds
- `--muted`: Subtle backgrounds
- `--accent`: Accent elements

### Semantic Colors
- `--destructive`: Error/delete actions
- `--border`: Border colors
- `--input`: Input field borders
- `--ring`: Focus ring color

### Dark Mode
All colors have `-dark` variants that automatically apply when dark mode is enabled.

---

## 📐 Layout Customization

### Grid Configuration

#### Modify Grid Columns & Rows
Edit `src/styles/global.css`:

```css
.asymmetric-grid {
  /* Mobile: 1 column, 200px rows */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}

@media (min-width: 768px) {
  /* Tablet: 4 columns */
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 220px;
}

@media (min-width: 1024px) {
  /* Desktop: 6 columns */
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 200px;
}
```

**Customization options:**
- Change `repeat(6, 1fr)` to `repeat(4, 1fr)` for fewer columns
- Adjust `200px` row height for taller/shorter items
- Modify `gap: 1.5rem` for spacing between items
- Use `minmax(150px, 1fr)` for smaller minimum sizes

#### Create Custom Grid Patterns
```css
/* Pinterest-style masonry */
.masonry-grid {
  column-count: 3;
  column-gap: 1.5rem;
}

/* Fixed 2-column layout */
.two-column-grid {
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 300px;
}

/* Horizontal scrolling */
.scroll-grid {
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  scroll-snap-type: x mandatory;
}
```

---

## 🎭 Animation & Interaction Customization

### Hover Effects

#### Current Hover Effect
```css
.portfolio-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  border-color: var(--primary);
}
```

#### Alternative Hover Effects

**Scale Effect:**
```css
.portfolio-item:hover {
  transform: scale(1.03);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
}
```

**Rotate + Lift:**
```css
.portfolio-item:hover {
  transform: translateY(-8px) rotate(1deg);
  box-shadow: 0 30px 60px -15px rgb(0 0 0 / 0.2);
}
```

**Glow Effect:**
```css
.portfolio-item:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 0 30px -10px var(--primary);
}
```

### Image Zoom Customization
```css
/* Current: Subtle zoom */
.portfolio-item:hover .portfolio-image {
  transform: scale(1.05);
}

/* Stronger zoom */
.portfolio-item:hover .portfolio-image {
  transform: scale(1.15);
}

/* Zoom + rotate */
.portfolio-item:hover .portfolio-image {
  transform: scale(1.08) rotate(2deg);
}

/* Zoom + filter effect */
.portfolio-item:hover .portfolio-image {
  transform: scale(1.05);
  filter: brightness(1.1) contrast(1.05);
}
```

---

## 🖼️ Portfolio Item Customization

### Border Radius
```css
.portfolio-item {
  border-radius: var(--radius-lg); /* ~8px */
}

/* Options: */
border-radius: 0; /* Sharp corners */
border-radius: var(--radius-sm); /* Subtle ~4px */
border-radius: var(--radius-xl); /* Rounded ~12px */
border-radius: 1.5rem; /* Very rounded */
border-radius: 9999px; /* Circular (for square items) */
```

### Border Styles
```css
/* Thick border */
.portfolio-item {
  border: 3px solid var(--border);
}

/* Double border */
.portfolio-item {
  border: 1px solid var(--border);
  box-shadow: inset 0 0 0 3px var(--background);
}

/* Gradient border */
.portfolio-item {
  border: 2px solid transparent;
  background: 
    linear-gradient(var(--card), var(--card)) padding-box,
    linear-gradient(135deg, var(--primary), var(--secondary)) border-box;
}
```

### Overlay Customization

**Change Overlay Direction:**
```css
/* Bottom to top (current) */
background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);

/* Top to bottom */
background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);

/* Center radial */
background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.7) 100%);

/* Solid with opacity */
background: rgba(0,0,0,0.6);
```

**Colored Overlays:**
```css
/* Primary color overlay */
.portfolio-overlay {
  background: linear-gradient(
    to top, 
    hsl(from var(--primary) h s l / 0.9) 0%, 
    transparent 100%
  );
}

/* Dual-tone overlay */
.portfolio-overlay {
  background: linear-gradient(
    135deg, 
    rgba(0, 115, 230, 0.8) 0%, 
    rgba(215, 248, 255, 0.6) 100%
  );
}
```

---

## 🎯 Advanced Background Techniques

### Custom SVG Patterns

#### Dots Pattern
```css
.dots-pattern {
  background-image: radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0;
}
```

#### Grid Pattern
```css
.grid-pattern {
  background-image: 
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

#### Diagonal Lines
```css
.diagonal-lines {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    var(--border) 10px,
    var(--border) 11px
  );
}
```

### Layered Textures
```css
.complex-texture {
  background-color: var(--background);
  background-image: 
    /* Grain layer */
    url("data:image/svg+xml,..."),
    /* Gradient layer */
    linear-gradient(135deg, transparent 0%, var(--muted) 100%),
    /* Pattern layer */
    radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-blend-mode: overlay, normal, normal;
}
```

---

## 📱 Responsive Customization

### Breakpoints
```css
/* Mobile first approach */
.my-element { /* Mobile styles */ }

@media (min-width: 640px) { /* sm - Small tablets */ }
@media (min-width: 768px) { /* md - Tablets */ }
@media (min-width: 1024px) { /* lg - Desktops */ }
@media (min-width: 1280px) { /* xl - Large desktops */ }
```

### Mobile-Specific Adjustments
```css
/* Disable animations on mobile */
@media (max-width: 767px) {
  .portfolio-item {
    transition: none;
  }
  
  .portfolio-item:hover {
    transform: none;
  }
}

/* Simplify grid on mobile */
@media (max-width: 640px) {
  .asymmetric-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 250px;
  }
}
```

---

## 🎨 Typography Customization

### Font Variables
Defined in `generated/webflow.css`:
```css
--heading-font: Montserrat, sans-serif;
--body-font: Inter, sans-serif;
--button-font: Montserrat, sans-serif;
```

### Custom Font Sizes
```css
.portfolio-title {
  font-size: 1.125rem; /* Default */
  
  /* Options: */
  font-size: 0.875rem; /* Smaller */
  font-size: 1.5rem; /* Larger */
  font-size: clamp(1rem, 2vw, 1.5rem); /* Fluid sizing */
}
```

### Text Effects
```css
/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Shadow text */
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Outline text */
.outline-text {
  -webkit-text-stroke: 1px var(--foreground);
  -webkit-text-fill-color: transparent;
}
```

---

## 🚀 Performance Considerations

### Optimizing Textures
- SVG textures are inline and cached
- Use CSS `will-change` sparingly for animations
- Prefer `transform` and `opacity` for smooth animations
- Consider reducing grain opacity on low-end devices

### Best Practices
```css
/* Good: GPU-accelerated */
.optimized {
  transform: translateY(-4px);
  opacity: 0.9;
  will-change: transform;
}

/* Avoid: CPU-intensive */
.not-optimized {
  margin-top: -4px;
  filter: blur(5px) saturate(1.5);
}
```

---

## 📝 Quick Customization Recipes

### Recipe 1: Minimal Clean Look
```css
.portfolio-item {
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.portfolio-item:hover {
  transform: none;
  opacity: 0.8;
}
```

### Recipe 2: Bold & Colorful
```css
.portfolio-item {
  border: 3px solid var(--primary);
  border-radius: var(--radius-xl);
}

.portfolio-item:hover {
  transform: scale(1.05) rotate(2deg);
  border-color: var(--secondary);
  box-shadow: 0 30px 60px -15px var(--primary);
}
```

### Recipe 3: Vintage Paper
```css
body {
  background: #f4f1e8;
}

.portfolio-item {
  background: #fffef9;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
}

.paper-texture::before {
  opacity: 0.15;
}
```

### Recipe 4: Dark Neon
```css
.dark .portfolio-item {
  background: #0a0a0a;
  border: 1px solid var(--primary);
  box-shadow: 0 0 20px rgba(32, 131, 248, 0.2);
}

.dark .portfolio-item:hover {
  box-shadow: 0 0 40px rgba(32, 131, 248, 0.4);
}
```

---

## 🛠️ Where to Make Changes

1. **Colors**: Edit in Webflow Design System (auto-generates to `generated/webflow.css`)
2. **Textures & Layouts**: Edit `src/styles/global.css`
3. **Component Structure**: Edit `src/components/PortfolioGrid.tsx`
4. **Page Layout**: Edit `src/pages/index.astro`
5. **Fonts**: Edit in Webflow (auto-generates to `generated/fonts.css`)

---

## 💡 Need Help?

- All texture classes are in `src/styles/global.css`
- Grid styles start at line with `.asymmetric-grid`
- Portfolio item styles start with `.portfolio-item`
- Use browser DevTools to experiment in real-time
- Copy any recipe from this guide directly into your CSS

Happy customizing! 🎨
