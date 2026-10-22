import { configApp } from '@adonisjs/eslint-config'
import { react } from '@adonisjs/eslint-config/react'

export default configApp(
  // database/schema.ts dibuat otomatis oleh Lucid (schemaGeneration)
  { ignores: ['database/schema.ts'] },
  ...react
)
