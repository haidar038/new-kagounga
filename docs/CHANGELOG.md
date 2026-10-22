# Changelog

Format: `YYYY-MM-DD — ringkas — file/area`.

## [Unreleased]
- 2026-10-23 — Product page copy CMS: adapter `productContent.ts` + `products.ts` (CMS-first, fallback statis), `ProductPage`/`ProductCard` membaca `intro`/`usage`/`sourcing`/`seoTitle`, snapshot build-time `CMS_URL`, SEO prerender/sitemap/JSON-LD tetap 48 URL; commit `23f1cd6`..`76b58e6`; prod 16 URL produk terverifikasi (title unik, canonical/hreflang, Product schema, 404). Stockist tidak disentuh.
- 2026-10-21 — Docs: runbook manual SEO `../../docs/RUNBOOK-MANUAL-SEO.md` + pointer di `TASKLIST.md` T-P6-07, `README.md`, dan `SEO-ACTION-PLAN.md`; tanpa perubahan kode.
- 2026-10-21 — SEO P1-6/P1-7/P1-8: 16 halaman produk + 10 halaman stockist, schema Product/Offer/Store/ItemList, copy ID unik, `srcSet` hero/produk, ikon sosial lokal, MapLibre lazy + peta dark + marker cluster, cache `/assets`, kontras/heading/skip-link/label a11y. Build 48 URL + 404, sitemap 48, image sitemap 7, Lighthouse 100 a11y/SEO/best-practices, axe kontak dengan peta termuat 0. Font self-host, GSC/GBP/backlink/native review tetap manual.
- 2026-10-20 — P1-4 body prerender: route tree bersama + `entry-server.tsx` (`renderToString` setelah preload chunk), 22 URL punya teks + satu `<h1>` di HTML mentah, hydration menunggu i18n/chunk dengan UI tanggal/media/storage deterministik, `noscript` reveal; `404.html` tetap kosong/noindex. `tsc` 0, `oxlint` 0, build OK.
- 2026-10-20 — SEO hardening: soft 404 nyata (`dist/404.html` + hapus catch-all rewrite), image sitemap double-prefix fix + robots, JSON-LD satu sumber (Product/Offer, LocalBusiness, MusicGroup, NewsArticle, breadcrumb locale), `StatusPage`/`ErrorPage`/`AppErrorBoundary`, footer flex, guide `SEO-ACTION-PLAN.md`. `tsc` 0, `oxlint` 0, build OK 22 halaman + 404.
- 2026-10-10 — i18n P4 selesai: EN default + ID `/id/*` (22 prerender, sitemap 22 URL, `hreflang` x3, JSON-LD `inLanguage`), 9 ns locale + overlay data + 3 artikel ID penuh + parity OK. `tsc` 0, `oxlint` 0, build OK.
- 2026-10-10 — Planning i18n P4: `I18N-PLAN.md` baru (EN default, ID `/id/*`, fallback EN), `PHASES.md` + `TASKLIST.md` (T-P4-01 s/d T-P4-10) + aturan `GUARDRAILS.md`. Belum eksekusi, tunggu install deps + persetujuan.
- 2026-10-09 — SEO: head manager penuh (`useDocumentMeta`: canonical/OG/Twitter/noindex/article/JSON-LD), `index.html` fallback OG + theme + preconnect, `robots.txt` + `sitemap.xml`, JSON-LD Organization/Product/MusicGroup/NewsArticle, OG default Cloudinary. `tsc` 0, `oxlint` 0, build OK.
- 2026-10-09 — Privacy & Terms: `PrivacyPage` + `TermsPage` (`/privacy`, `/terms`, lazy), footer link hidup, banner link Privacy. `tsc` 0, `oxlint` 0, build OK.
- 2026-10-09 — T-P3-01 Cloudinary: `src/lib/cloudinary.ts` baru, 64 ref lokal -> remote (`Partners/Collaborators/Tracks/Products/Signatures/Hero/Header/Footer/News`), `tsc` 0, `oxlint` 0, build OK. Lokal `public/img` dipertahankan sementara.
- 2026-10-09 — eksekusi P0+P1+P2+P3 (parsial). `tsc` 0, `oxlint` 0, `vite build` OK. 29 file ubah + `src/app/pages.ts` + `src/pages/NotFoundPage.tsx` + `README.md` + `vercel.json`. Tunda: T-P3-01 kompres massal (butuh izin hapus/CDN).
- 2026-10-09 — baseline audit read-only masuk `docs/`. Tanpa ubah `src/`. Status: `tsc -b` EXIT 0, `oxlint` 3 warning.

## History (dari `git log`)
- `b42ad15` — GA + Vercel Speed Insights, update deps.
- `a838cce` — title `index.html`, koreksi nama kolaborator `Hydr`.
- `8f2cc2b` — hapus `.env` berisi API URL sensitif.
- `8773057` — tambah `.env` ke `.gitignore`.
- `6e5d608` — first commit.

## Cara catat
- Satu baris per tugas selesai, rujuk ID `TASKLIST.md` (mis. `T-P0-03`).
- Pisah `Added / Fixed / Changed / Removed / Security`.
- Jangan tulis ulang masa lalu, tambah di atas.
