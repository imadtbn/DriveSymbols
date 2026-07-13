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
    const container = document.getElementById('categoriesGrid');
    if (container) {
      container.innerHTML = this.categories.map((cat, i) => `
        <a href="search.html?category=${cat.id}" class="category-card reveal" style="animation-delay: ${i * 0.1}s">
          <div class="category-icon" style="background: ${cat.color}20; color: ${cat.color};">
            <i class="fas ${cat.icon}"></i>
          </div>
          <div class="category-info">
            <h3>${cat.name}</h3>
            <p>${cat.count} رمز</p>
          </div>
        </a>
      `).join('');
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
    const container = document.getElementById('brandsGrid');
    if (container) {
      container.innerHTML = this.brands.map(brand => `
        <a href="search.html?brand=${brand.id}" class="brand-card">
          <div style="width: 60px; height: 60px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-sm); font-size: 1.5rem; color: var(--primary-color);">
            <i class="fas fa-car"></i>
          </div>
          <h4>${brand.name}</h4>
        </a>
      `).join('');
    }
  },
  
  renderSymbolCards(symbols) {
    return symbols.map(symbol => `
      <a href="symbol.html?id=${symbol.id}" class="symbol-card">
        <div class="symbol-card-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--primary-color);">
          <i class="fas fa-${this.getIconForCategory(symbol.category)}"></i>
        </div>
        <div class="symbol-card-body">
          <div class="symbol-card-title">${symbol.arabicName}</div>
          <div class="symbol-card-meta">
            <span class="severity-badge ${symbol.severityColor}">
              <i class="fas fa-circle" style="font-size: 0.4rem;"></i>
              ${symbol.severityArabic}
            </span>
            <span>${symbol.categoryArabic}</span>
          </div>
        </div>
      </a>
    `).join('');
  },
  
  getIconForCategory(category) {
    const icons = {
      'Engine': 'engine', 'Brakes': 'circle-stop', 'Battery': 'battery-half',
      'Oil': 'droplet', 'Temperature': 'temperature-high', 'Fuel': 'gas-pump',
      'Tires': 'circle-notch', 'Airbag': 'user-shield', 'Stability': 'car-side',
      'Transmission': 'gears', 'Electrical': 'bolt', 'Lights': 'lightbulb',
      'Assistance': 'hand-holding-hand'
    };
    return icons[category] || 'circle-question';
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