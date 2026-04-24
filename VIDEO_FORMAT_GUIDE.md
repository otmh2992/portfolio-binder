# 📹 Video Format & Compatibility Guide

## ⚠️ The Problem You Just Experienced

Your video uploaded successfully to Cloudflare R2 and the Worker is serving it correctly, **BUT it won't play in the browser** because of the video codec.

## Why Videos Don't Play

**Browser Requirement:** All major browsers require videos to use the **H.264 video codec** to play natively.

**Your video likely uses:**
- HEVC (H.265) - Common on iPhones
- Or another incompatible codec

## ✅ The Solution: Convert to H.264

### Option 1: HandBrake (Free & Easy)

1. **Download HandBrake:** https://handbrake.fr/
2. **Install and open** the app
3. **Drag your video** into HandBrake
4. **Select the "Web" preset** (this uses H.264)
5. **Click "Start"** to convert
6. **Upload the converted file**

### Option 2: FFmpeg (Command Line)

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -movflags +faststart output.mp4
```

### Option 3: Online Converters

- **CloudConvert:** https://cloudconvert.com/mp4-converter
- **FreeConvert:** https://www.freeconvert.com/video-converter

## 📱 iPhone Users

**iPhone videos use HEVC/H.265 by default** which won't work in web browsers.

**Options:**
1. Convert using HandBrake (recommended)
2. Or change iPhone settings:
   - Settings → Camera → Formats
   - Select "Most Compatible" instead of "High Efficiency"
   - This records in H.264 instead

## ✅ Recommended Video Settings

For best compatibility and performance:

- **Format:** MP4
- **Video Codec:** H.264 (also called AVC)
- **Audio Codec:** AAC
- **Resolution:** 1920x1080 or lower
- **File Size:** Under 200MB for faster uploads
- **Bitrate:** 5-8 Mbps for 1080p

## 🔍 How to Check Your Video Codec

### On Mac:
1. Right-click video → Get Info
2. Look under "More Info"
3. Check "Codecs" line

### On Windows:
1. Right-click video → Properties → Details
2. Look for "Video codec"

### Using VLC:
1. Open video in VLC
2. Tools → Codec Information
3. Check "Codec" under Video section

## 🎯 Quick Reference

| Format | Will It Work? | Notes |
|--------|---------------|-------|
| MP4 (H.264) | ✅ YES | Best choice |
| MP4 (HEVC/H.265) | ❌ NO | Must convert |
| MOV (H.264) | ✅ YES | But MP4 preferred |
| MOV (HEVC) | ❌ NO | Common on iPhones |
| AVI | ⚠️ MAYBE | Depends on codec |
| WebM | ✅ YES | Works well |
| MKV | ❌ NO | Not supported |

## 🛠️ Your Current Setup

- **Worker URL:** `https://video-streaming.otmh-here.workers.dev/`
- **R2 Bucket:** `portfoliovideos`
- **Max Upload:** 500MB
- **Storage:** 10GB free per month

The infrastructure is working perfectly - you just need H.264 encoded videos! 🎬
