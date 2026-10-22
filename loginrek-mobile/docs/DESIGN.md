# Design — loginrek mobile

Aplikasi untuk karyawan: cepat dibuka, satu tujuan utama (absen), bisa dipakai satu tangan.

## Brand

- Nama **loginrek**, warna utama **biru kehijauan (teal)**, logo simpel.
- Token warna: `src/theme/colors.ts` (sama dengan dashboard, lihat
  `../loginrek-dashboard/docs/DESIGN.md`).
- Ikon & splash: `assets/` (masih bawaan template — ganti dengan aset final).
  Warna latar splash & adaptive icon Android: `#0E7C86` (diatur di `app.json`).

| Token | Nilai | Pemakaian |
| ----- | ----- | --------- |
| `primary` | `#0E7C86` | tombol utama, header, ikon aktif |
| `primaryDark` | `#0A5E66` | pressed state |
| `primaryLight` | `#E6F4F5` | latar kartu status |
| `accent` | `#14B8A6` | highlight sekunder |
| `background` | `#F7FAFA` | latar layar |
| `surface` | `#FFFFFF` | kartu |
| `text` / `textMuted` | `#0F1F24` / `#5B6B70` | teks |
| `success` / `warning` / `danger` | `#16A34A` / `#D97706` / `#DC2626` | hadir / terlambat / gagal |

Spasi: `xs 4, sm 8, md 12, lg 16, xl 24, xxl 32`. Radius: `sm 6, md 10, lg 16, full`.

## Prinsip UI

- **Tombol absen** besar di area jempol (bawah layar), tinggi minimal 56, label jelas
  ("Absen Masuk" / "Absen Pulang") + jam saat ini.
- Kartu status hari ini di atas: jam masuk, jam pulang, status (teks + warna).
- Feedback langsung setelah absen: layar sukses dengan jam & lokasi kantor, atau pesan
  error yang menjelaskan tindakan (mis. "Kamu di luar radius kantor (230 m)").
- Target sentuh ≥ 44×44, font dasar 16, dukung font scaling sistem.
- Hormati safe area (notch / Dynamic Island iPhone) lewat `react-native-safe-area-context`.
- Bahasa Indonesia, format `Kamis, 22 Okt 2026` dan `08:05 WIB`.
- Mode gelap: rencana setelah MVP (`userInterfaceStyle` saat ini `light`).

## Navigasi (rencana)

Bottom tabs: **Beranda**, **Riwayat**, **Izin**, **Profil**. Layar absen kamera dibuka
sebagai modal full-screen dari Beranda.
