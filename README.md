# loginrek

Sistem absensi & HR internal. Monorepo berisi dua aplikasi:

| Folder | Isi | Stack |
| ------ | --- | ----- |
| `loginrek-dashboard/` | REST API (`/api/v1`) + dashboard admin web | AdonisJS 7 + Inertia + React, PostgreSQL, RustFS |
| `loginrek-mobile/` | Aplikasi karyawan (iOS & Android) | React Native 0.86 + Expo SDK 57 (Expo Router, EAS Build) |

Infrastruktur: Docker Compose (`docker-compose.yml`), Nginx di host sebagai reverse proxy,
image disimpan di GHCR, deploy lewat GitHub Actions.

```
.
├── .github/workflows/deploy.yml   # CI/CD dashboard -> GHCR -> VPS
├── deploy/nginx/loginrek.conf     # contoh server block Nginx host
├── loginrek-dashboard/            # AdonisJS (lihat AGENTS.md & docs/)
├── loginrek-mobile/               # Expo / React Native (lihat AGENTS.md & docs/)
├── docker-compose.yml             # dashboard + postgres + rustfs
├── .env.example                   # env server (dikirim ke VPS)
└── .gitignore
```

## Prasyarat developer

- Node.js **24** (dashboard mewajibkan ≥ 24)
- Docker + Docker Compose v2.24+
- Mobile: aplikasi **Expo Go** di HP (App Store / Play Store). Tidak perlu Mac, Xcode, atau
  Android Studio untuk development. Emulator Android opsional.

## Menjalankan di lokal

```bash
# 1) Infra: PostgreSQL (127.0.0.1:5432) + RustFS (API :9000, console :9001)
docker compose up -d postgres rustfs

# 2) Dashboard / API
cd loginrek-dashboard
cp .env.example .env
npm install
node ace generate:key
node ace migration:run
node ace storage:init          # buat bucket "loginrek"
node ace db:seed               # admin@loginrek.test / password123
npm run dev                    # http://localhost:3333

# 3) Mobile (terminal lain)
cd loginrek-mobile
npm install
npm run dev                    # expo start -> muncul QR code
```

### Menjalankan mobile di iPhone / Android (Expo Go)

1. Install **Expo Go** di HP.
2. Pastikan HP dan laptop terhubung ke **Wi-Fi yang sama**, dan dashboard berjalan
   (`npm run dev` di `loginrek-dashboard`, sudah bind `HOST=0.0.0.0`).
3. `npm run dev` di `loginrek-mobile`, lalu:
   - **iPhone**: scan QR dengan aplikasi **Kamera** → buka di Expo Go.
   - **Android**: scan QR dari dalam aplikasi Expo Go.
4. Di layar awal, tekan **Cek koneksi API** → harus muncul "API terhubung ✓".
   App otomatis memakai IP laptop (`http://<IP-laptop>:3333/api/v1`).

Kalau tidak terhubung:
- Izinkan port **3333** dan **8081** di firewall laptop (Windows: izinkan Node.js di jaringan *Private*).
- Wi-Fi kantor/publik sering memblokir antar-perangkat (*client isolation*) → pakai hotspot HP,
  atau `npm run dev:tunnel` + set `EXPO_PUBLIC_API_URL` di `loginrek-mobile/.env.local` ke URL
  tunnel API (mis. hasil `cloudflared tunnel --url http://localhost:3333`) + `/api/v1`.
- iPhone: saat pertama dibuka, izinkan Expo Go mengakses **Local Network**
  (Settings → Privacy & Security → Local Network → Expo Go).

Build aplikasi mandiri (bukan Expo Go) dilakukan di cloud dengan EAS Build — lihat
`loginrek-mobile/docs/ARCHITECTURE.md`. Rilis iOS membutuhkan akun Apple Developer.

Console RustFS lokal: http://localhost:9001 (login `loginrek` / `loginrek-secret`).

## Alur deploy

```
push ke main (loginrek-dashboard/**, docker-compose.yml, .env.example)
  └─ check   : npm ci, lint, typecheck
  └─ build   : docker build -> ghcr.io/<owner>/loginrek-dashboard:{sha-xxxxxxx, latest}
  └─ package : artifact "deploy-bundle" = docker-compose.yml + .env.example
  └─ deploy  : SCP bundle -> VPS_DEPLOY_PATH
               docker login ghcr.io -> compose pull -> up postgres rustfs
               -> ace migration:run --force -> ace storage:init -> up dashboard --wait
```

`.env` di VPS **tidak pernah ditimpa**; workflow hanya memperbarui baris `IMAGE_TAG` dan
`GHCR_OWNER`. Rollback: ubah `IMAGE_TAG=sha-<lama>` di `.env` lalu `docker compose up -d dashboard`.

## GitHub Secrets

Settings → Secrets and variables → Actions → **New repository secret**
(atau taruh di environment `production`, yang dipakai job deploy).

| Secret | Wajib | Isi |
| ------ | :---: | --- |
| `VPS_HOST` | ✅ | IP / hostname VPS |
| `VPS_USER` | ✅ | user SSH untuk deploy (disarankan user khusus, anggota grup `docker`) |
| `VPS_SSH_KEY` | ✅ | **private key** OpenSSH lengkap (`-----BEGIN OPENSSH PRIVATE KEY----- ...`); public key-nya ada di `~/.ssh/authorized_keys` user tsb |
| `GHCR_USERNAME` | ✅ | username GitHub pemilik token di bawah |
| `GHCR_TOKEN` | ✅ | Personal Access Token **(classic)** scope `read:packages` — dipakai VPS untuk `docker pull` image private |
| `VPS_PORT` | ⬜ | port SSH (default `22`) |
| `VPS_DEPLOY_PATH` | ⬜ | folder deploy di VPS (default `/opt/loginrek`) |

Tidak perlu dibuat: `GITHUB_TOKEN` (otomatis, dipakai untuk push image ke GHCR —
job build sudah meminta izin `packages: write`).

Nilai aplikasi (APP_KEY, password DB, kunci RustFS) **tidak** disimpan di GitHub;
semuanya ada di `.env` di VPS.

## Setup VPS (sekali)

```bash
# user deploy
sudo adduser --disabled-password deploy && sudo usermod -aG docker deploy
sudo mkdir -p /opt/loginrek && sudo chown deploy:deploy /opt/loginrek
# tempel public key ke /home/deploy/.ssh/authorized_keys

# env server
cd /opt/loginrek
# (jalankan workflow sekali -> .env.example terkirim & .env dibuat, workflow berhenti)
nano .env      # isi semua CHANGE_ME, sesuaikan port & domain
               # APP_KEY: openssl rand -base64 32 | password: openssl rand -hex 24

# Nginx + HTTPS
sudo cp loginrek.conf /etc/nginx/sites-available/   # dari deploy/nginx/loginrek.conf
sudo ln -s /etc/nginx/sites-available/loginrek.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d loginrek.example.com -d storage.loginrek.example.com
```

DNS: arahkan `loginrek.<domain>` dan `storage.<domain>` ke IP VPS.
Lalu jalankan ulang workflow (Actions → Deploy → Run workflow).

Port host default (bind `127.0.0.1`): dashboard `3050`, Postgres `5434`,
RustFS API `9100`, console `9101` — ubah di `.env` bila bentrok dengan project lain.

## Dokumentasi

- Dashboard: `loginrek-dashboard/AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/SCHEMA.md`, `docs/API.md`, `docs/DESIGN.md`
- Mobile: `loginrek-mobile/AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `eas.json`
