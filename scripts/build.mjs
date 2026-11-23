// Build step for celah.org, run by wrangler before every deploy (wrangler.jsonc)
// and locally with: node scripts/build.mjs
//
// 1. Fetch the latest Celah release and the guide from GitHub (falls back to
//    the copies in content/ when offline).
// 2. Fill the Indonesian home page (public/index.html): version, FAQ, JSON-LD.
// 3. Generate the English home page (public/en/index.html) from content/en.json.
// 4. Generate the guide page (public/panduan/index.html) from content/panduan.md.
// 5. Write sitemap.xml.
// 6. Add content hashes to CSS/JS URLs so browsers fetch fresh files.
// 7. On Cloudflare builds, report changed pages to IndexNow (Bing and others).
//
// Fails loudly (exit 1) when an English translation is missing, so a broken
// page is never deployed.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const CONTENT = join(ROOT, "content");
const SITE = "https://celah.org";
const REPO = "est57/celah-research-gap";

const read = (p) => readFileSync(p, "utf8");
const write = (p, s) => {
  mkdirSync(dirname(p), { recursive: true });
  const before = existsSync(p) ? read(p) : null;
  if (before !== s) {
    writeFileSync(p, s);
    console.log(`wrote ${p.slice(ROOT.length + 1)}`);
  }
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");

async function fetchWithTimeout(url, opts = {}) {
  const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res;
}

// ---------- 1. Remote data ----------
let release = JSON.parse(read(join(CONTENT, "release.json")));
try {
  const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "celah-website-build" },
  });
  const d = await res.json();
  if (/^v?\d+\.\d+\.\d+([-+.][0-9A-Za-z.-]+)?$/.test(d.tag_name || "") && String(d.html_url).startsWith(`https://github.com/${REPO}/releases/tag/`)) {
    release = { tag: d.tag_name, url: d.html_url, published: d.published_at };
    write(join(CONTENT, "release.json"), JSON.stringify(release, null, 2) + "\n");
  }
} catch (e) {
  console.warn(`release: using content/release.json (${e.message})`);
}
const version = release.tag.replace(/^v/, "");

let guideMd = read(join(CONTENT, "panduan.md"));
try {
  const res = await fetchWithTimeout(`https://raw.githubusercontent.com/${REPO}/main/docs/PANDUAN.md`);
  const text = await res.text();
  if (text.length > 500 && text.startsWith("#")) {
    guideMd = text;
    write(join(CONTENT, "panduan.md"), text);
  }
} catch (e) {
  console.warn(`guide: using content/panduan.md (${e.message})`);
}

const EN = JSON.parse(read(join(CONTENT, "en.json")));
const FAQ = JSON.parse(read(join(CONTENT, "faq.json")));

// ---------- Shared pieces ----------
function fill(html, name, content) {
  const re = new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`);
  if (!re.test(html)) throw new Error(`marker ${name} not found`);
  return html.replace(re, `<!-- ${name}:START -->\n${content}\n  <!-- ${name}:END -->`);
}

function faqHtml(lang) {
  const items = FAQ.map(
    (f) => `        <details class="faq-item">
          <summary>${esc(f[lang].q)}</summary>
          <p>${esc(f[lang].a)}</p>
        </details>`
  ).join("\n");
  return `      <div class="faq-list">\n${items}\n      </div>`;
}

function homeLd(lang) {
  const page = lang === "en" ? `${SITE}/en/` : `${SITE}/`;
  const desc = lang === "en" ? EN["meta.desc"] : ID_DESC;
  const strip = (s) => s.replace(/&amp;/g, "&");
  return `  <script type="application/ld+json">
${jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Celah", inLanguage: ["id", "en"] },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#app`,
      name: "Celah",
      alternateName: "Celah Research Gap",
      description: strip(desc),
      url: page,
      applicationCategory: "EducationalApplication",
      applicationSubCategory: lang === "en" ? "Bibliometric analysis and research gap finding" : "Analisis bibliometrik dan pencarian research gap",
      operatingSystem: "macOS, Windows, Linux",
      softwareVersion: version,
      downloadUrl: `https://github.com/${REPO}/releases/latest`,
      releaseNotes: release.url,
      license: "https://opensource.org/licenses/MIT",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      image: `${SITE}/assets/og-${lang}.png`,
      screenshot: ["gap-explorer", "peta-tematik", "tema-peluang", "laporan"].map((n) => `${SITE}/assets/${n}.webp`),
      inLanguage: ["id", "en"],
      sameAs: [`https://github.com/${REPO}`],
    },
    {
      "@type": "FAQPage",
      "@id": `${page}#faq`,
      inLanguage: lang,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f[lang].q,
        acceptedAnswer: { "@type": "Answer", text: f[lang].a },
      })),
    },
  ],
})}
  </script>`;
}

// ---------- 2. Indonesian home page ----------
const ID_PATH = join(PUBLIC, "index.html");
let idHtml = read(ID_PATH);
const ID_DESC = idHtml.match(/<meta name="description"[^>]*content="([^"]*)"/)[1];
idHtml = idHtml
  .replace(/(<span data-version>)[^<]*(<\/span>)/g, `$1${version}$2`)
  .replace(/(id="version-pill" href=")[^"]*/, `$1${release.url}`);
idHtml = fill(idHtml, "FAQ", faqHtml("id"));
idHtml = fill(idHtml, "LD", homeLd("id"));

// ---------- 3. English home page ----------
function translate(html) {
  const missing = new Set();
  const t = (key) => {
    if (!(key in EN)) missing.add(key);
    return EN[key];
  };
  let out = html.replace(
    /<([a-z0-9]+)(\s[^>]*?\bdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, key) => `<${tag}${attrs}>${t(key) ?? ""}</${tag}>`
  );
  for (const [attr, target] of [["data-i18n-content", "content"], ["data-i18n-alt", "alt"], ["data-i18n-aria", "aria-label"]]) {
    out = out.replace(new RegExp(`<[a-z][^>]*\\b${attr}="([^"]+)"[^>]*>`, "g"), (tagHtml, key) =>
      tagHtml.replace(new RegExp(`\\s${target}="[^"]*"`), ` ${target}="${esc(t(key) ?? "").replace(/&amp;amp;/g, "&amp;")}"`)
    );
  }
  if (missing.size) throw new Error(`missing English text for: ${[...missing].join(", ")}`);

  out = out
    .replace('<html lang="id">', '<html lang="en">')
    .replace('<link rel="canonical" href="https://celah.org/">', '<link rel="canonical" href="https://celah.org/en/">')
    .replace('<meta property="og:url" content="https://celah.org/">', '<meta property="og:url" content="https://celah.org/en/">')
    .replace('<meta property="og:locale" content="id_ID">', '<meta property="og:locale" content="en_US">')
    .replace('<meta property="og:locale:alternate" content="en_US">', '<meta property="og:locale:alternate" content="id_ID">')
    .replaceAll("/assets/og-id.png", "/assets/og-en.png")
    .replaceAll('href="/#', 'href="/en/#')
    .replace('<a href="/" class="brand" data-home', '<a href="/en/" class="brand" data-home')
    .replace(/(<a href="\/" hreflang="id"[^>]*?) aria-current="true"/, "$1")
    .replace(/(<a href="\/en\/" hreflang="en" lang="en" data-lang="en")/, '$1 aria-current="true"');
  out = fill(out, "FAQ", faqHtml("en"));
  out = fill(out, "LD", homeLd("en"));
  return out;
}
const enHtml = translate(idHtml);

// ---------- 4. Guide page ----------
function inline(text) {
  const codes = [];
  let s = esc(text).replace(/`([^`]+)`/g, (m, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?=[^*\w]|$)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[i]}</code>`);
}
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function markdown(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [];
  const toc = [];
  let title = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      const level = m[1].length;
      if (level === 1) { title = m[2]; i++; continue; }
      const id = slug(m[2]);
      if (level === 2) toc.push({ id, text: m[2] });
      out.push(`<h${level} id="${id}">${inline(m[2])}</h${level}>`);
      i++;
    } else if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push(
        `<div class="table-wrap"><table>\n<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>\n<tbody>\n${body
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("\n")}\n</tbody>\n</table></div>`
      );
    } else if (/^(\d+\.|-)\s/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items = [];
      while (i < lines.length && (/^(\d+\.|-)\s/.test(lines[i]) || (/^\s+\S/.test(lines[i]) && items.length))) {
        if (/^(\d+\.|-)\s/.test(lines[i])) items.push(lines[i].replace(/^(\d+\.|-)\s+/, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>\n${items.map((it) => `<li>${inline(it)}</li>`).join("\n")}\n</${tag}>`);
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|\||(\d+\.|-)\s)/.test(lines[i])) para.push(lines[i++].trim());
      out.push(`<p>${inline(para.join(" "))}</p>`);
    }
  }
  return { title, toc, body: out.join("\n") };
}

function guidePage(home) {
  const g = markdown(guideMd);
  const header = home.match(/<header class="nav"[\s\S]*?<\/header>/)[0];
  const footer = home.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
  const assetTags = (name) => home.match(new RegExp(`<[^>]+/${name}\\?v=[0-9a-f]+[^>]*>(</script>)?`))?.[0] ?? "";
  const desc =
    "Panduan lengkap Celah: cara mengumpulkan dan merapikan data Scopus, Web of Science, PubMed, dan OpenAlex, menjalankan analisis bibliometrik, menemukan research gap, dan menyusun draf laporan.";
  const title = "Panduan Celah: Cara Mencari Research Gap dan Analisis Bibliometrik";
  const ld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: desc,
    inLanguage: "id",
    url: `${SITE}/panduan/`,
    image: `${SITE}/assets/og-id.png`,
    about: { "@id": `${SITE}/#app` },
    isPartOf: { "@id": `${SITE}/#website` },
  };
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#f4f3f0">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${SITE}/panduan/">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/assets/icon-512.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Celah">
  <meta property="og:url" content="${SITE}/panduan/">
  <meta property="og:locale" content="id_ID">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}/assets/og-id.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE}/assets/og-id.png">
  <script type="application/ld+json">
${jsonLd(ld)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  ${assetTags("styles.css")}
  ${assetTags("i18n.js")}
</head>
<body>

${header}

<main class="guide">
  <div class="wrap guide-layout">
    <aside class="guide-toc" aria-label="Daftar isi">
      <p class="guide-toc-title">Daftar isi</p>
      <ol>
${g.toc.map((h) => `        <li><a href="#${h.id}">${inline(h.text.replace(/^\d+\.\s*/, ""))}</a></li>`).join("\n")}
      </ol>
      <a class="btn btn-primary btn-block" href="/#unduh">Unduh Celah</a>
    </aside>
    <article class="prose">
      <p class="kicker">Versi ${esc(version)}</p>
      <h1>${inline(g.title || "Panduan Celah")}</h1>
${g.body}
      <p class="guide-source">Panduan ini juga tersedia di <a href="https://github.com/${REPO}/blob/main/docs/PANDUAN.md" target="_blank" rel="noopener">GitHub</a>.</p>
    </article>
  </div>
</main>

${footer}

${assetTags("main.js")}
</body>
</html>
`;
}

// ---------- 5. Sitemap ----------
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[`${SITE}/`, `${SITE}/en/`]
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="id" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`
  )
  .join("\n")}
  <url>
    <loc>${SITE}/panduan/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`;

// ---------- 6. Cache busting + write ----------
const ASSETS = ["styles.css", "i18n.js", "main.js"];
const hashes = Object.fromEntries(
  ASSETS.map((a) => [a, createHash("sha256").update(readFileSync(join(PUBLIC, a))).digest("hex").slice(0, 10)])
);
const stamp = (html) => {
  for (const [asset, h] of Object.entries(hashes)) {
    html = html.replace(new RegExp(`(["']/${asset.replace(".", "\\.")})(\\?v=[0-9a-f]+)?(["'])`, "g"), `$1?v=${h}$3`);
  }
  return html;
};

// A content fingerprint per page, so a deploy can tell which pages changed.
const fingerprint = (html) => {
  const clean = html.replace(/\n  <meta name="celah-build" content="[0-9a-f]+">/, "");
  const h = createHash("sha256").update(clean).digest("hex").slice(0, 16);
  return clean.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  <meta name="celah-build" content="${h}">`);
};

const PAGES = {
  [`${SITE}/`]: fingerprint(stamp(idHtml)),
  [`${SITE}/en/`]: fingerprint(stamp(enHtml)),
  [`${SITE}/panduan/`]: fingerprint(stamp(guidePage(stamp(idHtml)))),
};
write(ID_PATH, PAGES[`${SITE}/`]);
write(join(PUBLIC, "en", "index.html"), PAGES[`${SITE}/en/`]);
write(join(PUBLIC, "panduan", "index.html"), PAGES[`${SITE}/panduan/`]);
write(join(PUBLIC, "404.html"), stamp(read(join(PUBLIC, "404.html"))));
write(join(PUBLIC, "sitemap.xml"), sitemap);
console.log(`build ok: version ${version}, ${Object.entries(hashes).map(([a, h]) => `${a}?v=${h}`).join(", ")}`);

// ---------- 7. IndexNow (Bing, Yandex, and others; Google does not use it) ----------
// Runs only on Cloudflare builds (WORKERS_CI) or when asked: INDEXNOW=1 (changed
// pages) / INDEXNOW=all (every page). Reports only pages whose fingerprint differs
// from the live site. Never fails the build.
const mode = process.env.INDEXNOW || (process.env.WORKERS_CI || process.env.CI ? "1" : "");
if (mode) {
  try {
    const { key } = JSON.parse(read(join(CONTENT, "indexnow.json")));
    const keyLocation = `${SITE}/${key}.txt`;
    const live = await fetchWithTimeout(keyLocation).then((r) => r.text()).catch(() => "");
    if (live.trim() !== key) {
      console.log("indexnow: key file not live yet, skipping this time");
    } else {
      const changed = [];
      for (const [url, html] of Object.entries(PAGES)) {
        const mine = html.match(/name="celah-build" content="([0-9a-f]+)"/)[1];
        const theirs = await fetchWithTimeout(url)
          .then((r) => r.text())
          .then((t) => (t.match(/name="celah-build" content="([0-9a-f]+)"/) || [])[1])
          .catch(() => null);
        if (mode === "all" || mine !== theirs) changed.push(url);
      }
      if (!changed.length) {
        console.log("indexnow: no page changed");
      } else {
        const res = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation, urlList: changed }),
          signal: AbortSignal.timeout(8000),
        });
        console.log(`indexnow: HTTP ${res.status} for ${changed.join(", ")}`);
      }
    }
  } catch (e) {
    console.warn(`indexnow: skipped (${e.message})`);
  }
}
