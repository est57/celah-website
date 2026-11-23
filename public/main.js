(function () {
  var REPO = "est57/celah-research-gap";

  var ICONS = {
    mac: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>',
    win: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1.5 4.2 10 3v8.4H1.5V4.2Zm0 15.6L10 21v-8.4H1.5v7.2Zm9.7 1.4 11.3 1.6V12.6H11.2v8.6Zm0-18.4v8.6h11.3V1.2L11.2 2.8Z"/></svg>',
    linux: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 1.5c-2.6 0-4 2.1-4 4.6 0 1.6.3 2.4-.7 3.9C6.1 11.8 4.5 14 4.5 16.6c0 1.2.4 2 .9 2.5-.7.5-1.9.8-1.9 1.7 0 1.1 1.7 1.3 3.5 1.6 1.2.2 2 .9 3 .9.8 0 1.3-.4 1.6-.9h.8c.3.5.8.9 1.6.9 1 0 1.8-.7 3-.9 1.8-.3 3.5-.5 3.5-1.6 0-.9-1.2-1.2-1.9-1.7.5-.5.9-1.3.9-2.5 0-2.6-1.6-4.8-2.8-6.6-1-1.5-.7-2.3-.7-3.9 0-2.5-1.4-4.6-4-4.6Zm0 8.6c-1.9 0-3.4 2.7-3.4 5.9 0 2.2 1.5 3.5 3.4 3.5s3.4-1.3 3.4-3.5c0-3.2-1.5-5.9-3.4-5.9ZM10.6 4.4c-.5 0-.8.5-.8 1.1s.3 1.1.8 1.1.8-.5.8-1.1-.3-1.1-.8-1.1Zm2.8 0c-.5 0-.8.5-.8 1.1s.3 1.1.8 1.1.8-.5.8-1.1-.3-1.1-.8-1.1Z"/></svg>'
  };
  var NAMES = { mac: "macOS", win: "Windows", linux: "Linux" };
  var PRIMARY = { mac: "aarch64.dmg", win: "x64-setup.exe", linux: ".AppImage" };

  function detectOS() {
    var p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "").toLowerCase();
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|android/.test(ua)) return null;
    if (navigator.maxTouchPoints > 1 && /mac/.test(p)) return null; // iPadOS reports as Mac
    if (p.indexOf("mac") > -1 || ua.indexOf("mac os") > -1) return "mac";
    if (p.indexOf("win") > -1 || ua.indexOf("windows") > -1) return "win";
    if (p.indexOf("linux") > -1 || ua.indexOf("linux") > -1 || ua.indexOf("x11") > -1) return "linux";
    return null;
  }

  // Best-effort Mac chip detection. Resolves "intel", "arm", or null (unknown).
  function detectMacChip() {
    var uad = navigator.userAgentData;
    if (uad && uad.getHighEntropyValues) {
      return uad.getHighEntropyValues(["architecture"]).then(function (v) {
        if (v.architecture === "x86") return "intel";
        if (v.architecture === "arm") return "arm";
        return glChip();
      }).catch(glChip);
    }
    return Promise.resolve(glChip());
  }
  function glChip() {
    try {
      var gl = document.createElement("canvas").getContext("webgl");
      var ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
      var r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).toLowerCase() : "";
      if (/apple m\d|apple gpu.*m\d/.test(r)) return "arm";
      if (/intel|amd|radeon/.test(r)) return "intel";
    } catch (e) {}
    return null;
  }

  var os = detectOS();
  var heroBtn = document.getElementById("hero-download");
  var heroNote = document.getElementById("hero-note");
  var releaseAssets = null;

  function applyAssets() {
    if (!releaseAssets) return;
    document.querySelectorAll("[data-asset]").forEach(function (el) {
      var suffix = el.dataset.asset;
      var hit = releaseAssets.find(function (a) { return a.name.slice(-suffix.length) === suffix; });
      if (hit) { el.href = hit.browser_download_url; el.removeAttribute("target"); }
    });
  }

  var STR = {
    id: {
      download: "Unduh untuk ", browse: "Lihat unduhan", mine: "Sistem Anda", other: "Pilihan lain", all: "Lihat semua unduhan",
      macIntel: "Untuk Mac Intel. Pakai Apple Silicon (M1 ke atas)?",
      macArm: "Untuk Apple Silicon (M1 ke atas). Pakai Mac Intel?",
      macUnknown: "Untuk Apple Silicon (M1 ke atas). Mac Intel, Windows, atau Linux?",
      win: "Untuk Windows 10/11 (64-bit). Sistem lain?", linux: "Untuk Linux (AppImage). Sistem lain?",
      none: "Celah adalah aplikasi desktop untuk macOS, Windows, dan Linux"
    },
    en: {
      download: "Download for ", browse: "See downloads", mine: "Your system", other: "Other options", all: "See all downloads",
      macIntel: "For Intel Macs. On Apple Silicon (M1 or later)?",
      macArm: "For Apple Silicon (M1 or later). On an Intel Mac?",
      macUnknown: "For Apple Silicon (M1 or later). Intel Mac, Windows, or Linux?",
      win: "For Windows 10/11 (64-bit). Another system?", linux: "For Linux (AppImage). Another system?",
      none: "Celah is a desktop app for macOS, Windows, and Linux"
    }
  };
  var macChip = null;

  var LANG = document.documentElement.lang === "en" ? "en" : "id";
  function s(key) { return STR[LANG][key]; }

  function renderHero() {
    var card = document.querySelector('.os[data-os="' + os + '"]');
    if (!os) {
      heroBtn.querySelector(".label").textContent = s("browse");
      heroNote.textContent = s("none");
      return;
    }
    heroBtn.querySelector(".label").textContent = s("download") + NAMES[os];
    if (card) card.querySelector("h3").dataset.badge = s("mine");
    var note;
    if (os === "mac") note = macChip === "intel" ? s("macIntel") : macChip === "arm" ? s("macArm") : s("macUnknown");
    else note = s(os);
    heroNote.innerHTML = note + ' <a href="#unduh">' + (os === "mac" ? s("other") : s("all")) + "</a>";
  }

  function setMacVariant(chip) {
    macChip = chip;
    heroBtn.dataset.asset = chip === "intel" ? "x64.dmg" : "aarch64.dmg";
    renderHero();
    applyAssets();
  }

  // Only the home pages have the download button; the guide page skips this part.
  if (heroBtn) initDownloads();

  function initDownloads() {
  if (os) {
    heroBtn.querySelector(".os-icon").innerHTML = ICONS[os];
    heroBtn.dataset.asset = PRIMARY[os];
    var osCard = document.querySelector('.os[data-os="' + os + '"]');
    if (osCard) osCard.classList.add("current");
    if (os === "mac") {
      setMacVariant(null);
      detectMacChip().then(setMacVariant);
    }
  } else {
    delete heroBtn.dataset.asset;
    heroBtn.href = "#unduh";
  }
  renderHero();

  // Latest release from GitHub (drafts and pre-releases are excluded by the API).
  // Cached for the browser session; every value is validated before use.
  var RELEASE_PREFIX = "https://github.com/" + REPO + "/releases/download/";
  var CACHE_KEY = "celah-release";
  var CACHE_MS = 30 * 60 * 1000;

  function useRelease(rel) {
    var tag = String(rel.tag || "");
    if (/^v?\d+\.\d+\.\d+([-+.][0-9A-Za-z.-]+)?$/.test(tag)) {
      var v = tag.replace(/^v/, "");
      document.querySelectorAll("[data-version]").forEach(function (el) { el.textContent = v; });
    }
    if (rel.url && rel.url.indexOf("https://github.com/" + REPO + "/releases/tag/") === 0) {
      document.getElementById("version-pill").href = rel.url;
    }
    releaseAssets = (rel.assets || []).filter(function (a) {
      return a && typeof a.name === "string" && !/\.sig$/.test(a.name) &&
        typeof a.url === "string" && a.url.indexOf(RELEASE_PREFIX) === 0;
    }).map(function (a) { return { name: a.name, browser_download_url: a.url }; });
    applyAssets();
  }

  function readCache() {
    try {
      var c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      return c && Date.now() - c.at < CACHE_MS ? c.rel : null;
    } catch (e) { return null; }
  }

  var cached = readCache();
  if (cached) {
    useRelease(cached);
  } else {
    fetch("https://api.github.com/repos/" + REPO + "/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
      credentials: "omit",
      referrerPolicy: "no-referrer"
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        var rel = {
          tag: d.tag_name,
          url: d.html_url,
          assets: (d.assets || []).map(function (a) { return { name: a.name, url: a.browser_download_url }; })
        };
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rel: rel })); } catch (e) {}
        useRelease(rel);
      })
      .catch(function () { /* offline or rate-limited: keep the links to the releases page */ });
  }
  }

  // Nav border on scroll
  var nav = document.querySelector(".nav");
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("mobile-menu");
  menuBtn.addEventListener("click", function () {
    var open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    menu.hidden = open;
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
  });

  // Reveal on scroll
  var targets = document.querySelectorAll(".feature-card, .steps li, .stats, .download-card, .section-head, .app-window.small, .faq-item");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
