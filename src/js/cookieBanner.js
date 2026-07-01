/**
 * Cookie/consent banner. No cookies are set by this script itself;
 * the user's acknowledgement is stored in localStorage.
 */

const COOKIE_BANNER_STORAGE_KEY = 'arcomix_cookie_notice_acknowledged';

function hasAcknowledgedCookieNotice() {
  try {
    return localStorage.getItem(COOKIE_BANNER_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function acknowledgeCookieNotice() {
  try {
    localStorage.setItem(COOKIE_BANNER_STORAGE_KEY, 'true');
  } catch (e) {
    // localStorage non disponibile: il banner ricomparirà, non blocca la navigazione
  }
}

function initCookieBanner() {
  if (hasAcknowledgedCookieNotice()) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'fixed bottom-0 left-0 w-full z-[100] bg-brand-bg border-t-2 border-brand-yellow px-6 py-5';
  banner.innerHTML = `
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 text-sm text-brand-accent">
      <p class="flex-1 text-brand-muted">
        Questo sito utilizza servizi di terze parti (Firebase, EmailJS) necessari al funzionamento del modulo di iscrizione
        e, solo su tua richiesta, Google Maps. Consulta la
        <a href="privacy.html" class="underline hover:text-brand-yellow">Privacy Policy</a> e la
        <a href="cookie-policy.html" class="underline hover:text-brand-yellow">Cookie Policy</a> per i dettagli.
      </p>
      <button id="cookie-banner-ok" type="button" class="bg-brand-yellow text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-yellow-400 transition-colors whitespace-nowrap">
        Ho capito
      </button>
    </div>
  `;
  document.body.appendChild(banner);

  const okBtn = document.getElementById('cookie-banner-ok');
  if (okBtn) {
    okBtn.addEventListener('click', () => {
      acknowledgeCookieNotice();
      banner.remove();
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hasAcknowledgedCookieNotice, acknowledgeCookieNotice, initCookieBanner };
}
