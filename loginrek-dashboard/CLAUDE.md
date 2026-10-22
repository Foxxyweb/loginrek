# CLAUDE.md — loginrek-dashboard

@AGENTS.md

## Catatan khusus Claude Code

- Sumber aturan proyek ada di `AGENTS.md` (di-import di atas). Jika ada aturan baru
  yang berlaku untuk semua agent, tulis di `AGENTS.md`, bukan di sini.
- Sebelum mengubah skema/endpoint, baca `docs/SCHEMA.md` dan `docs/API.md`.
- Setelah perubahan kode, jalankan minimal: `npm run lint && npm run typecheck`.
- Butuh database untuk menjalankan migrasi/test? Pastikan infra lokal hidup:
  `docker compose -f ../docker-compose.yml up -d postgres rustfs`.
- Jangan membaca atau menampilkan isi `.env` ke output.
