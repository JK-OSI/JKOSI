import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'
import { Repositories } from './src/collections/Repositories'
import { Submissions } from './src/collections/Submissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Repositories, Submissions],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'ab6a1f695e4c043a3jkosiplatformsecretkey',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Automatically create / sync all collection tables on startup.
    // Safe for production: it only creates missing tables, never drops existing data.
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URL || (
        process.env.DB_HOST
          ? `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'jkosi'}`
          : 'postgres://postgres:postgres@127.0.0.1:5432/jkosi'
      ),
    },
  }),
})
