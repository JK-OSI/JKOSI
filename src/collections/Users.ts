import type { CollectionConfig } from 'payload'

// Users = ONLY the admin team who can log into /admin
// Regular platform developers belong in the Members collection instead.
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: 'Admin accounts only. Platform developers/contributors live in the Members collection.',
  },
  access: {
    // Only admins can read the full admin user list
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      label: 'Admin Role',
      defaultValue: 'admin',
      required: true,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      options: [
        { label: '🛡️ Super Admin', value: 'admin' },
        { label: '📝 Editor', value: 'editor' },
      ],
    },
  ],
}
