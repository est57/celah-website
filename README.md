# celah.org

Website untuk [Celah](https://github.com/est57/celah-research-gap), aplikasi desktop untuk analisis bibliometrik dan pencarian celah penelitian.

Situs statis tanpa proses build. Semua berkas ada di `public/`.

## Pratinjau lokal

```bash
firebase serve --only hosting --port 5055
```

Atau server statis apa pun, misalnya `npx serve public`.

## Deploy

**Cloudflare Pages** (otomatis setiap push ke `main`)

| Pengaturan | Nilai |
| --- | --- |
| Framework preset | None |
| Build command | *(kosong)* |
| Build output directory | `public` |

Header cache dan keamanan diatur di `public/_headers`.

**Firebase Hosting** (manual)

```bash
firebase deploy --only hosting
```

Header diatur di `firebase.json`.

## Isi

- `public/index.html`, `styles.css`, `main.js`: halaman utama
- `public/assets/`: screenshot aplikasi (WebP) dan ikon
- Tautan unduhan diambil otomatis dari rilis terbaru di GitHub lewat `main.js`
