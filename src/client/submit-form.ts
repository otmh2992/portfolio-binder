import { baseUrl } from '../lib/base-url';

console.log('[Submit Form] Script file loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Submit Form] DOMContentLoaded event fired');

  const form = document.getElementById('submit-form') as HTMLFormElement;

  if (!form) {
    console.error('[Submit Form] ❌ Form element not found!');
    return;
  }

  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const successMessage = document.getElementById('success-message') as HTMLDivElement;
  const errorMessage = document.getElementById('error-message') as HTMLDivElement;
  const errorText = document.getElementById('error-text') as HTMLParagraphElement;

  const imageInput = document.getElementById('image') as HTMLInputElement;
  const imagePreview = document.getElementById('image-preview') as HTMLDivElement;
  const previewImg = document.getElementById('preview-img') as HTMLImageElement;
  const removeImageBtn = document.getElementById('remove-image') as HTMLButtonElement;

  const videoUploadSection = document.getElementById('video-upload-section') as HTMLDivElement;
  const mediaTypeRadios = document.querySelectorAll('input[name="media-type"]');

  let selectedImageFile: File | null = null;
  let selectedVideoFile: File | null = null;
  let videoPreviewUrl: string | null = null;

  function renderVideoUpload() {
    const container = document.getElementById('video-upload-container');
    if (!container) return;

    container.innerHTML = `<p>Video upload ready</p>`;
  }

  mediaTypeRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value;

      if (value === 'image') {
        videoUploadSection.classList.add('hidden');
      } else {
        videoUploadSection.classList.remove('hidden');
        renderVideoUpload();
      }
    });
  });

  imageInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImg.src = ev.target?.result as string;
      imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  removeImageBtn?.addEventListener('click', () => {
    selectedImageFile = null;
    imageInput.value = '';
    imagePreview.classList.add('hidden');
  });

  submitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();

    const mediaType = (document.querySelector('input[name="media-type"]:checked') as HTMLInputElement).value;

    if (mediaType === 'image' && !selectedImageFile) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(`${baseUrl}/api/submit-portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        successMessage.classList.remove('hidden');
        form.classList.add('hidden');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      errorText.textContent = err instanceof Error ? err.message : 'Error';
      errorMessage.classList.remove('hidden');
    }
  });
});