# Changelog

Format: `YYYY-MM-DD — ringkas — file/area`.

## [Unreleased]
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
