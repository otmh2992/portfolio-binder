/**
 * TMDb (The Movie Database) Integration
 * Provides intelligent film recommendations based on user's last watched film
 */

const TMDB_API_KEY = '1a0bcc84947a194003b9185b4da517ea';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDbFilm {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  genre_ids: number[];
}

export interface TMDbFilmDetails {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits: {
    crew: { id: number; name: string; job: string; department: string }[];
    cast: { id: number; name: string; order: number }[];
  };
  keywords: {
    keywords: { id: number; name: string }[];
  };
}

export interface FilmForUsername {
  title: string;
  year: number;
  slug: string;
  rating?: number;
  posterUrl?: string;
  matchTier?: 1 | 2 | 3 | 4 | 5;
  matchReason?: string;
}

/**
 * Generate URL-safe slug from film title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

/**
 * Get random page number for variety
 */
function getRandomPage(maxPage: number = 500): number {
  return Math.floor(Math.random() * Math.min(maxPage, 500)) + 1;
}

/**
 * Fetch film details including credits and keywords
 */
async function fetchFilmDetails(filmId: number): Promise<TMDbFilmDetails | null> {
  try {
    const [details, credits, keywords] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${filmId}?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      fetch(`${TMDB_BASE_URL}/movie/${filmId}/credits?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      fetch(`${TMDB_BASE_URL}/movie/${filmId}/keywords?api_key=${TMDB_API_KEY}`).then(r => r.json()),
    ]);

    return {
      ...details,
      credits,
      keywords,
    };
  } catch (error) {
    console.error('Error fetching film details:', error);
    return null;
  }
}

/**
 * Get director from credits
 */
function getDirector(credits: TMDbFilmDetails['credits']): string | null {
  const director = credits.crew.find(person => person.job === 'Director');
  return director?.name || null;
}

/**
 * Get cinematographer from credits
 */
function getCinematographer(credits: TMDbFilmDetails['credits']): string | null {
  const dp = credits.crew.find(person => person.job === 'Director of Photography');
  return dp?.name || null;
}

/**
 * Get composer from credits
 */
function getComposer(credits: TMDbFilmDetails['credits']): string | null {
  const composer = credits.crew.find(person => person.department === 'Sound' && person.job === 'Original Music Composer');
  return composer?.name || null;
}

/**
 * Get top 3 lead actors
 */
function getLeadActors(credits: TMDbFilmDetails['credits']): string[] {
  return credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
    .map(actor => actor.name);
}

/**
 * 5-TIER MATCHING ALGORITHM
 * Option C: Balanced approach with fallbacks
 */
export async function getRecommendedFilms(inputFilmTitle: string): Promise<FilmForUsername[]> {
  try {
    // Step 1: Search for the input film
    const searchResults = await searchFilms(inputFilmTitle);
    if (searchResults.length === 0) {
      // Fallback to popular films if search fails
      return fetchMixedFilms(5);
    }

    const inputFilm = searchResults[0];
    const inputDetails = await fetchFilmDetails(searchResults[0].id as any);
    
    if (!inputDetails) {
      return fetchMixedFilms(5);
    }

    // Extract key attributes
    const director = getDirector(inputDetails.credits);
    const leadActors = getLeadActors(inputDetails.credits);
    const cinematographer = getCinematographer(inputDetails.credits);
    const composer = getComposer(inputDetails.credits);
    const genres = inputDetails.genres.map(g => g.id);
    const primaryGenre = genres[0];
    const keywords = inputDetails.keywords.keywords.map(k => k.id);
    const inputYear = parseInt(inputDetails.release_date.split('-')[0]);

    const recommendations: FilmForUsername[] = [];
    const seenIds = new Set<number>([inputDetails.id]);

    // TIER 1: Same Director + Same Genre (Highest Priority)
    if (director && recommendations.length < 5) {
      const directorFilms = await fetchFilmsByDirector(director, inputDetails.id);
      const tier1 = directorFilms
        .filter(film => film.genre_ids?.includes(primaryGenre))
        .slice(0, 2);
      
      tier1.forEach(film => {
        if (!seenIds.has(film.id)) {
          recommendations.push({
            ...transformFilm(film),
            matchTier: 1,
            matchReason: `Same director: ${director}`,
          });
          seenIds.add(film.id);
        }
      });
    }

    // TIER 2: Same Lead Actors (Top 3) + Same Genre
    if (leadActors.length > 0 && recommendations.length < 5) {
      for (const actor of leadActors.slice(0, 2)) {
        if (recommendations.length >= 5) break;
        
        const actorFilms = await fetchFilmsByActor(actor, inputDetails.id);
        const tier2 = actorFilms
          .filter(film => film.genre_ids?.some(id => genres.includes(id)))
          .slice(0, 1);
        
        tier2.forEach(film => {
          if (!seenIds.has(film.id) && recommendations.length < 5) {
            recommendations.push({
              ...transformFilm(film),
              matchTier: 2,
              matchReason: `Same actor: ${actor}`,
            });
            seenIds.add(film.id);
          }
        });
      }
    }

    // TIER 3: Same Genre + Era + Rating 7.0+
    if (recommendations.length < 5) {
      const genreFilms = await fetchFilmsByGenre(primaryGenre, inputYear);
      const tier3 = genreFilms
        .filter(film => 
          !seenIds.has(film.id) &&
          film.vote_average >= 7.0 &&
          Math.abs(parseInt(film.release_date?.split('-')[0] || '0') - inputYear) <= 15
        )
        .slice(0, 5 - recommendations.length);
      
      tier3.forEach(film => {
        recommendations.push({
          ...transformFilm(film),
          matchTier: 3,
          matchReason: `Similar genre & era`,
        });
        seenIds.add(film.id);
      });
    }

    // TIER 4: TMDB Similar Films Algorithm
    if (recommendations.length < 5) {
      const similarFilms = await fetchSimilarFilms(inputDetails.id);
      const tier4 = similarFilms
        .filter(film => !seenIds.has(film.id))
        .slice(0, 5 - recommendations.length);
      
      tier4.forEach(film => {
        recommendations.push({
          ...transformFilm(film),
          matchTier: 4,
          matchReason: `Similar films`,
        });
        seenIds.add(film.id);
      });
    }

    // TIER 5: Shared Keywords/Themes
    if (recommendations.length < 5 && keywords.length > 0) {
      const keywordFilms = await fetchFilmsByKeywords(keywords, inputDetails.id);
      const tier5 = keywordFilms
        .filter(film => !seenIds.has(film.id))
        .slice(0, 5 - recommendations.length);
      
      tier5.forEach(film => {
        recommendations.push({
          ...transformFilm(film),
          matchTier: 5,
          matchReason: `Similar themes`,
        });
        seenIds.add(film.id);
      });
    }

    // Ensure we always return 5 films
    if (recommendations.length < 5) {
      const fallback = await fetchMixedFilms(5 - recommendations.length);
      recommendations.push(...fallback);
    }

    return recommendations.slice(0, 5);
  } catch (error) {
    console.error('Recommendation error:', error);
    return fetchMixedFilms(5);
  }
}

/**
 * Helper: Fetch films by director
 */
async function fetchFilmsByDirector(directorName: string, excludeId: number): Promise<TMDbFilm[]> {
  try {
    // Search for director
    const searchResponse = await fetch(
      `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(directorName)}`
    );
    const searchData = await searchResponse.json();
    const director = searchData.results?.[0];
    
    if (!director) return [];

    // Get director's films
    const creditsResponse = await fetch(
      `${TMDB_BASE_URL}/person/${director.id}/movie_credits?api_key=${TMDB_API_KEY}`
    );
    const creditsData = await creditsResponse.json();
    
    return (creditsData.crew || [])
      .filter((film: any) => film.job === 'Director' && film.id !== excludeId)
      .sort((a: any, b: any) => b.vote_average - a.vote_average)
      .slice(0, 5);
  } catch (error) {
    return [];
  }
}

/**
 * Helper: Fetch films by actor
 */
async function fetchFilmsByActor(actorName: string, excludeId: number): Promise<TMDbFilm[]> {
  try {
    const searchResponse = await fetch(
      `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(actorName)}`
    );
    const searchData = await searchResponse.json();
    const actor = searchData.results?.[0];
    
    if (!actor) return [];

    const creditsResponse = await fetch(
      `${TMDB_BASE_URL}/person/${actor.id}/movie_credits?api_key=${TMDB_API_KEY}`
    );
    const creditsData = await creditsResponse.json();
    
    return (creditsData.cast || [])
      .filter((film: any) => film.id !== excludeId)
      .sort((a: any, b: any) => b.vote_average - a.vote_average)
      .slice(0, 5);
  } catch (error) {
    return [];
  }
}

/**
 * Helper: Fetch films by genre
 */
async function fetchFilmsByGenre(genreId: number, targetYear: number): Promise<TMDbFilm[]> {
  try {
    const page = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=500&page=${page}`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * Helper: Fetch similar films (TMDB algorithm)
 */
async function fetchSimilarFilms(filmId: number): Promise<TMDbFilm[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${filmId}/similar?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * Helper: Fetch films by keywords
 */
async function fetchFilmsByKeywords(keywordIds: number[], excludeId: number): Promise<TMDbFilm[]> {
  try {
    // Use first 2 keywords
    const keywordString = keywordIds.slice(0, 2).join(',');
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${keywordString}&sort_by=vote_average.desc`
    );
    const data = await response.json();
    return (data.results || []).filter((film: TMDbFilm) => film.id !== excludeId);
  } catch (error) {
    return [];
  }
}

/**
 * Transform TMDbFilm to FilmForUsername
 */
function transformFilm(film: TMDbFilm): FilmForUsername {
  return {
    title: film.title,
    year: parseInt(film.release_date?.split('-')[0] || '0'),
    slug: createSlug(film.title),
    rating: Math.round(film.vote_average * 10) / 10,
    posterUrl: film.poster_path
      ? `https://image.tmdb.org/t/p/w185${film.poster_path}`
      : undefined,
  };
}

/**
 * Search for films (autocomplete)
 */
export async function searchFilms(query: string): Promise<Array<FilmForUsername & { id: number }>> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    const data = await response.json();
    const films: TMDbFilm[] = data.results || [];

    return films
      .filter((film) => {
        return (
          film.vote_average >= 5.0 &&
          film.vote_count >= 50 &&
          film.release_date &&
          film.title.length < 50
        );
      })
      .slice(0, 10)
      .map((film) => ({
        id: film.id,
        title: film.title,
        year: parseInt(film.release_date.split('-')[0]) || 0,
        slug: createSlug(film.title),
        rating: Math.round(film.vote_average * 10) / 10,
        posterUrl: film.poster_path
          ? `https://image.tmdb.org/t/p/w92${film.poster_path}`
          : undefined,
      }));
  } catch (error) {
    console.error('TMDb search error:', error);
    return [];
  }
}

/**
 * Fetch popular films (fallback)
 */
export async function fetchPopularFilms(count: number = 20): Promise<FilmForUsername[]> {
  try {
    const page = getRandomPage();
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    const data = await response.json();
    const films: TMDbFilm[] = data.results || [];

    return films
      .filter((film) => {
        return (
          film.vote_average >= 6.0 &&
          film.vote_count >= 100 &&
          film.release_date &&
          film.title.length < 50 &&
          !film.title.includes('Untitled')
        );
      })
      .slice(0, count)
      .map(transformFilm);
  } catch (error) {
    console.error('TMDb fetch error:', error);
    return [];
  }
}

/**
 * Fetch top-rated films (fallback)
 */
export async function fetchTopRatedFilms(count: number = 20): Promise<FilmForUsername[]> {
  try {
    const page = getRandomPage(100);
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    const data = await response.json();
    const films: TMDbFilm[] = data.results || [];

    return films
      .filter((film) => {
        return (
          film.vote_average >= 7.0 &&
          film.vote_count >= 500 &&
          film.release_date &&
          film.title.length < 50 &&
          !film.title.includes('Untitled')
        );
      })
      .slice(0, count)
      .map(transformFilm);
  } catch (error) {
    console.error('TMDb fetch error:', error);
    return [];
  }
}

/**
 * Get mix of popular and top-rated films
 */
export async function fetchMixedFilms(count: number = 20): Promise<FilmForUsername[]> {
  try {
    const [popular, topRated] = await Promise.all([
      fetchPopularFilms(count),
      fetchTopRatedFilms(count),
    ]);

    const combined = [...popular, ...topRated];
    const shuffled = combined.sort(() => Math.random() - 0.5);

    const seen = new Set<string>();
    return shuffled
      .filter((film) => {
        if (seen.has(film.slug)) return false;
        seen.add(film.slug);
        return true;
      })
      .slice(0, count);
  } catch (error) {
    console.error('TMDb fetch error:', error);
    return [];
  }
}
