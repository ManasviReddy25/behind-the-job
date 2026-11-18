# Behind the Job (front end)

React + Vite. All text comes from `src/content/` and matches "scenario text v6".

- `npm ci` then `npm run dev` (or `npm run build` and `npm run preview`). For the AI persona runs, use the built site (`build` + `preview`).
- Routes use the hash (`#/...`), so any static host works.
- `#/menu` jumps to any screen (presenter and tester only, not linked). `#/debug` shows the run log.
- The run log lives in memory only. Read it with `window.__btj.get()`. A reload clears it. Nothing is saved or sent.
- Option order: a fixed seeded shuffle (`src/lib/order.js`, `SHUFFLE_MODE`).
- Checks: `node scripts/check-structure.mjs`, `node scripts/e2e.mjs first|best|mixed` (needs the preview server on port 4173). `node scripts/export-md.mjs out.md` writes all scenario text to markdown.
