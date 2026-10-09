# Phases — Tahap Terarah

Prinsip: kunci fase sebelum lanjut. Tiap fase punya non-goal.

## P0 — Freeze + Kritis (keamanan/crash/data salah)
- Goal: hilangkan XSS, crash, data palsu/duplikat.
- Scope: `TASKLIST.md` T-P0-01 s/d T-P0-08.
- Exit: `tsc` 0, `oxlint` 0 error, 61 ref `/img` resolve, tidak ada placeholder palsu, tidak ada duplikat id.
- Non-goal: redesign, i18n penuh, optimasi gambar massal.

## P1 — Major (performa, a11y, keandalan fetch)
- Goal: halaman musik ringan, peta + dialog + form bisa keyboard/SR, fetch kalender andal.
- Scope: T-P1-01 s/d T-P1-10.
- Exit: iframe Spotify fasad, dialog return-focus, `res.ok` + empty-state, CLS turun.
- Non-goal: ganti CMS, ganti map provider.

## P2 — Minor + Polish (konten, konsistensi, dead-link)
- Goal: tanpa link mati, harga/tanggal konsisten, markdown rapi.
- Scope: T-P2-01 s/d T-P2-09.
- Exit: semua CTA/footer route nyata, `Intl` harga/tanggal, tidak ada `href="#"`.
- Non-goal: tambah bahasa baru penuh (cukup kamus parsial).

## P3 — Rilis + Hygiene (repo, docs, deploy)
- Goal: repo bersih, deploy aman, docs hidup.
- Scope: T-P3-01 s/d T-P3-06.
- Exit: `git status` bersih, `README.md` nyata, header cache Vercel, `CHANGELOG` update.
- Non-goal: fitur katalog/checkout baru.

Urutan kaku: P0 > P1 > P2 > P3. Lompat fase butuh catat alasan di `CHANGELOG.md`.
