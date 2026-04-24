

// Curated list of iconic films for filmmaker usernames
export const FILM_TITLES = [
  // Classics (1940s-1960s)
  { title: "Casablanca", year: 1942, slug: "casablanca" },
  { title: "Bicycle Thieves", year: 1948, slug: "bicycle-thieves" },
  { title: "Rashomon", year: 1950, slug: "rashomon" },
  { title: "Singin' in the Rain", year: 1952, slug: "singin-in-the-rain" },
  { title: "Seven Samurai", year: 1954, slug: "seven-samurai" },
  { title: "Vertigo", year: 1958, slug: "vertigo" },
  { title: "Breathless", year: 1960, slug: "breathless" },
  { title: "Psycho", year: 1960, slug: "psycho" },
  { title: "8½", year: 1963, slug: "eight-and-half" },
  { title: "Dr. Strangelove", year: 1964, slug: "dr-strangelove" },
  
  // New Hollywood (1970s)
  { title: "The Godfather", year: 1972, slug: "godfather" },
  { title: "Chinatown", year: 1974, slug: "chinatown" },
  { title: "Nashville", year: 1975, slug: "nashville" },
  { title: "Taxi Driver", year: 1976, slug: "taxi-driver" },
  { title: "Annie Hall", year: 1977, slug: "annie-hall" },
  { title: "Star Wars", year: 1977, slug: "star-wars" },
  { title: "Apocalypse Now", year: 1979, slug: "apocalypse-now" },
  
  // 1980s
  { title: "Raging Bull", year: 1980, slug: "raging-bull" },
  { title: "Blade Runner", year: 1982, slug: "bladerunner" },
  { title: "E.T.", year: 1982, slug: "et" },
  { title: "Paris, Texas", year: 1984, slug: "paris-texas" },
  { title: "Blue Velvet", year: 1986, slug: "blue-velvet" },
  { title: "Wings of Desire", year: 1987, slug: "wings-of-desire" },
  { title: "My Neighbor Totoro", year: 1988, slug: "totoro" },
  { title: "Do the Right Thing", year: 1989, slug: "do-the-right-thing" },
  
  // 1990s
  { title: "Goodfellas", year: 1990, slug: "goodfellas" },
  { title: "Chungking Express", year: 1994, slug: "chungking-express" },
  { title: "Pulp Fiction", year: 1994, slug: "pulp-fiction" },
  { title: "The Big Lebowski", year: 1998, slug: "big-lebowski" },
  { title: "Run Lola Run", year: 1998, slug: "run-lola-run" },
  { title: "The Matrix", year: 1999, slug: "matrix" },
  
  // 2000s
  { title: "In the Mood for Love", year: 2000, slug: "in-the-mood-for-love" },
  { title: "Amélie", year: 2001, slug: "amelie" },
  { title: "Spirited Away", year: 2001, slug: "spirited-away" },
  { title: "City of God", year: 2002, slug: "city-of-god" },
  { title: "Eternal Sunshine", year: 2004, slug: "eternal-sunshine" },
  { title: "Pan's Labyrinth", year: 2006, slug: "pans-labyrinth" },
  { title: "There Will Be Blood", year: 2007, slug: "there-will-be-blood" },
  
  // 2010s
  { title: "Inception", year: 2010, slug: "inception" },
  { title: "The Social Network", year: 2010, slug: "social-network" },
  { title: "Drive", year: 2011, slug: "drive" },
  { title: "Moonrise Kingdom", year: 2012, slug: "moonrise-kingdom" },
  { title: "Her", year: 2013, slug: "her" },
  { title: "Whiplash", year: 2014, slug: "whiplash" },
  { title: "Mad Max: Fury Road", year: 2015, slug: "mad-max-fury-road" },
  { title: "Moonlight", year: 2016, slug: "moonlight" },
  { title: "Get Out", year: 2017, slug: "get-out" },
  { title: "Parasite", year: 2019, slug: "parasite" },
  
  // 2020s
  { title: "Nomadland", year: 2020, slug: "nomadland" },
  { title: "Everything Everywhere", year: 2022, slug: "everything-everywhere" },
  { title: "The Banshees of Inisherin", year: 2022, slug: "banshees" },
  { title: "Oppenheimer", year: 2023, slug: "oppenheimer" },
  { title: "Poor Things", year: 2023, slug: "poor-things" },
  
  // Cult Classics
  { title: "Donnie Darko", year: 2001, slug: "donnie-darko" },
  { title: "Fight Club", year: 1999, slug: "fight-club" },
  { title: "Oldboy", year: 2003, slug: "oldboy" },
  { title: "The Room", year: 2003, slug: "the-room" },
  { title: "Scott Pilgrim", year: 2010, slug: "scott-pilgrim" },
  
  // Animation
  { title: "Akira", year: 1988, slug: "akira" },
  { title: "Princess Mononoke", year: 1997, slug: "princess-mononoke" },
  { title: "WALL-E", year: 2008, slug: "wall-e" },
  { title: "Spider-Verse", year: 2018, slug: "spider-verse" },
  
  // Horror
  { title: "The Shining", year: 1980, slug: "shining" },
  { title: "The Thing", year: 1982, slug: "the-thing" },
  { title: "The Fly", year: 1986, slug: "the-fly" },
  { title: "Hereditary", year: 2018, slug: "hereditary" },
  { title: "Midsommar", year: 2019, slug: "midsommar" },
  
  // Documentary
  { title: "Grey Gardens", year: 1975, slug: "grey-gardens" },
  { title: "Hoop Dreams", year: 1994, slug: "hoop-dreams" },
  { title: "Man on Wire", year: 2008, slug: "man-on-wire" },
  
  // International
  { title: "La Dolce Vita", year: 1960, slug: "la-dolce-vita" },
  { title: "Fitzcarraldo", year: 1982, slug: "fitzcarraldo" },
  { title: "Cinema Paradiso", year: 1988, slug: "cinema-paradiso" },
  { title: "Crouching Tiger", year: 2000, slug: "crouching-tiger" },
  { title: "The Lives of Others", year: 2006, slug: "lives-of-others" },
  { title: "A Separation", year: 2011, slug: "a-separation" },
  { title: "Roma", year: 2018, slug: "roma" },
];

/**
 * Get 5 random unique film titles
 */
export function getRandomFilms(count: number = 5): typeof FILM_TITLES {
  const shuffled = [...FILM_TITLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate username from film slug with 4-digit random code
 * Format: [4-digit]-[film-slug] (e.g., 2947-inception)
 */
export function generateUsername(filmSlug: string): string {
  const randomCode = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `${randomCode}-${filmSlug}`;
}

/**
 * Check if username is available (will be replaced with DB check)
 */
export function isUsernameAvailable(username: string): boolean {
  // TODO: Check against Supabase database
  return true;
}


