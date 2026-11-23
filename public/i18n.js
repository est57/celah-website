/*
 * Language routing for celah.org.
 * The site has two static pages: / (Indonesian) and /en/ (English), generated
 * at build time from public/index.html and content/en.json.
 *
 * Loaded in <head> so a redirect happens before the page renders.
 * Choice order: ?lang= in the URL, the visitor's saved choice, then the
 * browser's preferred languages (Indonesian/Malay -> ID, anything else -> EN).
 * Search engine crawlers are never redirected, so each page is indexed as is.
 */
(function () {
  var KEY = "celah-lang";
  var lang = document.documentElement.lang === "en" ? "en" : "id";

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
  }
  function preferred() {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      if (/^(id|ms)(-|$)/i.test(langs[i])) return "id";
      if (/^en(-|$)/i.test(langs[i])) return "en";
    }
    return "en";
  }

  var isBot = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|whatsapp|telegram|preview|lighthouse|pagespeed|headless/i.test(navigator.userAgent);
  var param = new URLSearchParams(location.search).get("lang");
  if (param === "id" || param === "en") save(param);

  var want = param === "id" || param === "en" ? param : saved();
  if (want !== "id" && want !== "en") want = isBot ? null : preferred();

  // Only pages that declare an alternate in that language are redirected
  // (the guide page has no English version, so it never redirects).
  if (want && want !== lang) {
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + want + '"]');
    if (alt) {
      var target = new URL(alt.href);
      if (target.pathname !== location.pathname) {
        location.replace(target.pathname + location.hash);
        return;
      }
    }
  }

  // Remember an explicit choice made with the ID / EN switch.
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest(".lang-switch a[data-lang]");
    if (link) save(link.getAttribute("data-lang"));
  });

  window.CelahI18n = { lang: lang };
})();
