import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { baseUrl } from '../lib/base-url';
import { Play } from 'lucide-react';

interface PortfolioItem {
  id: string;
  fieldData: {
    name: string;
    slug: string;
    [key: string]: any;
  };
}

interface PortfolioGridProps {
  collectionId?: string;
}

export default function PortfolioGrid({ collectionId }: PortfolioGridProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Helper function to convert R2 URLs to Worker URLs for streaming
  const convertToWorkerUrl = (url: string): string => {
    if (!url) return url;
    
    // Check if it's an R2 URL that needs conversion
    if (url.includes('.r2.dev') || url.includes('r2.cloudflarestorage.com')) {
      // Extract just the filename from the URL
      const filename = url.split('/').pop();
      if (filename) {
        // Use the Worker URL for streaming
        return `https://video-streaming.otmh-here.workers.dev/${filename}`;
      }
    }
    
    // If it's already a Worker URL or something else, return as-is
    return url;
  };

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      if (!collectionId) {
        setError('No collection ID provided. Please check your CMS setup.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/cms/${collectionId}?limit=100`);
        
        if (!response.ok) {
          const errorData = await response.json() as { error?: string; details?: string };
          
          // If site is not published, treat as empty and show placeholders
          if (errorData.details?.includes('site is not published') || 
              errorData.error?.includes('site is not published')) {
            setItems([]);
            setError(null);
            setLoading(false);
            return;
          }
          
          throw new Error(errorData.error || 'Failed to fetch portfolio items');
        }

        const data = await response.json() as { items?: PortfolioItem[] };
        setItems(data.items || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching portfolio items:', err);
        setError(err.message || 'Failed to load portfolio items');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [collectionId]);

  // Asymmetrical pattern for grid items (repeating pattern of different sizes)
  const getItemSize = (index: number): { rows: number; cols: number } => {
    const patterns = [
      { rows: 2, cols: 2 }, // Large square
      { rows: 1, cols: 1 }, // Small square
      { rows: 2, cols: 1 }, // Tall rectangle
      { rows: 1, cols: 2 }, // Wide rectangle
      { rows: 1, cols: 1 }, // Small square
      { rows: 2, cols: 1 }, // Tall rectangle
      { rows: 1, cols: 1 }, // Small square
      { rows: 2, cols: 2 }, // Large square
      { rows: 1, cols: 2 }, // Wide rectangle
      { rows: 1, cols: 1 }, // Small square
    ];
    return patterns[index % patterns.length];
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="asymmetric-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
          const size = getItemSize(i - 1);
          return (
            <div
              key={i}
              className="portfolio-item"
              style={{
                gridRow: `span ${size.rows}`,
                gridColumn: `span ${size.cols}`,
              }}
            >
              <Skeleton className="h-full w-full" />
            </div>
          );
        })}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-destructive/10 border border-destructive rounded-lg p-6">
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Portfolio</h2>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <div className="text-sm space-y-2">
          <p className="font-medium">Troubleshooting steps:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
            <li>Ensure your Portfolio collection exists in Webflow CMS</li>
            <li>Verify the collection ID is correct</li>
            <li>Check that items are published (not just drafted)</li>
            <li>Confirm your CMS API token is configured</li>
          </ul>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    // Show placeholder demo images for preview
    const demoItems = [
      { id: 'demo-1', name: 'Creative Design', image: 'https://picsum.photos/seed/1/800/600' },
      { id: 'demo-2', name: 'Digital Art', image: 'https://picsum.photos/seed/2/600/800' },
      { id: 'demo-3', name: 'Photography', image: 'https://picsum.photos/seed/3/800/800' },
      { id: 'demo-4', name: 'Illustration', image: 'https://picsum.photos/seed/4/700/500' },
      { id: 'demo-5', name: 'Web Design', image: 'https://picsum.photos/seed/5/600/600' },
      { id: 'demo-6', name: 'Branding', image: 'https://picsum.photos/seed/6/800/700' },
      { id: 'demo-7', name: 'Motion Graphics', image: 'https://picsum.photos/seed/7/500/800' },
      { id: 'demo-8', name: 'UI/UX Design', image: 'https://picsum.photos/seed/8/800/600' },
      { id: 'demo-9', name: '3D Rendering', image: 'https://picsum.photos/seed/9/700/700' },
      { id: 'demo-10', name: 'Abstract Art', image: 'https://picsum.photos/seed/10/600/800' },
    ];

    return (
      <>
        <div className="mb-6 p-4 bg-muted/50 border rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Preview Mode:</strong> Showing placeholder images. Submit real work to replace these!
          </p>
        </div>
        <div className="asymmetric-grid">
          {demoItems.map((item, index) => {
            const size = getItemSize(index);

            return (
              <div
                key={item.id}
                className="portfolio-item group"
                style={{
                  gridRow: `span ${size.rows}`,
                  gridColumn: `span ${size.cols}`,
                }}
              >
                <div className="portfolio-item-inner">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="portfolio-image"
                    loading="lazy"
                  />
                  
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3 className="portfolio-title">{item.name}</h3>
                      <p className="portfolio-description">Demo placeholder image</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="asymmetric-grid">
        {items.map((item, index) => {
          // Check for video URL first
          const videoUrl = item.fieldData['video-url'] || 
                          item.fieldData.videoUrl ||
                          item.fieldData.video;
          
          // Convert R2 URLs to Worker URLs for streaming
          const streamingVideoUrl = videoUrl ? convertToWorkerUrl(videoUrl) : null;
          
          // Try to find an image field (common field names)
          const imageField = item.fieldData.image || 
                            item.fieldData['main-image'] || 
                            item.fieldData.thumbnail ||
                            item.fieldData['featured-image'] ||
                            item.fieldData.photo ||
                            item.fieldData.picture;
          
          const imageUrl = imageField?.url || imageField;
          const imageAlt = imageField?.alt || item.fieldData.name;

          // Get asymmetrical size for this item
          const size = getItemSize(index);

          // Try to find a description field
          const description = item.fieldData.description || 
                            item.fieldData['short-description'] ||
                            item.fieldData.excerpt ||
                            item.fieldData.summary;

          // Get submitted by attribution if available
          const submittedBy = item.fieldData['submitted-by'] || 
                             item.fieldData.submittedBy ||
                             item.fieldData.author ||
                             item.fieldData.creator;

          const isVideo = !!streamingVideoUrl;

          return (
            <div
              key={item.id}
              className="portfolio-item group"
              style={{
                gridRow: `span ${size.rows}`,
                gridColumn: `span ${size.cols}`,
              }}
              onClick={() => isVideo && handleVideoClick(streamingVideoUrl)}
            >
              <div className="portfolio-item-inner">
                {isVideo ? (
                  <div className="relative w-full h-full bg-black cursor-pointer">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="portfolio-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="portfolio-placeholder bg-gradient-to-br from-primary/20 to-primary/5">
                        <Play className="w-16 h-16 text-primary" />
                        <span className="text-sm text-primary mt-2">Video</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                      </div>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="portfolio-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="portfolio-placeholder">
                    <svg
                      className="w-16 h-16 text-muted-foreground/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-muted-foreground/50">No media</span>
                  </div>
                )}
                
                {/* Overlay with info on hover */}
                <div className="portfolio-overlay">
                  <div className="portfolio-content">
                    <h3 className="portfolio-title">{item.fieldData.name}</h3>
                    {description && (
                      <p className="portfolio-description line-clamp-3">{description}</p>
                    )}
                    {submittedBy && (
                      <p className="text-xs opacity-80 mt-2">
                        By: {submittedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {videoModalOpen && selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              src={convertToWorkerUrl(selectedVideo)}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}





