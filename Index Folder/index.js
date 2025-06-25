const searchInput = document.getElementById('searchInput');
const priceSlider = document.getElementById('priceRange');
const priceValue = document.getElementById('priceRangeValue');
const carCards = document.querySelectorAll('.car-card');
const carGrid = document.getElementById('carGrid'); // Needed for adding OMDb cards

const MAX_VISIBLE = 6;
const MAX_PRICE = 100000;
const API_KEY = 'db4a7367';

async function fetchOMDbResults(query) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.Search || [];
}

function createCardFromOMDb(movie) {
  const card = document.createElement('div');
  card.className = 'car-card omdb-card';
  card.innerHTML = `
    <div class="image-wrapper">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <div class="hover-overlay">More info →</div>
    </div>
    <div class="car-details">
      <h3>${movie.Title}</h3>
      <ul>
        <li><i class="fa-solid fa-calendar"></i> ${movie.Year}</li>
        <li><i class="fa-solid fa-film"></i> ${movie.Type}</li>
      </ul>
      <p class="price">N/A</p>
    </div>
  `;
  return card;
}

async function updateFilter() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const minPrice = parseInt(priceSlider.value, 10);

  priceValue.textContent = `$${minPrice.toLocaleString()} to $${MAX_PRICE.toLocaleString()}`;

  // Remove previous OMDb results
  document.querySelectorAll('.omdb-card').forEach(el => el.remove());

  let shownCount = 0;

  // Filter local car cards
  carCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const price = parseInt(card.dataset.price, 10);

    const matchesSearch = title.includes(searchTerm);
    const matchesPrice = price >= minPrice && price <= MAX_PRICE;

    let shouldShow = false;
    if (searchTerm !== '') {
      shouldShow = matchesSearch;
    } else {
      shouldShow = matchesPrice;
    }

    if (shouldShow && shownCount < MAX_VISIBLE) {
      card.style.display = 'block';
      shownCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // If fewer than MAX_VISIBLE shown, fetch from OMDb to fill the rest
  if (shownCount < MAX_VISIBLE && searchTerm !== '') {
    const results = await fetchOMDbResults(searchTerm);
    results.slice(0, MAX_VISIBLE - shownCount).forEach(movie => {
      const card = createCardFromOMDb(movie);
      carGrid.appendChild(card);
    });
  }
}

searchInput.addEventListener('input', updateFilter);
priceSlider.addEventListener('input', updateFilter);
updateFilter();