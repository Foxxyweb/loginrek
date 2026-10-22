import User from '#models/user'
import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

/**
 * Login aplikasi mobile -> mengembalikan opaque access token (Bearer).
 * Akun karyawan dibuat oleh admin lewat dashboard, jadi tidak ada signup di mobile.
 */
export const mobileLoginValidator = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string(),
  deviceName: vine.string().maxLength(100).optional(),
})

export default class MobileAuthController {
  async store({ request, serialize }: HttpContext) {
    const { email, password, deviceName } = await request.validateUsing(mobileLoginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], {
      name: deviceName ?? 'mobile',
    })

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
      expiresAt: token.expiresAt,
    })
  }

  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return { message: 'Logged out' }
  }
}
