import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, CheckCircle, AlertCircle, Film } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

export default function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('video/')) {
      setStatus('error');
      setMessage('Please select a valid video file');
      return;
    }

    // Validate file size (5GB max)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB in bytes
    if (selectedFile.size > maxSize) {
      setStatus('error');
      setMessage('File size must be under 5GB');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !category) {
      setStatus('error');
      setMessage('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setStatus('uploading');
    setProgress(0);
    setMessage('Preparing upload...');

    try {
      // Step 1: Get upload URL from our API
      setMessage('Getting upload permissions...');
      const response = await fetch(`${baseUrl}/api/upload-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          title,
          description,
          category,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get upload URL');
      }

      const { uploadUrl, videoUrl, thumbnailUrl, slug } = await response.json();

      // Step 2: Upload video directly to R2
      setMessage('Uploading video...');
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
          setMessage(`Uploading... ${percentComplete}%`);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          // Step 3: Save metadata to Supabase
          setMessage('Saving portfolio item...');
          setProgress(95);

          const saveResponse = await fetch(`${baseUrl}/api/submit-portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title,
              description,
              category,
              video_url: videoUrl,
              thumbnail_url: thumbnailUrl,
              slug,
            }),
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save portfolio item');
          }

          setProgress(100);
          setStatus('success');
          setMessage('Video uploaded successfully! 🎉');
          
          // Reset form
          setTimeout(() => {
            setTitle('');
            setDescription('');
            setCategory('');
            setFile(null);
            setProgress(0);
            setStatus('idle');
            setMessage('');
          }, 3000);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Network error during upload');
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-6 h-6" />
          Upload Portfolio Video
        </CardTitle>
        <CardDescription>
          Share your work with the community. Videos are automatically optimized for streaming.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Short Film"
              disabled={uploading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your project..."
              rows={4}
              disabled={uploading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={uploading} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-film">Short Film</SelectItem>
                <SelectItem value="documentary">Documentary</SelectItem>
                <SelectItem value="music-video">Music Video</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
                <SelectItem value="animation">Animation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="video">
              Video File <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />
              {file && (
                <span className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP4, MOV, AVI, WebM • Max size: 5GB
            </p>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{message}</p>
            </div>
          )}

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={uploading || !file || !title || !category}
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
