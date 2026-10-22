# AGENTS.md — loginrek-dashboard

Panduan untuk AI coding agent (dan developer) yang bekerja di folder ini.
Baca juga: `docs/ARCHITECTURE.md`, `docs/SCHEMA.md`, `docs/API.md`, `docs/DESIGN.md`.

## Apa ini

Backend **dan** dashboard admin untuk **loginrek**, sistem absensi & HR internal
(satu perusahaan, ±100 pengguna bersamaan di jam puncak).

- **REST API** di `/api/v1/*` → dipakai aplikasi mobile `../loginrek-mobile` (React Native).
- **Dashboard admin** (web) → AdonisJS + Inertia + React, render dari route server.

## Stack

| Bagian        | Teknologi                                                     |
| ------------- | ------------------------------------------------------------- |
| Runtime       | Node.js **24** (wajib, lihat `engines`)                       |
| Framework     | AdonisJS 7 (`@adonisjs/core`)                                 |
| Frontend web  | Inertia 3 + React 19 + Vite, CSS token di `inertia/css/app.css` |
| Database      | PostgreSQL 17 via Lucid ORM (`pg`)                            |
| Storage       | RustFS (S3-compatible) via `@adonisjs/drive`                  |
| Auth          | guard `web` (session, dashboard) + guard `api` (access token, mobile) |
| Validasi      | VineJS (`app/validators`)                                     |
| Test          | Japa (`tests/`)                                               |

## Perintah

```bash
npm run dev              # dev server + HMR -> http://localhost:3333
npm run build            # node ace build -> ./build
npm run lint             # eslint
npm run typecheck        # tsc server + inertia
npm test                 # japa

node ace migration:run   # jalankan migrasi (juga meregenerasi database/schema.ts)
node ace db:seed         # seed dev (admin@loginrek.test / password123)
node ace storage:init    # buat bucket RustFS bila belum ada
node ace make:migration <name> | make:controller <name> | make:validator <name>
```

Infra lokal (Postgres + RustFS) dijalankan dari root repo: `docker compose up -d postgres rustfs`.

## Struktur penting

```
app/controllers/     # 1 file per resource, nama flat: <resource>_controller.ts
app/middleware/      # force_json_response_middleware dipakai grup /api
app/models/          # model Lucid, extend kelas *Schema dari database/schema.ts
app/transformers/    # bentuk output JSON/props (serialize -> { data })
app/validators/      # VineJS
commands/            # ace command custom (storage:init)
config/              # auth, database, drive, cors, shield, session, ...
database/migrations/ # sumber kebenaran skema DB
database/schema.ts   # DIBUAT OTOMATIS — jangan diedit manual
database/seeders/    # data dev
inertia/pages/       # halaman dashboard (React)
start/routes.ts      # semua route (web + /api/v1 + /health)
start/env.ts         # validasi env
```

## Konvensi

1. **Route**
   - Dashboard: grup dengan `middleware.auth()` (guard `web`), render `inertia.render(...)`.
   - API mobile: di bawah prefix `/api/v1`, wajib `middleware.forceJson()`,
     yang terproteksi pakai `middleware.auth({ guards: ['api'] })`.
   - Beri nama route (`.as(...)`), karena dipakai type-safe di frontend (Tuyau).
2. **Controller** di-referensikan lewat `controllers.<Nama>` dari `#generated/controllers`
   (dibuat otomatis oleh dev server / build). Jangan import file controller manual di routes.
3. **Respons API**: sukses `serialize(...)` → `{ "data": ... }`. Error mengikuti handler
   bawaan: `{ "errors": [{ "message", "field"?, "rule"? }] }`. Lihat `docs/API.md`.
4. **Skema DB**: ubah lewat migration baru, lalu `node ace migration:run`.
   Jangan edit migration yang sudah ter-deploy. Update `docs/SCHEMA.md` di PR yang sama.
5. **Env**: variabel baru → tambah di `start/env.ts`, `./.env.example` (dev),
   dan `../.env.example` (server). Jangan pernah commit `.env`.
6. **File/foto**: simpan via `drive.use('rustfs')`; bucket private. Untuk URL ke client
   gunakan `drive.use('rustfs_public').getSignedUrl(key, { expiresIn: '15m' })`.
   Pola key: `<domain>/<yyyy>/<mm>/<id>/<uuid>.<ext>` (mis. `attendances/2026/10/12/....jpg`).
7. **Waktu**: simpan `timestamp` dalam UTC di DB (TZ container = UTC); tampilkan dalam
   zona perusahaan (default `Asia/Jakarta`) di UI/API response bila perlu.
8. **CSRF**: aktif untuk web; route `/api/*` dikecualikan (pakai Bearer token).
9. **Bahasa**: teks UI dalam Bahasa Indonesia; nama kode (variabel, tabel, kolom) dalam bahasa Inggris, `snake_case` untuk DB.

## Jangan

- Edit `database/schema.ts`, `.adonisjs/`, `build/`, `public/assets/` (semuanya generated).
- Menyimpan foto/file di disk lokal container — selalu ke RustFS.
- Menaruh logika bisnis berat di controller — pindahkan ke `app/services/`.
- Menjalankan `migration:rollback`/`db:wipe` terhadap database produksi.
- Membuka signup publik di produksi (route signup saat ini hanya untuk dev, ada TODO di `start/routes.ts`).

## Definition of done

`npm run lint && npm run typecheck && npm test` lulus, migration + `docs/SCHEMA.md`
konsisten, endpoint baru tercatat di `docs/API.md`.

## Deploy

Push ke `main` yang mengubah folder ini → GitHub Actions build image → GHCR → VPS
(lihat `../.github/workflows/deploy.yml` dan `../README.md`). Migrasi dijalankan otomatis
saat deploy (`node ace migration:run --force`).
