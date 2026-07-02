/**
 * Cookie consent banner. No cookies are set directly by this script;
 * the user's choice is stored in localStorage as { necessary, maps, updatedAt }.
 * "necessary" (Firebase, EmailJS) can't be refused: the site can't work without them.
 * "maps" gates the on-demand Google Maps embed, the only non-essential service.
 */

const COOKIE_CONSENT_STORAGE_KEY = 'arcomix_cookie_consent';

function getCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveCookieConsent(choices) {
  const consent = { necessary: true, maps: !!choices.maps, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (e) {
    // localStorage non disponibile: la scelta non verrà ricordata tra le visite
  }
  document.dispatchEvent(new CustomEvent('cookieconsentchange', { detail: consent }));
  return consent;
}

function isCookieCategoryAllowed(category) {
  if (category === 'necessary') return true;
  const consent = getCookieConsent();
  return !!(consent && consent[category]);
}

function cookieBannerMarkup(expanded) {
  const mapsChecked = isCookieCategoryAllowed('maps') ? 'checked' : '';
  const legalLinks = `
    <a href="https://www.iubenda.com/privacy-policy/98185773" class="iubenda-white iubenda-noiframe iubenda-embed underline hover:text-brand-yellow" title="Privacy Policy" target="_blank">Privacy Policy</a> e la
    <a href="https://www.iubenda.com/privacy-policy/98185773/cookie-policy" class="iubenda-white iubenda-noiframe iubenda-embed underline hover:text-brand-yellow" title="Cookie Policy" target="_blank">Cookie Policy</a>.
  `;

  if (!expanded) {
    return `
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 text-sm text-brand-accent">
        <p class="flex-1 text-brand-muted">
          Questo sito utilizza servizi tecnici necessari (Firebase, EmailJS) per gestire il modulo di iscrizione, sempre attivi,
          e, solo su tua richiesta, Google Maps. Consulta la ${legalLinks}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button id="cookie-banner-customize" type="button" class="text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-yellow transition-colors px-2 py-3 whitespace-nowrap">
            Personalizza
          </button>
          <button id="cookie-banner-reject" type="button" class="border border-brand-border text-xs font-bold uppercase tracking-widest px-6 py-3 hover:border-brand-yellow hover:text-brand-yellow transition-colors whitespace-nowrap">
            Rifiuta non necessari
          </button>
          <button id="cookie-banner-accept" type="button" class="bg-brand-yellow text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-yellow-400 transition-colors whitespace-nowrap">
            Accetta tutti
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="max-w-6xl mx-auto text-sm text-brand-accent">
      <p class="text-brand-muted mb-5">
        Scegli quali servizi non necessari attivare. Consulta la ${legalLinks}
      </p>

      <div class="space-y-4 mb-5 border-t border-b border-brand-border py-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-bold text-xs uppercase tracking-widest">Cookie tecnici</p>
            <p class="text-brand-muted text-xs mt-1">Firebase ed EmailJS: necessari per iscrizioni, conteggio posti e area admin.</p>
          </div>
          <span class="text-xs font-bold uppercase tracking-widest text-brand-muted border border-brand-border px-3 py-1.5 flex-shrink-0 whitespace-nowrap">
            Sempre attivi
          </span>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-bold text-xs uppercase tracking-widest">Google Maps</p>
            <p class="text-brand-muted text-xs mt-1">Carica la mappa della location: invia dati (incluso indirizzo IP) a Google.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input type="checkbox" id="cookie-toggle-maps" class="sr-only peer" ${mapsChecked}>
            <div class="w-11 h-6 bg-brand-border rounded-full peer-checked:bg-brand-yellow transition-colors"></div>
            <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>

      <div class="flex justify-end">
        <button id="cookie-banner-save" type="button" class="bg-brand-yellow text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-yellow-400 transition-colors">
          Salva preferenze
        </button>
      </div>
    </div>
  `;
}

function renderCookieBanner(expanded) {
  let banner = document.getElementById('cookie-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'fixed bottom-0 left-0 w-full z-[100] bg-brand-bg border-t-2 border-brand-yellow px-6 py-5';
    document.body.appendChild(banner);
  }
  banner.innerHTML = cookieBannerMarkup(expanded);

  if (!expanded) {
    document.getElementById('cookie-banner-customize').addEventListener('click', () => renderCookieBanner(true));
    document.getElementById('cookie-banner-reject').addEventListener('click', () => {
      saveCookieConsent({ maps: false });
      banner.remove();
    });
    document.getElementById('cookie-banner-accept').addEventListener('click', () => {
      saveCookieConsent({ maps: true });
      banner.remove();
    });
  } else {
    document.getElementById('cookie-banner-save').addEventListener('click', () => {
      const mapsAllowed = document.getElementById('cookie-toggle-maps').checked;
      saveCookieConsent({ maps: mapsAllowed });
      banner.remove();
    });
  }
}

function openCookiePreferences() {
  renderCookieBanner(true);
}

function initCookieBanner() {
  if (!getCookieConsent()) renderCookieBanner(false);
}

window.CookieConsent = {
  get: getCookieConsent,
  isAllowed: isCookieCategoryAllowed,
  openPreferences: openCookiePreferences,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getCookieConsent, saveCookieConsent, isCookieCategoryAllowed, initCookieBanner, openCookiePreferences };
}
