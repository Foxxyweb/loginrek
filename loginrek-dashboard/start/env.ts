/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| Semua env divalidasi saat boot. Tambah variabel baru di sini DAN di
| .env.example (dashboard) serta /.env.example (root, untuk server).
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  TZ: Env.schema.string.optional(),

  // App
  APP_NAME: Env.schema.string.optional(),
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // CORS (production) — daftar origin dipisah koma, kosong = tidak ada cross-origin browser
  CORS_ORIGINS: Env.schema.string.optional(),

  // Database (PostgreSQL)
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  // Object storage (RustFS, S3-compatible)
  DRIVE_DISK: Env.schema.enum(['rustfs', 'rustfs_public'] as const),
  S3_ENDPOINT: Env.schema.string({ format: 'url', tld: false }),
  S3_PUBLIC_ENDPOINT: Env.schema.string.optional({ format: 'url', tld: false }),
  S3_ACCESS_KEY: Env.schema.string(),
  S3_SECRET_KEY: Env.schema.string(),
  S3_REGION: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),
})
