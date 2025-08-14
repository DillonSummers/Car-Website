// ====== Search & Filter Logic for Movies ======
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieGrid = document.getElementById('moviesGrid');
const ratingSlider = document.getElementById('ratingRange');
const ratingValue = document.getElementById('ratingRangeValue');

const MAX_VISIBLE = 6;
const API_KEY = 'db4a7367';

// Fetch movies from OMDb API
async function fetchOMDbResults(query) {
  if (!query) return [];
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.Search || [];
  } catch (err) {
    console.error('OMDb fetch error:', err);
    return [];
  }
}

// Create movie card (OMDb)
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <div class="image-wrapper">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.png'}" alt="${movie.Title}" />
      <div class="hover-overlay">More info →</div>
    </div>
    <div class="movie-details">
      <h3>${movie.Title}</h3>
      <ul>
        <li><i class="fa-solid fa-calendar"></i> ${movie.Year}</li>
        <li><i class="fa-solid fa-film"></i> ${movie.Type}</li>
      </ul>
    </div>
  `;
  return card;
}

// Main function to update movie results
async function updateMovies() {
  const searchTerm = searchInput.value.trim();
  const minRating = parseInt(ratingSlider.value, 10);
  ratingValue.textContent = `${minRating} to 10`;

  movieGrid.innerHTML = ''; // clear previous results
  if (!searchTerm) return;

  const results = await fetchOMDbResults(searchTerm);

  results.slice(0, MAX_VISIBLE).forEach(movie => {
    const card = createMovieCard(movie);
    movieGrid.appendChild(card);
  });
}

// Event listeners
searchInput.addEventListener('input', updateMovies);
searchBtn.addEventListener('click', updateMovies);
searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') updateMovies();
});
ratingSlider.addEventListener('input', updateMovies);

// Initial load (optional)
updateMovies();
