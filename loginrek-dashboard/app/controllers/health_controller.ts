import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Dipakai healthcheck Docker, Nginx, dan langkah verifikasi di GitHub Actions.
 */
export default class HealthController {
  async show({ response }: HttpContext) {
    try {
      await db.rawQuery('select 1')
      return response.ok({ status: 'ok', database: 'up' })
    } catch {
      return response.serviceUnavailable({ status: 'error', database: 'down' })
    }
  }
}
