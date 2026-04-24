# 🎨 Asymmetrical Portfolio Grid - Setup Guide

## What You Have Now

An **automatic asymmetrical masonry grid** that:
- ✅ Displays images in varying sizes (small, medium, large, tall, wide)
- ✅ Auto-arranges items in an interesting, Pinterest-style layout
- ✅ Pulls images directly from your Webflow CMS
- ✅ No manual layout work needed—just upload and go!
- ✅ Responsive on all devices
- ✅ Beautiful hover effects with image info overlay

## 🚀 How to Use It

### Step 1: Create Your Portfolio Collection

1. Go to **Webflow CMS** (your Webflow dashboard)
2. Click **"Add Collection"**
3. Name it: **`Portfolio`** (exactly like this)
4. Click **Create**

### Step 2: Add Required Fields

Your collection needs at least an **image field**. Add these fields:

#### Required:
- **Image** field
  - Field name: `image` (or `main-image`, `photo`, `thumbnail`)
  - Type: Image
  - This is what the grid will display

#### Optional but Recommended:
- **Description** field
  - Field name: `description` (or `short-description`, `excerpt`)
  - Type: Plain Text or Rich Text
  - Shows on hover overlay

- **Name** field
  - Automatically included
  - Shows as the title on hover

### Step 3: Add Your Images

1. Click **"Add Item"** in your Portfolio collection
2. Give it a name
3. Upload an image
4. Add a description (optional)
5. **Important**: Click **"Publish"** (not just "Save as Draft")

Repeat for as many images as you want!

### Step 4: Refresh Your App

1. Go to your app homepage
2. Refresh the page
3. Watch your images automatically arrange into the asymmetrical grid! 🎉

## 📐 How the Asymmetrical Layout Works

The grid uses a **repeating pattern** of different sizes:

```
Pattern cycle (repeats):
1. Large Square (2×2)
2. Small Square (1×1)
3. Tall Rectangle (2×1)
4. Wide Rectangle (1×2)
5. Small Square (1×1)
6. Tall Rectangle (2×1)
7. Small Square (1×1)
8. Large Square (2×2)
9. Wide Rectangle (1×2)
10. Small Square (1×1)
```

This creates visual variety automatically—you just add images in any order!

## 🎯 Grid Behavior

- **Mobile (< 640px)**: Single column, stacks vertically
- **Tablet (640-767px)**: Flexible 2-3 columns
- **Medium (768-1023px)**: 4 columns
- **Desktop (1024px+)**: 6 columns

The asymmetrical sizes adapt to create interesting layouts at every screen size.

## ✨ Features

### Automatic Image Detection
The component automatically finds your image field, even if you name it:
- `image`
- `main-image`
- `thumbnail`
- `featured-image`
- `photo`
- `picture`

### Hover Overlay
- Dark gradient appears on hover
- Shows image name and description
- Smooth animations

### Responsive Images
- Lazy loading for performance
- Object-fit cover (fills the space perfectly)
- Zoom effect on hover

## 🎨 Customization Options

### Change the Pattern
Edit `src/components/PortfolioGrid.tsx`, find the `patterns` array:

```typescript
const patterns = [
  { rows: 2, cols: 2 }, // Make this { rows: 3, cols: 3 } for huge squares
  { rows: 1, cols: 1 }, // Small items
  // Add more patterns here!
];
```

### Change Colors
The grid uses your Webflow design tokens:
- Borders: `--border`
- Background: `--card`
- Hover accent: `--primary`
- Text: `--foreground`

Edit these in Webflow Designer → Apps → Design Tokens

### Change Grid Size
Edit `src/styles/global.css`, find `.asymmetric-grid`:

```css
.asymmetric-grid {
  grid-template-columns: repeat(6, 1fr); /* Change 6 to 4 for bigger items */
  grid-auto-rows: 200px; /* Change height of rows */
  gap: 1.5rem; /* Change spacing between items */
}
```

### Remove Hover Overlay
In `src/styles/global.css`, add:

```css
.portfolio-overlay {
  display: none; /* Hides the overlay completely */
}
```

## 🐛 Troubleshooting

### "No Portfolio Items Found"
**Problem**: Collection is empty or items aren't published

**Solution**:
1. Check your Webflow CMS
2. Ensure items are **Published** (not just saved as drafts)
3. Wait a few seconds and refresh

### "Error Loading Portfolio"
**Problem**: Collection doesn't exist or API token issue

**Solution**:
1. Verify collection is named exactly **"Portfolio"**
2. Check `/cms-debug` page for configuration status
3. Ensure `WEBFLOW_CMS_SITE_API_TOKEN` is set

### Images Not Showing
**Problem**: Image field not found

**Solution**:
1. Make sure your image field is named one of:
   - `image`, `main-image`, `thumbnail`, `featured-image`, `photo`, `picture`
2. Or edit the component to match your field name
3. Check that images are actually uploaded (not empty fields)

### Layout Looks Wrong
**Problem**: Browser cache or CSS not loading

**Solution**:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check that `src/styles/global.css` is imported in your layout

## 📊 Performance Tips

### Optimize Images in Webflow
1. Upload images at reasonable sizes (max 2000px wide)
2. Use JPEG for photos, PNG for graphics
3. Webflow automatically optimizes images via CDN

### Loading Many Images
The grid uses lazy loading automatically:
- Only visible images load initially
- Images below the fold load as you scroll
- Improves page speed significantly

### Fetching Limits
By default, the component fetches up to **100 items**. To change this:

Edit `src/components/PortfolioGrid.tsx`:
```typescript
const response = await fetch(`${baseUrl}/api/cms/${collectionId}?limit=100`);
// Change 100 to your desired number
```

## 🎯 Next Steps

### Add Click Functionality
Want images to open in a lightbox or link to detail pages?

1. Wrap the image in a link:
```tsx
<a href={`/portfolio/${item.fieldData.slug}`}>
  <img src={imageUrl} alt={imageAlt} />
</a>
```

2. Or add a lightbox library like `yet-another-react-lightbox`

### Add Filtering
Want to filter by category or tags?

1. Add a **Category** field to your collection
2. Add filter buttons above the grid
3. Filter the `items` array before mapping

### Add Animations
The grid already has smooth hover effects. For more:

1. Install `framer-motion`
2. Wrap items in `<motion.div>`
3. Add entrance animations

## 📁 File Structure

```
src/
├── components/
│   └── PortfolioGrid.tsx       ← Main grid component
├── pages/
│   ├── index.astro              ← Homepage that displays grid
│   └── api/
│       └── cms/
│           └── [collectionId].ts ← Fetches CMS data
├── styles/
│   └── global.css               ← Grid styles here
└── lib/
    └── cms.ts                   ← Helper functions
```

## 🎉 You're Done!

Your asymmetrical portfolio grid is ready! Just:

1. ✅ Create "Portfolio" collection in Webflow CMS
2. ✅ Add image field
3. ✅ Upload images and publish
4. ✅ Refresh your app

The grid handles all the layout automatically—no more manual positioning! 🚀

---

**Need help?** Check `/cms-debug` or review `COLLECTION_LIST_GUIDE.md`
