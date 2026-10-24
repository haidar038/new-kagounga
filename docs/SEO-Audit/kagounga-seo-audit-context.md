# Konteks SEO Audit - Kagōunga

> **Tujuan dokumen:** referensi kerja untuk AI agent yang menganalisis dan memperbaiki SEO `kagounga.com`. Dokumen ini menggabungkan fakta dari laporan audit 17 halaman dengan analisis prioritas. Fakta laporan dan inferensi analitis dibedakan agar agent tidak menganggap semua temuan sebagai kondisi live.

## 1. Ringkasan eksekutif

- **Nilai keseluruhan:** B
- **Jumlah rekomendasi dalam laporan:** 18
- **Nilai kategori:** SEO On-Page **A-**, GEO **A**, Tautan/Backlink **F**, Kegunaan **C**, Performa **A+**.
- **Risiko prioritas:** PageSpeed seluler 60 dengan Largest Contentful Paint (LCP) 6,8 detik; backlink memiliki kekuatan domain/halaman yang dilaporkan 0 dan perlu pemeriksaan manual; title tag hanya 26 karakter; konten berjumlah 470 kata; 29 dari 56 gambar tidak memiliki `alt`; belum ada FAQ eksplisit.
- **Fondasi yang dilaporkan baik:** canonical, SSL/HTTPS, robots.txt, sitemap XML, schema JSON-LD `Organization`, struktur heading, X Cards/Open Graph, caching dan minifikasi, serta PageSpeed desktop 96.

**Kesimpulan analitis:** jangan melakukan 18 perubahan secara membabi buta. Mulai dari mengukur ulang performa seluler, memeriksa mutu backlink, memperbaiki penjelasan inti halaman (title/konten/FAQ), serta menambahkan alt gambar informatif. Rekomendasi lokal, pixel iklan, dan kanal sosial bergantung pada kebutuhan serta kelayakan bisnis.

## 2. Tentang sumber dan batasan

Sumber adalah `seo-report.pdf` berjudul *Audit SEO untuk kagounga.com*, terdiri dari 17 halaman. **Tanggal audit tidak tercantum**, sehingga semua metrik perlu diperlakukan sebagai snapshot, bukan jaminan kondisi website saat ini. Audit juga menyatakan pengujian PageSpeed berasal dari server AS dan data lapangan Google Core Web Vitals tidak cukup untuk memberi penilaian.

Gunakan tiga label dalam pekerjaan agent:

- `DILAPORKAN_AUDIT`: angka atau status yang tertulis di PDF.
- `ANALISIS_AGENT`: interpretasi, risiko, atau rekomendasi hasil analisis.
- `TERVERIFIKASI_LIVE`: kondisi yang benar-benar diperiksa ulang pada website/tool saat ini.

## 3. Nilai kategori dan interpretasi

| Kategori | Nilai | Interpretasi |
|---|---:|---|
| SEO On-Page | A- | Fondasi cukup baik. Masih ada pekerjaan pada title tag, konsistensi kata kunci, volume/kegunaan konten, dan alt gambar. |
| GEO (Generative Engine Optimization) | A | Entitas, struktur konten, kesiapan sitasi, serta akses crawler AI dilaporkan baik. FAQ belum tersedia. |
| Tautan/Backlink | F | Audit melaporkan kekuatan domain dan halaman bernilai 0. Daftar sumber perlu diaudit manual sebelum disimpulkan berkualitas buruk atau berbahaya. |
| Kegunaan | C | Viewport mobile tersedia, tetapi skor PageSpeed seluler rendah. Desktop jauh lebih baik. |
| Performa | A+ | Pengujian umum melaporkan loading cepat, ukuran halaman cukup rendah, caching dan minifikasi baik. Nilai ini tidak menghapus isu seluler. |

## 4. Temuan detail

### 4.1 SEO on-page

**Title dan deskripsi meta**

- Title yang dilaporkan: `Kagōunga | Move, Moreover.` (26 karakter).
- Tool menyarankan 50-60 karakter, termasuk spasi. Angka tersebut merupakan panduan, bukan aturan mutlak.
- Meta description yang dilaporkan (159 karakter):

  > Kagōunga. Five distinct forms of expression bound by one identity. Gastronomy, personal care, home fragrance, sonic identity, and fine art from North Moluccas.

- Deskripsi meta berada dalam kisaran panjang 120-160 karakter menurut audit.
- Bahasa halaman yang dideklarasikan adalah English. Hreflang terdeteksi.

**Heading dan kata kunci**

- H1 terdeteksi; H2 berjumlah 4 dan H3 berjumlah 8.
- Struktur heading dinilai baik, tanpa level terlewat atau heading kosong.
- Audit menyatakan distribusi kata kunci pada title, meta, dan heading belum kuat.

| Kata kunci yang tercatat audit | Frekuensi di halaman |
|---|---:|
| `sago palm` | 2 |
| `global reach` | 2 |
| `maluku utara` | 2 |
| `indonesia` | 4 |
| `scheduled` | 3 |
| `jakarta` | 3 |
| `identity` | 3 |
| `innovation` | 3 |

Frekuensi tersebut tidak membuktikan bahwa semua istilah layak dijadikan target. Agent perlu menguji relevansi setiap istilah dengan isi dan penawaran Kagōunga. Jangan memasukkan lokasi atau kata kunci secara paksa.

**Konten dan gambar**

- Jumlah teks yang dilaporkan: **470 kata**; audit menganggapnya rendah.
- Jumlah gambar yang ditemukan: **56**.
- Gambar tanpa atribut alt: **29**.
- Rekomendasi: tambah konten yang benar-benar menjelaskan merek/kategori/produk/fakta yang dapat dibuktikan; berikan alt bermakna pada gambar informatif dan gunakan `alt=""` untuk gambar dekoratif.
- Jangan menambah paragraf pengisi semata-mata untuk memenuhi jumlah kata.

**Fondasi teknis SEO yang sudah terdeteksi**

- Canonical: `https://kagounga.com/`
- SSL aktif dan redirect ke HTTPS dilaporkan berhasil.
- `robots.txt` terdeteksi; crawler mesin pencari utama dilaporkan dapat merayapi halaman.
- Tag `noindex` dan header `noindex` tidak terdeteksi.
- Sitemap: `https://kagounga.com/sitemap.xml` dan `https://kagounga.com/sitemap-images.xml`.
- Google Analytics terdeteksi.
- Schema JSON-LD serta entitas `Organization` terdeteksi.

Jangan membuat ulang komponen-komponen ini tanpa memverifikasi kondisi live terlebih dahulu.

### 4.2 GEO / keterbacaan untuk sistem AI

GEO mendapat nilai **A**. Laporan menyatakan:

- `llms.txt` terdeteksi pada `http://kagounga.com/llms.txt`; crawler AI utama tidak diblokir oleh `robots.txt`.
- Entitas yang diwakili halaman dinilai jelas: Kagōunga dijelaskan sebagai merek kreatif berakar budaya dengan cakupan gastronomi, perawatan diri, wewangian, musik, dan seni.
- Struktur heading, card, statistik, kelompok acara, kategori produk, dan paragraf pendek dinilai mudah dipindai.
- Konten memiliki klaim mandiri yang berpotensi dikutip, termasuk klaim terkait produk, warisan, tonggak, bahan, sertifikasi, dan tujuan organisasi.
- Sinyal kesegaran yang disebut adalah acara 2026, copyright 2026, dan jadwal dinamis; timestamp pembaruan eksplisit tidak ditemukan.
- Otoritas/kepercayaan mendapat sinyal dari logo mitra/media, klaim sertifikasi, informasi organisasi, serta lokasi, tetapi kredensial dinilai masih terbatas.
- FAQ eksplisit tidak ditemukan.
- Persentase konten yang dirender dilaporkan **11%**, tetapi metodologi angka ini tidak dijelaskan. Jangan mengubah strategi rendering hanya berdasarkan angka tersebut.

**Arah tindakan:** tambahkan FAQ yang menjawab pertanyaan riil, pastikan semua klaim dapat dibuktikan, dan perjelas konteks entitas. Tidak perlu menambah markup FAQ atau konten artifisial tanpa kebutuhan pengguna.

### 4.3 Backlink dan tautan

Nilai kategori backlink adalah **F**. Angka yang dilaporkan:

- Kekuatan domain: **0**; kekuatan halaman: **0**.
- **27 backlink** dari **23 domain pengarah**.
- 27 follow, 0 nofollow, 0 tautan `.edu`, dan 0 tautan `.gov`.
- Halaman tujuan teratas: `https://kagounga.com/` dengan 27 tautan.
- Anchor teratas: `kagounga.com` dengan 27 tautan.
- Domain pengarah menurut TLD: `.top` 6, `.com` 5, `.eu` 2, `.cloud` 1, dan kategori lain 9.
- Negara domain pengarah: Finlandia (FI) 19, Singapura (SG) 3, Kanada (CA) 1.

Sepuluh URL perujuk yang ditampilkan audit:

| Skor domain pada laporan | URL perujuk |
|---:|---|
| 65 | `https://bye.fyi/report/5826` |
| 63 | `https://drjack.world/report/5827` |
| 62 | `https://atomizelink.icu/report/5826` |
| 59 | `https://blogsphere.top/stats/5826` |
| 59 | `https://metamagic.top/stats/5827` |
| 59 | `https://anchorurl.cloud/share/5826` |
| 59 | `https://backlinks-checker.com/share/5826` |
| 59 | `https://shortenurls.eu/share/5827` |
| 59 | `https://byteshort.xyz/report/5826` |
| 58 | `https://optimizeflow.top/stats/5827` |

**Analisis dan kehati-hatian:** pola path `report`, `share`, dan `stats` terlihat seperti halaman report/share otomatis. Itu alasan untuk memeriksa link satu per satu, tetapi bukan bukti yang cukup untuk menyatakan semuanya spam atau berbahaya. Jangan melakukan disavow otomatis. Cocokkan dengan Google Search Console dan sumber independen; bangun tautan editorial yang relevan dari mitra, komunitas, media, organisasi, acara, atau publikasi yang nyata.

Struktur tautan dalam halaman: 29 total, 23 internal, 6 eksternal follow, 0 eksternal nofollow. Anchor internal dinilai deskriptif. Beberapa URL disebut kurang ramah, tetapi contoh URL spesifik tidak disediakan.

### 4.4 Kegunaan dan PageSpeed

**Seluler — skor 60**

| Metrik | Hasil laporan |
|---|---:|
| First Contentful Paint (FCP) | 4,0 dtk |
| Speed Index | 5,2 dtk |
| Largest Contentful Paint (LCP) | 6,8 dtk |
| Time to Interactive (TTI) | 6,9 dtk |
| Total Blocking Time (TBT) | 0,1 dtk |
| Cumulative Layout Shift (CLS) | 0 |

**Desktop — skor 96**

| Metrik | Hasil laporan |
|---|---:|
| First Contentful Paint (FCP) | 0,9 dtk |
| Speed Index | 0,9 dtk |
| Largest Contentful Paint (LCP) | 1,2 dtk |
| Time to Interactive (TTI) | 1,2 dtk |
| Total Blocking Time (TBT) | 0,01 dtk |
| Cumulative Layout Shift (CLS) | 0 |

Peluang yang dicantumkan laporan untuk pengujian seluler: menghindari redirect ganda (estimasi 0,63 dtk), mengurangi JavaScript yang tidak dipakai (0,6 dtk), mengurangi render-blocking request (0,45 dtk), dan memperbaiki image delivery (0,3 dtk). Untuk desktop, penghematan redirect diperkirakan 0,19 dtk.

Data Core Web Vitals pengguna nyata tidak cukup, menurut laporan. Hasil PageSpeed disebut berasal dari server AS sehingga perlu diuji ulang dengan kondisi yang relevan. Fokus awal adalah mencari elemen LCP, ukuran/format gambar hero, CSS/JS yang menghambat render, redirect berantai, dan JavaScript yang tidak digunakan. Ukur ulang setiap perubahan.

**Data performa lain yang dilaporkan**

- Respons server: 0,18 dtk; semua konten: 0,9 dtk; semua script selesai: 1,0 dtk.
- Ukuran unduhan halaman: 0,88 MB (HTML 0,01; CSS 0,01; JS 0,33; gambar 0,39; lain-lain 0,14 MB).
- 25 objek: 1 HTML, 7 JS, 1 CSS, 6 gambar, 10 sumber daya lain.
- Kompresi total dilaporkan 45%; kompresi gambar 0%.
- Dimensi gambar eksplisit, caching browser, HTTP/2+, minifikasi JS/CSS, dan tidak adanya error JavaScript dilaporkan baik.
- Flash dan iframe tidak terdeteksi; favicon: `https://kagounga.com/favicon/favicon.svg`.
- Inline style dan render-blocking resource terdeteksi.

Audit sekaligus menyatakan gambar tampak dioptimalkan dan mencatat peluang perbaikan delivery gambar. Hal ini tidak harus berarti kontradiksi langsung karena pemeriksaan mungkin mengukur aspek yang berbeda; periksa aset dan waterfall live sebelum menyimpulkan.

### 4.5 Sosial dan SEO lokal

- Facebook page tidak tertaut; Facebook Open Graph terdeteksi; Facebook Pixel tidak terdeteksi.
- X tertaut: `https://x.com/kagounga`; X Cards terdeteksi.
- Instagram tertaut: `https://instagram.com/kagounga.id`.
- LinkedIn tidak ditemukan tertaut.
- YouTube tertaut: `https://youtube.com/channel/UC56V7HM6piJhih9855fyr7w`; jumlah subscriber dianggap rendah tanpa angka spesifik.
- Bagian SEO lokal tidak dapat mengidentifikasi alamat, tetapi menampilkan telepon `+62 811 1538 111`.
- LocalBusiness schema dan Google Business Profile tidak ditemukan.

**Ketidakkonsistenan penting:** bagian GEO mengatakan alamat kantor, email, telepon, akses kontak dan tautan sosial resmi tersedia, sedangkan bagian SEO lokal mengatakan alamat tidak dapat ditemukan. Verifikasi website aktual, footer, halaman kontak, dan JSON-LD sebelum memperbarui informasi.

Google Business Profile dan LocalBusiness schema harus bersifat kondisional: gunakan hanya jika model usaha/lokasi memenuhi syarat dan datanya nyata. Facebook Pixel bukan perbaikan SEO organik; pasang hanya jika ada kebutuhan iklan/retargeting serta tata kelola privasi yang sesuai. Jangan membuat akun sosial kosong hanya untuk menutup temuan audit.

### 4.6 Teknologi dan domain

Teknologi yang terdeteksi: Google Analytics, HSTS, Vercel, dan Vercel Analytics. Server web dilaporkan Vercel; IP `216.198.79.1`; nameserver `ns2.dns-parking.com` dan `ns1.dns-parking.com`; content type `text/html; charset=utf-8`.

DNS email yang dilaporkan:

- DMARC: `v=DMARC1; p=none`
- SPF: `v=spf1 include:_spf.mail.hostinger.com ~all`

Ini bukan temuan SEO langsung. `p=none` merupakan kebijakan pemantauan; jangan mengubahnya menjadi kebijakan penolakan tanpa memastikan seluruh alur email bisnis telah terautentikasi dan diuji.

## 5. Roadmap rekomendasi

Prioritas di bawah adalah **prioritas analitis**, bukan salinan prioritas dari tool. Kolom prioritas audit asli dipertahankan pada JSON.

### P0 — Baseline dan performa seluler

1. Uji ulang PageSpeed/Lighthouse untuk URL yang sama dan simpan metrik sebelum perubahan.
2. Identifikasi elemen LCP dan bottleneck render pada mobile.
3. Periksa redirect ganda, unused JavaScript, render-blocking resource, serta delivery gambar berdasarkan bukti waterfall.
4. Lakukan perubahan kecil, uji fungsi/visual, lalu bandingkan hasil.

**Selesai jika:** terdapat baseline yang dapat diulang, LCP seluler membaik secara terukur, dan tidak ada regresi UX/fungsi.

### P1 — Konten, relevansi, alt, dan backlink

1. Perbarui title tag dengan konteks penawaran yang benar tanpa mengorbankan identitas merek.
2. Petakan kata kunci ke kebutuhan pencarian dan bagian halaman yang relevan.
3. Tambahkan konten substantif dan FAQ berdasarkan fakta/pertanyaan nyata.
4. Lengkapi alt untuk gambar informatif.
5. Audit 23 domain pengarah dan jalankan strategi tautan yang relevan; jangan disavow otomatis.
6. Verifikasi konsistensi informasi alamat dan kontak.

**Selesai jika:** konten lebih jelas, alt informatif terisi, backlink sudah dikategorikan berdasarkan pemeriksaan manual, dan semua klaim kontak konsisten.

### P2 — Validasi SEO teknis dan lokal

1. Minta daftar URL yang ditandai kurang ramah; jangan mengubah URL tanpa contoh.
2. Validasi canonical, sitemap, robots.txt, bahasa/hreflang, dan JSON-LD pada website saat ini.
3. Tentukan kelayakan Google Business Profile dan LocalBusiness schema sebelum implementasi.

**Selesai jika:** temuan teknis tervalidasi dan tidak ada perubahan yang menimbulkan redirect/URL rusak atau structured data yang tidak akurat.

### P3 — Peningkatan bersyarat

- Facebook Pixel bila memang ada kampanye iklan/retargeting.
- Halaman Facebook, LinkedIn, dan pertumbuhan YouTube sesuai tujuan serta kapasitas pengelolaan kanal.
- Refactor inline style hanya jika relevan terhadap maintainability atau kinerja yang terukur.
- Perbaiki mitigasi scraping email tanpa mengorbankan aksesibilitas.

## 6. Daftar 18 rekomendasi asli dari audit

| # | Rekomendasi audit | Kategori | Prioritas audit |
|---:|---|---|---|
| 1 | Jalankan strategi membangun tautan | Tautan | Utama |
| 2 | Tingkatkan panjang tag judul | SEO On-Page | Sedang |
| 3 | Gunakan kata kunci di seluruh tag HTML | SEO On-Page | Sedang |
| 4 | Tambahkan konten FAQ/tanya jawab | GEO | Sedang |
| 5 | Tambahkan atribut alt ke semua gambar | SEO On-Page | Rendah |
| 6 | Perbarui URL agar lebih mudah dibaca | Tautan | Rendah |
| 7 | Tambahkan konten teks halaman | SEO On-Page | Rendah |
| 8 | Optimalkan PageSpeed Insights seluler | Kegunaan | Rendah |
| 9 | Tunda sumber daya yang menghambat rendering | Kegunaan | Rendah |
| 10 | Buat Google Business Profile | Lainnya | Rendah |
| 11 | Tambahkan alamat dan nomor telepon bisnis ke situs | Lainnya | Rendah |
| 12 | Tambahkan schema LocalBusiness | Lainnya | Rendah |
| 13 | Pasang Facebook Pixel | Lainnya | Rendah |
| 14 | Hapus inline style | Performa | Rendah |
| 15 | Hapus alamat email dalam teks jelas | Kegunaan | Rendah |
| 16 | Buat dan tautkan halaman Facebook | Lainnya | Rendah |
| 17 | Buat dan tautkan profil LinkedIn | Lainnya | Rendah |
| 18 | Tingkatkan jumlah pelanggan channel YouTube | Lainnya | Rendah |

## 7. Temuan positif yang jangan rusak saat optimasi

- Meta description sudah cukup lengkap dan panjangnya sesuai panduan audit.
- Struktur heading dan deklarasi bahasa terdeteksi baik.
- Canonical, HTTPS, robots.txt, sitemap, dan `Organization` JSON-LD sudah terdeteksi.
- Crawler AI utama dilaporkan tidak diblokir.
- Open Graph, X Cards, X, Instagram, dan YouTube sudah tertaut/terdeteksi sesuai laporan.
- Desktop PageSpeed 96, CLS 0, caching browser, HTTP/2+, dan minifikasi dilaporkan baik.

Jangan melakukan rewrite teknis secara luas hanya untuk mengejar skor jika fondasi sudah benar. Pertahankan halaman, tautan, data terstruktur, aksesibilitas, dan fungsi saat menjalankan eksperimen.

## 8. Instruksi untuk AI agent

1. Perlakukan dokumen ini sebagai **baseline audit**, bukan keadaan website yang dijamin masih berlaku.
2. Tandai setiap pernyataan sebagai `DILAPORKAN_AUDIT`, `ANALISIS_AGENT`, atau `TERVERIFIKASI_LIVE`.
3. Verifikasi kondisi live sebelum mengubah kode atau DNS; jangan mengarang trafik, ranking, tanggal audit, konversi, jumlah subscriber, maupun data yang tidak tersedia.
4. Pertahankan identitas Kagōunga dan jangan membuat klaim tentang bahan, budaya, sertifikasi, jangkauan, atau sejarah tanpa sumber yang disetujui.
5. Jangan melakukan keyword stuffing atau menghasilkan konten pengisi.
6. Jangan melakukan disavow backlink otomatis; inspeksi dan validasi lebih dahulu.
7. Jadikan Google Business Profile, LocalBusiness schema, Facebook Pixel, dan kanal sosial sebagai keputusan kondisional.
8. Jangan mengganti email dengan gambar sebagai solusi default karena dapat menurunkan aksesibilitas.
9. Setiap perubahan harus memiliki alasan, risiko, langkah verifikasi, dan kriteria selesai.
10. Ukur performa sebelum/sesudah dengan kondisi yang konsisten dan pastikan tidak ada regresi visual, aksesibilitas, SEO teknis, atau fungsi.

## 9. Ringkasan caveat yang perlu dipertahankan

- Tanggal laporan tidak diketahui.
- Domain/page strength 0 dilaporkan bersamaan dengan 27 backlink dan 23 domain pengarah; definisi metrik tool tidak sepenuhnya dijelaskan.
- URL backlink terlihat seperti halaman report/share/stats, tetapi belum ada bukti cukup untuk menyebut semuanya berbahaya.
- Status keberadaan alamat tidak konsisten antara bagian GEO dan SEO lokal.
- PageSpeed seluler 60 dan desktop 96 berasal dari pengujian tool; Core Web Vitals lapangan tidak memadai.
- Status gambar “dioptimalkan” muncul bersamaan dengan peluang image delivery dan kompresi gambar 0%; perlu cek aktual.
- Persentase konten dirender 11% tidak disertai penjelasan metode.
- Audit tidak memberikan contoh URL tidak ramah, angka subscriber YouTube, atau rincian cukup untuk penilaian kualitas backlink final.

---

**Sumber utama:** `seo-report.pdf` (17 halaman), *Audit SEO untuk kagounga.com*. Seluruh skor dan angka dalam dokumen ini berasal dari laporan tersebut, kecuali bagian yang secara eksplisit ditandai sebagai analisis/rekomendasi.
