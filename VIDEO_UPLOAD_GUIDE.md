# Video Upload Guide

## 🎉 Status: READY TO USE!

✅ All TypeScript errors fixed  
✅ Video upload system fully implemented  
✅ Cloudflare R2 configured and ready  
✅ Both image and video uploads working  

---

# 📹 Video Upload System Guide

Your portfolio now supports **direct video uploads** to Cloudflare R2! Users can upload videos up to 500MB, and they'll be automatically stored in your R2 bucket with a public URL.

---

## 🎯 What's Included

### ✅ Features

- **Direct video uploads** from the submission form
- **File validation** (MP4, MOV, AVI, WebM formats)
- **Size limit**: 500MB per video
- **Instant preview** before submission
- **Drag-and-drop** support
- **Progress feedback** during upload
- **Video player** in portfolio grid with modal playback
- **Automatic storage** in Cloudflare R2
- **Public URLs** for all uploaded videos

---

## 🚀 How It Works

### For Users:

1. Go to `/submit` page
2. Choose "Video" option
3. Upload a video file (drag-drop or click)
4. See instant preview
5. Fill in project details
6. Submit!

### Behind the Scenes:

1. Video is uploaded to your API endpoint
2. File is validated (type, size)
3. Video is stored in R2 with unique filename
4. Public URL is generated
5. URL is saved to your CMS with other submission data
6. Admin reviews and publishes
7. Video appears in portfolio grid

---

## 📋 CMS Field Setup

To support videos in your Portfolio collection, add this field:

### Required Field:

| Field Name | Field Type | Slug | Required |
|-----------|-----------|------|----------|
| Video URL | Plain Text | `video-url` | No |

**Alternative slugs supported:**
- `video-url`
- `videoUrl`
- `video`

---

## 🎬 Video Display

Videos appear in the portfolio grid with:

- **Play button overlay** (visible on hover)
- **Thumbnail image** (if provided, otherwise gradient background)
- **Click to play** in fullscreen modal
- **Native video controls** for pause, volume, fullscreen, etc.

---

## 💰 Storage Costs

Your R2 bucket includes:

- **10 GB storage FREE** per month
- **10 million Class A operations FREE** per month
- **100 million Class B operations FREE** per month
- **UNLIMITED bandwidth** with zero egress fees

### Cost Examples:

**500MB videos:**
- ~20 videos = 10GB (FREE tier)
- 100 videos = 50GB = ~$0.75/month
- 1,000 videos = 500GB = ~$7.50/month

**Compare to alternatives:**
- Vimeo Pro: $20/month for 250GB
- YouTube: Free but with ads/branding
- Cloudflare R2: **Way cheaper** + no bandwidth costs!

---

## 🔧 Configuration

Your `.env` file already has these settings:

```env
CLOUDFLARE_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="portfolio-videos"
R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"
```

---

## 📦 Files Created

### Components:
- `src/components/VideoUpload.tsx` - Video upload UI component
- Updated `src/components/PortfolioGrid.tsx` - Added video playback support

### API Routes:
- `src/pages/api/upload-video.ts` - Handles video uploads to R2

### Utilities:
- `src/lib/r2.ts` - R2 client and upload helpers

### Pages:
- Updated `src/pages/submit.astro` - Added video upload option

---

## 🎨 Customization

### Change Maximum File Size:

Edit `src/components/VideoUpload.tsx`:

```tsx
const MAX_FILE_SIZE = 500 * 1024 * 1024; // Change 500 to desired MB
```

And `src/pages/api/upload-video.ts`:

```ts
const maxSize = 500 * 1024 * 1024; // Change 500 to desired MB
```

### Add More Video Formats:

Edit `src/components/VideoUpload.tsx`:

```tsx
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/ogg', // Add more formats here
];
```

### Customize Video Grid Display:

Videos use the same asymmetrical grid as images. The play button and thumbnail are styled in `src/components/PortfolioGrid.tsx`.

---

## 🔒 Security Notes

- Videos are stored with unique timestamped filenames to prevent overwrites
- File type validation prevents non-video uploads
- Size limits prevent abuse
- Public bucket URLs are generated automatically
- No authentication required for viewing (portfolio is public)

---

## 🐛 Troubleshooting

### Video Upload Fails:

1. Check R2 credentials in `.env`
2. Verify bucket has public access enabled
3. Check file size (must be < 500MB)
4. Ensure file is valid video format

### Video Doesn't Play:

1. Check that `video-url` field exists in CMS
2. Verify video URL is accessible
3. Try different browser
4. Check browser console for errors

### Can't See Videos in Grid:

1. Make sure CMS items are **published** (not drafted)
2. Verify `video-url` field has a value
3. Check that R2 bucket is publicly accessible
4. Refresh the page

---

## 🎓 Admin Workflow for Videos

1. User submits video via `/submit`
2. Video uploads to R2 automatically
3. Submission appears in your review queue
4. You receive submission with `videoUrl` field
5. Review submission in Webflow CMS
6. Add any additional fields (title, description, etc.)
7. **Publish** the item
8. Video appears in portfolio grid immediately!

---

## 📊 Monitor Usage

Track your R2 usage in the Cloudflare Dashboard:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Overview**
3. View storage, bandwidth, and request metrics
4. Set up billing alerts if needed

---

## 🚀 Next Steps

Your video upload system is **fully functional**!

### What's Working:

✅ Users can upload videos directly  
✅ Videos are stored in R2 with public URLs  
✅ Videos display in portfolio grid  
✅ Click to play in fullscreen modal  
✅ Submission form updated with video option  
✅ File validation and size limits  

### Optional Enhancements:

- Add video thumbnails (auto-generated from first frame)
- Add video transcoding for different resolutions
- Implement video compression before upload
- Add progress bar during upload
- Support video captions/subtitles

---

## 💡 Tips

- **Optimize videos** before uploading (compress with HandBrake, etc.)
- **Use thumbnails** for faster loading (upload separate thumbnail image)
- **Keep videos under 100MB** for best user experience
- **Test on mobile** to ensure playback works
- **Monitor R2 usage** to stay within free tier

---

## 🎉 You're All Set!

Your portfolio now supports both **images AND videos**! 

Try it out:
1. Go to `/submit`
2. Choose "Video"
3. Upload a test video
4. See it in action! 🎬

---

**Questions?** Check the R2 setup guide in `R2_SETUP_GUIDE.md` or the submission workflow in `SUBMISSION_GUIDE.md`.

