# I18N Plan — EN default + ID penuh

Status: selesai 2026-10-10 (T-P4-01 s/d T-P4-10, `tsc` 0, `oxlint` 0, build OK 22 halaman, parity OK 9 ns). Penyesuaian dari rencana: resources statis (tanpa `resources-to-backend`, bundle kecil, tanpa dep tambahan); overlay data ID di JSON (`products/signatures/movements/roles/subjects`, EN tetap TS base).

## Keputusan kunci

1. EN default tanpa prefix (URL kini tak berubah, ranking aman). ID di bawah `/id/*`. Segmen path + slug news identik, cuma tambah prefix (mirror = strip/tambah `/id`, tanpa tabel mapping).
2. Peta rute: `/` <-> `/id`, `/about` <-> `/id/about`, `/news` <-> `/id/news`, `/news/:slug` <-> `/id/news/:slug`, `/catalog`, `/music`, `/contact`, `/privacy`, `/terms` sama pola. Slug tak diterjemahkan (tolak alternatif slug-ID: mapping ganda + redirect map + sitemap rumit, untung SEO kecil).
3. Lib: `i18next` + `react-i18next`, lazy namespace via `i18next-resources-to-backend` (dynamic import, tanpa backend HTTP). Tanpa `language-detector` (deteksi custom, lihat §6).
4. Fallback konten = EN. Kunci ID hilang → render EN + badge khusus news body. Tak ada halaman kosong.
5. Harga tetap `$` (tanpa konversi). Tanggal/angka via `Intl` per locale dari `dateISO` (ganti `dateLabel` statis di render).

## Arsitektur

- `src/i18n/index.ts`: init sekali (`lng` dari `localStorage kga-lang`, default `en`), `fallbackLng: en`, `ns` per rute, `resourcesToBackend` lazy `../locales/{lng}/{ns}.json`.
- Namespace: `common` (header/nav/footer/consent/404/switcher/banner), `home`, `about`, `catalog`, `music`, `news`, `contact`, `legal`, `products` (data), `seo` (title/desc per rute per locale).
- Data ber-`id`/`en` ganda: `products.ts` (name tetap, blurb/badges/specs/note/eyebrow/per), `tracks.ts` (meta/deskripsi), `news.json` + kolom ID (`titleId/descriptionId/excerptId/ledeId/bodyMarkdownId/coverAltId`, slug sama), `collaborators/movements/signatures/partners/site.ts` label, `contactSubjects`, template WA (`orderMessage/inquiryMessage` per locale — kini ID saja, EN perlu dibuat).
- Router: `src/app/router.tsx` tambah cabang `/id/*` ke komponen halaman yang sama (komponen baca locale dari hook, bukan duplikat page). `useLocalePath()` untuk mirror path. `SiteLayout` sinkron `document.lang`, `useDocumentMeta` baca meta dari ns `seo` + `hreflang` en/id/x-default + kanonis per locale.
- Switcher: header desktop + menu mobile (+ footer link). Klik = simpan `kga-lang` + navigasi ke path mirror. `aria-label` dua bahasa.

## Matriks konten (apa diterjemahkan)

| Area | ID | Fallback |
|---|---|---|
| Nav/header/footer/consent/404/form label/validasi/aria | penuh | — |
| Home/About/Catalog/Music/Contact/hero/lede/section | penuh | — |
| Product blurb/specs/note/badges/eyebrow | penuh | EN + tanpa badge |
| News title/desc/excerpt/lede/body/coverAlt | penuh | EN + badge "Tersedia dalam bahasa Inggris" |
| Privacy/Terms | penuh | EN + badge |
| `dateLabel` | render `Intl` dari `dateISO` | — |
| Harga, nomor WA, email, alamat fisik, nama brand/orang, slug | tetap | — |

## SEO per locale

- `hreflang`: tiap URL injeksikan `en`, `id`, `x-default` (-> URL EN). Kanonis = URL locale sendiri. `og:locale` `en_US` / `id_ID` + `og:locale:alternate` silang.
- Sitemap: 22 URL (11 x 2 locale), `lastmod` news dari `dateISO`. `sitemap-images.xml` ikut cover (sama, caption per locale bila ada).
- `scripts/seo-build.mjs`: render tiap rute x2 locale (meta dari `locales/{en,id}/seo.json` + JSON-LD `inLanguage` sesuai locale + breadcrumb label per locale).
- JSON-LD: `WebSite` `inLanguage` array/en per halaman? Praktis: per halaman `inLanguage` = locale halaman; `Organization` global tetap. `NewsArticle` ID pakai field ID + `inLanguage: id`.
- `robots.txt`, redirect www->apex, verifikasi GSC: tak berubah. Daftarkan properti `/id/` + sitemap ulang setelah rilis.

## Deteksi bahasa (tanpa jebakan SEO)

- Prioritas: `localStorage kga-lang` > default `en`. Browser `id` + belum ada pref → banner sekali, bisa dismiss ("Lihat versi Indonesia?"), tanpa auto-redirect. Bot/crawler selalu dapat EN di `/`, ID di `/id/*` (prerender statis, tanpa redirect JS).
- Analytics `page_path` sudah per-path, prefix `/id` otomatis terpisah. Consent logic tak berubah.

## Verifikasi per fase

- Tiap tugas: `tsc` 0, `oxlint` 0, build OK, cek view-source 1 URL EN + 1 ID (title/meta/hreflang/JSON-LD benar tanpa JS).
- Akhir: skrip parity kunci EN vs ID (gagal bila kunci ID hilang di ns UI; konten news/produk boleh fallback + badge), klik semua rute dua locale, 404 dua locale `noindex`, banner deteksi muncul 1x, Lighthouse SEO 100 kedua locale sampel, Rich Results 1 artikel ID.

## Risiko + non-goal

- Risiko: volume terjemahan news body (3 artikel, panjang) — butuh penulis ID, bukan MT mentah untuk halaman uang/brand. Mitigasi: fallback EN + badge, rilis ID bertahap per namespace.
- Non-goal: slug terlokalisasi, konversi mata uang, CMS terjemahan, RTL, locale ketiga, auto-redirect browser.

## Urutan eksekusi

T-P4-01 fondasi (init + deps + `useLocale`) → T-P4-02 routing + switcher → T-P4-03/04/05/06/07 konten per area (paralel isi, integrasi urut) → T-P4-08 SEO locale + prerender → T-P4-09 QA parity + a11y + GSC daftar → T-P4-10 tutup docs.
