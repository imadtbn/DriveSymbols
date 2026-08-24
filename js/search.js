// Search functionality
let allSymbols = [];
let currentFilters = { severity: null, canDrive: null, category: null, brand: null };

async function initSearch() {
  try {
    const res = await fetch('data/symbols.json');
    allSymbols = await res.json();

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const category = params.get('category');
    const brand = params.get('brand');
    const severity = params.get('severity');

    if (query) {
      document.getElementById('searchInput').value = query;
      performSearch();
    } else if (category) {
      currentFilters.category = category;
      performSearch();
    } else if (brand) {
      currentFilters.brand = brand;
      performSearch();
    } else if (severity) {
      currentFilters.severity = severity;
      updateFilterButtons();
      performSearch();
    } else {
      displayResults(allSymbols, window.DriveI18n?.getLanguage() === 'en' ? 'All symbols' : 'جميع الرموز');
    }

    setupFilters();
    setupSearchInput();
  } catch (e) {
    console.error(e);
  }
}

function setupSearchInput() {
  const input = document.getElementById('searchInput');
  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(performSearch, 300);
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      const value = btn.dataset.value;

      if (btn.classList.contains('active') && value !== 'all') {
        btn.classList.remove('active');
        currentFilters[filter] = null;
      } else {
        document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilters[filter] = value === 'all' ? null : (value === 'true' ? true : value === 'false' ? false : value);
      }

      performSearch();
    });
  });
}

function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    if (currentFilters[filter] !== null && currentFilters[filter].toString() === value) {
      btn.classList.add('active');
    }
  });
}

function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  let results = allSymbols.filter(symbol => {
    const searchable = [
      symbol.name,
      symbol.nameEn,
      symbol.arabicName,
      symbol.categoryArabic,
      symbol.categoryEn,
      ...(symbol.keywords || []),
      ...(symbol.keywordsEn || [])
    ].filter(Boolean).join(' ').toLowerCase();
    const matchesQuery = !query || searchable.includes(query);

    const matchesSeverity = !currentFilters.severity || symbol.severity === currentFilters.severity;
    const matchesDrive = currentFilters.canDrive === null || symbol.canDrive === currentFilters.canDrive;
    const matchesCategory = !currentFilters.category || symbol.category === currentFilters.category;
    const matchesBrand = !currentFilters.brand || symbol.brands.includes(currentFilters.brand);

    return matchesQuery && matchesSeverity && matchesDrive && matchesCategory && matchesBrand;
  });

  const isEnglish = window.DriveI18n?.getLanguage() === 'en';
  const title = query ? `${isEnglish ? 'Search results' : 'نتائج البحث'}: "${query}"` :
    currentFilters.category ? `${isEnglish ? 'Category' : 'تصنيف'}: ${isEnglish ? (results[0]?.categoryEn || '') : (results[0]?.categoryArabic || '')}` :
      currentFilters.brand ? `${isEnglish ? 'Brand' : 'علامة'}: ${results[0]?.brands.find(b => b === currentFilters.brand) || ''}` :
        (isEnglish ? 'All symbols' : 'جميع الرموز');

  displayResults(results, title);
}

function displayResults(results, title) {

  const isEnglish = window.DriveI18n?.getLanguage() === 'en';
  const container = document.getElementById("searchResults");
  const titleEl = document.getElementById("resultsTitle");
  const countEl = document.getElementById("resultsCount");

  titleEl.textContent = title;
  countEl.textContent = `${results.length} ${isEnglish ? 'results' : 'نتيجة'}`;

  if (!results.length) {

    container.innerHTML = `

            <div class="no-results" style="grid-column:1/-1;">

                <i class="fas fa-search"></i>

                <h3>${isEnglish ? 'No results' : 'لا توجد نتائج'}</h3>

                <p>${isEnglish ? 'Try different search terms.' : 'جرب كلمات بحث مختلفة.'}</p>

            </div>

        `;

    return;

  }

  container.innerHTML = results.map(symbol => `

        <a href="symbol.html?id=${symbol.id}" class="symbol-card">

            <div class="symbol-card-image">

                <img
                    src="${symbol.image}"
                    alt="${isEnglish ? symbol.nameEn : symbol.arabicName}"
                    loading="lazy"
                    onerror="this.src='images/symbols/default.webp'">

            </div>

            <div class="symbol-card-body">

                <div class="symbol-card-title">

                        ${isEnglish ? symbol.nameEn : symbol.arabicName}

                </div>

                <div class="symbol-card-meta">

                    <span class="severity-badge ${symbol.severityColor}">

                        ${isEnglish ? symbol.severity : symbol.severityArabic}

                    </span>

                    <span>

                        ${isEnglish ? symbol.categoryEn : symbol.categoryArabic}

                    </span>

                </div>

            </div>

        </a>

    `).join("");

}

document.addEventListener('DOMContentLoaded', initSearch);