
# 🎨 Texture Customization Guide

You can now easily customize texture intensity, grey levels, and color tones using CSS custom properties!

## 📊 Customizable Properties

### Grey Texture Variables

```html
<div class="grey-texture" style="--grey-lightness: 95%; --grain-opacity: 0.08;">
  <!-- Your content -->
</div>
```

**Available Variables:**

| Variable | What it Controls | Default | Range |
|----------|-----------------|---------|-------|
| `--grey-lightness` | How light/dark the grey is | 96% | 0% (black) to 100% (white) |
| `--grain-opacity` | Intensity of grain texture | 0.05 | 0 (none) to 0.2 (heavy) |

### Warm Grey Variables

```html
<div class="warm-grey-texture" style="--grey-hue: 40; --grey-saturation: 15%; --grey-lightness: 94%;">
  <!-- Your content -->
</div>
```

**Available Variables:**

| Variable | What it Controls | Default | Range |
|----------|-----------------|---------|-------|
| `--grey-hue` | Color temperature (warm to cool) | 30 | 0-360 (orange=30, neutral=0, blue=210) |
| `--grey-saturation` | How much color vs grey | 10% | 0% (pure grey) to 30% (tinted) |
| `--grey-lightness` | How light/dark the grey is | 96% | 0% to 100% |
| `--grain-opacity` | Intensity of grain texture | 0.06 | 0 to 0.2 |

### Cool Grey Variables

Same as warm grey, but defaults to blue tones (hue: 210).

### General Grain Variables

Works with `.grainy-texture`, `.paper-texture`, `.gradient-grain`:

```html
<div class="grainy-texture" style="--grain-opacity: 0.1;">
  <!-- Your content -->
</div>
```

| Variable | What it Controls | Default | Range |
|----------|-----------------|---------|-------|
| `--grain-opacity` | Texture intensity | varies | 0 to 0.2 |

## 🎯 Common Use Cases

### 1. Lighter Grey Background

```html
<div class="grey-texture" style="--grey-lightness: 98%;">
  Very light grey
</div>
```

### 2. Darker Grey Background

```html
<div class="grey-texture" style="--grey-lightness: 90%;">
  Darker grey
</div>
```

### 3. More Intense Grain

```html
<div class="grey-texture" style="--grain-opacity: 0.12;">
  Heavy texture
</div>
```

### 4. Subtle/Minimal Grain

```html
<div class="grey-texture" style="--grain-opacity: 0.02;">
  Barely visible texture
</div>
```

### 5. Custom Warm Tone

```html
<div class="warm-grey-texture" style="--grey-hue: 45; --grey-saturation: 20%; --grey-lightness: 95%;">
  Warm beige background
</div>
```

### 6. Custom Cool Tone

```html
<div class="cool-grey-texture" style="--grey-hue: 200; --grey-saturation: 20%; --grey-lightness: 96%;">
  Cool blue-grey background
</div>
```

### 7. Combine Multiple Adjustments

```html
<div class="warm-grey-texture" style="--grey-hue: 35; --grey-saturation: 12%; --grey-lightness: 94%; --grain-opacity: 0.08;">
  Custom warm grey with heavy grain
</div>
```

## 🌈 Color Temperature Guide

**Hue values for different color temperatures:**

- **0-60** → Warm (orange, yellow tones)
  - 20 = Peachy warm
  - 30 = Natural warm
  - 45 = Yellow-beige
  
- **180-240** → Cool (blue tones)
  - 200 = Sky blue
  - 210 = Natural cool
  - 220 = Deep blue

- **120-160** → Green-grey tones
  
- **280-320** → Purple-grey tones

## 💡 Quick Reference

### Light Greys (for light mode)
```
--grey-lightness: 98% → Almost white
--grey-lightness: 96% → Very light (default)
--grey-lightness: 92% → Light grey
--grey-lightness: 85% → Medium-light grey
```

### Dark Greys (for dark mode)
```
--grey-lightness: 5%  → Almost black
--grey-lightness: 10% → Very dark (default)
--grey-lightness: 15% → Dark grey
--grey-lightness: 25% → Medium-dark grey
```

### Grain Intensity
```
--grain-opacity: 0.01 → Barely visible
--grain-opacity: 0.03 → Subtle (default for grainy-texture)
--grain-opacity: 0.06 → Noticeable (default for warm/cool grey)
--grain-opacity: 0.10 → Strong
--grain-opacity: 0.15 → Very strong
```

## 📝 Example: Custom Section Backgrounds

```html
<!-- Main content: Pure white with subtle grain -->
<div class="grainy-texture" style="--grain-opacity: 0.02;">
  <h2>Featured Work</h2>
  <PortfolioGrid />
</div>

<!-- Secondary: Light warm grey with medium grain -->
<div class="warm-grey-texture" style="--grey-lightness: 95%; --grain-opacity: 0.07;">
  <h2>Recent Projects</h2>
  <PortfolioGrid />
</div>

<!-- Tertiary: Darker cool grey with heavy grain -->
<div class="cool-grey-texture" style="--grey-lightness: 88%; --grey-saturation: 18%; --grain-opacity: 0.12;">
  <h2>Archive</h2>
  <PortfolioGrid />
</div>
```

## 🎨 Pro Tips

1. **Consistency**: Keep saturation levels consistent across sections (e.g., all 10-15%)
2. **Hierarchy**: Use lighter backgrounds for primary content, darker for secondary
3. **Grain Balance**: More grain on colored backgrounds, less on pure greys
4. **Dark Mode**: Test both light and dark modes when adjusting lightness
5. **Subtlety**: Less is often more — grain between 0.03-0.08 works best for most designs

## 🔧 How to Apply in Your Code

In your Astro file (`src/pages/index.astro`), add inline styles:

```jsx
<div class="secondary-grid grey-texture rounded-2xl p-12 -mx-4" 
     style="--grey-lightness: 94%; --grain-opacity: 0.08;">
  <h2>Recent Projects</h2>
  <PortfolioGrid collectionId={portfolioCollectionId} client:load />
</div>
```

Or create custom classes in `global.css`:

```css
.my-custom-grey {
  --grey-lightness: 93%;
  --grain-opacity: 0.09;
}
```

Then use:
```html
<div class="grey-texture my-custom-grey">
  <!-- Content -->
</div>
```

Happy customizing! 🎉

---

## 🏭 Distressed Grunge Texture (Weathered Concrete)

The `.grunge-texture` class creates an industrial, weathered concrete appearance with vertical streaks, cloudy patches, and worn areas.

### Structure Required

```html
<div class="grunge-texture">
  <div class="grunge-overlay"></div>
  <div class="grunge-scuffs"></div>
  <!-- Your content here -->
</div>
```

**Important**: The overlay and scuffs divs must be included for the full effect.

### Customizable Variables

```html
<div class="grunge-texture" style="--base-lightness: 92%; --streak-opacity: 0.1; --patch-opacity: 0.15;">
  <div class="grunge-overlay"></div>
  <div class="grunge-scuffs"></div>
  <!-- Content -->
</div>
```

| Variable | What it Controls | Default | Range |
|----------|-----------------|---------|-------|
| `--base-lightness` | Overall grey tone | 94% | 85% (darker) to 98% (lighter) |
| `--streak-opacity` | Intensity of vertical drip marks | 0.08 | 0 to 0.15 |
| `--patch-opacity` | Intensity of cloudy worn patches | 0.12 | 0 to 0.2 |
| `--grain-opacity` | Base texture grain | 0.06 | 0 to 0.12 |

### Effect Layers

The grunge texture is built from 4 layers:

1. **Base grain** - Fine noise texture
2. **Vertical streaks** - Paint drip / brush mark effect
3. **Cloudy patches** - Irregular worn areas (via `.grunge-overlay`)
4. **Abrasion marks** - Subtle scuffs and scratches (via `.grunge-scuffs`)

### Examples

**Subtle weathered look:**
```html
<div class="grunge-texture" style="--streak-opacity: 0.05; --patch-opacity: 0.08;">
  <div class="grunge-overlay"></div>
  <div class="grunge-scuffs"></div>
  <h2>Minimal wear</h2>
</div>
```

**Heavy distressed look:**
```html
<div class="grunge-texture" style="--base-lightness: 90%; --streak-opacity: 0.12; --patch-opacity: 0.18;">
  <div class="grunge-overlay"></div>
  <div class="grunge-scuffs"></div>
  <h2>Heavily worn</h2>
</div>
```

**Darker concrete:**
```html
<div class="grunge-texture" style="--base-lightness: 88%; --grain-opacity: 0.1;">
  <div class="grunge-overlay"></div>
  <div class="grunge-scuffs"></div>
  <h2>Dark industrial</h2>
</div>
```

### Dark Mode

The grunge texture automatically adjusts for dark mode with a default lightness of 18%. You can customize this:

```css
.dark .my-dark-grunge {
  --base-lightness: 22%; /* Lighter dark mode */
}
```

### Pro Tips

- Keep `--streak-opacity` between 0.05-0.12 for realistic drips
- Use higher `--patch-opacity` (0.15-0.2) for aged, weathered looks
- Lower `--base-lightness` (88-92%) creates a moodier, industrial feel
- Combine with rounded corners for a softer industrial aesthetic
- Works great for background sections that need visual interest without being distracting

