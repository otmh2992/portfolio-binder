import { useEffect, useState } from 'react';
import { supabase, type PortfolioItem } from '../lib/supabase';
import { baseUrl } from '../lib/base-url';

interface Props {
  featured?: boolean;
  limit?: number;
}

// Extended interface to include username from join
interface PortfolioWithUser extends PortfolioItem {
  users?: {
    username: string;
  };
}

const CACHE_TTL = 300000; // 5 minutes

export default function PortfolioGridSupabase({ featured, limit }: Props) {
  const [items, setItems] = useState<PortfolioWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    async function fetchPortfolio() {
      try {
        const cacheKey = `portfolio_${featured ? 'featured' : 'all'}_${limit || 'all'}`;
        
        // Try cache first
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
              if (isMounted) {
                setItems(data);
                setLoading(false);
              }
              return;
            }
          }
        } catch (e) {
          // Cache miss or corrupted - continue to fetch
        }

        // Build query
        let query = supabase
          .from('portfolios')
          .select('id, user_id, title, description, thumbnail_url, tags, featured, created_at, users(username)')
          .order('created_at', { ascending: false });

        if (featured) query = query.eq('featured', true);
        if (limit) query = query.limit(limit);

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        const portfolioData = data || [];
        
        // Cache with size limit
        if (portfolioData.length < 100) { // Don't cache huge datasets
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              data: portfolioData,
              timestamp: Date.now()
            }));
          } catch (e) {
            // localStorage full - clear old portfolio caches
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('portfolio_')) {
                localStorage.removeItem(key);
              }
            });
          }
        }

        if (isMounted) {
          setItems(portfolioData);
        }
      } catch (err: any) {
        console.error('Error fetching portfolio:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load portfolio items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPortfolio();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [featured, limit]);

  if (loading) {
    return (
      <div className="asymmetric-grid">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="portfolio-item"
            style={{
              gridColumn: 'span 1',
              gridRow: 'span 1',
            }}
          >
            <div className="portfolio-placeholder">
              <div className="animate-pulse bg-muted w-full h-full rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Failed to Load Portfolio
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <div className="text-sm space-y-2">
          <p className="font-medium">Possible issues:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
            <li>Supabase environment variables not set</li>
            <li>Database table "portfolios" doesn't exist</li>
            <li>Row Level Security is blocking access</li>
          </ul>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Portfolio Items Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your first portfolio item in Supabase!
        </p>
        <a
          href="https://app.supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Open Supabase Dashboard
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    );
  }

  // Calculate grid positions for variety
  const getGridStyle = (index: number) => {
    const patterns = [
      { gridColumn: 'span 2', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 2', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="asymmetric-grid">
      {items.map((item, index) => (
        <a
          key={item.id}
          href={`${baseUrl}/filmmaker/${item.users?.username || item.user_id}`}
          className="portfolio-item"
          style={getGridStyle(index)}
        >
          <div className="portfolio-item-inner">
            {item.thumbnail_url ? (
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="portfolio-image"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="portfolio-placeholder">
                <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">No Image</p>
              </div>
            )}
            <div className="portfolio-overlay">
              <div className="portfolio-content">
                <h3 className="portfolio-title">{item.title}</h3>
                {item.description && (
                  <p className="portfolio-description">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}


