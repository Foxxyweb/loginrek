import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

/**
 * Seeder data awal untuk DEVELOPMENT.
 *   node ace db:seed
 *
 * Akun admin dev: admin@loginrek.test / password123
 * Tidak berjalan di production.
 */
export default class MainSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    if (app.inProduction) return

    await User.updateOrCreate(
      { email: 'admin@loginrek.test' },
      { fullName: 'Admin Loginrek', password: 'password123' }
    )
  }
}
