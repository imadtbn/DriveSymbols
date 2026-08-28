(() => {
  'use strict';

  const TAG_CONFIG = Object.freeze({
    // ضع هنا رمز Google Site Verification إذا احتجت إلى تغييره.
    siteVerification: 'f5Xi4oFx0v5dN6iPZd9qCw-7vnc3vIbAeYF9jr4vwVM',
    // معرف حاوية Google Tag Manager المقدم من مالك الموقع.
    gtmId: 'GTM-W28BWS3L',
    // معرف GA4 المقدم من مالك الموقع.
    ga4Id: 'G-ZESVTL55XT',
    // direct يجعل Google tag قابلاً للاكتشاف؛ لا تضبط نفس GA4 Tag داخل GTM.
    ga4Mode: 'direct',
    // معرف Microsoft Clarity غير متوفر حاليًا.
    clarityId: 'xxxxxxxx',
    // معرف AdSense المرفق سابقًا.
    adsenseClient: 'ca-pub-5656416032906373'
  });

  const state = window.__driveSymbolsSiteTags || (window.__driveSymbolsSiteTags = {});
  const isConfigured = (value, pattern) => Boolean(value) && !/^x+$/i.test(value) && pattern.test(value);
  const validGtm = isConfigured(TAG_CONFIG.gtmId, /^GTM-[A-Z0-9]+$/i);
  const validGa4 = isConfigured(TAG_CONFIG.ga4Id, /^G-[A-Z0-9]+$/i);
  const validClarity = isConfigured(TAG_CONFIG.clarityId, /^[a-z0-9]{6,32}$/i);
  const validAdsense = isConfigured(TAG_CONFIG.adsenseClient, /^ca-pub-\d+$/i);

  const appendScriptOnce = (key, src, attributes = {}) => {
    if (state[key]) return state[key];
    const existing = [...document.scripts].find(script => script.src === src || script.dataset.siteTag === key);
    if (existing) {
      state[key] = Promise.resolve(existing);
      return state[key];
    }
    state[key] = new Promise(resolve => {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.dataset.siteTag = key;
      Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
      script.addEventListener('load', () => resolve(script), { once: true });
      script.addEventListener('error', () => resolve(null), { once: true });
      document.head.appendChild(script);
    });
    return state[key];
  };

  const loadGtm = () => {
    if (!validGtm) return Promise.resolve(null);
    window.dataLayer = window.dataLayer || [];
    if (!state.gtmStarted) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      if (validGa4 && TAG_CONFIG.ga4Mode === 'gtm') {
        window.dataLayer.push({ event: 'driveSymbols.config', driveSymbolsGa4Id: TAG_CONFIG.ga4Id });
      }
      state.gtmStarted = true;
    }
    return appendScriptOnce('gtm', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(TAG_CONFIG.gtmId)}`);
  };

  const loadGa4Direct = () => {
    if (!validGa4 || TAG_CONFIG.ga4Mode !== 'direct') return Promise.resolve(null);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function (...args) {
      window.dataLayer.push(args);
    };
    if (!state.ga4Started) {
      window.gtag('js', new Date());
      window.gtag('config', TAG_CONFIG.ga4Id);
      state.ga4Started = true;
    }
    return appendScriptOnce('ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(TAG_CONFIG.ga4Id)}`);
  };

  const loadClarity = () => {
    // When GTM is configured, Clarity must be configured as a GTM tag instead.
    if (!validClarity || validGtm || state.clarity) return Promise.resolve(null);
    window.clarity = window.clarity || function (...args) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
    return appendScriptOnce('clarity', `https://www.clarity.ms/tag/${encodeURIComponent(TAG_CONFIG.clarityId)}`);
  };

  const loadAdsense = () => {
    const units = [...document.querySelectorAll('ins.adsbygoogle')];
    if (!validAdsense || !units.length) return Promise.resolve(null);
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(TAG_CONFIG.adsenseClient)}`;
    return appendScriptOnce('adsense', src, { crossorigin: 'anonymous' }).then(() => {
      window.adsbygoogle = window.adsbygoogle || [];
      units.forEach(unit => {
        if (unit.dataset.siteTagQueued === 'true') return;
        unit.dataset.siteTagQueued = 'true';
        window.adsbygoogle.push({});
      });
      return units;
    });
  };

  const scheduleAdsense = () => {
    const units = [...document.querySelectorAll('ins.adsbygoogle')];
    if (!validAdsense || !units.length) return;
    const request = () => loadAdsense();
    if (!('IntersectionObserver' in window)) {
      window.setTimeout(request, 300);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      request();
    }, { rootMargin: '360px 0px', threshold: 0.01 });
    units.forEach(unit => observer.observe(unit));
  };

  const init = () => {
    loadGtm();
    loadGa4Direct();
    loadClarity();
    scheduleAdsense();
  };

  window.DriveSymbolsSiteTags = Object.freeze({ config: TAG_CONFIG, init });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
