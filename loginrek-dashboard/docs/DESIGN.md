# Design — loginrek dashboard

Dashboard dipakai admin/HR di desktop (min. lebar 1280px), tetap responsif sampai tablet.
Tema terang default, tema gelap tersedia (toggle bawaan).

## Brand

- Nama: **loginrek** (huruf kecil di logo & judul).
- Warna utama: **biru kehijauan (teal)**. Logo sementara: kotak teal + centang
  (`inertia/components/logo.tsx`) — ganti dengan aset final.

## Token warna

Token didefinisikan di `inertia/css/app.css`. Mobile memakai nilai yang sama
(`loginrek-mobile/src/theme/colors.ts`).

| Token            | Light     | Dark      | Pemakaian |
| ---------------- | --------- | --------- | --------- |
| `--brand`        | `#0E7C86` | `#2BB3BD` | aksi utama, link aktif, logo |
| `--brand-dark`   | `#0A5E66` | `#1D8F98` | hover/pressed |
| `--brand-soft`   | `#E6F4F5` | `#0B2A2D` | latar badge/seleksi |
| `--btn`/`--btn-fg` | brand / putih | brand / `#04181A` | tombol primer |
| `--paper`        | `#F5F5F6` | `#08080A` | latar halaman |
| `--card`         | `#FFFFFF` | `#111114` | kartu, tabel |
| `--ink`/`--muted`| teks utama / sekunder |  | |

### Warna status kehadiran

| Status (DB)  | Label UI     | Warna     |
| ------------ | ------------ | --------- |
| `present`    | Hadir        | `#16A34A` hijau |
| `late`       | Terlambat    | `#D97706` oranye |
| `leave`      | Izin / Cuti  | `#2563EB` biru |
| `sick`       | Sakit        | `#7C3AED` ungu |
| `absent`     | Tidak hadir  | `#DC2626` merah |

Status selalu ditampilkan dengan **teks + warna** (jangan warna saja).

## Tipografi & spasi

- Font sistem (`--sans`), ukuran dasar 15px; angka di tabel pakai `font-variant-numeric: tabular-nums`.
- Radius `--r` 8px, `--r-lg` 14px. Kelipatan spasi 4px.

## Pola halaman

- **Layout aplikasi** (`inertia/layouts/app.tsx`): navigasi + konten. Menu rencana:
  Ringkasan, Kehadiran, Karyawan, Jadwal & Shift, Izin/Cuti, Lokasi Kantor, Pengaturan.
- **Tabel data**: filter di atas (tanggal, departemen, status), pagination di bawah,
  aksi baris di kolom kanan. Ekspor CSV/Excel untuk rekap.
- **Form**: label di atas field, pesan error di bawah field (dari `errors.<field>` Inertia).
- **Notifikasi**: toast (`sonner`) untuk hasil aksi; konfirmasi modal untuk aksi destruktif.
- Bahasa UI: Indonesia, format tanggal `22 Okt 2026`, jam `08:05 WIB`.

## Aksesibilitas

Kontras minimal AA, fokus terlihat (`--ring`), semua ikon tombol punya `aria-label`.
