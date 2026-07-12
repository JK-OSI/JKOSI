import type { CollectionConfig } from 'payload'

// Members = Public-facing developer/contributor profiles shown in the JKOSI directory.
// These are NOT admin users and cannot log into /admin.
export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'githubUsername',
    description: 'Open-source developers and contributors listed in the JKOSI directory.',
    defaultColumns: ['githubUsername', 'email', 'bio', 'createdAt'],
  },
  // Fully public read — the directory is open source after all
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'githubUsername',
      type: 'text',
      required: true,
      label: 'GitHub Username',
      unique: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
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
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Personal Website',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
    },
  ],
}
