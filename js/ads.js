(() => {
  'use strict';

  const config = window.DriveSymbolsConfig || {};
  const client = String(config.adsenseClient || '').trim();
  const defaultSlot = String(config.defaultAdSlot || '6118497380').trim();
  const selector = '.ad-slot';
  const requested = new WeakSet();
  let scriptPromise;
  let observer;

  const runWhenIdle = (callback) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1200 });
    } else {
      window.setTimeout(callback, 180);
    }
  };

  const ensureAdSense = () => {
    if (!client) return Promise.resolve(false);
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve) => {
      const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      const existing = document.querySelector('script[data-drive-adsense="true"]') || document.querySelector(`script[src^="${scriptUrl}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve(true);
        existing.addEventListener('load', () => resolve(true), { once: true });
        existing.addEventListener('error', () => resolve(false), { once: true });
        window.setTimeout(() => resolve(Boolean(window.adsbygoogle)), 3000);
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = scriptUrl;
      script.dataset.driveAdsense = 'true';
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve(true);
      }, { once: true });
      script.addEventListener('error', () => resolve(false), { once: true });
      document.head.appendChild(script);
    });
    return scriptPromise;
  };

  const createAdUnit = (container) => {
    const existing = container.querySelector('.adsbygoogle');
    if (existing) return existing;

    const slot = container.dataset.adSlot || defaultSlot;
    if (!slot) return null;
    container.dataset.adSlot = slot;

    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.setAttribute('data-ad-client', client);
    ad.setAttribute('data-ad-slot', slot);
    ad.setAttribute('data-ad-format', container.dataset.adFormat || 'auto');
    if (container.dataset.adLayoutKey) ad.setAttribute('data-ad-layout-key', container.dataset.adLayoutKey);
    if (container.dataset.adLayout) ad.setAttribute('data-ad-layout', container.dataset.adLayout);
    if (container.dataset.adResponsive !== 'false') ad.setAttribute('data-full-width-responsive', 'true');
    container.appendChild(ad);
    return ad;
  };

  const requestAd = (container) => {
    if (!container || requested.has(container) || container.dataset.adRequested === 'true') return;
    if (!client) {
      container.classList.add('ad-slot--disabled');
      return;
    }

    const ad = createAdUnit(container);
    if (!ad) return;
    requested.add(container);
    container.classList.add('ad-slot--loading');
    runWhenIdle(() => {
      ensureAdSense().then((ready) => {
        if (!ready) {
          requested.delete(container);
          container.classList.remove('ad-slot--loading');
          container.classList.add('ad-slot--unavailable');
          return;
        }
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          container.dataset.adRequested = 'true';
          container.classList.remove('ad-slot--loading');
          container.classList.add('ad-slot--requested');
        } catch (error) {
          requested.delete(container);
          container.classList.remove('ad-slot--loading');
          container.classList.add('ad-slot--unavailable');
          console.warn('AdSense request skipped:', error);
        }
      });
    });
  };

  const initAds = () => {
    const containers = [...document.querySelectorAll(selector)];
    if (!containers.length) return;
    const label = document.documentElement.lang === 'en' ? 'Advertisement' : 'إعلان';
    containers.forEach((container) => {
      container.setAttribute('role', 'complementary');
      container.setAttribute('aria-label', label);
      container.classList.add('ad-slot');
      if (client) createAdUnit(container);
    });

    if (!('IntersectionObserver' in window)) {
      containers.forEach(requestAd);
      return;
    }
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        requestAd(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '420px 0px', threshold: 0.01 });
    containers.forEach((container) => observer.observe(container));
  };

  window.DriveSymbolsAds = { init: initAds, refresh: () => document.querySelectorAll(selector).forEach(requestAd) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAds, { once: true });
  else initAds();
})();
