SEO selesai.

**Pasang:** head manager penuh (canonical absolut, OG/Twitter, noindex, article time, JSON-LD per page), `index.html` fallback OG Cloudinary + theme + preconnect, `robots.txt` + `sitemap.xml` (11 URL, ada di `dist/`), JSON-LD Organization/Product/MusicGroup/NewsArticle, 404 `noindex`.

**Gate:** `tsc` 0, `oxlint` 0, build OK. Kanonis default `https://kagounga.com` via `VITE_SITE_URL` — ganti jika domain final beda.

**Batasan jujur:** SPA tanpa prerender, scraper sosmed baca fallback statis. Sitemap statis, regenerasi manual saat news nambah.