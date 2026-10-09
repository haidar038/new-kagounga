# Audit Baseline — 2026-10-09 (Frozen)

Hasil scan total read-only, `node_modules` kecuali. Jangan edit bagian ini. Tambah adendum di bawah bila fakta berubah.

## Verifikasi
- `tsc -b --pretty false` EXIT 0.
- `oxlint` 3 warning: `useMilestones.ts:26`, `useMediaQuery.ts:12` (`set-state-in-effect`), `router.tsx:11` (`only-export-components`).
- `grep console/TODO/dangerouslySetInnerHTML/eval/innerHTML` nol.
- 61 ref `"/img/*"` di `src` semua resolve di `public`.
- Repo 182 file 112MB, `public` 113 file 111MB (berat gambar).
- Git `main` `haidar038/new-kagounga`, status: `D public/img/news/WhatsApp Image...5.29.32 AM.jpeg`, `?? .codegraph/`.

## Stack
- React 19.2, TS 6, Vite 8, Tailwind 4, `react-router-dom` 7, MapLibre 6, `lucide-react`, Vercel Analytics/SpeedInsights.
- Entry `src/main.tsx:8` StrictMode + Analytics. Router `src/app/router.tsx:15`, layout `src/app/SiteLayout.tsx:37`.

## Struktur
- `app/`: `SiteLayout` (ScrollManager + PageViewTracker + Header/Footer), `router` (/, /about, /news, /news/:slug, /catalog, /contact lazy, /music, *->Home).
- `pages/`: Home (Hero+Milestones+Signature+Movement+Partners), About (COLLABORATORS), Catalog (PRODUCTS+ProductDialog), Contact (FindUs+ContactForm), Music (Spotify iframe + TRACKS + DISTRIBUTORS), News + Detail.
- `features/home/`: Hero (swap tisan), Milestones (paginasi tahun, swipe, `monthKind`), Signature (`sigId`, WA inquiry), Movement (statis), Partners (marquee 2x).
- `features/contact/`: FindUs (MapLibre + CARTO + popupHTML + CityDialog), ContactForm (validasi lokal -> `waLink`), CityDialog (`<dialog>`).
- `components/`: SiteHeader (sticky + menu mobile), SiteFooter (grid + sosmed CDN), Reveal (IO 0.12), PageHero (gradient duplikat Hero), ProductCard/Dialog, TrackCard, NewsCard/Article, BrandIcons (`amazon->null`).
- `lib/`: `calendar.ts` (bucket/sort/cache TTL 30mnt, `isCalApiRow`, `fetchYear`), `analytics.ts` (gtag tanpa consent), `whatsapp.ts` (WA_NUMBER hardcoded + encode benar), `markdown.tsx` (bold/italic saja, tanpa HTML = aman XSS), `cn.ts` (join truthy).
- `hooks/`: `useMilestonesYear` (stale-while-revalidate, `JSON.stringify` compare, remote-wins), `useShareLink` (share/clipboard bug), `useScrolled`, `useMediaQuery`, `useDocumentMeta` (title+description saja).
- `data/`: `site.ts` (nav/footer/kontak/sosmed CDN), `tracks.ts` (COVER ibb.co + Deezer palsu), `products.ts` (8 produk USD + Halal), `partners.ts` (18 logo, case campur), `movements.ts`, `collaborators.ts`, `news.ts` (validasi + sort) + `news.json` (3 post, markdown rusak 1), `locations.ts` (19 titik, duplikat id, placeholder koordinat, `note` mati), `signatures.ts` (fallback `[0]` diam).

## Risiko lintas-area
- Keamanan rendah kecuali popup map. Tanpa secret kecuali `VITE_CAL_API_URL` publik. Tanpa `dangerouslySetInnerHTML`.
- Privasi: gtag + CDN/embed eksternal (jsdelivr, thesvg, ibb, Spotify, CARTO, cdnfonts) tanpa consent/SRI.
- Performa: N iframe Spotify, marquee 36 img tanpa dimensi, aset 111MB.
- A11y: marker/dialog/form/markdown parsial. i18n: full EN hardcoded.

## Adendum
- 2026-10-09 — T-P3-01 selesai: semua ref gambar konten via Cloudinary `fal5otmd` (`f_auto,q_auto`, width per konteks). `public/img` belum hapus (fallback + favicon `/img/logo-primary-emblem.svg`).
- 2026-10-09 — eksekusi selesai P0+P1+P2, P3 parsial. `tsc` 0, `oxlint` 0 (dari 3), `vite build` 7.95s OK (ContactPage 1075kB lazy, warning chunk >500kB wajar). T-P3-01 tunda: `public/img` 111MB, banyak file tak terpakai (`teams.jpg` 6.7MB, `file_*.png`, `WhatsApp*`, `DSC*`) — hapus massal butuh izin.
