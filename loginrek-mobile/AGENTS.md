# AGENTS.md — loginrek-mobile

Panduan untuk AI coding agent (dan developer) yang bekerja di folder ini.
Baca juga: `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, dan kontrak API di
`../loginrek-dashboard/docs/API.md`.

## Apa ini

Aplikasi mobile **loginrek** untuk **karyawan**: login, absen masuk/pulang (GPS + selfie),
riwayat kehadiran, pengajuan izin/cuti. Admin/HR memakai dashboard web, bukan app ini.

## Stack

| Bagian     | Teknologi |
| ---------- | --------- |
| Framework  | **React Native 0.86 + Expo SDK 57** (Continuous Native Generation, tanpa folder `ios/`/`android/` di repo) |
| Routing    | **Expo Router** (file-based, `src/app/`) |
| Bahasa     | TypeScript strict, alias `@/*` → `src/*` |
| Token      | `expo-secure-store` (Keychain / Keystore) |
| Build      | **EAS Build** di cloud (iOS tanpa Mac) — profil di `eas.json` |
| Test       | Jest 29 + `jest-expo` + `@testing-library/react-native` |
| Lint       | `expo lint` (eslint-config-expo + Prettier) |
| ID app     | iOS `bundleIdentifier` & Android `package`: `com.loginrek`, scheme `loginrek` |

## Versi SDK: ikuti Expo Go di App Store

Expo Go di App Store (iOS) hanya mendukung **satu SDK** dan biasanya tertinggal dari rilis
terbaru (saat ini SDK 57; SDK 58 sudah rilis tapi Expo Go-nya belum). Jika project memakai SDK
yang lebih baru, Expo Go menolak dengan "Project is incompatible with this version of Expo Go".
**Jangan upgrade SDK** sebelum Expo Go di App Store mendukungnya, kecuali tim sudah beralih ke
development build. Saat upgrade: `npx expo install expo@^<sdk> && npx expo install --fix`, lalu `npm run doctor`.

## Expo cepat berubah — jangan percaya ingatan

Expo membawa breaking change di tiap SDK. Sebelum menulis kode yang memakai API Expo/EAS/RN:

1. Lihat versi major `expo` di `package.json` (saat ini **57**).
2. Buka dokumentasi versi tersebut: `https://docs.expo.dev/versions/v57.0.0/`
3. Untuk topik lain, mulai dari https://docs.expo.dev/llms.txt lalu ikuti link halaman spesifiknya.

## Perintah

```bash
npm install
npm run dev               # = expo start  -> scan QR dengan Expo Go (iPhone/Android)
npm run dev:tunnel        # bila HP & laptop beda jaringan (lihat catatan API di bawah)
npm run lint              # expo lint
npm run typecheck         # tsc --noEmit
npm test                  # jest
npm run doctor            # expo-doctor: cek versi & config

npx expo install <pkg>    # SELALU pakai ini untuk menambah library (versi cocok dengan SDK)
npx expo install --fix    # perbaiki versi yang tidak cocok
npx eas-cli@latest build --profile development|preview|production --platform ios|android
```

## Struktur

```
src/
  app/                # ROUTE saja (Expo Router). _layout.tsx = navigator.
    _layout.tsx       # root: SafeAreaProvider, Stack
    index.tsx         # layar awal (placeholder + cek koneksi API)
  components/         # komponen UI reusable (bukan route)
  config/env.ts       # base URL API (EXPO_PUBLIC_API_URL / deteksi IP Metro)
  lib/api.ts          # fetch wrapper + endpoint (authApi, ...)
  lib/token-storage.ts# simpan token di secure store
  theme/colors.ts     # token warna/spasi/radius (samakan dengan dashboard)
__tests__/            # test Jest
assets/               # ikon & splash
app.json              # konfigurasi app (nama, bundle id, plugin, permission)
eas.json              # profil EAS Build + env per profil
```

Rencana grup route: `src/app/(auth)/login.tsx`, `src/app/(app)/_layout.tsx` (tabs:
beranda, riwayat, izin, profil), `src/app/(app)/attendance/capture.tsx` (modal).

## Konvensi

1. Navigasi hanya dengan Expo Router (`Link`, `router`, `useLocalSearchParams` dari `expo-router`).
   Kode non-route tidak boleh ada di `src/app/`.
2. Semua request lewat `src/lib/api.ts`; jangan `fetch` langsung di komponen
   (pengecualian: cek `/health` di layar placeholder). Respons `{ data }`, error `{ errors: [...] }`.
3. Token **hanya** di `expo-secure-store` (`src/lib/token-storage.ts`), bukan AsyncStorage.
4. Warna/spasi dari `src/theme` — jangan hardcode hex di komponen.
5. Env publik pakai prefix `EXPO_PUBLIC_` (masuk ke bundle — **tidak boleh berisi secret**).
6. Teks UI Bahasa Indonesia; nama kode bahasa Inggris. Import pakai alias `@/...`.
7. Utamakan modul Expo (`expo-camera`, `expo-location`, `expo-image-manipulator`, ...)
   dibanding library pihak ketiga — modul Expo tersedia di Expo Go.
8. Permission (kamera, lokasi) dikonfigurasi lewat plugin di `app.json` beserta teks alasannya
   dalam Bahasa Indonesia, dan diminta tepat sebelum dipakai.

## Jangan

- Membuat/mengedit folder `ios/` atau `android/` manual — keduanya di-generate (`npx expo prebuild`)
  dan di-ignore git. Ubah perilaku native lewat `app.json` / config plugin.
- Menambah library ber-kode native yang tidak ada di Expo Go tanpa diskusi: setelah itu
  tim wajib pakai **development build** (`eas build --profile development`) dan akun Apple Developer.
- `npm install <pkg>` langsung untuk library RN/Expo (pakai `npx expo install`).
- Mengubah `bundleIdentifier`/`package` tanpa persetujuan (memutus update di store).

## Definition of done

`npm run lint && npm run typecheck && npm test` lulus, `npm run doctor` tanpa error,
dan dicoba di Expo Go (minimal satu perangkat iOS atau Android).
