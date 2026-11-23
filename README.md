# celah.org

Website untuk [Celah](https://github.com/est57/celah-research-gap), aplikasi desktop untuk analisis bibliometrik dan pencarian celah penelitian.

Situs statis tanpa framework. Semua berkas ada di `public/`, dan di-host di Cloudflare Workers (static assets).

## Pratinjau lokal

```bash
npx wrangler dev --port 5055
```

Buka http://localhost:5055. Perintah ini memakai `_headers` dan halaman 404 yang sama dengan situs live.

## Deploy

Otomatis setiap push ke `main` lewat Cloudflare Workers Builds.

| Pengaturan | Nilai |
| --- | --- |
| Build command | *(kosong)* |
| Deploy command | `npx wrangler deploy` |

- `wrangler.jsonc`: static assets dari `public/`, halaman 404 dari `public/404.html`.
- `public/_headers`: header keamanan (CSP, HSTS, dan lainnya) serta aturan cache.
- Sebelum deploy, wrangler menjalankan `node scripts/stamp.mjs`. Skrip ini menambahkan hash isi file ke alamat `styles.css`, `i18n.js`, dan `main.js` di halaman HTML (`?v=...`), sehingga browser pengunjung langsung mengambil versi terbaru. Jalankan juga sebelum commit agar file di repo ikut sesuai.

## Isi

- `public/index.html`: halaman utama (teks bahasa Indonesia)
- `public/i18n.js`: teks bahasa Inggris dan pemilih bahasa ID/EN
- `public/main.js`: tombol unduh sesuai sistem operasi, versi, dan tautan unduhan terbaru dari rilis GitHub
- `public/styles.css`: tampilan
- `public/assets/`: screenshot aplikasi (WebP) dan ikon
