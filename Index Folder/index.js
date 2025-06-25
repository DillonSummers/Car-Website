const searchInput = document.getElementById('searchInput');
const priceSlider = document.getElementById('priceRange');
const priceValue = document.getElementById('priceRangeValue');
const carCards = document.querySelectorAll('.car-card');

const MAX_VISIBLE = 6;
const MAX_PRICE = 100000;

function updateFilter() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const minPrice = parseInt(priceSlider.value, 10);

  priceValue.textContent = `$${minPrice.toLocaleString()} to $${MAX_PRICE.toLocaleString()}`;

  let shownCount = 0;

  carCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const price = parseInt(card.dataset.price, 10);

    const matchesSearch = title.includes(searchTerm);
    const matchesPrice = price >= minPrice && price <= MAX_PRICE;

    let shouldShow = false;

    // If search is active, match only the name
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
}

searchInput.addEventListener('input', updateFilter);
priceSlider.addEventListener('input', updateFilter);
updateFilter();