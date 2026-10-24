# Playbook Manual SEO - kagounga.com

> **Untuk:** pemilik/pengelola situs (pekerjaan yang butuh manusia).
> **Tanggal:** 2026-10-24. Baseline: `kagounga-seo-audit-context.md` + `seo-crawling-results.md`.
> Perubahan kode sisi agent sudah selesai dan terverifikasi - lihat ringkasan di bagian 8. Dokumen ini hanya berisi pekerjaan manual, dalam urutan prioritas.

---

## 1. Deploy + verifikasi pasca-deploy (kerjakan pertama)

Semua perubahan berupa **working-tree changes yang belum di-commit** di repository `new-kagounga` (branch `main`): 30 file berubah + 4 file baru (`src/features/home/Faq.tsx`, `scripts/verify-seo-dist.mjs`, `docs/SEO-Audit/seo-manual-playbook.md`, plus hasil crawl yang memang baru). Build lokal sudah diperiksa (`bun run build`, 48 halaman + 404, lint bersih, 104 test lolos). **Commit & push dahulu** agar Vercel mendeploy perubahan - atau deploy via CLI jika itu alur Anda.

Setelah live:

1. **Cek noindex /contact hilang di render JS.**
   - Google Search Console → URL Inspection → `https://kagounga.com/contact` → *Live test* → hasil harus `Indexable`, bukan `noindex`.
   - Ulangi untuk `https://kagounga.com/id/contact`.
   - Lalu klik *Request indexing* agar re-crawl lebih cepat.
2. **Ukur ulang PageSpeed (baseline before/after).**
   Baseline dari audit lama: mobile 60 (LCP 6,8 dtk, FCP 4,0 dtk), desktop 96.
   - Web: [pagespeed.web.dev](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fkagounga.com%2F) → pilih *Mobile*, simpan PDF/screenshot.
   - API (opsional, kuota anonim terbatas per hari):
     ```
     curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fkagounga.com%2F&strategy=mobile&category=performance" > psi-after.json
     ```
   - Catat skor + LCP sebelum dan sesudah; perubahan preload hero hanya memengaruhi homepage.
3. **Sanity check cepat semua halaman** (opsional, lokal):
   ```
   node scripts/verify-seo-dist.mjs
   ```
   Skrip ini membaca `dist/` dan memeriksa robots meta, panjang title/desc, heading, FAQ, preload.
4. **Rich Results Test** untuk `/` dan `/catalog/popeda` ([search.google.com/test/rich-results](https://search.google.com/test/rich-results)) - memastikan JSON-LD tetap valid setelah perubahan.
5. Tidak ada perubahan URL/redirect - sitemap lama tetap valid. Tidak perlu submit ulang sitemap kecuali Anda menambah halaman.

---

## 2. Payload CMS: meta SEO produk & berita (wajib)

Kode membaca field CMS lebih dulu; fallback statis hanya dipakai jika field kosong. Isi field berikut agar CMS dan kode konsisten.

### 2a. Produk - `seoTitle` + `seoDescription` (8 produk × EN/ID)

Di koleksi **Products**, isi field `seoTitle` dan `seoDescription` (locale EN dan ID) dengan nilai final berikut. Ini sama dengan fallback statis yang sudah aktif - mengisi CMS mencegah perbedaan bila snapshot berubah.

| Produk | Locale | seoTitle | seoDescription |
|---|---|---|---|
| popeda | en | `Popeda Soup - Instant Sago from Ternate \| Kagōunga` | `Instant sago soup from Ternate: silky sago base with savoury turmeric fish broth, dried tuna, and vegetables. Ready in 5 minutes, halal certified.` |
| popeda | id | `Popeda Soup - Sup Sagu Instan Khas Ternate \| Kagōunga` | `Sup sagu instan dari Ternate: dasar sagu lembut dengan kuah kunyit ikan gurih, tuna kering, dan sayuran. Siap dalam 5 menit, bersertifikat halal.` |
| sago | en | `Sago Starch - Pure 1 kg Pouch from North Maluku \| Kagōunga` | `Pure sago starch from North Moluccan palms, packed in a 1 kg food-grade pouch. Thickens papeda-style porridge, soups, and desserts. Halal certified.` |
| sago | id | `Pati Sagu Murni 1 kg Asli dari Maluku Utara \| Kagōunga` | `Pati sagu murni dari pohon sagu Maluku Utara dalam pouch food grade 1 kg. Untuk bubur papeda, sup, dan hidangan penutup. Bersertifikat halal.` |
| tuna | en | `Sun-Dried Tuna from Ternate, North Maluku \| Kagōunga` | `Wild-caught tuna, cleaned and sun-dried in Ternate with no preservatives. A 100 g resealable pouch that adds savoury depth to soups and sambal.` |
| tuna | id | `Tuna Kering Jemur Matahari dari Maluku Utara \| Kagōunga` | `Tuna tangkapan liar yang dibersihkan dan dijemur di Ternate tanpa pengawet. Pouch 100 g yang dapat ditutup ulang untuk sup, sambal, dan nasi goreng.` |
| seasoning | en | `Turmeric Fish Seasoning from the Spice Islands \| Kagōunga` | `Small-batch turmeric fish seasoning blended in Ternate: turmeric, dried fish powder, and sea salt for an instant golden broth or grilling rub.` |
| seasoning | id | `Bumbu Kunyit Ikan Khas Ternate, Maluku Utara \| Kagōunga` | `Bumbu kunyit ikan produksi kecil dari Ternate: kunyit, bubuk ikan kering, dan garam laut untuk kuah keemasan instan atau olesan bakaran ikan.` |
| kenari | en | `Roasted Kenari Nuts from Ternate, North Maluku \| Kagōunga` | `Buttery native kenari nuts, roasted and lightly salted in Ternate, North Maluku. A 200 g resealable pouch, ready to snack or top salads and desserts.` |
| kenari | id | `Kacang Kenari Panggang dari Ternate, Maluku Utara \| Kagōunga` | `Kacang kenari asli yang gurih seperti mentega, dipanggang dan diberi sedikit garam di Ternate. Pouch 200 g, siap jadi camilan atau topping salad.` |
| telang | en | `Dried Butterfly Pea Flowers for Blue Tea \| Kagōunga` | `Sun-dried butterfly pea flowers from North Maluku for vibrant blue tea and natural food colouring. 50 g resealable pouch, only one ingredient.` |
| telang | id | `Bunga Telang Kering untuk Teh Biru Alami \| Kagōunga` | `Bunga telang kering dari Maluku Utara untuk teh biru pekat dan pewarna alami makanan. Pouch 50 g yang dapat ditutup ulang, hanya satu bahan.` |
| pala | en | `Whole Nutmeg and Mace from North Maluku \| Kagōunga` | `Whole sun-dried nutmeg and mace from Moluccan groves in a 100 g resealable pouch. Warm, resinous aroma for soups, sauces, and sweet dishes.` |
| pala | id | `Pala & Fuli Utuh Asli dari Kepulauan Maluku \| Kagōunga` | `Pala dan fuli utuh yang dijemur dari kebun Maluku dalam pouch 100 g. Aroma hangat khas Kepulauan Rempah untuk sup, saus, dan hidangan manis.` |
| cengkeh | en | `Whole Sun-Dried Cloves from North Maluku \| Kagōunga` | `Whole sun-dried cloves with a strong sweet aroma, packed unground in a 100 g resealable pouch. For broths, rice, braises, and mulled drinks.` |
| cengkeh | id | `Cengkeh Kering Utuh Asli dari Maluku Utara \| Kagōunga` | `Cengkeh utuh yang dijemur dengan aroma manis kuat, dikemas tanpa digiling dalam pouch 100 g. Untuk kaldu, nasi, semur, dan minuman rempah.` |

> Jika koleksi Products di Payload belum punya field `seoDescription`, tambahkan dulu di CMS (text, localized EN/ID). Kode sudah siap membacanya (`doc.seoDescription`).

### 2b. Berita - meta description & body headings (3 artikel)

Crawl menandai deskripsi artikel terlalu pendek/panjang dan halaman artikel tanpa h2/h3. Perbaiki di koleksi **Posts**:

| Artikel | Masalah | Perbaikan |
|---|---|---|
| sultans-blessings-for-kagounga | desc EN 162 kar. (>160) | Ganti `metaDescription` (EN) menjadi: `Kagōunga was honored to be invited by the Sultan of Ternate: appreciation for Popeda Instant, a path to the Maluku diaspora, and a blessing for our name.` (153 kar.) - sama dengan fallback statis baru. |
| kunstkring-dialogue | desc terlalu pendek (crawl) | Tulis meta description 120–160 kar. yang merangkum acara: siapa, di mana, kapan, poin utama. |
| ubud-food-festival | desc terlalu pendek (crawl) | Idem. |
| ketiga artikel | body tanpa heading | Pecah body di editor Lexical menjadi 3–5 bagian dengan **Heading 2/3** (parser markdown/Lexical di situs sudah mendukung h1–h3). Jangan menambah kalimat baru; cukup beri judul bagian pada alur yang sudah ada. |

Setelah selesai: jalankan `bun run sync:cms` saat build berikutnya (atau biarkan build produksi memanggil CMS), lalu cek satu halaman artikel di GSC URL Inspection.

---

## 3. Backlink (nilai F) - audit manual 23 domain

**Jangan disavow otomatis.** Pola path `report|share|stats` pada 10 URL yang tercantum di audit (bye.fyi, drjack.world, atomizelink.icu, blogsphere.top, metamagic.top, anchorurl.cloud, backlinks-checker.com, shortenurls.eu, byteshort.xyz, optimizeflow.top) mengindikasikan halaman report otomatis, tetapi perlu verifikasi satu per satu.

Prosedur:

1. Google Search Console → *Link reports* → *External links* → export daftar top linking sites. Bandingkan dengan 23 domain dari audit; catat domain baru.
2. Untuk tiap domain: buka URL perujuk.
   - Halaman report/autoscribe tanpa konten manusia → catat sebagai *low-quality*.
   - Ada konten nyata yang menyebut Kagōunga → *keep*.
3. Klasifikasi akhir: `keep` (editorial/nyata), `ignore` (low-value tapi tidak berbahaya - Google biasanya mengabaikan sendiri), `disavow` (hanya jika pola manipulatif massal dan jumlahnya signifikan).
4. Jika memutuskan disavow: buat file `.txt` (satu domain per baris, format `domain:example.top`) → upload di [GSC Disavow Links](https://search.google.com/search-console/disavow-links). Dokumentasikan tanggal + alasan per domain.
5. **Membangun tautan nyata (jangka panjang):**
   - Minta tautan dari mitra nyata: JAVARA, Rasta Timur Asli, venue event (Ubud Food Festival, Kunstkring), media lokal Ternate yang sudah memberitakan.
   - Daftar di direktori bisnis Indonesia resmi yang relevan.
   - Setiap event/penampilan baru → minta halaman event menautkan ke situs.

---

## 4. Google Business Profile + LocalBusiness (kondisional)

Data NAP di situs sudah konsisten dan ada di JSON-LD `LocalBusiness` pada `/contact`:
- Nama: Kagōunga Head Office
- Alamat: Jl. Raya Pertamina, No.800, Jambula, Ternate, North Maluku 97751
- Telepon: +62 811-1538-111 · Email: hello@kagounga.com

**Buat GBP hanya jika** kantor Ternate melayani pelanggan tatap muka / bisa diverifikasi Google. Langkah:

1. [business.google.com](https://business.google.com) → tambah bisnis → kategori paling pas (mis. *Food products supplier* / *Manufacturer*).
2. Alamat harus persis sama dengan di situs (di atas). Verifikasi via video/post.
3. Setelah live: tambah link website `https://kagounga.com/`, jam operasional, foto produk.
4. Tidak perlu mengubah JSON-LD situs - `LocalBusiness` sudah ada.

---

## 5. Facebook Pixel (hanya jika ada iklan)

Bukan perbaikan SEO. Pasang **hanya jika** Anda akan menjalankan iklan FB/IG retargeting:

1. Buat pixel di Meta Events Manager.
2. Karena situs adalah SPA, pasang via Google Tag Manager atau tambahkan script pixel di `index.html` dengan consent check yang sama seperti gtag (lihat pola yang ada).
3. Pastikan kebijakan privasi (`/privacy`) disesuaikan - sebutkan Meta sebagai pihak ketiga.

---

## 6. DMARC: `p=none` → lebih ketat (email, bukan SEO)

SPF sudah ada (`include:_spf.mail.hostinger.com`), DMARC `p=none` (monitoring saja). Jalur email bisnis harus diuji dulu:

1. Aktifkan laporan DMARC: `v=DMARC1; p=none; rua=mailto:dmarc-reports@kagounga.com` - kumpulkan 2–4 minggu.
2. Pastikan semua pengirim sah (Hostinger mailbox, tool apa pun yang mengirim atas nama domain) lolos SPF/DKIM dari laporan.
3. Naikkan bertahap: `p=quarantine; pct=25` → `pct=100` → akhirnya `p=reject`.
4. Setiap tahap, cek apakah email order/inquiry tetap sampai.

---

## 7. Kanal sosial & email plaintext (kondisional)

- **Halaman Facebook**: audit menandai FB page tidak tertaut. Buat hanya jika ada kapasitas mengelola; setelah aktif, tambahkan URL-nya ke `SOCIALS` di `src/data/site.ts` (muncul otomatis di footer, kontak, dan JSON-LD `sameAs`).
- **LinkedIn**: idem.
- **YouTube**: pertumbuhan subscriber adalah kerja konten, bukan perbaikan teknis. Gunakan tautan channel yang sudah ada.
- **Email plaintext** di halaman kontak: audit menyarankan obfuscation anti-scraping. **Jangan ganti dengan gambar** (menurunkan aksesibilitas). Opsi aman bila spam jadi masalah: form WhatsApp sudah menjadi jalur utama; email bisa dibiarkan karena mailto justru berguna bagi pengguna.

---

## 8. Yang sudah dikerjakan agent (ringkasan, 2026-10-24)

| Temuan crawl | Status | Perubahan |
|---|---|---|
| Noindex /contact + /id/contact (HIGH) | **Fixed** | `MapView` kini cek WebGL + try/catch; crash peta tidak pernah lagi menjatuhkan halaman ke ErrorPage/noindex. Fallback teks saat WebGL tidak tersedia. |
| Title terlalu pendek (29 hal.) | **Fixed** | 7 title halaman + 8 title produk × EN/ID ditulis ulang (50–60 kar.). Home sengaja tetap `Kagōunga \| Move, Moreover.` (keputusan pemilik). |
| Meta desc pendek (27) / panjang (3) | **Fixed** | Semua desc halaman, produk (via `seoDescriptions` baru), dan stockist kini 120–160 kar. |
| Poor header usage (14 hal.) | **Fixed** | Contact: h3 Office/Email/Phone. News: h2 seksi + kartu jadi h3. Article: item "Related" jadi h3. Privacy/Terms: sub-seksi h3 (teks dipindah verbatim). |
| Thin content (38 hal.) | **Sebagian** | FAQ homepage baru (5 Q&A EN+ID, fakta dari kode). Teks legal/konten halaman lain = bagian 2 & catatan di bawah. |
| Alt gambar 29/56 kosong | **Terverifikasi OK** | Semua `alt=""` adalah gambar dekoratif (ikon dalam link ber-aria-label, hero dekoratif, duplikat marquee) - benar menurut WCAG. 2 perbaikan nyata: logo footer `Kagounga`→`Kagōunga`, dan fallback alt CMS berita agar tidak pernah kosong. |
| FAQ tidak ada | **Fixed** | Komponen `Faq.tsx` (details/summary native) di homepage. |
| LCP mobile 6,8 dtk | **Sebagian** | Preload hero LCP di homepage EN+ID; redirect chain live sudah dicek bersih (apex 200 langsung). Ukur ulang = bagian 1. |
| Backlink, GBP, Pixel, DMARC, sosial | **Manual** | Bagian 3–7 di atas. |

**Verifikasi otomatis yang berjalan:** 104 test lolos (termasuk 9 guard baru: panjang title 50–60 & desc 120–160 untuk seo.json, produk, dan stockist - mencegah regresi), lint 0 warning, `i18n:check` OK, build 48 halaman.

**Butuh review Anda sebelum/after deploy:**
1. Semua copy baru (title/desc) di daftar bagian 2a dan tabel di laporan agent - pastikan sesuai tone merek.
2. Struktur legal Privacy/Terms: teks dipindah verbatim ke sub-h3 tanpa kalimat baru; konten legal tetap disarankan diperluas oleh pemilik (thin content di kedua halaman ini memang dari teks legal yang singkat).
3. Jika ada keberatan pada copy mana pun, cukup ubah di `src/locales/{en,id}/seo.json`, `src/data/productPageCopy.json`, atau `src/data/stockistContent.ts` - guard test akan memberi tahu jika keluar dari rentang.
