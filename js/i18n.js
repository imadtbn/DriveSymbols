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

    const tips = language === 'en' ? [
      ['Do not ignore the check engine light', 'Inspection needed', 'A Check Engine symbol is not always a serious fault, but it can point to a fuel, ignition, or sensor issue. Ignoring it can lead to larger problems.', 'What to do:', 'Scan the vehicle with an OBD2 diagnostic tool soon.'],
      ['Engine overheating', 'Immediate risk', 'A high temperature reading can damage the head gasket or cylinder head if driving continues.', 'What to do:', 'Stop safely, switch off the engine, and wait for it to cool before checking coolant.'],
      ['Looking after engine oil', 'Routine maintenance', 'Oil lubricates engine components and reduces friction. Low or unsuitable oil can accelerate wear.', 'Tip:', 'Check the oil level regularly and follow the manufacturer’s service interval.'],
      ['Car battery', 'Check required', 'A weak battery can cause hard starting or warning symbols because of low voltage.', 'Tip:', 'Check the battery and alternator output, especially before winter.'],
      ['Brake system', 'Top priority', 'A brake or ABS symbol can affect the vehicle’s ability to stop safely.', 'What to do:', 'Avoid speed and have the system inspected immediately.'],
      ['Tire pressure', 'Safe driving', 'Incorrect pressure increases fuel use and affects stability and control.', 'Tip:', 'Check tire pressure monthly and before long journeys.']
    ] : [
      ['لا تتجاهل ضوء المحرك', 'يحتاج للفحص', 'ظهور رمز Check Engine لا يعني دائماً عطلاً خطيراً، لكنه قد يشير إلى مشكلة في نظام الوقود أو الإشعال أو الحساسات. تجاهله لفترة طويلة قد يؤدي إلى أعطال أكبر.', 'التصرف الصحيح:', 'افحص السيارة بجهاز التشخيص OBD2 في أقرب وقت.'],
      ['ارتفاع حرارة المحرك', 'خطر فوري', 'ارتفاع مؤشر الحرارة قد يؤدي إلى تلف حشية رأس المحرك أو تشوه رأس الأسطوانة إذا استمرت القيادة.', 'التصرف الصحيح:', 'توقف بأمان، أطفئ المحرك وانتظر حتى يبرد قبل فحص مستوى سائل التبريد.'],
      ['العناية بزيت المحرك', 'صيانة دورية', 'الزيت يحافظ على تزييت أجزاء المحرك وتقليل الاحتكاك. نقص الزيت أو استخدام زيت غير مناسب يسبب تآكل المحرك.', 'النصيحة:', 'افحص مستوى الزيت بانتظام واتبع فترة التغيير الموصى بها من الشركة.'],
      ['بطارية السيارة', 'فحص مطلوب', 'ضعف البطارية قد يسبب صعوبة التشغيل أو ظهور رموز تحذيرية بسبب انخفاض الجهد.', 'النصيحة:', 'افحص البطارية وشحن الدينامو خاصة قبل فصل الشتاء.'],
      ['نظام الفرامل', 'أولوية قصوى', 'ظهور رمز الفرامل أو ABS قد يؤثر على قدرة السيارة على التوقف بأمان.', 'التصرف الصحيح:', 'تجنب السرعة وقم بفحص النظام فوراً.'],
      ['ضغط الإطارات', 'قيادة آمنة', 'الضغط غير الصحيح يزيد استهلاك الوقود ويؤثر على الثبات والتحكم.', 'النصيحة:', 'افحص ضغط الإطارات مرة كل شهر وقبل الرحلات الطويلة.']
    ];
    document.querySelectorAll('.tip-card').forEach((card, index) => {
      const tip = tips[index];
      if (!tip) return;
      const heading = card.querySelector('h3');
      const level = card.querySelector('.tip-level');
      const paragraphs = card.querySelectorAll('p');
      const action = card.querySelector('strong');
      if (heading) heading.textContent = tip[0];
      if (level) {
        const icon = level.querySelector('i');
        level.textContent = '';
        if (icon) level.appendChild(icon);
        level.append(` ${tip[1]}`);
      }
      if (paragraphs[0]) paragraphs[0].textContent = tip[2];
      if (action) {
        const icon = action.querySelector('i');
        action.textContent = '';
        if (icon) action.appendChild(icon);
        action.append(` ${tip[3]}`);
      }
      if (paragraphs[1]) paragraphs[1].textContent = tip[4];
    });
    const footerDescription = document.querySelector('.footer-brand p');
    const copyright = document.querySelector('.footer-bottom p');
    if (footerDescription) footerDescription.textContent = language === 'en' ? 'A practical guide to dashboard symbols and safe next steps.' : 'دليل شامل لرموز لوحة القيادة وعلامات الأعطال في السيارات. نساعدك على فهم معنى كل رمز والتصرف الصحيح.';
    if (copyright) copyright.textContent = language === 'en' ? '© 2026 DriveSymbols. All rights reserved.' : '© 2026 DriveSymbols DZ. جميع الحقوق محفوظة.';
  }

  function applyListingHeaderCopy(language) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const copy = {
      'categories.html': ['Categories', 'Browse symbols by vehicle system or component.', 'التصنيفات', 'تصفح الرموز حسب النظام أو الجزء المعني'],
      'brands.html': ['Car brands', 'Explore dashboard symbols by vehicle manufacturer.', 'علامات السيارات', 'تصفح الرموز حسب الشركة المصنّعة للسيارة'],
      'favorites.html': ['Saved symbols', 'Keep important symbols close for quick reference.', 'المفضلة', 'احفظ الرموز المهمة للوصول السريع']
    }[page];
    if (!copy) return;
    const heading = document.querySelector('.page-header h1');
    const description = document.querySelector('.page-header p');
    if (language === 'en') {
      document.title = `${copy[0]} | DriveSymbols`;
      if (heading) heading.textContent = copy[0];
      if (description) description.textContent = copy[1];
    } else {
      document.title = `${copy[2]} - DriveSymbols DZ`;
      if (heading) heading.textContent = copy[2];
      if (description) description.textContent = copy[3];
    }
  }

  function applyStaticPageCopy(language) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const copies = {
      'about.html': {
        title: 'About DriveSymbols', description: 'A practical, safety-first guide to dashboard warning symbols.', html: `<section class="section"><div class="container"><div class="content-narrow"><h2>Understand the signal before the repair</h2><p>DriveSymbols helps drivers identify dashboard symbols, understand their severity, and choose a safer next step. The guide is designed for quick reading on a phone at the moment a warning appears.</p><h2>What you will find</h2><div class="grid grid-2"><div class="card card-body"><h3>Verified symbol guide</h3><p>Browse clear explanations for common engine, oil, brake, tire, battery, lighting, and driver-assistance symbols.</p></div><div class="card card-body"><h3>Smart search</h3><p>Search by symbol name, category, color, or vehicle brand to reach the relevant record faster.</p></div><div class="card card-body"><h3>Offline-ready PWA</h3><p>The progressive web app caches essential pages and assets for practical access when connectivity is limited.</p></div><div class="card card-body"><h3>Safety-first decisions</h3><p>Each guide separates inspection, caution, and stop-now situations so you can avoid unsafe guesswork.</p></div></div><div class="alert alert-warning"><strong>Important:</strong> This website is educational. Your owner’s manual and a qualified technician remain the final authority for your vehicle.</div></div></div></section>`
      },
      'contact.html': {
        title: 'Contact DriveSymbols', description: 'Send a correction, source suggestion, or feedback about the guide.', html: `<section class="section"><div class="container"><div class="content-narrow"><h2>Help improve the guide</h2><p>If you spot an inaccurate label, a missing vehicle brand, or a source that should be reviewed, send the details to our team.</p><div class="card card-body"><h3><i class="fas fa-envelope" aria-hidden="true"></i> Email</h3><p><a href="mailto:contact@drivesymbols.dz">contact@drivesymbols.dz</a></p><p>Include the symbol name, vehicle make and model if relevant, the source URL, and a short description of the proposed correction.</p></div><div class="card card-body"><h3><i class="fas fa-shield-halved" aria-hidden="true"></i> Safety reports</h3><p>For a safety-critical correction involving brakes, steering, airbags, oil pressure, charging, or overheating, clearly mark the message as urgent and rely on the owner’s manual until it is reviewed.</p></div></div></div></section>`
      },
      'privacy.html': {
        title: 'Privacy Policy', description: 'How DriveSymbols handles basic website information.', html: `<section class="section"><div class="container"><div class="content-narrow"><p><strong>Last updated: August 24, 2026</strong></p><h2>Scope</h2><p>This policy explains how DriveSymbols handles information when you browse the public website. The guide is designed to work without requiring an account.</p><h2>Information and storage</h2><p>Favorites and theme preferences may be stored locally in your browser. We do not ask you to submit vehicle registration details or personal diagnostic information to read the guide.</p><h2>Cookies and advertising</h2><p>The site may display third-party advertising. Those providers may use their own technologies subject to their policies. DriveSymbols does not use the favorites feature to build a personal profile.</p><h2>External links</h2><p>Links to owner manuals, manufacturer pages, social sharing services, and other websites open resources governed by their own privacy policies.</p><h2>Changes</h2><p>We may update this policy when the website or its features change. The update date above indicates the latest revision.</p></div></div></section>`
      },
      'terms.html': {
        title: 'Terms of Use', description: 'The terms that apply when you use the DriveSymbols guide.', html: `<section class="section"><div class="container"><div class="content-narrow"><p><strong>Last updated: August 24, 2026</strong></p><h2>Educational information</h2><p>DriveSymbols provides general educational information about dashboard symbols. A symbol can vary by vehicle, model year, market, and equipment. Always compare the information with the owner’s manual.</p><h2>Safety and responsibility</h2><p>Do not continue driving when a warning indicates an immediate risk. For brakes, steering, airbags, oil pressure, charging, or overheating, stop safely and consult a qualified technician or roadside service.</p><h2>Accuracy and availability</h2><p>We work to keep the guide clear and current, but we cannot guarantee that every record applies to every vehicle or that the website will always be available.</p><h2>External services</h2><p>External manufacturer manuals, social networks, advertising providers, and other linked services are governed by their own terms and policies.</p><h2>Updates</h2><p>We may revise these terms as the website evolves. Continued use after an update means you accept the revised terms.</p></div></div></section>`
      }
    };
    const copy = copies[page];
    if (!copy) return;
    const header = document.querySelector('.page-header');
    const heading = header?.querySelector('h1');
    const description = header?.querySelector('p');
    const main = document.querySelector('main') || document.querySelector('section.section');
    if (language === 'en') {
      document.title = `${copy.title} | DriveSymbols`;
      if (heading) heading.textContent = copy.title;
      if (description) description.textContent = copy.description;
      if (main) main.outerHTML = copy.html;
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
    applyListingHeaderCopy(language);
    applyStaticPageCopy(language);
    const globalFooterDescription = document.querySelector('.footer-brand p');
    const globalCopyright = document.querySelector('.footer-bottom p');
    const globalFooterEmail = document.querySelector('footer a[href^="mailto:"]');
    if (globalFooterDescription) globalFooterDescription.textContent = language === 'en' ? 'A practical guide to dashboard symbols and safe next steps.' : 'دليل عملي لفهم رموز لوحة القيادة والتصرف الآمن.';
    if (globalFooterEmail) globalFooterEmail.lastChild.textContent = language === 'en' ? ' Email' : ' البريد الإلكتروني';
    if (globalCopyright) globalCopyright.textContent = language === 'en' ? '© 2026 DriveSymbols. All rights reserved.' : '© 2026 DriveSymbols DZ. جميع الحقوق محفوظة.';
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
