# Kagōunga — Move, Moreover

Company profile + catalog + music + news + distribution map. React 19 + TS + Vite + Tailwind 4 + react-router 7 + MapLibre.

## Run
- `bun install` (atau `npm install`)
- `bun run dev` → http://localhost:5173
- `bun run build` → `tsc -b && vite build`
- `bun run lint` → `oxlint`

## Env
- Salin `.env.example` ke `.env`, isi `VITE_CAL_API_URL` (Apps Script `?action=getEvents&year=YYYY`).
- Tanpa env, halaman Milestones pakai fallback statis + cache lokal.

## Struktur
- `src/app/` router + layout (header/footer, consent, page-view tanpa query).
- `src/pages/` Home/About/News/Catalog/Music/Contact/404 (lazy kecuali Home).
- `src/features/` home + contact (peta MapLibre, form WA).
- `src/data/` konten statis + `news.json`. `src/lib/` calendar/analytics/whatsapp/markdown/cn.

## Docs
Baca `docs/README.md` dulu. Fase di `docs/PHASES.md`, tugas di `docs/TASKLIST.md`, baseline di `docs/AUDIT-BASELINE.md`, rambu di `docs/GUARDRAILS.md`.
