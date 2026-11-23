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
- Sebelum deploy, wrangler menjalankan `node scripts/build.mjs` (lihat di bawah).

## Build (`node scripts/build.mjs`)

Jalankan setelah mengubah teks atau tampilan, lalu commit hasilnya. Skrip ini:

1. Mengambil versi rilis terbaru dan `docs/PANDUAN.md` dari repo aplikasi di GitHub (bila offline, memakai salinan di `content/`).
2. Mengisi halaman Indonesia `public/index.html`: angka versi, FAQ, dan data terstruktur (JSON-LD).
3. Membuat halaman Inggris `public/en/index.html` dari `content/en.json`. Build gagal bila ada teks yang belum diterjemahkan.
4. Membuat halaman panduan `public/panduan/index.html` dari `content/panduan.md`.
5. Menulis `public/sitemap.xml`.
6. Menambahkan hash isi file ke alamat CSS/JS (`?v=...`) supaya browser selalu mengambil versi terbaru.

Mengubah teks:

- Teks Indonesia: langsung di `public/index.html`. Elemen yang diterjemahkan punya atribut `data-i18n="kunci"`.
- Teks Inggris: `content/en.json`, dengan kunci yang sama.
- FAQ (dua bahasa): `content/faq.json`.
- Jangan mengedit `public/en/index.html` atau `public/panduan/index.html` secara manual; keduanya ditimpa saat build.

## Isi

- `public/index.html`: halaman utama bahasa Indonesia (sumber untuk halaman Inggris)
- `public/en/`, `public/panduan/`: halaman hasil build
- `public/i18n.js`: mengarahkan pengunjung ke `/` atau `/en/` sesuai pilihan atau bahasa browser (crawler mesin pencari tidak diarahkan)
- `public/main.js`: tombol unduh sesuai sistem operasi, versi, dan tautan unduhan terbaru dari rilis GitHub
- `public/styles.css`: tampilan
- `public/assets/`: screenshot aplikasi (WebP), ikon, dan gambar pratinjau tautan `og-id.png` / `og-en.png` (1200×630)
