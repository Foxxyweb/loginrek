import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

/**
 * Object storage memakai RustFS (S3-compatible).
 *
 * - `rustfs`         : dipakai untuk upload/download dari server (endpoint internal,
 *                      mis. http://rustfs:9000 di dalam jaringan Docker).
 * - `rustfs_public`  : bucket yang sama, tapi memakai endpoint publik. Hanya dipakai
 *                      untuk membuat signed URL yang dibuka browser / aplikasi mobile.
 *                      Membuat signed URL tidak melakukan request jaringan.
 *
 * Bucket bersifat private: file (mis. foto absensi) diakses lewat signed URL.
 */
const shared = {
  credentials: {
    accessKeyId: env.get('S3_ACCESS_KEY'),
    secretAccessKey: env.get('S3_SECRET_KEY'),
  },
  region: env.get('S3_REGION'),
  bucket: env.get('S3_BUCKET'),
  forcePathStyle: true,
  visibility: 'private' as const,
}

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  services: {
    rustfs: services.s3({
      ...shared,
      endpoint: env.get('S3_ENDPOINT'),
    }),

    rustfs_public: services.s3({
      ...shared,
      endpoint: env.get('S3_PUBLIC_ENDPOINT', env.get('S3_ENDPOINT')),
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
