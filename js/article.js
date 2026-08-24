let articles = [];
let symbols = [];
let currentArticle = null;

function articleLanguage() {
  return window.DriveI18n?.getLanguage() || 'ar';
}

function escapeArticleHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getArticleText(article, field) {
  return articleLanguage() === 'en' ? article[`${field}En`] : article[`${field}Ar`];
}

function updateArticleMetadata(article) {
  const language = articleLanguage();
  const title = getArticleText(article, 'title');
  const description = getArticleText(article, 'excerpt');
  const canonical = `https://imadtbn.github.io/DriveSymbols/article.html?slug=${encodeURIComponent(article.slug)}`;
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
  document.title = `${title} | DriveSymbols`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[name="keywords"]')?.setAttribute('content', (language === 'en' ? article.keywordsEn : article.keywordsAr).join(', '));
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', `https://imadtbn.github.io/DriveSymbols/${article.image}`);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
}

function renderArticle(article) {
  const language = articleLanguage();
  const title = getArticleText(article, 'title');
  const excerpt = getArticleText(article, 'excerpt');
  const sections = article.sections[language] || article.sections.ar;
  const category = language === 'en' ? article.category : article.category;
  const articleUrl = `article.html?slug=${encodeURIComponent(article.slug)}`;
  const sectionMarkup = sections.map(section => `
    <section class="article-section">
      <h2>${escapeArticleHtml(section.heading)}</h2>
      <p>${escapeArticleHtml(section.body)}</p>
    </section>
  `).join('');

  const related = article.relatedSymbolIds
    .map(id => symbols.find(symbol => Number(symbol.id) === Number(id)))
    .filter(Boolean)
    .slice(0, 4)
    .map(symbol => `
      <a class="symbol-card compact-card" href="symbol.html?id=${symbol.id}">
        <div class="symbol-card-image"><img src="${escapeArticleHtml(symbol.image)}" alt="${escapeArticleHtml(language === 'en' ? symbol.nameEn : symbol.arabicName)}" loading="lazy" width="320" height="180"></div>
        <div class="symbol-card-body"><h3 class="symbol-card-title">${escapeArticleHtml(language === 'en' ? symbol.nameEn : symbol.arabicName)}</h3><div class="symbol-card-meta"><span>${escapeArticleHtml(language === 'en' ? symbol.categoryEn : symbol.categoryArabic)}</span></div></div>
      </a>
    `).join('');

  const sources = article.sources.map(source => `
    <li><a href="${escapeArticleHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeArticleHtml(source.label)}</a></li>
  `).join('');

  document.getElementById('articleContent').innerHTML = `
    <article class="article-page" itemscope itemtype="https://schema.org/Article">
      <meta itemprop="datePublished" content="${escapeArticleHtml(article.publishedAt)}">
      <meta itemprop="dateModified" content="${escapeArticleHtml(article.updatedAt)}">
      <meta itemprop="articleSection" content="${escapeArticleHtml(category)}">
      <div class="article-hero">
        <img src="${escapeArticleHtml(article.image)}" alt="${escapeArticleHtml(language === 'en' ? article.altEn : article.altAr)}" width="1280" height="720" itemprop="image">
        <div class="article-hero-overlay"></div>
        <div class="article-hero-copy">
          <span class="article-kicker">${language === 'en' ? 'DriveSymbols guide' : 'دليل DriveSymbols'}</span>
          <h1 itemprop="headline">${escapeArticleHtml(title)}</h1>
          <p itemprop="description">${escapeArticleHtml(excerpt)}</p>
          <div class="article-meta"><span><i class="fas fa-clock" aria-hidden="true"></i> ${article.readTime} ${language === 'en' ? 'min read' : 'دقائق قراءة'}</span><span><i class="fas fa-calendar" aria-hidden="true"></i> ${escapeArticleHtml(article.updatedAt)}</span></div>
        </div>
      </div>
      <div class="article-layout">
        <div class="article-body" itemprop="articleBody">${sectionMarkup}</div>
        <aside class="article-aside">
          <div class="article-aside-card">
            <h2>${language === 'en' ? 'Quick navigation' : 'تنقل سريع'}</h2>
            <ul class="article-toc">${sections.map((section, index) => `<li><a href="#article-section-${index}">${escapeArticleHtml(section.heading)}</a></li>`).join('')}</ul>
          </div>
          <div class="article-aside-card article-safety-card"><i class="fas fa-shield-halved" aria-hidden="true"></i><h2>${language === 'en' ? 'Safety first' : 'السلامة أولًا'}</h2><p>${language === 'en' ? 'This guide supports a safe first decision. Your owner’s manual and a qualified technician remain the authority for your vehicle.' : 'هذا الدليل يساعدك على اتخاذ قرار أولي آمن. يبقى دليل المالك والفني المؤهل المرجع النهائي لسيارتك.'}</p></div>
        </aside>
      </div>
      <div class="article-sources"><h2>${language === 'en' ? 'Trusted references' : 'مراجع موثوقة'}</h2><ul>${sources}</ul></div>
    </article>
    <section class="section related-section">
      <div class="section-header"><h2><i class="fas fa-link" aria-hidden="true"></i> ${language === 'en' ? 'Related symbols' : 'رموز ذات صلة'}</h2></div>
      <div class="grid grid-4">${related}</div>
    </section>
  `;
  document.querySelectorAll('.article-section').forEach((section, index) => section.id = `article-section-${index}`);
  updateArticleMetadata(article);
  document.getElementById('breadcrumbArticle').textContent = title;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: [`https://imadtbn.github.io/DriveSymbols/${article.image}`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'DriveSymbols' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    inLanguage: language
  };
  document.getElementById('articleStructuredData').textContent = JSON.stringify(schema);
}

async function initArticle() {
  const slug = new URLSearchParams(window.location.search).get('slug');
  try {
    const [articlesResponse, symbolsResponse] = await Promise.all([
      fetch('data/articles.json'),
      fetch('data/symbols.json')
    ]);
    articles = await articlesResponse.json();
    symbols = await symbolsResponse.json();
    currentArticle = articles.find(article => article.slug === slug) || articles[0];
    if (!currentArticle) throw new Error('Article not found');
    renderArticle(currentArticle);
    window.DriveI18n?.apply();
  } catch (error) {
    console.error(error);
    document.getElementById('articleContent').innerHTML = '<div class="no-results"><h1>Article unavailable</h1><p>Please return to the articles list.</p></div>';
  }
}

document.addEventListener('languagechange', () => {
  if (currentArticle) renderArticle(currentArticle);
});
document.addEventListener('DOMContentLoaded', initArticle);
