import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'
import { Members } from './src/collections/Members'
import { Repositories } from './src/collections/Repositories'
import { Submissions } from './src/collections/Submissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// All database config comes from separate environment variables.
// Set these in your .env file — no hardcoded fallbacks in production.
const {
  DB_HOST,
  DB_PORT = '5432',
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  PAYLOAD_SECRET,
} = process.env

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.warn(
    '[JKOSI] Warning: One or more database environment variables are missing (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME). ' +
    'The app may fail to connect to the database. Please check your .env file.'
  )
}

const connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Members, Repositories, Submissions],
  editor: lexicalEditor({}),
  secret: PAYLOAD_SECRET || (() => { throw new Error('[JKOSI] PAYLOAD_SECRET env variable is not set.') })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Automatically create / sync all collection tables on startup.
    // Safe for production: only creates missing tables, never drops existing data.
    push: true,
    pool: {
      connectionString,
    },
  }),
})
