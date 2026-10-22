/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| - Dashboard web (Inertia + session guard `web`)
| - REST API untuk mobile di /api/v1 (token guard `api`)
| - /health untuk healthcheck
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/health', [controllers.Health, 'show']).as('health')

/*
|--------------------------------------------------------------------------
| Dashboard (web)
|--------------------------------------------------------------------------
*/
router.on('/').redirect('dashboard').as('home')

router
  .group(() => {
    // TODO: tutup signup publik sebelum produksi — akun dibuat oleh admin.
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| REST API untuk aplikasi mobile
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('auth/login', [controllers.MobileAuth, 'store']).as('auth.login')

    router
      .group(() => {
        router.get('auth/me', [controllers.MobileAuth, 'show']).as('auth.me')
        router.post('auth/logout', [controllers.MobileAuth, 'destroy']).as('auth.logout')
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/v1')
  .as('api.v1')
  .use(middleware.forceJson())
