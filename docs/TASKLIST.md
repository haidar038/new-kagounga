# Tasklist — Ceklis Eksekusi

## P0 — Kritis (selesai 2026-10-09, tsc 0)
- [x] T-P0-01 Escape popup map `src/features/contact/FindUs.tsx:21`.
- [x] T-P0-02 Guard clipboard `src/hooks/useShare.ts:30`.
- [x] T-P0-03 Dedup lokasi `src/data/locations.ts:109` (19 id unik, pin jitter).
- [x] T-P0-04 Hapus Deezer palsu `src/data/tracks.ts:41`.
- [x] T-P0-05 Perbaiki markdown `src/data/news.json:24,36`.
- [x] T-P0-06 ErrorBoundary news `src/data/news.ts:21` (fallback `[]`).
- [x] T-P0-07 Marker keyboard `src/features/contact/FindUs.tsx:48` (button + label + CSS).
- [x] T-P0-08 Bersih git (staging hapus `public/img/news/WhatsApp Image...5.29.32 AM.jpeg`).

## P1 — Major (selesai 2026-10-09, oxlint 0)
- [x] T-P1-01 Fasad Spotify `TrackCard.tsx` (tombol Play preview, cover fallback lokal).
- [x] T-P1-02 Return-focus dialog `ProductDialog` + `CityDialog`.
- [x] T-P1-03 Form WA `ContactForm.tsx:62` (aria-describedby/live + link fallback bila popup blokir).
- [x] T-P1-04 Fetch andal `calendar.ts:145` (`res.ok`) + `dayLabel` strip nol konsisten.
- [x] T-P1-05 Render-phase sync `useMilestones` + microtask sync `useMediaQuery` (warning hilang).
- [x] T-P1-06 Memo `groupByCity` di `FindUs.tsx:34`.
- [x] T-P1-07 Marquee a11y (`role=region`, pause `:focus-within`).
- [x] T-P1-08 Hero keyboard (Enter/Space) + label `Countries Served`.
- [x] T-P1-09 Consent GA (`ConsentBanner`, `page_path` tanpa query, tanpa `page_location`).
- [x] T-P1-10 Fallback CDN (sosmed `target/rel` + `onError` hide, cover `onError` lokal).

## P2 — Minor (selesai 2026-10-09)
- [x] T-P2-01 Footer mati (Privacy/Terms jadi teks soon, hapus ID palsu).
- [x] T-P2-02 Deep-link signature (`/?sig=id#signature` + baca query).
- [x] T-P2-03 Harga konsisten (hapus duplikat ` USD`, tinggal `$`).
- [x] T-P2-04 Tanggal konsisten (pertahankan `dateLabel`, `time dateTime` valid; `Intl` penuh ditunda).
- [x] T-P2-05 404 UX `NewsDetailPage` + normalisasi slug.
- [x] T-P2-06 Empty-state `NewsPage`.
- [x] T-P2-07 Title konsisten (hapus titik akhir `index.html`).
- [x] T-P2-08 Tahun dinamis (`YEAR` module-scope).
- [x] T-P2-09 HTML valid Signature (trim split, `button>p` bukan `button>h3`).

## P3 — Rilis (selesai sebagian 2026-10-09)
- [x] T-P3-02 Dimensi logo header/footer + cover fallback (kompres massal 111MB ditunda: butuh pipeline gambar).
- [x] T-P3-03 Lazy semua route + `NotFoundPage` 404 nyata (`src/app/pages.ts`).
- [x] T-P3-04 `README.md` nyata.
- [x] T-P3-05 Header cache Vercel (`/img` immutable, halaman revalidate).
- [x] T-P3-01 Cloudinary (selesai 2026-10-09): helper `src/lib/cloudinary.ts` (`f_auto,q_auto` + width, cloud `fal5otmd` via `VITE_CLOUDINARY_CLOUD_NAME`). 64 ref `/img/*` di `src` -> 0 (sisa favicon lokal). News `https` lolos normalisasi cover. File lokal `public/img` belum hapus (fallback + favicon).
- [x] T-P3-06 CHANGELOG + baseline kunci (entri ini).
