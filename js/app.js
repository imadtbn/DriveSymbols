// DriveSymbols DZ - Main Application
const App = {
  symbols: [],
  categories: [],
  brands: [],

  async init() {
    await this.loadData();
    this.initTheme();
    this.initMobileMenu();
    this.initScrollTop();
    this.initInstallButton();
    this.initServiceWorker();
  },

  async loadData() {
    try {
      const [symbolsRes, categoriesRes, brandsRes] = await Promise.all([
        fetch('data/symbols.json'),
        fetch('data/categories.json'),
        fetch('data/brands.json')
      ]);

      this.symbols = await symbolsRes.json();
      this.categories = await categoriesRes.json();
      this.brands = await brandsRes.json();

      // Render homepage sections if on index
      if (document.getElementById('dangerSymbolsGrid')) {
        this.renderDangerSymbols();
        this.renderCategories();
        this.renderPopularSymbols();
        this.renderLatestSymbols();
        this.renderBrands();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },

  renderDangerSymbols() {
    const danger = this.symbols.filter(s => s.severity === 'High').slice(0, 4);
    const container = document.getElementById('dangerSymbolsGrid');
    if (container) container.innerHTML = this.renderSymbolCards(danger);
  },

  renderCategories() {

    const container = document.getElementById("categoriesGrid");

    if (!container) return;

    const categories = this.categories.slice(0, 6);

    container.innerHTML = categories.map((cat, index) => {

      const symbolsCount = this.symbols.filter(symbol =>
        symbol.category === cat.id
      ).length;

      return `

            <a href="search.html?category=${cat.id}"
               class="category-card reveal"
               style="animation-delay:${index * 0.08}s">

                <div class="category-image">

                    <img
                        src="${cat.image}"
                        alt="${cat.name}"
                        loading="lazy"
                        onerror="this.src='images/categories/default.webp'">

                </div>

                <div class="category-info">

                    <h3>${cat.name}</h3>

                    <p class="category-description">

                        ${cat.description}

                    </p>

                    <span class="category-count">

                        ${symbolsCount} رمز

                    </span>

                </div>

            </a>

        `;

    }).join("");

    if (typeof initScrollReveal === "function") {
      initScrollReveal();
    }

  },

  renderPopularSymbols() {
    const popular = [...this.symbols].sort((a, b) => b.views - a.views).slice(0, 4);
    const container = document.getElementById('popularSymbolsGrid');
    if (container) container.innerHTML = this.renderSymbolCards(popular);
  },

  renderLatestSymbols() {
    const latest = [...this.symbols].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)).slice(0, 4);
    const container = document.getElementById('latestSymbolsGrid');
    if (container) container.innerHTML = this.renderSymbolCards(latest);
  },

  renderBrands() {

    const container = document.getElementById("brandsGrid");

    if (!container) return;

    const brands = this.brands.slice(0, 6);

    container.innerHTML = brands.map(brand => {

      const symbolsCount = this.symbols.filter(symbol =>
        (symbol.brands || []).includes(brand.id)
      ).length;

      return `

            <a href="search.html?brand=${brand.id}"
               class="brand-card reveal">

                <div class="brand-logo">

                    <img
                        src="${brand.image}"
                        alt="${brand.name}"
                        loading="lazy"
                        onerror="this.src='images/brands/default.svg'">

                </div>

                <div class="brand-info">

                    <h3>${brand.name}</h3>

                    <p class="brand-country">

                        ${brand.country}

                    </p>

                    <span class="brand-count">

                        ${symbolsCount} رمز

                    </span>

                </div>

            </a>

        `;

    }).join("");

    if (typeof initScrollReveal === "function") {
      initScrollReveal();
    }

  },

  renderSymbolCards(symbols) {

    return symbols.map(symbol => `

<a href="symbol.html?id=${symbol.id}" class="symbol-card reveal">

  <div class="symbol-card-image">

    <img src="${symbol.image}" alt="${symbol.arabicName}" loading="lazy"
      onerror="this.src='images/symbols/default.webp'">

  </div>

  <div class="symbol-card-body">

    <h3 class="symbol-card-title">

      ${symbol.arabicName}

    </h3>

    <div class="symbol-card-meta">

      <span class="severity-badge ${symbol.severityColor}">
        ${symbol.severityArabic}
      </span>

      <span>${symbol.categoryArabic}</span>

    </div>

  </div>

</a>

`).join("");

  },


  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.innerHTML = `<i class="fas fa-${next === 'light' ? 'moon' : 'sun'}"></i>`;
      });
    }
  },

  initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (btn && nav) {
      btn.addEventListener('click', () => nav.classList.toggle('active'));
    }
  },

  initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (btn) {
      window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 300);
      });
    }
  },

  initInstallButton() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const btn = document.getElementById('installBtn');
      if (btn) btn.classList.add('show');
    });

    const btn = document.getElementById('installBtn');
    if (btn) {
      btn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') btn.classList.remove('show');
          deferredPrompt = null;
        }
      });
    }
  },

  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.log('SW registration failed:', err));
    }
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => App.init());