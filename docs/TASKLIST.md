# Tasklist - Ceklis Eksekusi

## P0 - Kritis (selesai 2026-10-09, tsc 0)
- [x] T-P0-01 Escape popup map `src/features/contact/FindUs.tsx:21`.
- [x] T-P0-02 Guard clipboard `src/hooks/useShare.ts:30`.
- [x] T-P0-03 Dedup lokasi `src/data/locations.ts:109` (19 id unik, pin jitter).
- [x] T-P0-04 Hapus Deezer palsu `src/data/tracks.ts:41`.
- [x] T-P0-05 Perbaiki markdown `src/data/news.json:24,36`.
- [x] T-P0-06 ErrorBoundary news `src/data/news.ts:21` (fallback `[]`).
- [x] T-P0-07 Marker keyboard `src/features/contact/FindUs.tsx:48` (button + label + CSS).
- [x] T-P0-08 Bersih git (staging hapus `public/img/news/WhatsApp Image...5.29.32 AM.jpeg`).

## P1 - Major (selesai 2026-10-09, oxlint 0)
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

## P2 - Minor (selesai 2026-10-09)
- [x] T-P2-01 Footer + legal (selesai 2026-10-09): `/privacy` + `/terms` lazy, footer + banner link hidup.
- [x] T-P2-02 Deep-link signature (`/?sig=id#signature` + baca query).
- [x] T-P2-03 Harga konsisten (hapus duplikat ` USD`, tinggal `$`).
- [x] T-P2-04 Tanggal konsisten (pertahankan `dateLabel`, `time dateTime` valid; `Intl` penuh ditunda).
- [x] T-P2-05 404 UX `NewsDetailPage` + normalisasi slug.
- [x] T-P2-06 Empty-state `NewsPage`.
- [x] T-P2-07 Title konsisten (hapus titik akhir `index.html`).
- [x] T-P2-08 Tahun dinamis (`YEAR` module-scope).
- [x] T-P2-09 HTML valid Signature (trim split, `button>p` bukan `button>h3`).

## P3 - Rilis (selesai sebagian 2026-10-09)
- [x] T-P3-02 Dimensi logo header/footer + cover fallback (kompres massal 111MB ditunda: butuh pipeline gambar).
- [x] T-P3-03 Lazy semua route + `NotFoundPage` 404 nyata (`src/app/pages.ts`).
- [x] T-P3-04 `README.md` nyata.
- [x] T-P3-05 Header cache Vercel (`/img` immutable, halaman revalidate).
- [x] T-P3-01 Cloudinary (selesai 2026-10-09): helper `src/lib/cloudinary.ts` (`f_auto,q_auto` + width, cloud `fal5otmd` via `VITE_CLOUDINARY_CLOUD_NAME`). 64 ref `/img/*` di `src` -> 0 (sisa favicon lokal). News `https` lolos normalisasi cover. File lokal `public/img` belum hapus (fallback + favicon).
- [x] T-P3-06 CHANGELOG + baseline kunci (entri ini).

## P5 - SEO hardening (selesai 2026-10-20, tsc 0, oxlint 0, build OK 22+404)
- [x] T-P5-01 Soft 404: hapus catch-all rewrite, generate `dist/404.html` (noindex, tanpa canonical), `StatusPage` + `ErrorPage` + `AppErrorBoundary`.
- [x] T-P5-02 Image sitemap: `absMedia()` untuk cover CMS, guard cover kosong, robots cantumkan `sitemap-images.xml`.
- [x] T-P5-03 JSON-LD satu sumber di `seo-build.mjs`: Organization/WebSite/WebPage, Product+Offer, LocalBusiness, MusicGroup, NewsArticle, ItemList, breadcrumb locale; hapus injeksi client.
- [x] T-P5-04 Footer menempel viewport (`flex min-h-dvh` + `flex-1`).
- [x] T-P5-05 Guide `SEO-ACTION-PLAN.md` (P1-6/P1-7/P1-8/P2).
- [x] T-P5-06 Body prerender P1-4: route tree bersama, `entry-server.tsx` (`renderToString` setelah preload chunk), `seo-build.mjs` inject body 22 URL, hydration deterministik + `noscript` reveal; `404.html` tetap kosong/noindex. `tsc` 0, `oxlint` 0, build OK.

## P6 - SEO P1-6/P1-7/P1-8 + P2 (selesai 2026-10-21, tsc 0, oxlint 0, build OK 48 halaman + 404)
- [x] T-P6-01 P1-6 produk: 8 halaman EN + 8 ID, copy unik, `Product` + `Offer` + breadcrumb, internal link katalog/stockist; CMS product tanpa copy tidak ditautkan ke halaman.
- [x] T-P6-02 P1-6 stockist: 5 halaman EN + 5 ID, data `LOCATIONS`, `Store` + `ItemList` + breadcrumb, kartu kota jadi link halaman + quick view.
- [x] T-P6-03 P1-7: `srcSet` hero/tisan/produk, ikon sosial lokal + dimensi, MapLibre + CSS jadi chunk lazy `MapView`, peta dark CARTO, cache `/assets` immutable.
- [x] T-P6-04 P1-8: kontras teks kecil `text-ink/70`, Milestones H5→H3, H2 katalog, label switcher, skip link, label-content mismatch Signature diperbaiki; marker peta 24px + cluster; Lighthouse home/catalog/product/contact/stockist 100 a11y/SEO/best-practices.
- [x] T-P6-05 P2-2/P2-4 kode: metadata produk/stockist ID unik, hreflang reciprocal, NAP + `Store` schema kota; GSC/GBP/direktori tetap manual.
- [x] T-P6-06 Build/verifikasi: 48 URL + `404.html`, sitemap 48 `<loc>`, image sitemap 7, body prerender + satu H1, 404 noindex tanpa canonical.
- [ ] T-P6-07 Manual: jalankan `../../docs/RUNBOOK-MANUAL-SEO.md` - GSC submit ulang, GBP/Apple/Bing, review native ID, backlink/outreach, self-host font setelah lisensi/WOFF2, ukur CWV setelah deploy.

## P7 - Product Page Copy CMS (kode selesai 2026-10-23, tsc 0, oxlint 0, build 48+404; konten manual terbuka)
- [x] T-P7-01 Adapter `src/data/productContent.ts` + `products.ts`: baca `intro`/`usage`/`sourcing`/`seoTitle` dari CMS, fallback statis `productPageCopy.json`.
- [x] T-P7-02 `ProductPage` static-first + upgrade runtime CMS; `ProductCard` tetap kompatibel.
- [x] T-P7-03 `scripts/cms-snapshot.mjs` + `build`/`seo`/`sync:cms`: snapshot `CMS_URL` build-time, fallback `[]`.
- [x] T-P7-04 Verifikasi build: 48 halaman + 404, sitemap 48, 16 URL produk, JSON-LD `Product`/`Offer`, title unik.
- [x] T-P7-05 Verifikasi prod: 16 URL 200, title/meta/canonical/hreflang, Usage tampil, 404 benar; fallback statis tetap ada.
- [ ] T-P7-06 Manual (pemilik): lengkapi gap konten B2B di `../../docs/CONTENT-CHECKLIST-B2B.md` (7F/G5, Popeda EN specs, insideTitle, categories).

## P4 - i18n (selesai 2026-10-10, tsc 0, oxlint 0, build OK 22 halaman)
- [x] T-P4-01 Fondasi: `i18next` + `react-i18next`, `src/i18n/index.ts` (resources statis, fallback EN, `kga-lang`), `useLocale`, `src/lib/format.ts` (`Intl` tanggal/bulan), `tsc` 0.
- [x] T-P4-02 Routing + switcher: cabang `/id/*` di `src/app/router.tsx`, mirror path, `LanguageSwitcher` header/mobile/footer, `LocaleBanner` 1x tanpa auto-redirect, `LocaleSync` (`document.lang` + simpan pref).
- [x] T-P4-03 UI umum + Home + About: ns `common/home/about`, nav/footer/konsent/404, Hero/Milestones (`Intl` bulan)/Signature/Movement/Partners, `getCollaborators`.
- [x] T-P4-04 Catalog + Music: ns + `getProducts` (overlay ID 8 produk), dialog/B2B, `TrackCard`, WA `order/inquiry` per locale.
- [x] T-P4-05 News: kolom `*Id` di `news.json` (3 artikel penuh), `localizePost` + badge fallback, list/detail/related/breadcrumb, tanggal `Intl`.
- [x] T-P4-06 Contact: form/subjek/validasi/aria ID, `contactMessage` per locale (EN dibuat), `CityDialog`, `FindUs` (kinds/legend/map), subjek ID di `contact.json`.
- [x] T-P4-07 Legal: `PrivacyPage` + `TermsPage` dari `legal.json` ID penuh.
- [x] T-P4-08 SEO locale: `hreflang` en/id/x-default, kanonis per locale, `og:locale` + alternate, JSON-LD `inLanguage`, sitemap 22 URL + images, `seo-build.mjs` render x2 locale.
- [x] T-P4-09 QA: `scripts/i18n-parity.mjs` OK (9 ns) + `bun run i18n:check`, view-source EN+ID (title/meta/hreflang/JSON-LD), build OK.
- [x] T-P4-10 Tutup: centang semua, `CHANGELOG.md`, adendum `AUDIT-BASELINE.md`.

## P8 - Remediasi audit SEO 2026-10-30 (Option B, kode selesai; deploy/manual terbuka)
- [x] T-P8-01 Content/meta: 6 meta description diperpendek (EN home 134 char, artworks/contact/about ID), `kga-jsonld-site` blok `WebSite` bertipe eksplisit dipertahankan bersama `@graph`, `dateModified` + `publishingPrinciples` per halaman.
- [x] T-P8-02 Performance: CSS tidak lagi di-inline (hapus ~54,8 KB `<style>` per halaman, tetap `/assets/*.css` cacheable), normalisasi atribut camelCase React SSR (`imagesrcset`/`imagesizes`/`fetchpriority`/`srcset`), Tisan pertama eager + `fetchPriority="low"`, dimensi eksplisit Tisan/news cover/distributor/logo kolaborator (430 gambar, 0 tanpa width/height/alt), no `alt=""`.
- [x] T-P8-03 Security: CSP enforcing (Cloudinary, CARTO, GA/GTM, Vercel Insights, Web3Forms, Spotify, `script.google.com`/`script.googleusercontent.com`, worker blob) + HSTS `max-age=63072000; includeSubDomains; preload`, nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy; GA bootstrap ke `public/gtag-init.js`.
- [x] T-P8-04 E-E-A-T/trust: halaman `/editorial` + `/id/editorial` (EN/ID parity), link footer + breadcrumb + `llms.txt`, `publishingPrinciples` di schema, byline "last reviewed" + link editorial di bawah FAQ beranda, link kebijakan editorial di byline artikel.
- [x] T-P8-05 Anchor/a11y: logo header, Tokopedia/Shopee/TikTok Shop, sosial footer/kontak dapat teks sr-only deskriptif; honeypot `aria-label="botcheck"`; LanguageSwitcher `hrefLang`/`lang` + sr-only tanpa `label-content-name-mismatch`; kontras tanggal editorial `text-ink/70`.
- [x] T-P8-06 Verifikasi: `tsc` 0, `oxlint` 0, vitest 107/107, i18n parity 14 ns, build 54 halaman + 404, sitemap 52, image sitemap 7, 0 anchor kosong, JSON-LD valid, Lighthouse lokal home/contact/editorial SEO 100 + a11y 100 + BP 96 (hanya `/_vercel/*` 404 di server lokal).
- [ ] T-P8-07 Manual (pemilik): deploy lalu cek CSP di console prod, submit ulang sitemap di GSC, ukur CWV/Brotli di prod. Jangan submit `hstspreload.org` sampai yakin semua subdomain HTTPS. HTTP/3 tetap batas platform Vercel.
- [ ] T-P8-08 Tradeoff terdokumentasi: rasio teks home 7,6% (<10%) diterima; tidak ada section Story/FAQ baru sesuai keputusan Option B. Tinjau ulang hanya jika audit berikutnya menuntut konten lebih panjang.
- [x] T-P8-09 Tindak lanjut re-audit: link HTML `llms.txt` di head, logo footer `loading="lazy"`, logo header `fetchPriority="high"` (React 19 sudah preload logo; hanya menyelaraskan hint), preload hero `href` eksplisit + duplikat preload SSR dibuang. Verifikasi dist: 1 link `llms.txt`, 59 gambar/56 lazy (3 eager di atas fold), header `fetchpriority`, 1 preload hero ber-`href`, footer tidak dipreload.
- [ ] T-P8-10 Audit ulang setelah deploy. Jika schema `@type`, Threads `nofollow`, atau kompresi teks masih muncul, ambil detail rule/URL/screenshot sebelum ubah kode. Bukti saat ini: 52 URL sitemap punya root `@type` (container `@graph` tanpa `@type` valid), semua balas `content-encoding: br`, dan tidak ada aturan SEOmator yang mewajibkan `nofollow` pada anchor Threads. Jangan tambah schema/nofollow/header tanpa bukti.
