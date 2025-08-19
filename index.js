// ====== Search & Filter Logic for Movies with Rating Sort ======
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieGrid = document.getElementById('moviesGrid');
const ratingSlider = document.getElementById('ratingRange');
const ratingValue = document.getElementById('ratingRangeValue');

const MAX_VISIBLE = 6;
const API_KEY = 'db4a7367';

// Fetch search results (basic info only)
async function fetchOMDbResults(query) {
  if (!query) return [];
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === "False") return [];
    return data.Search || [];
  } catch (err) {
    console.error('OMDb fetch error:', err);
    return [];
  }
}

// Fetch full details for a single movie (to get imdbRating)
async function fetchMovieDetails(imdbID) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('OMDb detail fetch error:', err);
    return null;
  }
}

// Create movie card
function createMovieCard(movie) {
  const ratingText = movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : "N/A";
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <div class="image-wrapper">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/150x220'}" alt="${movie.Title}" />
      <div class="hover-overlay">More info →</div>
    </div>
    <div class="movie-details">
      <h3>${movie.Title}</h3>
      <ul>
        <li><i class="fa-solid fa-calendar"></i> ${movie.Year}</li>
        <li><i class="fa-solid fa-film"></i> ${movie.Type}</li>
        <li><i class="fa-solid fa-star"></i> Rating: ${ratingText}</li>
      </ul>
    </div>
  `;
  return card;
}

// Main function to update movie results
async function updateMovies() {
  const searchTerm = searchInput.value.trim() || "Batman"; // default query
  const minRating = parseInt(ratingSlider.value, 10);
  ratingValue.textContent = `${minRating} to 10`;

  movieGrid.innerHTML = ''; // clear results
  const results = await fetchOMDbResults(searchTerm);

  if (results.length === 0) {
    movieGrid.innerHTML = `<p>No results found for "${searchTerm}".</p>`;
    return;
  }

  // Fetch details for each movie (to get rating)
  const detailedResults = await Promise.all(
    results.map(async movie => {
      const details = await fetchMovieDetails(movie.imdbID);
      return details;
    })
  );

  // Filter by slider rating (only numeric ratings)
  const filtered = detailedResults.filter(m => {
    const r = parseFloat(m.imdbRating);
    return !isNaN(r) && r >= minRating;
  });

  // Sort by rating (highest first)
  filtered.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

  // Display top N
  filtered.slice(0, MAX_VISIBLE).forEach(movie => {
    const card = createMovieCard(movie);
    movieGrid.appendChild(card);
  });

  // If nothing matched rating filter
  if (filtered.length === 0) {
    movieGrid.innerHTML = `<p>No movies with rating ≥ ${minRating}.</p>`;
  }
}

// Event listeners
searchInput.addEventListener('input', updateMovies);
searchBtn.addEventListener('click', updateMovies);
searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') updateMovies();
});
ratingSlider.addEventListener('input', updateMovies);

// Initial load
updateMovies();
