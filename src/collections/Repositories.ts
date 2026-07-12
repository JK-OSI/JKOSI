import { CollectionConfig } from 'payload'

export const Repositories: CollectionConfig = {
  slug: 'repositories',
  admin: {
    useAsTitle: 'name',
  },
  // Public can read approved repositories, but only admins can modify
  access: {
    read: () => true, // Public directory is fully readable
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Project Name',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'GitHub Repository URL',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'stars',
      type: 'number',
      defaultValue: 0,
      label: 'Stars',
    },
    {
      name: 'commits',
      type: 'number',
      defaultValue: 0,
      label: 'Weekly Commits',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Web', value: 'Web' },
        { label: 'Mobile', value: 'Mobile' },
        { label: 'AI/ML', value: 'AI/ML' },
        { label: 'IoT', value: 'IoT' },
        { label: 'Blockchain', value: 'Blockchain' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Technology Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'members',
      label: 'Owner / Submitter',
    },
  ],
}
