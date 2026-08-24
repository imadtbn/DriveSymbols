(() => {
  'use strict';

  const config = window.DriveSymbolsConfig || {};
  const measurementId = String(config.analyticsMeasurementId || '').trim();
  const validId = /^G-[A-Z0-9]+$/i.test(measurementId);
  if (!config.analyticsEnabled || !validId || window.__driveAnalyticsLoaded) return;

  window.__driveAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    transport_type: 'beacon',
    send_page_view: true
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.driveAnalytics = 'true';
  document.head.appendChild(script);

  const track = (eventName, parameters = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, parameters);
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) track('contact_click', { method: 'email' });
    if (href.includes('article.html')) track('article_select', { article_path: href.split('?')[0] });
    if (href.includes('symbol.html')) track('symbol_select', { symbol_path: href.split('?')[0] });
  }, { passive: true });

  document.addEventListener('languagechange', (event) => {
    track('language_change', { language: event.detail?.language || document.documentElement.lang });
  });

  window.DriveSymbolsAnalytics = { track };
})();
