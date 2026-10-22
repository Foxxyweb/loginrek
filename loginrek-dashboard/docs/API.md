# REST API — loginrek (untuk mobile)

Base URL: `https://<domain>/api/v1` (dev: `http://localhost:3333/api/v1`,
emulator Android: `http://10.0.2.2:3333/api/v1`).

## Konvensi

- Selalu kirim `Accept: application/json`; body JSON (`Content-Type: application/json`),
  kecuali upload file (`multipart/form-data`).
- Auth: `Authorization: Bearer <token>` (token dari login, prefix `lrk_`).
- Sukses: `{ "data": ... }`. Daftar ber-halaman (rencana): `{ "data": [...], "metadata": { total, perPage, currentPage, lastPage } }`.
- Error:
  ```json
  { "errors": [{ "message": "...", "field": "email", "rule": "email" }] }
  ```
  | Status | Arti |
  | ------ | ---- |
  | 401 | token tidak ada / kedaluwarsa / salah kredensial |
  | 403 | tidak berhak |
  | 404 | tidak ditemukan |
  | 422 | validasi gagal (`field` terisi) |
  | 5xx | error server |
- Field JSON pakai `camelCase`; tanggal ISO-8601.
- Versi API di path (`/api/v1`). Perubahan breaking → `/api/v2`.

## Endpoint yang tersedia

### `POST /auth/login`
```json
{ "email": "admin@loginrek.test", "password": "password123", "deviceName": "Pixel 8" }
```
Respons 200:
```json
{ "data": { "user": { "id": 1, "fullName": "...", "email": "...", "initials": "AL" },
            "token": "lrk_xxx", "expiresAt": "2026-11-21T05:00:00.000+00:00" } }
```

### `GET /auth/me` 🔒
Profil user dari token aktif.

### `POST /auth/logout` 🔒
Mencabut token yang sedang dipakai. → `{ "message": "Logged out" }`

### `GET /health` (di luar /api)
`{ "status": "ok", "database": "up" }` atau 503.

## Rencana endpoint (belum dibuat)

| Method | Path | Keterangan |
| ------ | ---- | ---------- |
| GET  | `/attendances/today` | status absensi hari ini |
| POST | `/attendances/check-in` | multipart: `photo`, `latitude`, `longitude` |
| POST | `/attendances/check-out` | multipart: `photo`, `latitude`, `longitude` |
| GET  | `/attendances?month=2026-10` | riwayat |
| GET  | `/leave-requests` / POST `/leave-requests` | pengajuan izin/cuti |
| GET  | `/me/schedule` | jadwal shift |
