# celah.org

Website untuk [Celah](https://github.com/est57/celah-research-gap), aplikasi desktop untuk analisis bibliometrik dan pencarian celah penelitian.

Situs statis tanpa proses build. Semua berkas ada di `public/`.

## Pratinjau lokal

```bash
firebase serve --only hosting --port 5055
```

Atau server statis apa pun, misalnya `npx serve public`.

## Deploy

**Cloudflare Workers** (otomatis setiap push ke `main`)

Konfigurasi ada di `wrangler.jsonc` (static assets dari `public/`, halaman 404 dari `public/404.html`).

| Pengaturan | Nilai |
| --- | --- |
| Build command | *(kosong)* |
| Deploy command | `npx wrangler deploy` |

Header cache dan keamanan diatur di `public/_headers`. Cek lokal: `npx wrangler dev`.

Setiap deploy menjalankan `node scripts/stamp.mjs` lebih dulu. Skrip ini menambahkan hash isi file ke alamat `styles.css`, `i18n.js`, dan `main.js` di halaman HTML (`?v=...`), sehingga browser pengunjung langsung mengambil versi terbaru. Jalankan juga sebelum commit agar file di repo ikut sesuai.

**Firebase Hosting** (manual)

```bash
firebase deploy --only hosting
```

Header diatur di `firebase.json`.

## Isi

- `public/index.html`, `styles.css`, `main.js`: halaman utama
- `public/assets/`: screenshot aplikasi (WebP) dan ikon
- Tautan unduhan diambil otomatis dari rilis terbaru di GitHub lewat `main.js`
