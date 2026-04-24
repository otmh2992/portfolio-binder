# Portfolio CMS Setup Guide

## Current Status
Your Portfolio Binder app is now configured to display items from a Webflow CMS collection called "Portfolio".

## What's Been Fixed

### 1. **API Routes Created**
- `src/pages/api/cms/[collectionId].ts` - Fetches list of items from any collection
- `src/pages/api/cms/[collectionId]/[itemId].ts` - Fetches individual items

### 2. **CMS Helper Utilities**
- `src/lib/cms.ts` - Server-side functions to interact with Webflow CMS
  - `listCollections()` - Lists all available collections
  - `findCollection()` - Finds a collection by name or slug
  - `getCollectionItems()` - Fetches items from a collection

### 3. **Portfolio Grid Component**
- `src/components/PortfolioGrid.tsx` - React component that:
  - Fetches and displays portfolio items
  - Shows loading skeletons while fetching
  - Displays helpful error messages
  - Automatically detects common image fields
  - Shows all published items in a responsive grid

### 4. **Updated Home Page**
- `src/pages/index.astro` - Now displays your portfolio items with proper error handling

## Required: Create Your Portfolio Collection

Since no CMS collections were found, you need to create one in Webflow:

### Step 1: Create the Collection in Webflow
1. Go to your Webflow site
2. Navigate to the CMS Collections
3. Create a new collection named **"Portfolio"**

### Step 2: Add Fields to Your Collection
Add these recommended fields (the component will work with whatever fields you add):

**Required fields** (automatically added by Webflow):
- `name` - The portfolio item title
- `slug` - URL-friendly identifier

**Recommended image fields** (add at least one):
- `image` - Main portfolio image
- `main-image` - Alternative name
- `thumbnail` - Thumbnail image
- `featured-image` - Featured image

**Recommended text fields**:
- `description` - Full description
- `short-description` - Brief summary
- `excerpt` - Short excerpt
- `summary` - Summary text

### Step 3: Publish Items
1. Add some portfolio items to your collection
2. **Important**: Make sure to **Publish** the items (not just save as draft)
3. Only published items will appear in your app

### Step 4: Verify Configuration
Make sure these environment variables are set:
- `WEBFLOW_CMS_SITE_API_TOKEN` - Your CMS API token
- `WEBFLOW_SITE_ID` - Your Webflow site ID
- `WEBFLOW_API_HOST` - (Optional) Custom API host

## How It Works

### Data Flow
1. **Server-side**: The home page (`index.astro`) calls `findCollection()` to get the Portfolio collection ID
2. **Client-side**: The `PortfolioGrid` component fetches items via the API route
3. **API Route**: Calls Webflow's API to get published items only
4. **Display**: Items are rendered in a responsive card grid

### Automatic Field Detection
The component automatically looks for common field names:

**Images**:
- `image`, `main-image`, `thumbnail`, `featured-image`

**Descriptions**:
- `description`, `short-description`, `excerpt`, `summary`

### Responsive Grid
- **Mobile**: 1 column
- **Tablet**: 2 columns  
- **Desktop**: 3 columns

## Troubleshooting

### "Portfolio collection not found"
- Ensure you created a collection named exactly "Portfolio" in Webflow
- Check that the collection is published
- Verify your WEBFLOW_SITE_ID is correct

### "No Portfolio Items Found"
- Make sure you've added items to the collection
- **Items must be Published** (not just saved as drafts)
- Check the CMS API token has read permissions

### "Missing CMS API token"
- Verify `WEBFLOW_CMS_SITE_API_TOKEN` environment variable is set
- Ensure the token has CMS read permissions

### Images Not Showing
- Check that your image field is named one of: `image`, `main-image`, `thumbnail`, or `featured-image`
- Or update the component to match your actual field name

## Customization

### Using Different Field Names
Edit `src/components/PortfolioGrid.tsx` and update the field detection logic:

```tsx
// Find your custom image field
const imageField = item.fieldData['your-custom-image-field'];

// Find your custom description field
const description = item.fieldData['your-custom-description-field'];
```

### Changing the Collection Name
If you want to use a different collection name:

1. Update `src/pages/index.astro`:
```astro
const collection = await findCollection('YourCollectionName', Astro.locals);
```

### Styling
The component uses shadCN UI components and Tailwind CSS. Customize in:
- `src/components/PortfolioGrid.tsx` - Component styling
- `src/pages/index.astro` - Page layout
- `src/styles/global.css` - Global styles

## Next Steps

1. ✅ Create your Portfolio collection in Webflow
2. ✅ Add image and description fields
3. ✅ Publish some portfolio items
4. ✅ Refresh your app to see the items display
5. 🎨 Customize the styling to match your brand
6. 🚀 Deploy your app

---

**Need help?** Check the Webflow CMS documentation: https://developers.webflow.com/data/reference
