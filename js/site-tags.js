(() => {
  'use strict';

  const config = Object.freeze({
    // ضع هنا معرف حاوية Google Tag Manager مثل GTM-XXXXXXX.
    gtmId: 'xxxxxxxx',
    // ضع هنا معرف Google Analytics 4 مثل G-XXXXXXXXXX؛ تتم إدارته عبر GTM ولا يُحمّل gtag.js مباشرة.
    ga4Id: 'xxxxxxxx',
    // ضع هنا معرف Microsoft Clarity عند توفره.
    clarityId: 'xxxxxxxx',
    // معرف AdSense مأخوذ من ملف adsbygoogle المرفق.
    adsenseClient: 'ca-pub-5656416032906373'
  });

  const state = window.__driveSymbolsSiteTags || (window.__driveSymbolsSiteTags = {});
  const validGtm = /^GTM-[A-Z0-9]+$/i.test(config.gtmId);
  const validClarity = /^[a-z0-9]{6,32}$/i.test(config.clarityId) && !/^x+$/i.test(config.clarityId);
  const validAdsense = /^ca-pub-\d+$/.test(config.adsenseClient);

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
      state.gtmStarted = true;
    }
    return appendScriptOnce('gtm', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`);
  };

  const loadClarity = () => {
    // When GTM is configured, Clarity must be configured as a GTM tag instead.
    if (!validClarity || validGtm || state.clarity) return Promise.resolve(null);
    window.clarity = window.clarity || function (...args) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
    return appendScriptOnce('clarity', `https://www.clarity.ms/tag/${encodeURIComponent(config.clarityId)}`);
  };

  const loadAdsense = () => {
    const units = [...document.querySelectorAll('ins.adsbygoogle')];
    if (!validAdsense || !units.length) return Promise.resolve(null);
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsenseClient)}`;
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
    loadClarity();
    scheduleAdsense();
  };

  window.DriveSymbolsSiteTags = Object.freeze({ config, init });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
