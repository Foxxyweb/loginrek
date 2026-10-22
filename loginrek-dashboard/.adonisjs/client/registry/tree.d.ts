/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  health: typeof routes['health']
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  api: {
    v1: {
      auth: {
        login: typeof routes['api.v1.auth.login']
        me: typeof routes['api.v1.auth.me']
        logout: typeof routes['api.v1.auth.logout']
      }
    }
  }
}
