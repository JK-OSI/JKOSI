import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },

  // ─── Access Control ──────────────────────────────────────────────────────────
  // Only users with the 'admin' role can read/update/delete other user records.
  // Regular 'developer' users can only read/update their own profile.
  access: {
    // Only admins can see the full user list in the admin panel
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Developers can only read their own record
      return {
        id: { equals: user.id },
      }
    },
    // Only admins can create new users directly from the admin panel
    create: ({ req: { user } }) => user?.role === 'admin',
    // Admins can update anyone; developers can only update themselves
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: { equals: user.id },
      }
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => user?.role === 'admin',
    // Only admins can access this collection in the Payload admin panel
    admin: ({ req: { user } }) => user?.role === 'admin',
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'developer',
      required: true,
      // Only admins can change a user's role
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      options: [
        { label: '🛡️ Admin', value: 'admin' },
        { label: '👨‍💻 Developer', value: 'developer' },
      ],
    },
    {
      name: 'githubUsername',
      type: 'text',
      label: 'GitHub Username',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'Avatar URL',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biography / About',
    },
  ],
}
