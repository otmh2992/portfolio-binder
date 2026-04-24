import { useState, useEffect, useRef } from 'react';
import { searchFilms } from '../lib/tmdb';
import { baseUrl } from '../lib/base-url';

interface Film {
  title: string;
  year: number;
  slug: string;
  posterUrl?: string;
}

interface SmartFilmSelectorProps {
  onSelect: (username: string, filmTitle: string) => void;
}

export default function SmartFilmSelector({ onSelect }: SmartFilmSelectorProps) {
  const [step, setStep] = useState<'search' | 'recommendations' | 'generating'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedInputFilm, setSelectedInputFilm] = useState<Film | null>(null);
  const [recommendations, setRecommendations] = useState<Film[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [rollingNumber, setRollingNumber] = useState('0000');
  const [isRolling, setIsRolling] = useState(false);
  const [finalUsername, setFinalUsername] = useState<string | null>(null);
  const [refreshCountdown, setRefreshCountdown] = useState(5);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();

  // Search debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchFilms(searchQuery);
        setSearchResults(results.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Rolling number animation
  useEffect(() => {
    if (!isRolling) return;

    let frame = 0;
    const maxFrames = 30;
    const targetNumber = Math.floor(1000 + Math.random() * 9000).toString();

    const interval = setInterval(() => {
      frame++;
      
      const progress = frame / maxFrames;
      const currentNumber = Array.from({ length: 4 }, (_, i) => {
        if (progress > (i + 1) / 4) {
          return targetNumber[i];
        } else {
          return Math.floor(Math.random() * 10).toString();
        }
      }).join('');

      setRollingNumber(currentNumber);

      if (frame >= maxFrames) {
        clearInterval(interval);
        setRollingNumber(targetNumber);
        setIsRolling(false);
        
        if (selectedFilm) {
          const cleanedSlug = selectedFilm.slug.replace(/-/g, '');
          const username = `${targetNumber}-${cleanedSlug}`;
          setFinalUsername(username);
          onSelect(username, selectedFilm.title);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRolling, selectedFilm, onSelect]);

  const handleInputFilmSelect = async (film: Film) => {
    setSelectedInputFilm(film);
    setSearchQuery('');
    setSearchResults([]);
    setStep('recommendations');
    setRefreshCountdown(5);
    await fetchRecommendations(film);
  };

  const fetchRecommendations = async (film: Film) => {
    setIsLoadingRecommendations(true);

    try {
      const response = await fetch(`${baseUrl}/api/recommend-films?film=${encodeURIComponent(film.title)}`);
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      setRecommendations([film]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Auto-refresh recommendations every 5 seconds
  useEffect(() => {
    if (step !== 'recommendations' || !selectedInputFilm) {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    // Countdown timer
    countdownIntervalRef.current = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    // Refresh recommendations
    refreshIntervalRef.current = setInterval(() => {
      fetchRecommendations(selectedInputFilm);
    }, 5000);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [step, selectedInputFilm]);

  const handleRecommendationSelect = (film: Film) => {
    setSelectedFilm(film);
    setStep('generating');
    setRollingNumber('0000');
    setIsRolling(true);
  };

  const handleStartOver = () => {
    setStep('search');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedInputFilm(null);
    setRecommendations([]);
    setSelectedFilm(null);
    setFinalUsername(null);
    setRollingNumber('0000');
    setIsRolling(false);
  };

  // STEP 1: Search for last watched film
  if (step === 'search') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-heading mb-2">
            What's the last film you watched?
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a film title..."
            className="w-full px-4 py-3 text-lg border-2 border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            autoFocus
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((film, index) => (
              <button
                key={`${film.slug}-${index}`}
                onClick={() => handleInputFilmSelect(film)}
                className="w-full text-left p-4 rounded-lg border-2 border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  {film.posterUrl && (
                    <img 
                      src={film.posterUrl} 
                      alt={film.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {film.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {film.year}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No films found. Try a different title.</p>
          </div>
        )}
      </div>
    );
  }

  // STEP 2: Show 5 curated recommendations
  if (step === 'recommendations') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <button
            onClick={handleStartOver}
            className="text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            ← Search different film
          </button>
          <h2 className="text-2xl font-bold font-heading mb-2">
            Pick Your Filmmaker Name
          </h2>
          <p className="text-muted-foreground text-sm">
            Based on <span className="font-semibold">{selectedInputFilm?.title}</span>
            {!isLoadingRecommendations && (
              <span className="ml-2 opacity-50">• Refreshing in {refreshCountdown}s</span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoadingRecommendations && (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Finding perfect matches...</p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {!isLoadingRecommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((film, index) => (
              <button
                key={`${film.slug}-${index}`}
                onClick={() => handleRecommendationSelect(film)}
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
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // STEP 3: Generate username with rolling animation
  if (step === 'generating') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-heading mb-2">
            🎬 Creating Your Username
          </h2>
          <p className="text-muted-foreground">
            {isRolling ? "Generating..." : "All set!"}
          </p>
        </div>

        {/* Username Generation Animation */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-8 text-center">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              Your Filmmaker Name
            </div>
            
            <div className="font-mono text-3xl md:text-4xl font-bold">
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
              <span className="text-primary">-</span>
              <span className="text-foreground">{selectedFilm?.slug.replace(/-/g, '')}</span>
            </div>
          </div>
        </div>

        {finalUsername && (
          <div className="text-center">
            <button
              onClick={handleStartOver}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Pick a different film
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}







