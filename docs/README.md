# Docs — Konteks Dasar Pengembangan

Sumber tunggal arah kerja. Baca urut ini sebelum ubah kode.

1. `AUDIT-BASELINE.md` — snapshot kondisi 2026-10-09, hasil scan total. Jangan edit, hanya tambah adendum.
2. `GUARDRAILS.md` — rambu agar tidak keluar jalur. Wajib patuh.
3. `PHASES.md` — tahap kerja + exit criteria.
4. `TASKLIST.md` — daftar tugas ceklis per fase. Update status di sini saja.
5. `CHANGELOG.md` — catat tiap selesai fase / rilis.
6. `I18N-PLAN.md` — rencana i18n P4 (baca penuh sebelum eksekusi T-P4-xx).

Aturan pakai:
- Mulai sesi baru: baca `GUARDRAILS.md` + fase aktif di `PHASES.md` + tugas terbuka di `TASKLIST.md`.
- Selesai tugas: centang `TASKLIST.md`, tambah baris `CHANGELOG.md`.
- Temu fakta baru beda baseline: tambah adendum di `AUDIT-BASELINE.md`, jangan tulis ulang history.
- Larang edit di luar fase aktif kecuali P0. P0 masuk dulu ke `TASKLIST.md`.
