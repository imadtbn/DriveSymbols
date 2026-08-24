(function () {
  const translations = {
    'الرئيسية': 'Home',
    'البحث': 'Search',
    'التصنيفات': 'Categories',
    'علامات السيارات': 'Car Brands',
    'نصائح': 'Tips',
    'المقالات': 'Articles',
    'المعرفة قبل الإصلاح': 'Knowledge before repair',
    'مقالات وإرشادات عملية': 'Practical guides and articles',
    'خطوات واضحة لفهم الرمز واتخاذ القرار الآمن.': 'Clear steps to understand a warning and choose a safe response.',
    'عن الموقع': 'About',
    'اتصل بنا': 'Contact',
    'المفضلة': 'Favorites',
    'الوضع الليلي': 'Dark mode',
    'رمز موثق': 'Verified symbols',
    'تصنيف': 'Categories',
    'علامة في الدليل': 'Brands in guide',
    'درجة خطورة': 'Severity levels',
    'اعرف معنى كل رمز...': 'Understand every symbol...',
    'وتحرك بأمان.': 'Drive with confidence.',
    'دليل شامل لرموز لوحة القيادة وعلامات الأعطال في السيارات.': 'A practical guide to dashboard symbols and vehicle warnings.',
    'فهم درجة الخطورة، أسباب العطل، وخطوات التصرف الصحيحة.': 'Understand severity, likely causes, and the right next step.',
    'ابحث عن رمز، مثال: Check Engine, ABS, زيت...': 'Search a symbol, e.g. Check Engine, ABS, oil...',
    'رموز الأعطال الخطيرة': 'Critical warning symbols',
    'عرض الكل': 'View all',
    'تنبيه:': 'Warning:',
    'هذه الرموز تتطلب التوقف الفوري. لا تهملها أبداً.': 'These symbols may require an immediate stop. Do not ignore them.',
    'أكثر الرموز مشاهدة': 'Most viewed symbols',
    'أحدث الرموز': 'Latest symbols',
    'نصائح القيادة والصيانة': 'Driving and maintenance tips',
    'إرشادات مهمة تساعدك على فهم إشارات السيارة وتجنب الأعطال المكلفة': 'Practical guidance to understand vehicle alerts and avoid expensive damage.',
    'لا تتجاهل ضوء المحرك': 'Do not ignore the check engine light',
    'يحتاج للفحص': 'Inspection needed',
    'ارتفاع حرارة المحرك': 'Engine overheating',
    'خطر فوري': 'Immediate risk',
    'العناية بزيت المحرك': 'Looking after engine oil',
    'صيانة دورية': 'Routine maintenance',
    'بطارية السيارة': 'Car battery',
    'فحص مطلوب': 'Check required',
    'نظام الفرامل': 'Brake system',
    'أولوية قصوى': 'Top priority',
    'ضغط الإطارات': 'Tire pressure',
    'قيادة آمنة': 'Safe driving',
    'التصرف الصحيح:': 'What to do:',
    'النصيحة:': 'Tip:',
    'رموز مشابهة': 'Related symbols',
    'الشركات التي يظهر لديها الرمز': 'Brands where this symbol appears',
    'الأسباب المحتملة': 'Possible causes',
    'طريقة الإصلاح': 'What to do next',
    'تكلفة الإصلاح': 'Estimated repair cost',
    'إمكانية مواصلة القيادة': 'Can you keep driving?',
    'يمكن القيادة بحذر.': 'Drive cautiously.',
    'يجب التوقف وعدم مواصلة القيادة.': 'Stop and do not continue driving.',
    'إضافة إلى المفضلة': 'Add to favorites',
    'إزالة من المفضلة': 'Remove from favorites',
    'طباعة': 'Print',
    'جميع الرموز': 'All symbols',
    'نتائج البحث:': 'Search results:',
    'لا توجد نتائج': 'No results',
    'جرب كلمات بحث مختلفة.': 'Try different search terms.',
    'رموز لوحة القيادة وعلامات الأعطال في السيارات. نساعدك على فهم معنى كل رمز والتصرف الصحيح.': 'Dashboard symbols and vehicle warnings. Understand what each symbol means and what to do next.',
    'روابط سريعة': 'Quick links',
    'المعلومات': 'Information',
    'تواصل معنا': 'Contact us',
    'سياسة الخصوصية': 'Privacy policy',
    'شروط الاستخدام': 'Terms of use',
    'تثبيت التطبيق': 'Install app',
    'فيسبوك': 'Facebook',
    'الخصوصية': 'Privacy',
    'البريد الإلكتروني': 'Email',
    'تيليجرام': 'Telegram',
    'واتساب': 'WhatsApp',
    'رمز': 'Symbol',
    'تفاصيل الرمز': 'Symbol details',
    'المحرك': 'Engine',
    'الفرامل': 'Brakes',
    'البطارية': 'Battery',
    'الزيت': 'Oil',
    'الحرارة': 'Temperature',
    'الوقود': 'Fuel',
    'الإطارات': 'Tires',
    'الوسائد الهوائية': 'Airbags',
    'نظام الثبات': 'Stability',
    'ناقل الحركة': 'Transmission',
    'الكهرباء': 'Electrical',
    'الإضاءة': 'Lights',
    'أنظمة المساعدة': 'Driver assistance'
  };

  function getLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    return fromUrl === 'en' || fromUrl === 'ar' ? fromUrl : (localStorage.getItem('language') || 'ar');
  }

  function t(value) {
    return getLanguage() === 'en' && translations[value] ? translations[value] : value;
  }

  function translateTextNodes(root) {
    if (getLanguage() !== 'en') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const raw = node.nodeValue || '';
      const key = raw.trim();
      if (!key || !translations[key] || node.parentElement?.closest('script,style')) return;
      node.nodeValue = raw.replace(key, translations[key]);
    });
  }

  function ensureToggle() {
    const actions = document.querySelector('.header-actions');
    if (!actions || document.getElementById('languageToggle')) return;
    const button = document.createElement('button');
    button.id = 'languageToggle';
    button.className = 'btn-icon language-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', getLanguage() === 'en' ? 'Switch to Arabic' : 'Switch to English');
    button.innerHTML = `<span>${getLanguage() === 'en' ? 'ع' : 'EN'}</span>`;
    button.addEventListener('click', () => {
      const next = getLanguage() === 'en' ? 'ar' : 'en';
      localStorage.setItem('language', next);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.location.assign(url.toString());
    });
    actions.insertBefore(button, actions.firstChild);
  }

  function updateLanguageMetadata(language) {
    const base = new URL(window.location.href);
    base.searchParams.delete('lang');
    const english = new URL(base.toString());
    english.searchParams.set('lang', 'en');
    const canonical = language === 'en' ? english.href : base.href;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
    [['ar', base.href], ['en', english.href], ['x-default', base.href]].forEach(([hreflang, href]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
    });

    const isHome = /(?:^|\/)index\.html?$/.test(window.location.pathname) || /DriveSymbols\/?$/.test(window.location.pathname);
    if (language === 'en' && isHome) {
      document.title = 'DriveSymbols | Dashboard Warning Symbols Guide';
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'A practical guide to dashboard warning symbols, severity, likely causes, and the right next step.');
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'A practical guide to dashboard warning symbols, severity, likely causes, and the right next step.');
      document.querySelector('meta[property="og:locale"]')?.setAttribute('content', 'en_US');
    }
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  }

  function applyPageCopy(language) {
    const isHome = /(?:^|\/)index\.html?$/.test(window.location.pathname) || /DriveSymbols\/?$/.test(window.location.pathname);
    const isSearch = /\/search\.html$/.test(window.location.pathname);
    if (isSearch) {
      const heading = document.querySelector('.page-header h1');
      const description = document.querySelector('.page-header p');
      const input = document.getElementById('searchInput');
      const breadcrumb = document.querySelector('.page-header .container > div span:last-child');
      if (language === 'en') {
        document.title = 'Search dashboard symbols | DriveSymbols';
        if (heading) heading.textContent = 'Search dashboard symbols';
        if (description) description.textContent = 'Search by symbol name, category, color, or vehicle brand.';
        if (input) input.placeholder = 'Search a symbol, e.g. oil, ABS, engine...';
        if (breadcrumb) breadcrumb.textContent = 'Search dashboard symbols';
      } else {
        document.title = 'البحث - DriveSymbols DZ';
        if (heading) heading.textContent = 'البحث في الرموز';
        if (description) description.textContent = 'ابحث عن أي رمز باستخدام الاسم، التصنيف، اللون، أو الشركة';
        if (input) input.placeholder = 'ابحث عن رمز...';
        if (breadcrumb) breadcrumb.textContent = 'البحث في الرموز';
      }
      document.querySelectorAll('.filter-btn').forEach(button => {
        const value = button.dataset.value || (button.dataset.filter === 'all' ? 'all' : '');
        if (language === 'en') {
          const labels = { all: 'All', High: 'High risk', Medium: 'Medium', Low: 'Low', true: 'Can drive', false: 'Do not drive' };
          button.innerHTML = labels[value] || button.textContent;
        } else {
          const labels = { all: 'الكل', High: '🔴 خطير', Medium: '🟡 متوسط', Low: '🟢 منخفض', true: '✅ يمكن القيادة', false: '❌ لا تقود' };
          button.innerHTML = labels[value] || button.textContent;
        }
      });
      return;
    }
    if (!isHome) return;
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroSearch = document.getElementById('heroSearch');
    if (language === 'en') {
      if (heroTitle) heroTitle.innerHTML = 'Understand every symbol...<br>Drive with confidence.';
      if (heroSubtitle) heroSubtitle.textContent = 'A practical guide to dashboard symbols and vehicle warnings. Understand severity, likely causes, and the right next step.';
      if (heroSearch) heroSearch.placeholder = 'Search a symbol, e.g. Check Engine, ABS, oil...';
    } else {
      if (heroTitle) heroTitle.innerHTML = 'اعرف معنى كل رمز...<br>وتحرك بأمان.';
      if (heroSubtitle) heroSubtitle.textContent = 'دليل شامل لرموز لوحة القيادة وعلامات الأعطال في السيارات. فهم درجة الخطورة، أسباب العطل، وخطوات التصرف الصحيحة.';
      if (heroSearch) heroSearch.placeholder = 'ابحث عن رمز، مثال: Check Engine, ABS, زيت...';
    }
  }

  function apply() {
    const language = getLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    updateLanguageMetadata(language);
    document.body.classList.toggle('is-english', language === 'en');
    ensureToggle();
    translateTextNodes(document.body);
    applyPageCopy(language);
    if (language === 'en') {
      document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        element.textContent = element.dataset.en;
      });
    }
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  }

  window.DriveI18n = { getLanguage, t, apply };
  document.addEventListener('DOMContentLoaded', apply);
})();
