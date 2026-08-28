(() => {
  'use strict';

  const state = window.__driveSymbolsSiteTags || (window.__driveSymbolsSiteTags = {});
  const CONFIG_PATH = 'site-config.js';

  const isConfigured = (value, pattern) => Boolean(value) && !/^x+$/i.test(value) && pattern.test(value);
  const isValidGa4Id = value => isConfigured(value, /^G-[A-Z0-9]+$/i);
  const isValidGtmId = value => isConfigured(value, /^GTM-[A-Z0-9]+$/i);
  const isValidClarityId = value => isConfigured(value, /^[a-z0-9]{6,32}$/i);
  const isValidAdsenseClient = value => isConfigured(value, /^ca-pub-\d+$/i);

  // site-config.js is the single source of truth for GA4.
  const loadSiteConfig = () => {
    if (window.DriveSymbolsConfig) return Promise.resolve(window.DriveSymbolsConfig);
    if (state.configPromise) return state.configPromise;

    const existing = [...document.scripts].find(script => script.src.endsWith(`/js/${CONFIG_PATH}`) || script.dataset.siteTag === 'site-config');
    if (existing) {
      state.configPromise = new Promise(resolve => {
        if (window.DriveSymbolsConfig) return resolve(window.DriveSymbolsConfig);
        existing.addEventListener('load', () => resolve(window.DriveSymbolsConfig || {}), { once: true });
      });
      return state.configPromise;
    }

    state.configPromise = new Promise(resolve => {
      const script = document.createElement('script');
      script.src = new URL(CONFIG_PATH, document.currentScript?.src || `${location.origin}/js/site-tags.js`).href;
      script.dataset.siteTag = 'site-config';
      script.addEventListener('load', () => resolve(window.DriveSymbolsConfig || {}), { once: true });
      script.addEventListener('error', () => resolve({}), { once: true });
      document.head.appendChild(script);
    });
    return state.configPromise;
  };

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

  const createConfig = source => Object.freeze({
    siteVerification: 'f5Xi4oFx0v5dN6iPZd9qCw-7vnc3vIbAeYF9jr4vwVM',
    gtmId: 'GTM-W28BWS3L',
    ga4Id: source.analyticsMeasurementId || '',
    ga4Mode: 'direct',
    clarityId: 'xxxxxxxx',
    adsenseClient: 'ca-pub-5656416032906373'
  });

  let TAG_CONFIG = createConfig({});
  let validGtm = false;
  let validGa4 = false;
  let validClarity = false;
  let validAdsense = false;

  const refreshValidation = () => {
    validGtm = isValidGtmId(TAG_CONFIG.gtmId);
    validGa4 = isValidGa4Id(TAG_CONFIG.ga4Id);
    validClarity = isValidClarityId(TAG_CONFIG.clarityId);
    validAdsense = isValidAdsenseClient(TAG_CONFIG.adsenseClient);
  };

  const getGA4Id = () => validGa4 ? TAG_CONFIG.ga4Id : null;

  const validateGA4 = () => ({
    id: TAG_CONFIG.ga4Id || null,
    valid: validGa4,
    mode: TAG_CONFIG.ga4Mode,
    source: validGa4 ? 'site-config.js' : 'missing-or-invalid'
  });

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
      window.gtag('config', TAG_CONFIG.ga4Id, { send_page_view: true });
      state.ga4Started = true;
    }
    return appendScriptOnce('ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(TAG_CONFIG.ga4Id)}`);
  };

  const loadClarity = () => {
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

  const init = async () => {
    const source = await loadSiteConfig();
    TAG_CONFIG = createConfig(source);
    refreshValidation();

    loadGtm();
    loadGa4Direct();
    loadClarity();
    scheduleAdsense();

    if (!validGa4) {
      console.warn('[DriveSymbols] GA4 Measurement ID is missing or invalid. Check js/site-config.js.');
    } else {
      console.info(`[DriveSymbols] GA4 initialized: ${TAG_CONFIG.ga4Id}`);
    }
  };

  window.DriveSymbolsSiteTags = Object.freeze({
    get config() { return TAG_CONFIG; },
    getGA4Id,
    validateGA4,
    init
  });

  init();
})();
