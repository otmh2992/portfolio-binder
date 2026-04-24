# Collection List Display Guide

## Understanding the Issue

You created a **Collection Page and Collection List in Webflow Designer**, but it's not showing items in your app. This is expected because there are **two different ways** to display CMS data:

### Method 1: Devlink Components (Designer-based) ❌ Not Working Yet
- Create Collection List in Webflow Designer
- Export via Devlink
- **Limitation**: Collection Lists require manual data binding in code
- **Status**: Your component hasn't been exported yet

### Method 2: API-based Components (Code-based) ✅ Already Working
- Fetch CMS data via Webflow API
- Render with custom React components
- **Status**: `PortfolioGrid` component is ready and working

## ✅ Current Working Solution

Your app **already has a working portfolio display** using Method 2. Here's what you need:

### Step 1: Create Portfolio Collection
1. Go to Webflow CMS (not Designer)
2. Create a collection named **"Portfolio"**
3. Add fields:
   - `image` (Image field)
   - `description` (Plain Text or Rich Text)
   - Any other fields you want

### Step 2: Add Items
1. Create portfolio items in the collection
2. **Important**: Click "Publish" (not just "Save as Draft")
3. Live items are required for the API

### Step 3: View Your Portfolio
1. Visit your app homepage
2. Items will display automatically in a responsive grid
3. No Designer work needed!

## 🎨 If You Want to Use Designer Collection Lists

To use your Webflow Designer Collection List component:

### Step 1: Prepare Your Designer Component
1. In Webflow Designer, create your Collection Page
2. Add a Collection List wrapper
3. Design your Collection Item inside
4. **Important**: Give your Collection List a unique class name (e.g., `portfolio-list`)

### Step 2: Export via Devlink
Your Webflow site needs to be configured for Devlink exports:

1. In Designer, ensure your Collection List is properly set up
2. The component should appear in `src/site-components/` after export
3. Look for files like `PortfolioList.jsx` or similar

### Step 3: Request Code Binding
Once the component is exported, the Collection List needs manual data binding because:
- Devlink exports static HTML/CSS structure
- CMS data must be fetched and injected separately
- This requires custom code to connect the two

I can help write this code once your component is exported.

## Why Collection Lists Are Different

Collection Lists in Devlink are **challenging** because:

1. **Static Export**: Devlink exports the visual design, not the dynamic data
2. **No Auto-Binding**: Unlike Webflow's published sites, apps don't auto-populate Collection Lists
3. **Manual Mapping**: You must fetch CMS data and map it to the component structure
4. **Complexity**: Each Collection Item child element needs individual data binding

### Example of What's Required:

```tsx
// Fetch CMS data
const items = await fetchFromCMS();

// Map to your Devlink component
items.map(item => (
  <YourCollectionItem
    image={item.fieldData.image}
    title={item.fieldData.name}
    description={item.fieldData.description}
  />
))
```

## 📊 Comparison

| Feature | API-based (Current) | Devlink Collection List |
|---------|-------------------|------------------------|
| Setup complexity | ✅ Simple | ❌ Complex |
| Visual control | ⚠️ Code-based | ✅ Designer-based |
| CMS binding | ✅ Automatic | ❌ Manual required |
| Customization | ✅ Full control | ⚠️ Limited by export |
| Working now | ✅ Yes | ❌ Needs setup |

## 🎯 Recommended Path

**For most users, the API-based approach (what's already built) is better because:**

1. ✅ It's already working
2. ✅ Easier to customize
3. ✅ More flexible
4. ✅ Standard Webflow Apps practice
5. ✅ No Devlink export needed

**Use Designer Collection Lists only if:**
- You have complex, pre-designed layouts you want to preserve exactly
- You're comfortable with manual data binding code
- You need Designer's visual editing for the layout

## 🚀 Next Steps

### To Use Current Solution (Recommended):
1. ✅ Create "Portfolio" collection in Webflow CMS
2. ✅ Add and publish items
3. ✅ Refresh your app homepage
4. ✅ See items display automatically

### To Use Designer Collection List:
1. ⏳ Ensure Collection List is exported from Designer
2. ⏳ Verify component appears in `src/site-components/`
3. ⏳ Request custom binding code
4. ⏳ Test and debug

## 🆘 Troubleshooting

### "Items still not showing"
- Check `/cms-debug` page to verify:
  - ✅ Portfolio collection exists
  - ✅ Items are published (not drafts)
  - ✅ API token is configured

### "I want to use my Designer layout"
- First verify the Devlink export includes your Collection List
- Check `src/site-components/` for component files
- The Collection List component may be split into multiple files

### "Can I combine both approaches?"
- Yes! You can:
  - Use API to fetch data
  - Pass data to your Devlink component
  - This gives you Designer styling + code flexibility

## 📝 Summary

**You have a working solution already!** The PortfolioGrid component will display your CMS items as soon as you:

1. Create the Portfolio collection
2. Add and publish items
3. Refresh the page

If you specifically need your Designer Collection List layout, we'll need to export it from Devlink first, then write custom binding code.

---

**Need help?** Visit `/cms-debug` to check your CMS configuration.
