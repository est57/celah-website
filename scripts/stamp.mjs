// Add a content hash to CSS/JS URLs in the HTML pages (cache busting),
// so browsers fetch a changed file right away instead of a cached copy.
// Runs automatically on every Cloudflare deploy (see wrangler.jsonc);
// run it locally with: node scripts/stamp.mjs
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const ASSETS = ["styles.css", "i18n.js", "main.js"];
const PAGES = ["index.html", "404.html"];

const hashes = Object.fromEntries(
  ASSETS.map((a) => [a, createHash("sha256").update(readFileSync(join(PUBLIC, a))).digest("hex").slice(0, 10)])
);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

for (const page of PAGES) {
  const path = join(PUBLIC, page);
  const html = readFileSync(path, "utf8");
  let out = html;
  for (const [asset, h] of Object.entries(hashes)) {
    out = out.replace(new RegExp(`(["']/${escape(asset)})(\\?v=[0-9a-f]+)?(["'])`, "g"), `$1?v=${h}$3`);
  }
  if (out !== html) {
    writeFileSync(path, out);
    console.log(`stamped ${page}`);
  }
}
for (const [asset, h] of Object.entries(hashes)) console.log(`  ${asset} -> ?v=${h}`);
