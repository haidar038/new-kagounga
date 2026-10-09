# Guardrails — Rambu Tidak Keluar Jalur

## Wajib
- Kerja per fase `PHASES.md`. Satu fase aktif. Selesai = exit criteria + centang `TASKLIST.md` + baris `CHANGELOG.md`.
- Sentuh hanya file tugas aktif. Sampingan catat, jangan refactor liar.
- Tiap ubah: `tsc` 0 + `oxlint` bersih + cek 61 ref `/img` + uji keyboard/SR untuk UI.
- Match gaya ada. Tanpa deps baru tanpa catat alasan. Tanpa abstraksi single-use.

## Larang
- Tanpa `innerHTML/setHTML` mentah (kecuali escape teruji). Tanpa `dangerouslySetInnerHTML`.
- Tanpa link/ID palsu baru (`#`, `track/1234`, koordinat placeholder). Tanpa harga/tanggal string bebas baru (pakai `Intl`).
- Tanpa embed/CDN baru tanpa fallback + privasi cek.
- Tanpa edit `AUDIT-BASELINE.md` history. Tanpa force-push `main`.

## Definisi selesai
- Fungsional + tidak regresi rute lain + `tsc/oxlint` hijau + a11y keyboard + docs update.
- Bug = tes reproduksi dulu, baru fix. Fitur = kriteria terima `TASKLIST.md` terpenuhi.

## Keputusan cepat
- Ragu? Tanya, jangan asumsi diam. Sederhana dulu, tolak scope merayap.
- P0 boleh potong antre. Selain itu antre ke fase berikut.
