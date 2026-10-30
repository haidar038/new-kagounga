# SEO Action Plan - 2026-10-20

Panduan eksekusi lanjutan setelah audit `kagounga.com`. Fokus: P1-6, P1-7, P1-8, dan P2.
P0-2, P0-3, P1-4, P1-5, P1-6, P1-7 (kecuali font), dan P1-8 sudah diimplementasikan di kode.

Status 2026-10-21: 48 URL prerender + `404.html`, sitemap 48 `<loc>`, image sitemap 7, title/description 48 unik.
Lighthouse lokal home/catalog/product/contact/stockist: Accessibility, SEO, Best Practices = 100. Axe kontak dengan peta termuat: 0 pelanggaran.
Sisa manual: GSC, domain `kagounga.id`, GBP/Apple/Bing, backlink, review copy ID native,
kredensial GA4/GSC, dan self-host font setelah file WOFF2 + lisensi jelas.
Langkah eksekusi + gate + bukti: `../../docs/RUNBOOK-MANUAL-SEO.md`.

Status 2026-10-30 (audit lanjutan, Option B): 54 URL prerender + `404.html`, sitemap 52, image sitemap 7.
CSS eksternal (bukan inline), CSP enforcing + HSTS preload-ready, halaman editorial EN/ID, schema `WebSite` root bertipe,
430 gambar 0 alt/dimensi hilang, 0 anchor kosong. Lighthouse lokal home/contact/editorial: SEO 100, a11y 100,
Best Practices 96 (hanya `/_vercel/*` 404 di server lokal), Performance 56 di headless (caveat lokal, ukur ulang di prod).
Rasio teks home 7,6% diterima sebagai tradeoff sadar: tidak ada section Story/FAQ baru. Rincian: §P8.
Tindak lanjut re-audit: link HTML `llms.txt`, footer logo lazy, header logo `fetchpriority="high"`, hero preload
ber-`href`. Schema `@type`, Threads `nofollow`, dan kompresi teks tidak diubah karena tidak dapat direproduksi;
lihat §P8 "Tindak lanjut re-audit".

---

## Sudah diimplementasikan

### P0-2 - Soft 404

- `vercel.json`: catch-all rewrite `/(.*) -> /` dihapus.
- `scripts/seo-build.mjs`: menghasilkan `dist/404.html` dengan `noindex, nofollow`, tanpa canonical/hreflang.
- Vercel menyajikan `404.html` dengan status **404** untuk path yang tidak punya file statis.
- `NotFoundPage` + `StatusPage` tetap merender UI 404 di client.
- `ErrorPage` + `AppErrorBoundary` + router `errorElement` menangani error render (500) dan siap dipakai untuk 503/maintenance.
- `SiteLayout`: wrapper `flex min-h-dvh flex-col` + `flex-1` di outlet, footer menempel di bawah viewport.

Verifikasi setelah deploy:

```powershell
curl.exe -sI https://kagounga.com/test | Select-String "HTTP/"
curl.exe -s https://kagounga.com/test | Select-String "noindex"
curl.exe -sI https://kagounga.com/about | Select-String "HTTP/"
```

Target: `/test` = `404`, `/about` = `200`, `/id` = `200`.

### P0-3 - Image sitemap

- `cmsPost()` sekarang memakai `absMedia()`: URL absolut Cloudinary tidak lagi ditempeli `https://cms.kagounga.com`.
- `sitemap-images.xml` hanya memuat artikel yang punya cover.
- `public/robots.txt` mencantumkan `sitemap-images.xml`.

Verifikasi:

```powershell
curl.exe -s https://kagounga.com/sitemap-images.xml | Select-String "cms.kagounga.comhttps"
curl.exe -s https://kagounga.com/sitemap-images.xml | Select-String "<image:loc>"
```

Target: 7 `<image:loc>`, 0 double prefix.

### P1-5 - Structured data

- Satu sumber JSON-LD: `scripts/seo-build.mjs`, dirender ke HTML mentah setiap URL.
- Client tidak lagi menyuntikkan JSON-LD (`useDocumentMeta.jsonLd`, `SiteLayout` Organization, schema di pages dihapus) sehingga tidak ada duplikat.
- Graph per halaman: `Organization`, `WebSite`, `WebPage`, lalu node spesifik:
  - Home: tidak ada breadcrumb.
  - Catalog: `ItemList` + 8 `Product` + `Offer` (USD, `InStock`) + `BreadcrumbList`.
  - Contact: `LocalBusiness` + `BreadcrumbList`.
  - Music: `MusicGroup` + `MusicRecording`.
  - News list: `ItemList`; detail: `NewsArticle`.
- Breadcrumb locale sudah benar (`/id/...` untuk halaman ID).
- Data produk/kontak/track dibaca dari source TypeScript via `vite.ssrLoadModule`, bukan duplikasi manual.

Catatan: `Offer.priceCurrency` saat ini `USD` mengikuti harga `$` di UI. Kalau harga diubah ke IDR, ubah di `productListNode()`.

### P1-4 - Body content prerender

- Route tree tunggal di `src/app/routes.tsx`, dipakai browser router dan SSR.
- `src/entry-server.tsx`: set locale, preload chunk route, buat memory router, lalu `renderToString`.
- `scripts/seo-build.mjs`: satu Vite SSR server, render 48 URL valid, inject body ke `<div id="root">`. Home dan halaman lazy sama-sama punya teks + satu `<h1>` di HTML mentah.
- Hydration menunggu `initI18n()` + `preloadPage()` supaya chunk route sudah sinkron saat render pertama, bukan fallback Suspense kosong.
- UI yang bergantung tanggal/media/storage memakai nilai deterministik saat render awal; state asli diterapkan setelah mount (`useHydrated`, `useMediaQuery`, `useMilestones`, `Signature`, banner).
- `noscript` membuat `.reveal` tetap terlihat tanpa JS.
- `404.html` sengaja tetap root kosong dan dirender client karena `noindex, nofollow`.

Verifikasi lokal:

```powershell
# Jangan pakai `vite preview`: fallback SPA-nya mengembalikan index.html root
# untuk semua path, bukan file nested. Pakai static server yang resolve
# /contact -> dist/contact/index.html, atau verifikasi setelah deploy.
curl.exe -s https://kagounga.com/contact | Select-String "<h1"
```

Target: 48 halaman punya body + 1 `<h1>`, 404 tanpa canonical/JSON-LD, dan tidak ada error hydration di console. Marker `<!--$-->` React 19 bukan indikasi Suspense kosong.

---

## P1-6 - Halaman produk & stockist

Status: **selesai di kode**. 26 URL baru (16 produk + 10 kota), schema, sitemap, body prerender, dan internal link sudah ada.

Tujuan: menangkap long-tail commercial query dan memberi mesin pencari halaman yang layak diperingkat, bukan hanya katalog satu halaman.

### Struktur URL

| Halaman | EN | ID |
|---|---|---|
| Produk | `/catalog/:slug` | `/id/catalog/:slug` |
| Stockist kota | `/stockists/:city` | `/id/stockists/:city` |

Slug produk pakai `ProductDetail.id` yang sudah ada: `popeda`, `sago`, `tuna`, `seasoning`, `kenari`, `telang`, `pala`, `cengkeh`.
Slug kota: `ternate`, `tidore`, `denpasar`, `bandung`, `jakarta`.

Jumlah URL baru: 8 produk × 2 locale + 5 kota × 2 locale = **26 URL**.

### Langkah produk

1. Buat `src/pages/ProductPage.tsx`.
   - `useParams<{ slug: string }>()`.
   - `getProducts(locale).find((p) => p.id === slug)`.
   - Kalau tidak ada: render `NotFoundPage` (server sudah 404 karena URL tidak diprerender).
   - Konten minimum: H1 nama produk, blurb, harga, badge, spesifikasi, origin, certification, shelf life, CTA WhatsApp, produk terkait.
2. Daftarkan route di `src/app/router.tsx` (EN + `/id`).
3. Ubah `ProductCard`:
   - Tombol "Details" menjadi `<Link to={localeLink(`/catalog/${product.id}`, locale)}>`.
   - Dialog boleh tetap ada sebagai quick view, tapi link halaman adalah jalur utama.
4. Prerender di `scripts/seo-build.mjs`:
   - Tambah `PRODUCT_ROUTES` dari `schemaData.products`.
   - `path: `${prefix}/catalog/${p.id}``.
   - `title: `${p.name} | Kagōunga``, `description: p.blurb`.
   - `crumbs`: Home → Catalog → Product.
   - Sitemap otomatis ikut karena `ROUTES`.
5. Schema: `Product` + `Offer` + `BreadcrumbList` (pola sudah ada di `productListNode`).

### Langkah stockist

1. Buat `src/pages/StockistPage.tsx`.
   - Filter `LOCATIONS` berdasarkan `city`.
   - Konten: intro kota (asli, bukan template kosong), daftar titik (nama, area, jenis), peta opsional, CTA kontak.
2. Tambah helper `citySlug()` di `src/data/locations.ts` atau `src/lib/slug.ts`.
3. Ubah kartu kota di `FindUs` dari `<button>` menjadi `<Link>` ke halaman kota; dialog tetap untuk quick view.
4. Prerender dan sitemap: 5 kota × 2 locale.
5. Schema: `ItemList` berisi `Store`/`LocalBusiness` per titik + `BreadcrumbList`. Koordinat sudah tersedia (`lng`, `lat`).

### Aturan konten

- Minimal 250–400 kata unik per halaman produk; 150–250 kata per kota.
- Jangan copy-paste blurb katalog ke semua halaman.
- Sertakan bukti: sertifikasi, asal bahan, cara pakai, pengiriman, MOQ.
- Setiap halaman wajib punya H1 tunggal, H2 section, alt text gambar, dan internal link ke katalog/kontak.
- Jangan buat halaman kota yang hanya berisi 1 baris + peta; itu thin content.

### Acceptance criteria

- 26 URL baru balas `200`, canonical self, hreflang benar.
- H1 ada di HTML mentah (bukan hanya setelah JS).
- `Product` schema lolos Rich Results Test, ada `offers.price` + `priceCurrency`.
- Semua halaman masuk `sitemap.xml` dan terindeks di GSC.
- Nomor WhatsApp/origin/kota konsisten dengan data sumber.

---

## P1-7 - Performance

Status: **selesai di kode kecuali font**. Hero/tisan/produk sudah `srcSet`, MapLibre + CSS jadi chunk lazy `MapView`, peta dark, ikon sosial lokal, `/assets` immutable. Font masih CDN karena file WOFF2 + lisensi belum tersedia.

Baseline terukur (desktop, build saat audit):

- FCP ~2,36 s; home transfer ~997 KB; hero 277 KB pada 1920 px.
- 6 file WOFF dari `fonts.cdnfonts.com`, tanpa `font-display`.
- 8 long task / ~843 ms blocking.
- Chunk `ContactPage` ~1.077 MB (gzip ~293 KB) + worker MapLibre ~508 KB.
- Chunk shared `useDocumentMeta` ~187 KB (gzip ~63 KB); `index` ~279 KB (gzip ~89 KB).

### 1. Font

Sasaran: hilangkan render-blocking pihak ketiga.

- Self-host Open Sauce One WOFF2 sesuai bobot terpakai (300/400/500/700/800/900; variable font jika tersedia) di `public/fonts/`.
- `@font-face` di `src/index.css` dengan `font-display: swap`.
- Preload hanya 1–2 file yang dipakai above-the-fold (cek bobot body + heading dulu).
- Hapus `<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/open-sauce-one">` dan preconnect `fonts.cdnfonts.com`.
- Cek lisensi font sebelum redistribusi.

### 2. Hero image

`src/features/home/Hero.tsx` sekarang memakai satu URL 1920 px. Ganti ke `srcSet`:

```tsx
<img
  src={cld("hero-bg-nature.webp", 1280)}
  srcSet={[640, 960, 1280, 1920]
    .map((w) => `${cld("hero-bg-nature.webp", w)} ${w}w`)
    .join(", ")}
  sizes="100vw"
  width={1920}
  height={1080}
  alt=""
  fetchPriority="high"
  decoding="async"
/>
```

Lakukan hal sama untuk `tisan-self.webp` (480/800) dan gambar produk (400/800, `sizes` sesuai grid).

### 3. MapLibre

`FindUs.tsx` mengimpor `maplibre-gl` secara statis. Pindahkan ke dynamic import setelah section mendekati viewport:

```tsx
const [mapReady, setMapReady] = useState(false);

useEffect(() => {
  const el = sectionRef.current;
  if (!el) return;
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      setMapReady(true);
      io.disconnect();
    }
  }, { rootMargin: "300px" });
  io.observe(el);
  return () => io.disconnect();
}, []);
```

Lalu `const maplibregl = await import("maplibre-gl")` di effect map. Pindahkan `@import "maplibre-gl/dist/maplibre-gl.css"` dari `index.css` ke modul map agar CSS ikut chunk lazy.

Target: contact initial JS turun dari ~1,08 MB ke < 250 KB gzip; peta baru dimuat saat dibutuhkan.

### 4. Aset pihak ketiga

- Ikon sosial dari `cdn.jsdelivr.net` (Instagram/TikTok/X/Threads/YouTube) → inline SVG lokal atau sprite.
- Tambah `width`/`height` pada semua `<img>` ikon untuk mencegah CLS.
- GA4 tetap async; pastikan tidak memuat sebelum consent jika target privasi ketat.

### 5. Cache & delivery

- Tambah header immutable untuk aset ber-hash di `vercel.json`:

```json
{
  "source": "/assets/(.*)",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
}
```

- Pastikan Cloudinary memakai `f_auto,q_auto` + width sesuai slot (sudah).

### 6. Ukur

- Lighthouse mobile (throttling default), WebPageTest, GSC Core Web Vitals.
- Target: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 pada mobile.
- Ulangi setelah font + hero + map beres; jangan optimasi berdasarkan desktop saja.

---

## P1-8 - Accessibility

Status: **selesai di kode**. Kontras teks kecil, heading order, label switcher, skip link, dan label-content-name mismatch sudah diperbaiki. Lighthouse lokal 100 untuk home/catalog/product/contact/stockist.

Baseline Lighthouse: Accessibility 96. Tiga kegagalan: color contrast, heading order, label-content-name mismatch.

### 1. Color contrast

Terukur:

| Token | Background | Rasio | Status |
|---|---|---|---|
| `text-ink/50` | cream `#F3F1E9` | 2,93:1 | gagal teks normal |
| `text-ink/60` | cream | 3,85:1 | gagal teks normal |
| `text-ink/70` | cream | 5,18:1 | lolos |
| `text-cream/60` | ink `#1F2C22` | 5,61:1 | lolos |

Aksi:

- Ganti `text-ink/50` dan `text-ink/60` untuk teks kecil menjadi `text-ink/70`.
- Teks besar (≥ 24 px atau ≥ 18,66 px bold) boleh 3:1, tapi konsisten lebih aman.
- Audit juga `text-ink/50` di `eyebrow`, `ProductDialog` H4, `NewsArticle` label, `StatusPage` code.

### 2. Heading order

- `Milestones.tsx`: H5 → H3. Section sudah punya H2.
- `CatalogPage.tsx`: tambah H2 "Signature Products" sebelum grid, biarkan `ProductCard` H3.
- `ProductDialog`: H3/H4 valid selama dialog berada di dalam section ber-H2.
- Cek ulang dengan Lighthouse/axe; target 0 heading-order violation.

### 3. Label in name

`LanguageSwitcher.tsx`: visible text `EN`/`ID`, tetapi `aria-label` = `English`/`Bahasa Indonesia`. Accessible name tidak mengandung visible text.

```tsx
aria-label={l === "id" ? "Bahasa Indonesia (ID)" : "English (EN)"}
```

Atau hapus `aria-label` dan sediakan visually-hidden full name.

### 4. Tambahan

- Tambah skip link "Skip to content" di awal `SiteLayout`.
- Pastikan dialog (`ProductDialog`, `CityDialog`) punya focus trap + `Esc` + return focus.
- Target akhir: Lighthouse Accessibility 100, axe 0 serious/critical.

---

## P2 - Roadmap

### P2-1. Content engine

- 2 artikel baru/bulan, minimal 800 kata, satu topik satu keyword.
- Cluster:
  - Produk: popeda instan, sagu Maluku, kenari, pala/fuli, cengkeh, ikan cakalang.
  - Resep & cara pakai: resep popeda, kuah kunyit, sagu untuk dessert.
  - Asal & budaya: rempah Maluku Utara, Ternate, Spice Islands.
  - B2B: supplier rempah, distributor popeda, MOQ, sertifikasi.
- Tiap artikel: H1, ringkasan, FAQ, gambar+alt, internal link ke produk/katalog, author/organization.
- Update artikel lama setiap 6 bulan; perbarui `dateModified`.

### P2-2. Kualitas copy ID

Status: **sebagian selesai**. Title/description produk + stockist ID sudah unik dan hreflang reciprocal; review native speaker tetap manual.

- Review native speaker; jangan terjemahan mesin.
- Glosarium konsisten: popeda, sagu, kenari, pala, fuli, cengkeh, cakalang.
- Jangan terjemahkan nama brand/produk yang sudah mapan.
- Pastikan title/description ID unik, bukan copy EN.
- Cek hreflang reciprocal EN ↔ ID untuk semua URL.

### P2-3. Google Search Console

Dari screenshot GSC:

- `https://kagounga.com/sitemap.xml` - Success, 22 URL live. Build baru berisi 48 URL; submit ulang setelah deploy.
- `https://kagounga.com/sitemap-images.xml` - Success, 7 URL. Pertahankan.
- `https://www.kagounga.com/sitemap.xml` - Success, 22 URL. **Hapus** dari daftar; `www` sudah 308 ke apex.
- `https://kagounga.com/sitemap-image.xml` - 1 error. **Hapus**; nama yang benar `sitemap-images.xml`.

Langkah:

1. Buka GSC → Sitemaps → menu tiga titik → Remove untuk dua sitemap yang salah.
2. Submit ulang `sitemap.xml` + `sitemap-images.xml` setelah deploy P0-3.
3. URL Inspection untuk `/`, `/catalog`, `/contact`, dan 3 artikel; minta indexing.
4. Pantau Pages: soft 404 harus jadi 404, duplicate canonical hilang.
5. Hubungkan GA4 → GSC; pantau query brand vs non-brand.

### P2-4. Local & NAP

Status: **sisi kode selesai**. NAP footer/kontak konsisten, halaman stockist + `Store` schema per kota sudah ada. GBP/Apple/Bing tetap manual.

- Google Business Profile: kategori (food brand / distributor), alamat Jl. Raya Pertamina No.800 Jambula, Ternate; telepon +62 811-1538-111; jam; foto; post.
- Apple Business Connect, Bing Places.
- Konsisten NAP di semua direktori, footer, schema.
- Minta review pelanggan B2B; jangan review palsu.
- Tambah halaman stockist (P1-6) sebagai bukti distribusi.

### P2-5. Backlink & PR

- Target: media kuliner Indonesia, media Maluku Utara, travel/spice Islands, desain/kemasan, universitas, komunitas food.
- Angle: "rempah Maluku Utara", "popeda", "brand dari Ternate", "sagu sebagai pangan lokal".
- Kirim press kit: foto, fakta, kontak, link produk.
- Anchor alami; hindari exact-match berlebihan.
- Setelah `.id` dibersihkan, audit backlink toxic; disavow hanya yang jelas spam.

### P2-6. Domain `kagounga.id`

- Masih 301 ke situs judi (per 2026-10-20). Ini masalah brand/legal, bukan kode.
- Kejar registrar PT Digital Registra / PANDI (IDRP), cek akses Cloudflare lama.
- Update semua bio, link sosial, GBP, direktori ke `kagounga.com`.
- Jika domain kembali: 301 semua URL `.id` ke `.com`, lalu submit change of address di GSC.
- Jika tidak kembali: disavow backlink toxic, monitor brand SERP, dokumentasikan untuk legal.

### P2-7. Measurement

- Dashboard bulanan: GSC impressions/clicks/CTR/position, GA4 sessions/conversions, Core Web Vitals.
- Rank tracker untuk 20–30 keyword prioritas.
- KPI 90 hari: brand query #1, 26 halaman produk/stockist terindeks, LCP mobile < 2,5 s, a11y 100.
- Review setiap bulan; hentikan halaman yang tidak menghasilkan impression setelah 3 bulan.

---

## P8 - Remediasi audit 2026-10-30 (Option B)

Audit eksternal (`../../docs/SEO-AUDIT-Kagounga-new.md`) menyorot rasio teks, meta description, HTTP/3,
anchor kosong, dimensi gambar, label form, dan sinyal E-E-A-T. Keputusan pemilik: **Option B** — perbaiki
temuan yang murah dan berdampak, tanpa menambah section Story, tanpa 4 FAQ baru, tanpa menulis ulang
reading level. Konsekuensinya rasio teks tetap di bawah 10% dan skor Content diperkirakan ~92.

### Yang diubah

- **CSS eksternal**: `seo-build.mjs` tidak lagi meng-inline stylesheet ke 54 halaman. HTML home turun dari
  ~116 KB ke ~61 KB; CSS tetap di `/assets/index-*.css` (cacheable, Brotli di Vercel). Ini akar masalah
  text-to-HTML ratio, bukan menambah teks.
- **Meta**: 6 description diperpendek (home EN 134 char, artworks EN/ID, about ID, contact ID, home ID),
  canonical/OG/Twitter ikut sinkron. `verify-seo-dist.mjs` memastikan tidak ada description >160 char.
- **Structured data**: blok `kga-jsonld-site` berdiri sendiri dengan `@type: WebSite` (audit hanya membaca
  objek pertama), sementara `@graph` tetap memuat Organization/WebPage/LocalBusiness/NewsArticle.
  `dateModified` + `publishingPrinciples` ditambahkan ke WebPage.
- **E-E-A-T**: halaman `/editorial` + `/id/editorial` menjelaskan siapa menulis, cara riset, review,
  koreksi, dan hubungan komersial. Ditautkan dari footer, breadcrumb, `llms.txt`, byline artikel, dan
  baris "last reviewed" di bawah FAQ beranda. Tidak ada kredensial fiktif.
- **Security/CSP**: `vercel.json` mengirim CSP enforcing (allowlist Cloudinary, CARTO, GA/GTM, Vercel
  Insights, Web3Forms, Spotify, Google Apps Script calendar), HSTS `includeSubDomains; preload`, nosniff,
  SAMEORIGIN, Referrer-Policy, Permissions-Policy. Inline GA stub dipindah ke `public/gtag-init.js`;
  `noscript.css` menggantikan `<style>` di `<noscript>`.
- **Gambar**: Tisan pertama `loading="eager"` + `fetchPriority="low"` (di atas fold desktop, tersembunyi di
  mobile), dimensi eksplisit untuk Tisan, cover berita, logo distributor, dan potret kolaborator.
  Hasil: 430 gambar, 0 tanpa `alt`, 0 tanpa `width`/`height`, 0 `alt=""`.
- **Anchor/a11y**: logo header, Tokopedia/Shopee/TikTok Shop, dan ikon sosial footer/kontak punya teks
  sr-only deskriptif; honeypot `aria-label="botcheck"`; LanguageSwitcher memakai `hrefLang`/`lang` +
  sr-only sehingga lolos `label-content-name-mismatch`; kontras tanggal editorial dinaikkan ke `text-ink/70`.

### Tindak lanjut re-audit (2026-10-30)

- **`llms.txt`**: `<link rel="alternate" type="text/plain" href="/llms.txt">` ditambahkan ke `index.html`
  agar audit yang hanya membaca HTML melihat referensinya. File sendiri sudah 200, `text/plain`, 958 B.
- **Footer lazy**: logo footer sekarang `loading="lazy" decoding="async"`. Tiga gambar awal (logo header,
  hero, Tisan) tetap eager.
- **LCP hint**: logo header diberi `fetchPriority="high"` karena heuristik SEOmator memilih `header img`
  sebelum hero. React 19 sudah mempreload logo, jadi ini hanya menyelaraskan hint, bukan request baru.
  Preload hero manual sekarang punya `href` eksplisit (audit hanya menghitung preload ber-`href`), tetap
  memakai `imagesrcset`/`imagesizes`; preload hero duplikat dari SSR React dibuang sehingga hanya tersisa
  satu.
- **Tidak diubah**: schema `@type` — semua 52 URL lulus `schema-type`; container `@graph` tanpa `@type`
  valid dan node di dalamnya bertipe. Threads `nofollow` — aturan SEOmator hanya menandai anchor eksternal
  berisi sponsor/advertiser/partner/paid atau nofollow internal; anchor "Kagōunga on Threads" tidak cocok,
  dan temuan asli adalah descriptive anchor text yang sudah diperbaiki. Kompresi teks — 52 URL membalas
  `content-encoding: br`; klien audit harus mengirim `Accept-Encoding`.
- **Verifikasi**: build 54 halaman + 404, cek dist untuk keempat perubahan, 59 gambar/56 lazy,
  `oxlint` 0, vitest 107/107, i18n parity 14 namespace. `verify-seo-dist.mjs` melaporkan 6 peringatan
  panjang title/description yang tidak terkait perubahan ini.

### Verifikasi (2026-10-30)

- `tsc` 0, `oxlint` 0 warning, vitest 107/107, `i18n:check` OK 14 namespace.
- `bun run build`: 54 halaman + `404.html`; sitemap 52 URL; image sitemap 7.
- Home: 61.342 B, 0 `<style>` inline, rasio teks **7,6%**, 0 anchor kosong, 59 gambar lengkap.
- Semua halaman: JSON-LD valid, robots benar (`/thank-you` noindex), canonical/hreflang utuh.
- Lighthouse lokal (server gzip + CSP, bukan `vite preview`):
  - home, contact, editorial: **SEO 100, Accessibility 100, Best Practices 96**.
  - BP 96 hanya karena `/_vercel/insights/script.js` + `/_vercel/speed-insights/script.js` 404 di server
    lokal; di Vercel kedua endpoint itu ada. Tidak ada pelanggaran CSP aplikasi.
  - Performance 56 (headless, main-thread style/layout) — angka lokal tidak mewakili prod; ukur CWV
    setelah deploy.

### Tradeoff yang diterima

- **Text ratio 7,6%** (<10%) tetap muncul di audit. Root cause: halaman padat gambar/interaktif, bukan
  kurang teks. Opsi menambah Story/FAQ sengaja tidak diambil. Jika audit berikutnya tetap menuntut,
  tambah konten nyata (bukan filler) di halaman produk/berita, bukan section tersembunyi.
- **HTTP/3 / `alt-svc`** tidak bisa diperbaiki dari aplikasi: Vercel tidak mengirim `alt-svc` untuk domain
  ini. Jangan tambah header palsu.
- **HSTS preload** dikirim sebagai header, tetapi domain **tidak** disubmit ke `hstspreload.org` sampai
  semua subdomain dipastikan HTTPS.

### Manual setelah deploy

1. Cek console browser prod: tidak ada error CSP; kalender, peta, Spotify, GA consent, form Web3Forms jalan.
2. Submit ulang `sitemap.xml` + `sitemap-images.xml` di GSC; minta indexing `/editorial` + `/id/editorial`.
3. Ukur CWV mobile di PageSpeed Insights (bukan Lighthouse lokal), cek Brotli aktif.
4. Jangan submit HSTS preload dulu; HTTP/3 tetap menunggu dukungan platform.
5. Review copy ID native + backlink/GBP sesuai `RUNBOOK-MANUAL-SEO.md`.
6. Audit ulang setelah deploy. Jika schema `@type`, Threads `nofollow`, atau kompresi teks masih muncul,
   simpan rule ID + URL + screenshot dulu; jangan ubah schema/nofollow/header tanpa bukti.

---

## Urutan eksekusi

1. Deploy P0-2/P0-3/P1-5, verifikasi status 404 + sitemap + Rich Results.
2. P1-7 font + hero + map (dampak CWV terbesar).
3. P1-8 contrast + heading + language switcher.
4. P1-6 halaman produk, lalu stockist.
5. P2-1 konten + P2-2 copy ID.
6. P2-3 GSC cleanup, P2-4 local, P2-5 backlink.
7. P2-6 domain `.id` berjalan paralel sejak sekarang.
