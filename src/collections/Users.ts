import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
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
