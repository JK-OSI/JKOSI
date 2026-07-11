import { CollectionConfig } from 'payload'

export const Repositories: CollectionConfig = {
  slug: 'repositories',
  admin: {
    useAsTitle: 'name',
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
      relationTo: 'users',
      label: 'Owner / Submitter',
    },
  ],
}
