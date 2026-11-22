/*
 * Language switcher for celah.org.
 * Indonesian is written in index.html; English lives here.
 * Order of choice: ?lang= in the URL, then the visitor's saved choice,
 * then the browser's preferred languages in order (Indonesian/Malay picks ID,
 * English or anything else picks EN).
 */
(function () {
  var KEY = "celah-lang";

  var EN = {
    "meta.title": "Celah – Find research gaps, backed by evidence",
    "meta.desc": "Celah is a free, open-source desktop app for bibliometric analysis and finding research gaps backed by document evidence. All data stays on your computer.",

    "aria.home": "Celah, home",
    "aria.main": "Main",
    "aria.lang": "Language",
    "aria.github": "Source code on GitHub",
    "aria.menu": "Open menu",
    "aria.mobile": "Mobile menu",
    "aria.stats": "Celah in numbers",

    "nav.features": "Features",
    "nav.workflow": "Workflow",
    "nav.download": "Download",
    "nav.guide": "Guide",

    "hero.version": "Version",
    "hero.title": "Find research gaps, <em>with the evidence to back them</em>",
    "hero.lead": "Map a research field bibliometrically, then review gap candidates and their supporting documents until they become a chapter draft ready to edit. Local, no account, on your computer.",
    "hero.guide": "Read the guide",

    "sources.title": "Pulls data from open sources and the export files you already have",
    "sources.sub": "Search six databases directly, or import exports from reference managers and subscription databases",

    "feat.title": "From thousands of documents <strong>to one gap</strong> you can defend",
    "feat.sub": "Every gap candidate comes with a score, evidence documents, and research questions. You make the call.",

    "f1.kicker": "Collect &amp; clean",
    "f1.title": "A clean collection before you analyze",
    "f1.accent": "Search six sources at once, or import Scopus, Web of Science, PubMed, and RIS.",
    "f1.body": "Merge duplicates across sources, unify keyword synonyms and author name spellings, fill in reference lists through Crossref, and add journal quartiles from SJR.",
    "f1.t1": "Cross-source duplicate merging",
    "f1.t2": "Keyword synonyms apply to every analysis",
    "f1.t3": "Metadata quality report per field",

    "f2.kicker": "Knowledge structure",
    "f2.title": "See the shape of a field",
    "f2.accent": "Thematic map, theme evolution, co-occurrence networks, co-citation, bibliographic coupling, historiograph, and RPYS.",
    "f2.body": "Full descriptive analysis: annual production, citations, Bradford's and Lotka's laws, countries and international collaboration. Network charts can be zoomed, panned, and saved as SVG or PNG.",

    "f3.kicker": "Gap finding",
    "f3.title": "Gap candidates, not guesses",
    "f3.accent": "Opportunity themes and Gap Explorer combine several detectors into one ranked list.",
    "f3.body": "Each candidate has novelty, evidence, and momentum scores, the documents that support it, and suggested research questions. Test your own gap ideas, then verify them against recent literature outside your collection before you write.",
    "f3.t1": "Novelty · evidence · momentum scores",
    "f3.t2": "Review: accepted, needs check, rejected",
    "f3.t3": "Re-check against papers from the last two years",

    "f4.kicker": "Output",
    "f4.title": "From gap to chapter draft",
    "f4.accent": "A research gap draft plus a methods &amp; results draft, ready to edit.",
    "f4.body": "Choose APA 7 or IEEE citations, in Indonesian or English. Export BibTeX, RIS, CSV, and chart images for your manuscript.",

    "priv.kicker": "Local &amp; secure",
    "priv.title": "Your research data never leaves your computer",
    "priv.lead": "No account. No subscription. No cloud sync. Celah only contacts the data sources you choose, and API keys are stored in the system keychain, not in a file.",
    "priv.a1": "No account",
    "priv.a2": "Open it and start working.",
    "priv.b1": "System keychain",
    "priv.b2": "API keys stored securely.",
    "priv.c2": "Anyone can inspect the code.",
    "priv.d1": "Automatic updates",
    "priv.d2": "Settings › About › Check for updates.",

    "wf.title": "Six steps, <strong>one clear workflow</strong>",
    "wf.sub": "Celah's first screen always shows where you are and what comes next.",
    "wf.s1": "Collect",
    "wf.s1d": "Enter a research topic and pick sources, or import export files.",
    "wf.s2": "Clean",
    "wf.s2d": "Merge duplicates, keyword synonyms, and author names.",
    "wf.s3": "Describe",
    "wf.s3d": "Production, citations, sources, authors, and countries.",
    "wf.s4": "Map",
    "wf.s4d": "The field's conceptual, intellectual, and social structure.",
    "wf.s5": "Find gaps",
    "wf.s5d": "Review candidates, mark accepted ones, verify against recent literature.",
    "wf.s6": "Write",
    "wf.s6d": "Assemble the chapter draft and export references.",

    "st.1": "open search sources",
    "st.2": "export formats to import",
    "st.3": "analysis screens",
    "st.4": "languages: Indonesian &amp; English",

    "gal.title": "Designed for <strong>reading data</strong>, not decoration",
    "gal.win": "Countries &amp; collaboration",

    "dl.title": "Download Celah",
    "dl.sub": "Free for everyone, on every system.",
    "dl.exe": ".exe installer",
    "dl.msi": ".msi package",
    "dl.warn": "Seeing a warning when you open the installer?",
    "dl.warn1": "The installers are not yet signed with a paid developer certificate, so your system warns you once.",
    "dl.mac": "<b>macOS:</b> open the <code>.dmg</code> and drag Celah to Applications. If you see “unidentified developer”, open System Settings › Privacy &amp; Security, then click <b>Open Anyway</b>.",
    "dl.win": "<b>Windows:</b> if SmartScreen appears, click <b>More info</b> and then <b>Run anyway</b>.",
    "dl.linux": "<b>Linux (AppImage):</b> run <code>chmod +x Celah_*.AppImage</code>, then open the file.",
    "dl.all": "All releases &amp; changelog ↗",

    "ft.tag": "Bibliometric analysis and research gap finding backed by document evidence.",
    "ft.product": "Product",
    "ft.res": "Resources",
    "ft.notes": "Release notes",
    "ft.issue": "Report an issue",
    "ft.project": "Project",
    "ft.license": "MIT License",
    "ft.top": "Back to top ↑",

    "alt.hero": "Gap Explorer in Celah: a list of research gap candidates with scores, evidence documents, recent literature checks, and suggested research questions",
    "alt.f1": "Overview screen: main collection info, annual production, and a three-field plot",
    "alt.f2": "Thematic map with four quadrants: motor, niche, emerging or declining, and basic themes",
    "alt.f3": "Opportunity themes screen: fast-growing themes that rarely connect to the main themes",
    "alt.f4": "A research gap chapter draft with its reference list",
    "alt.wf": "Celah's workflow screen with six research steps",
    "alt.gal": "World map of research output and the country collaboration network"
  };

  var doc = document.documentElement;
  var titleEl = document.querySelector("title");
  var descEl = document.querySelector('meta[name="description"]');
  var listeners = [];

  // Remember the Indonesian originals from the HTML.
  var ID = { "meta.title": titleEl.textContent, "meta.desc": descEl.getAttribute("content") };
  var textNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var altNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-alt]"));
  var ariaNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-aria]"));
  textNodes.forEach(function (el) { var k = el.dataset.i18n; if (!(k in ID)) ID[k] = el.innerHTML; });
  altNodes.forEach(function (el) { ID[el.dataset.i18nAlt] = el.getAttribute("alt"); });
  ariaNodes.forEach(function (el) { ID[el.dataset.i18nAria] = el.getAttribute("aria-label"); });

  function t(key, lang) {
    var table = lang === "en" ? EN : ID;
    return key in table ? table[key] : ID[key];
  }

  function readSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode */ }
  }

  function detect() {
    var param = new URLSearchParams(location.search).get("lang");
    if (param === "id" || param === "en") return param;
    var saved = readSaved();
    if (saved === "id" || saved === "en") return saved;
    // Follow the browser's own order: the first Indonesian/Malay or English entry wins.
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      if (/^(id|ms)(-|$)/i.test(langs[i])) return "id";
      if (/^en(-|$)/i.test(langs[i])) return "en";
    }
    return "en";
  }

  var current = null;

  function apply(lang) {
    current = lang;
    doc.lang = lang;
    titleEl.textContent = t("meta.title", lang);
    descEl.setAttribute("content", t("meta.desc", lang));
    textNodes.forEach(function (el) { el.innerHTML = t(el.dataset.i18n, lang); });
    altNodes.forEach(function (el) { el.setAttribute("alt", t(el.dataset.i18nAlt, lang)); });
    ariaNodes.forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria, lang)); });
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    listeners.forEach(function (fn) { fn(lang); });
  }

  document.querySelectorAll(".lang-switch [data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      var lang = b.dataset.lang;
      if (lang === current) return;
      save(lang);
      apply(lang);
      // Drop ?lang= so the saved choice wins on the next visit.
      if (location.search.indexOf("lang=") > -1) history.replaceState(null, "", location.pathname + location.hash);
    });
  });

  window.CelahI18n = {
    get lang() { return current; },
    onChange: function (fn) { listeners.push(fn); }
  };

  apply(detect());
})();
