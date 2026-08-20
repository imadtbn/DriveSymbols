(() => {
  'use strict';

  const ADSENSE_CLIENT = 'ca-pub-5656416032906373';
  const AD_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  const AD_SELECTOR = '.ad-slot[data-ad-slot]';
  const loadedAds = new WeakSet();
  let observer;
  let scriptPromise;

  const runWhenIdle = (callback) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1200 });
      return;
    }
    window.setTimeout(callback, 180);
  };

  const ensureAdSense = () => {
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve) => {
      window.adsbygoogle = window.adsbygoogle || [];
      const existingScript = document.querySelector(`script[src^="${AD_SCRIPT_URL}"]`);

      if (existingScript) {
        if (existingScript.dataset.adsReady === 'true' || window.adsbygoogle) {
          resolve();
          return;
        }
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => resolve(), { once: true });
        window.setTimeout(resolve, 2500);
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = AD_SCRIPT_URL;
      script.dataset.adsReady = 'pending';
      script.addEventListener('load', () => {
        script.dataset.adsReady = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => resolve(), { once: true });
      document.head.appendChild(script);
    });

    return scriptPromise;
  };

  const createAdUnit = (container) => {
    if (container.querySelector('.adsbygoogle')) return container.querySelector('.adsbygoogle');

    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = ADSENSE_CLIENT;
    ad.dataset.adSlot = container.dataset.adSlot;
    ad.dataset.adFormat = container.dataset.adFormat || 'auto';

    if (container.dataset.adLayoutKey) {
      ad.dataset.adLayoutKey = container.dataset.adLayoutKey;
    }
    if (container.dataset.adLayout) {
      ad.dataset.adLayout = container.dataset.adLayout;
    }
    if (container.dataset.adResponsive !== 'false') {
      ad.dataset.fullWidthResponsive = 'true';
    }

    container.appendChild(ad);
    return ad;
  };

  const requestAd = (container) => {
    if (!container || loadedAds.has(container)) return;

    loadedAds.add(container);
    container.classList.add('ad-slot--loading');
    const ad = createAdUnit(container);

    runWhenIdle(() => {
      ensureAdSense().then(() => {
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          ad.dataset.adRequested = 'true';
          container.classList.remove('ad-slot--loading');
          container.classList.add('ad-slot--requested');
        } catch (error) {
          loadedAds.delete(container);
          container.classList.remove('ad-slot--loading');
          console.warn('AdSense initialization skipped:', error);
        }
      });
    });
  };

  const initAds = () => {
    const containers = [...document.querySelectorAll(AD_SELECTOR)];
    if (!containers.length) return;

    containers.forEach((container) => {
      container.setAttribute('role', 'complementary');
      container.setAttribute('aria-label', 'إعلان');
      container.classList.add('ad-slot');
      createAdUnit(container);
    });

    if (!('IntersectionObserver' in window)) {
      containers.forEach(requestAd);
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        requestAd(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '420px 0px',
      threshold: 0.01
    });

    containers.forEach((container) => observer.observe(container));
  };

  window.DriveSymbolsAds = {
    init: initAds,
    refresh: () => document.querySelectorAll(AD_SELECTOR).forEach(requestAd)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds, { once: true });
  } else {
    initAds();
  }
})();
