(function () {
  var REPO = "est57/celah-research-gap";
  var RELEASES = "https://github.com/" + REPO + "/releases/latest";

  var ICONS = {
    mac: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.37 1.43c0 1.14-.42 2.2-1.25 3.1-.9.98-1.99 1.55-3.17 1.46a3.2 3.2 0 0 1-.02-.43c0-1.1.48-2.27 1.33-3.2.42-.47.96-.86 1.62-1.17.65-.3 1.27-.47 1.86-.5.02.25.03.5.03.74Zm4.24 15.9c-.4.93-.88 1.78-1.43 2.56-.75 1.06-1.37 1.8-1.84 2.2-.73.67-1.52 1.02-2.36 1.04-.6 0-1.33-.17-2.18-.52-.85-.35-1.63-.52-2.35-.52-.75 0-1.56.17-2.42.52-.87.35-1.56.53-2.1.55-.8.04-1.61-.32-2.41-1.07-.51-.45-1.15-1.21-1.92-2.3-.82-1.15-1.5-2.49-2.03-4.01C.99 14.14.7 12.54.7 11c0-1.77.38-3.3 1.15-4.58a6.73 6.73 0 0 1 2.4-2.43 6.46 6.46 0 0 1 3.25-.92c.64 0 1.47.2 2.5.58 1.03.39 1.7.58 1.99.58.22 0 .96-.23 2.21-.69 1.18-.42 2.18-.6 3-.53 2.22.18 3.89 1.05 5 2.63-1.99 1.2-2.97 2.89-2.95 5.06.02 1.69.63 3.1 1.83 4.21.55.52 1.16.92 1.84 1.2-.15.43-.3.84-.47 1.24Z"/></svg>',
    win: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 5.1 10.4 4v7.1H3V5.1Zm0 13.8 7.4 1.1v-7.1H3v6Zm8.3 1.2L21 21.5V13h-9.7v7.1Zm0-16.2v7.2H21V2.5l-9.7 1.4Z"/></svg>',
    linux: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c-2.2 0-3.6 1.8-3.6 4.4 0 1.3.3 2.3-.5 3.6-.9 1.4-2.6 3.4-2.9 5.9-.2 1.6.4 2.6.9 3.1-.6.4-1.6.6-1.6 1.5 0 1 1.4 1.1 3 1.4 1.3.2 2.1 1 3.2 1 .8 0 1.4-.4 1.6-.9h.8c.2.5.8.9 1.6.9 1.1 0 1.9-.8 3.2-1 1.6-.3 3-.4 3-1.4 0-.9-1-1.1-1.6-1.5.5-.5 1.1-1.5.9-3.1-.3-2.5-2-4.5-2.9-5.9-.8-1.3-.5-2.3-.5-3.6C15.6 3.8 14.2 2 12 2Zm-1.4 4c.4 0 .7.5.7 1.1 0 .6-.3 1.1-.7 1.1-.4 0-.7-.5-.7-1.1 0-.6.3-1.1.7-1.1Zm2.8 0c.4 0 .7.5.7 1.1 0 .6-.3 1.1-.7 1.1-.4 0-.7-.5-.7-1.1 0-.6.3-1.1.7-1.1ZM12 9c.9 0 2 .6 2 1s-1.1 1.1-2 1.1-2-.7-2-1.1 1.1-1 2-1Z"/></svg>'
  };
  var NAMES = { mac: "macOS", win: "Windows", linux: "Linux" };
  var PRIMARY = { mac: "aarch64.dmg", win: "x64-setup.exe", linux: ".AppImage" };

  function detectOS() {
    var p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "").toLowerCase();
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|android/.test(ua)) return null;
    if (p.indexOf("mac") > -1 || ua.indexOf("mac os") > -1) return "mac";
    if (p.indexOf("win") > -1 || ua.indexOf("windows") > -1) return "win";
    if (p.indexOf("linux") > -1 || ua.indexOf("linux") > -1) return "linux";
    return null;
  }

  var os = detectOS();
  var heroBtn = document.getElementById("hero-download");
  var heroNote = document.getElementById("hero-note");

  if (os) {
    heroBtn.querySelector(".os-icon").innerHTML = ICONS[os];
    heroBtn.querySelector(".label").textContent = "Unduh untuk " + NAMES[os];
    heroBtn.dataset.asset = PRIMARY[os];
    var card = document.querySelector('.os[data-os="' + os + '"]');
    if (card) card.classList.add("current");
    heroNote.innerHTML = os === "mac"
      ? 'Untuk Apple Silicon. Mac Intel, Windows, atau Linux? <a href="#unduh">Pilihan lain</a>'
      : 'Sistem lain? <a href="#unduh">Lihat semua unduhan</a>';
  } else {
    heroBtn.href = "#unduh";
  }

  // Resolve direct download links from the latest GitHub release.
  fetch("https://api.github.com/repos/" + REPO + "/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (rel) {
      var assets = (rel.assets || []).filter(function (a) { return !/\.sig$/.test(a.name); });
      document.querySelectorAll("[data-asset]").forEach(function (el) {
        var suffix = el.dataset.asset;
        var hit = assets.find(function (a) { return a.name.slice(-suffix.length) === suffix; });
        if (hit) { el.href = hit.browser_download_url; el.removeAttribute("target"); }
      });
      if (rel.tag_name) {
        var v = rel.tag_name.replace(/^v/, "");
        document.querySelectorAll("[data-version]").forEach(function (el) { el.textContent = v; });
      }
    })
    .catch(function () { /* keep fallback links to the releases page */ });

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
  var targets = document.querySelectorAll(".feature-card, .steps li, .stats, .download-card, .section-head, .app-window.small");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
