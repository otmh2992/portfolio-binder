


import React from 'react';
import { createRoot } from 'react-dom/client';
import { baseUrl } from '../lib/base-url';

console.log('[Submit Form] Script file loaded');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Submit Form] DOMContentLoaded event fired');
  console.log('[Submit Form] Looking for form element...');

  const form = document.getElementById('submit-form') as HTMLFormElement;

  if (!form) {
    console.error('[Submit Form] ❌ Form element not found!');
    return;
  }

  console.log('[Submit Form] ✅ Form element found');
  console.log('[Submit Form] Attaching event handlers...');

  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const successMessage = document.getElementById('success-message') as HTMLDivElement;
  const errorMessage = document.getElementById('error-message') as HTMLDivElement;
  const errorText = document.getElementById('error-text') as HTMLParagraphElement;
  const submitAnotherBtn = document.getElementById('submit-another') as HTMLButtonElement;
  const tryAgainBtn = document.getElementById('try-again') as HTMLButtonElement;

  const imageInput = document.getElementById('image') as HTMLInputElement;
  const imagePreview = document.getElementById('image-preview') as HTMLDivElement;
  const previewImg = document.getElementById('preview-img') as HTMLImageElement;
  const removeImageBtn = document.getElementById('remove-image') as HTMLButtonElement;
  const fileSizeText = document.getElementById('file-size') as HTMLParagraphElement;

  const imageUploadSection = document.getElementById('image-upload-section') as HTMLDivElement;
  const videoUploadSection = document.getElementById('video-upload-section') as HTMLDivElement;
  const videoUploadContainer = document.getElementById('video-upload-container') as HTMLDivElement;

  const mediaTypeRadios = document.querySelectorAll('input[name="media-type"]');

  let selectedImageFile: File | null = null;
  let selectedVideoFile: File | null = null;
  let videoPreviewUrl: string | null = null;
  let isUploading = false;
  let uploadProgress = 0;
  let uploadSpeed = 0;
  let timeRemaining = 0;

  // Initialize React Video Upload Component
  let videoRoot: any = null;
  let VideoUploadComponent: any = null;

  function renderVideoUpload() {
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
    const RECOMMENDED_SIZE = 200 * 1024 * 1024; // 200MB

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      }
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatSpeed = (bytesPerSecond: number) => {
      if (bytesPerSecond < 1024 * 1024) {
        return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
      }
      return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
    };

    const formatTime = (seconds: number) => {
      if (seconds < 60) {
        return `${Math.ceil(seconds)} seconds`;
      }
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.ceil(seconds % 60);
      if (remainingSeconds === 0) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
      }
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (videoPreviewUrl && selectedVideoFile) {
      // Show video preview
      const hasProgressBar = document.getElementById('upload-progress-bar');
      const hasProgressText = document.getElementById('upload-progress-text');
      
      // Only update progress elements if they exist (during upload)
      if (isUploading && hasProgressBar && hasProgressText && uploadProgress > 0 && uploadProgress < 100) {
        // Just update the progress values without full re-render
        hasProgressBar.style.width = `${uploadProgress}%`;
        hasProgressText.textContent = `Uploading video... ${uploadProgress}%`;
        
        const speedText = document.getElementById('upload-speed-text');
        const timeText = document.getElementById('upload-time-text');
        
        if (speedText && uploadSpeed > 0) {
          speedText.textContent = formatSpeed(uploadSpeed);
        }
        if (timeText && timeRemaining > 0) {
          timeText.textContent = `Time remaining: ~${formatTime(timeRemaining)}`;
        }
        
        return; // Don't re-render the whole thing
      }
      
      // Full render only when state changes significantly
      videoUploadContainer.innerHTML = `
        <div class="space-y-3">
          <div class="relative rounded-lg border-2 border-border overflow-hidden bg-card">
            <video src="${videoPreviewUrl}" controls class="w-full max-h-96 object-contain bg-black"></video>
            ${!isUploading ? `
              <button
                type="button"
                id="remove-video-btn"
                class="absolute top-2 right-2 p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                aria-label="Remove video"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ` : ''}
          </div>
          
          ${isUploading && uploadProgress > 0 && uploadProgress < 100 ? `
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span id="upload-progress-text" class="font-medium text-foreground">Uploading video... ${uploadProgress}%</span>
                ${uploadSpeed > 0 ? `<span id="upload-speed-text" class="text-muted-foreground">${formatSpeed(uploadSpeed)}</span>` : '<span id="upload-speed-text" class="text-muted-foreground"></span>'}
              </div>
              
              <div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div id="upload-progress-bar" class="bg-primary h-full transition-all duration-300 ease-out rounded-full" style="width: ${uploadProgress}%"></div>
              </div>

              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span id="upload-time-text">${timeRemaining > 0 ? `Time remaining: ~${formatTime(timeRemaining)}` : ''}</span>
                <span>${uploadSpeed > 0 && uploadProgress > 0 ? `Average speed: ${formatSpeed(uploadSpeed)}` : ''}</span>
              </div>
            </div>
          ` : ''}
          
          <p class="text-xs text-muted-foreground">
            ${selectedVideoFile.name} (${formatFileSize(selectedVideoFile.size)})
          </p>
        </div>
      `;

      if (!isUploading) {
        const removeBtn = document.getElementById('remove-video-btn');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            selectedVideoFile = null;
            if (videoPreviewUrl) {
              URL.revokeObjectURL(videoPreviewUrl);
              videoPreviewUrl = null;
            }
            renderVideoUpload();
          });
        }
      }
    } else {
      // Show upload area
      const fileSize = selectedVideoFile ? selectedVideoFile.size : 0;
      const showWarning = fileSize > RECOMMENDED_SIZE && fileSize <= MAX_FILE_SIZE;

      videoUploadContainer.innerHTML = `
        <div class="space-y-3">
          ${showWarning ? `
            <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-2">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">Large File Warning</p>
                <p class="text-xs text-amber-800 dark:text-amber-200">This file is ${formatFileSize(fileSize)}. Consider compressing to under 200MB for faster uploads.</p>
              </div>
            </div>
          ` : ''}
          
          <div class="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm">
                <p class="font-medium text-blue-900 dark:text-blue-100 mb-1">📹 Video Upload Tips</p>
                <ul class="text-blue-800 dark:text-blue-200 space-y-1 text-xs">
                  <li>• <strong>Recommended:</strong> Keep files under 200MB for faster uploads</li>
                  <li>• <strong>Best format:</strong> MP4 (H.264) for compatibility</li>
                  <li>• <strong>Need to compress?</strong> Use <a href="https://handbrake.fr/" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">HandBrake</a> (free)</li>
                </ul>
              </div>
            </div>
          </div>

          <div id="video-drop-zone" class="relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 border-border hover:border-primary ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}">
            <input type="file" id="video-file-input" accept="video/mp4,video/quicktime,video/x-msvideo,video/webm" class="hidden" ${isUploading ? 'disabled' : ''} />
            
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 rounded-full bg-muted">
                <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div>
                <p class="text-lg font-medium mb-1">Upload a video</p>
                <p class="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                <p class="text-xs text-muted-foreground mt-2">MP4, MOV, AVI, or WebM (max 500MB)</p>
              </div>
            </div>
          </div>
          
          <div id="video-error" class="hidden p-3 bg-destructive/10 border border-destructive rounded-md flex items-start gap-2">
            <svg class="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm text-destructive" id="video-error-text"></p>
          </div>
        </div>
      `;

      // Attach event listeners
      const dropZone = document.getElementById('video-drop-zone');
      const fileInput = document.getElementById('video-file-input') as HTMLInputElement;
      const errorDiv = document.getElementById('video-error') as HTMLDivElement;
      const errorText = document.getElementById('video-error-text') as HTMLParagraphElement;

      const validateVideo = (file: File) => {
        errorDiv?.classList.add('hidden');
        
        const acceptedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
        if (!acceptedTypes.includes(file.type)) {
          if (errorText) errorText.textContent = 'Please upload a video file (MP4, MOV, AVI, or WebM)';
          errorDiv?.classList.remove('hidden');
          return false;
        }

        if (file.size > MAX_FILE_SIZE) {
          if (errorText) errorText.textContent = 'Video file must be smaller than 500MB';
          errorDiv?.classList.remove('hidden');
          return false;
        }

        // Warn about MOV files (often HEVC/H.265 which won't play in browsers)
        if (file.type === 'video/quicktime' || file.name.toLowerCase().endsWith('.mov')) {
          if (!confirm('⚠️ MOV files from iPhones often use HEVC/H.265 codec which won\'t play in web browsers.\n\n' +
                      '✅ RECOMMENDED: Convert to MP4 (H.264) using HandBrake first.\n\n' +
                      '❌ If you continue, your video may upload successfully but fail to play.\n\n' +
                      'Continue anyway?')) {
            return false;
          }
        }

        // Warn about AVI files (codec unknown)
        if (file.type === 'video/x-msvideo' || file.name.toLowerCase().endsWith('.avi')) {
          if (!confirm('⚠️ AVI files may not be compatible with web browsers.\n\n' +
                      '✅ RECOMMENDED: Convert to MP4 (H.264) using HandBrake first.\n\n' +
                      'Continue anyway?')) {
            return false;
          }
        }

        return true;
      };

      const handleFile = (file: File) => {
        if (validateVideo(file)) {
          selectedVideoFile = file;
          videoPreviewUrl = URL.createObjectURL(file);
          renderVideoUpload();
        }
      };

      if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => {
          if (!isUploading) fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        });

        dropZone.addEventListener('dragenter', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('border-primary', 'bg-primary/5');
        });

        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        dropZone.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('border-primary', 'bg-primary/5');
        });

        dropZone.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('border-primary', 'bg-primary/5');
          
          if (!isUploading) {
            const file = e.dataTransfer?.files?.[0];
            if (file) handleFile(file);
          }
        });
      }
    }
  }

  // Handle media type switching
  mediaTypeRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value;

      if (value === 'image') {
        imageUploadSection.classList.remove('hidden');
        videoUploadSection.classList.add('hidden');
        imageInput.required = true;
      } else {
        imageUploadSection.classList.add('hidden');
        videoUploadSection.classList.remove('hidden');
        imageInput.required = false;
        try {
          renderVideoUpload();
        } catch (error) {
          console.error('[Submit Form] Error switching to video mode:', error);
        }
      }
    });
  });

  // Handle image selection and preview
  imageInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      imageInput.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      imageInput.value = '';
      return;
    }

    selectedImageFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target?.result as string;
      imagePreview.classList.remove('hidden');

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      fileSizeText.textContent = `${file.name} (${sizeInMB} MB)`;
    };
    reader.readAsDataURL(file);
  });

  // Remove image
  removeImageBtn.addEventListener('click', () => {
    selectedImageFile = null;
    imageInput.value = '';
    imagePreview.classList.add('hidden');
    previewImg.src = '';
  });

  submitBtn.addEventListener('click', async (e) => {
    console.log('[Submit Form] Submit button clicked!');
    e.preventDefault();

    const mediaType = (document.querySelector('input[name="media-type"]:checked') as HTMLInputElement).value;

    if (mediaType === 'image' && !selectedImageFile) {
      alert('Please select an image');
      return;
    }

    if (mediaType === 'video' && !selectedVideoFile) {
      alert('Please select a video');
      return;
    }

    isUploading = true;
    submitBtn.disabled = true;
    submitBtn.textContent = mediaType === 'video' ? 'Uploading video...' : 'Uploading...';

    const formData = new FormData(form);

    try {
      let mediaUrl = '';
      let mediaType_final = mediaType;

      if (mediaType === 'video' && selectedVideoFile) {
        // Upload video to R2 with progress tracking
        const videoFormData = new FormData();
        videoFormData.append('video', selectedVideoFile);

        submitBtn.textContent = 'Uploading video to cloud...';

        // Use XMLHttpRequest for progress tracking
        const videoUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const startTime = Date.now();
          let lastLoaded = 0;
          let lastTime = startTime;
          let lastUpdateTime = startTime;

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const now = Date.now();
              
              // Throttle UI updates to every 100ms to reduce lag
              if (now - lastUpdateTime < 100 && e.loaded < e.total) {
                return;
              }
              lastUpdateTime = now;
              
              // Calculate progress percentage
              uploadProgress = Math.round((e.loaded / e.total) * 100);
              
              // Calculate upload speed (bytes per second)
              const timeDiff = (now - lastTime) / 1000; // seconds
              const bytesDiff = e.loaded - lastLoaded;
              
              if (timeDiff > 0) {
                const currentSpeed = bytesDiff / timeDiff;
                // Smooth the speed using exponential moving average
                uploadSpeed = uploadSpeed === 0 ? currentSpeed : (uploadSpeed * 0.7 + currentSpeed * 0.3);
              }
              
              // Calculate time remaining
              if (uploadSpeed > 0) {
                const bytesRemaining = e.total - e.loaded;
                timeRemaining = bytesRemaining / uploadSpeed;
              }
              
              lastLoaded = e.loaded;
              lastTime = now;
              
              // Update UI (now throttled to 100ms)
              renderVideoUpload();
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText) as { url: string; error?: string };
                if (result.url) {
                  // Reset progress
                  uploadProgress = 100;
                  renderVideoUpload();
                  resolve(result.url);
                } else {
                  reject(new Error(result.error || 'Video upload failed'));
                }
              } catch (e) {
                reject(new Error('Invalid response from server'));
              }
            } else {
              // Parse error response
              try {
                const errorData = JSON.parse(xhr.responseText) as { error?: string; details?: string };
                const errorMsg = errorData.error || 'Video upload failed';
                const details = errorData.details ? `\n\nDetails: ${errorData.details}` : '';
                reject(new Error(errorMsg + details));
              } catch (e) {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
          });

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'));
          });

          xhr.open('POST', `${baseUrl}/api/upload-video`);
          xhr.send(videoFormData);
        });

        mediaUrl = videoUrl;
        
        // Reset progress indicators
        uploadProgress = 0;
        uploadSpeed = 0;
        timeRemaining = 0;
        
        submitBtn.textContent = 'Submitting to review...';
      } else if (selectedImageFile) {
        // Convert image to base64
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImageFile!);
        });
        mediaUrl = base64Image;
      }

      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        title: formData.get('title'),
        description: formData.get('description'),
        mediaType: mediaType_final,
        ...(mediaType === 'image' ? {
          image: mediaUrl,
          imageFileName: selectedImageFile!.name,
          imageMimeType: selectedImageFile!.type,
        } : {
          videoUrl: mediaUrl,
        }),
        website: formData.get('website') || null,
      };

      const response = await fetch(`${baseUrl}/api/submit-portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as { success?: boolean; error?: string; message?: string };

      if (response.ok && result.success) {
        form.classList.add('hidden');
        errorMessage.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Reset
        selectedImageFile = null;
        selectedVideoFile = null;
        if (videoPreviewUrl) {
          URL.revokeObjectURL(videoPreviewUrl);
          videoPreviewUrl = null;
        }
        imagePreview.classList.add('hidden');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      errorText.textContent = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      errorMessage.classList.remove('hidden');
    } finally {
      isUploading = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Your Work';
      uploadProgress = 0;
      uploadSpeed = 0;
      timeRemaining = 0;
      renderVideoUpload();
    }
  });

  submitAnotherBtn.addEventListener('click', () => {
    form.reset();
    form.classList.remove('hidden');
    successMessage.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Your Work';
    selectedImageFile = null;
    selectedVideoFile = null;
    uploadProgress = 0;
    uploadSpeed = 0;
    timeRemaining = 0;
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      videoPreviewUrl = null;
    }
    imagePreview.classList.add('hidden');
    imageUploadSection.classList.remove('hidden');
    videoUploadSection.classList.add('hidden');
    (document.querySelector('input[name="media-type"][value="image"]') as HTMLInputElement).checked = true;
  });

  tryAgainBtn.addEventListener('click', () => {
    errorMessage.classList.add('hidden');
  });
});


















