# CLAUDE.md — loginrek-mobile

@AGENTS.md

## Catatan khusus Claude Code

- Aturan proyek ada di `AGENTS.md` (di-import di atas); tambahkan aturan umum di sana.
- Expo berubah tiap SDK: cek dokumentasi versi SDK di `package.json` sebelum memakai API
  Expo, jangan mengandalkan ingatan. Plugin `expo@claude-plugins-official` diaktifkan
  lewat `.claude/settings.json`.
- Kontrak API ada di `../loginrek-dashboard/docs/API.md` — bila endpoint belum ada,
  sebutkan dan jangan mengarang bentuk respons.
- Tidak bisa membuka simulator/HP di sini; verifikasi dengan
  `npm run lint && npm run typecheck && npm test && npm run doctor`, dan bila perlu
  `npx expo export --platform ios --platform android` untuk memastikan bundle bisa dibuat.
