import { useState, useEffect } from 'react';
import { getRandomFilms, generateUsername } from '../lib/filmTitles';
import { fetchMixedFilms } from '../lib/tmdb';

interface Film {
  title: string;
  year: number;
  slug: string;
  rating?: number;
  posterUrl?: string;
}

interface FilmUsernameSelectorProps {
  onSelect: (username: string, filmTitle: string) => void;
}

export default function FilmUsernameSelector({ onSelect }: FilmUsernameSelectorProps) {
  const [films, setFilms] = useState<Film[]>([]);
  const [countdown, setCountdown] = useState(5);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [finalUsername, setFinalUsername] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useTMDb, setUseTMDb] = useState(true);
  const [rollingNumber, setRollingNumber] = useState('0000');
  const [isRolling, setIsRolling] = useState(false);

  // Load initial films
  useEffect(() => {
    refreshFilms();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (selectedFilm) return; // Stop countdown if user selected
    if (isLoading) return; // Don't countdown while loading

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshFilms();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedFilm, isLoading]);

  // Rolling number animation
  useEffect(() => {
    if (!isRolling) return;

    let frame = 0;
    const maxFrames = 30; // 30 frames for smooth animation
    const targetNumber = Math.floor(1000 + Math.random() * 9000).toString();

    const interval = setInterval(() => {
      frame++;
      
      // Generate random digits that gradually settle into target
      const progress = frame / maxFrames;
      const currentNumber = Array.from({ length: 4 }, (_, i) => {
        if (progress > (i + 1) / 4) {
          // This digit has settled
          return targetNumber[i];
        } else {
          // Still rolling
          return Math.floor(Math.random() * 10).toString();
        }
      }).join('');

      setRollingNumber(currentNumber);

      if (frame >= maxFrames) {
        clearInterval(interval);
        setRollingNumber(targetNumber);
        setIsRolling(false);
        
        // Set final username and notify parent
        if (selectedFilm) {
          const cleanedSlug = selectedFilm.slug.replace(/-/g, '');
          const username = `${cleanedSlug}-${targetNumber}`;
          setFinalUsername(username);
          onSelect(username, selectedFilm.title);
        }
      }
    }, 50); // 50ms per frame = 1.5 second animation

    return () => clearInterval(interval);
  }, [isRolling, selectedFilm, onSelect]);

  const refreshFilms = async () => {
    setIsAnimating(true);
    setIsLoading(true);

    try {
      // Try fetching from TMDb first
      if (useTMDb) {
        const tmdbFilms = await fetchMixedFilms(5);
        
        if (tmdbFilms.length > 0) {
          setTimeout(() => {
            setFilms(tmdbFilms);
            setCountdown(5);
            setIsAnimating(false);
            setIsLoading(false);
          }, 300);
          return;
        } else {
          // TMDb failed, fall back to curated list
          console.warn('TMDb failed, using curated list');
          setUseTMDb(false);
        }
      }

      // Fallback to curated list
      const curatedFilms = getRandomFilms(5);
      setTimeout(() => {
        setFilms(curatedFilms);
        setCountdown(5);
        setIsAnimating(false);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error fetching films:', error);
      // Fallback to curated list
      const curatedFilms = getRandomFilms(5);
      setTimeout(() => {
        setFilms(curatedFilms);
        setCountdown(5);
        setIsAnimating(false);
        setIsLoading(false);
        setUseTMDb(false);
      }, 300);
    }
  };

  const handleSelect = (film: Film) => {
    setSelectedFilm(film);
    setRollingNumber('0000');
    setIsRolling(true);
  };

  const handleManualRefresh = () => {
    if (!selectedFilm) {
      refreshFilms();
    }
  };

  const handleChangeSelection = () => {
    setSelectedFilm(null);
    setFinalUsername(null);
    setRollingNumber('0000');
    setIsRolling(false);
  };

  // Helper function to remove hyphens from slug
  const cleanSlug = (slug: string) => slug.replace(/-/g, '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold font-heading mb-2">
          🎬 Pick Your Filmmaker Name
        </h2>
        <p className="text-muted-foreground">
          {selectedFilm 
            ? "Creating your unique username..."
            : "Quick! Pick what catches your eye"
          }
        </p>
        {useTMDb && !isLoading && !selectedFilm && (
          <p className="text-xs text-muted-foreground mt-1">
            ✨ Powered by 800,000+ films from TMDb
          </p>
        )}
      </div>

      {/* Username Generation Animation */}
      {selectedFilm && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-8 text-center">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              Your Filmmaker Name
            </div>
            
            <div className="font-mono text-3xl md:text-4xl font-bold">
              <span className="text-foreground">{cleanSlug(selectedFilm.slug)}</span>
              <span className="text-primary">-</span>
              <span 
                className={`inline-block transition-all ${
                  isRolling 
                    ? 'text-primary scale-110 blur-[1px]' 
                    : 'text-foreground scale-100 blur-0'
                }`}
                style={{
                  letterSpacing: '0.1em',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {rollingNumber}
              </span>
            </div>

            {finalUsername && (
              <div className="pt-4 space-y-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  🎬 {selectedFilm.title} ({selectedFilm.year})
                </p>
                <p className="text-xs text-muted-foreground">
                  Profile: <span className="font-mono">/filmmaker/{finalUsername}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Countdown Timer */}
      {!selectedFilm && !isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <span className="text-sm font-medium">New films in</span>
            <span className="text-2xl font-bold tabular-nums w-8">
              {countdown}
            </span>
            <span className="text-sm font-medium">sec</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !selectedFilm && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Loading films...</p>
          </div>
        </div>
      )}

      {/* Film Options */}
      {!isLoading && !selectedFilm && (
        <div 
          className={`space-y-3 transition-all duration-300 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {films.map((film) => {
            return (
              <button
                key={film.slug}
                onClick={() => handleSelect(film)}
                className="w-full text-left p-4 rounded-lg border-2 border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1">
                      {film.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {film.year}
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl ml-4">
                    🎬
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Manual Refresh Button */}
      {!selectedFilm && !isLoading && (
        <button
          onClick={handleManualRefresh}
          className="w-full py-3 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          🔄 Show Different Films
        </button>
      )}

      {/* Change Selection */}
      {finalUsername && (
        <div className="text-center space-y-3">
          <button
            onClick={handleChangeSelection}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Pick a different film
          </button>
        </div>
      )}

      {/* Fun Stats */}
      {!selectedFilm && (
        <div className="text-center text-xs text-muted-foreground">
          <p>🎥 {useTMDb ? 'Discovering films from around the world' : 'Curated iconic cinema 1942-2024'}</p>
        </div>
      )}
    </div>
  );
}



