import env from '#start/env'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { S3Client, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3'

/**
 * Membuat bucket RustFS jika belum ada. Aman dijalankan berulang (idempotent).
 *
 *   node ace storage:init
 *
 * Dijalankan otomatis saat deploy (lihat .github/workflows/deploy.yml)
 * dan sekali saat setup development lokal.
 */
export default class StorageInit extends BaseCommand {
  static commandName = 'storage:init'
  static description = 'Buat bucket object storage (RustFS) bila belum ada'

  static options: CommandOptions = {
    startApp: false,
  }

  async run() {
    const bucket = env.get('S3_BUCKET')
    const client = new S3Client({
      endpoint: env.get('S3_ENDPOINT'),
      region: env.get('S3_REGION'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY'),
        secretAccessKey: env.get('S3_SECRET_KEY'),
      },
    })

    try {
      await client.send(new HeadBucketCommand({ Bucket: bucket }))
      this.logger.info(`Bucket "${bucket}" sudah ada`)
    } catch (error: any) {
      const status = error?.$metadata?.httpStatusCode
      if (status !== 404 && error?.name !== 'NotFound') {
        this.logger.error(`Tidak bisa mengecek bucket "${bucket}": ${error?.message ?? error}`)
        this.exitCode = 1
        return
      }

      await client.send(new CreateBucketCommand({ Bucket: bucket }))
      this.logger.success(`Bucket "${bucket}" dibuat`)
    } finally {
      client.destroy()
    }
  }
}
