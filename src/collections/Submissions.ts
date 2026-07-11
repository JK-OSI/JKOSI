import { CollectionConfig } from 'payload'

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'projectName',
  },
  fields: [
    {
      name: 'projectName',
      type: 'text',
      required: true,
      label: 'Project Name',
    },
    {
      name: 'repoUrl',
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
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      label: 'Submission Status',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Submitter',
    },
    {
      name: 'fullName',
      type: 'text',
      label: 'Lead Developer Name',
    },
    {
      name: 'email',
      type: 'text',
      label: 'Contact Email',
    },
    {
      name: 'githubUsername',
      type: 'text',
      label: 'Lead Developer GitHub Username',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Lead Developer Bio',
    },
    {
      name: 'techStack',
      type: 'array',
      label: 'Technology Stack',
      fields: [
        {
          name: 'tech',
          type: 'text',
        },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Moderation Notes',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Automatically transfer to Repositories collection when approved
        if (doc.status === 'approved' && previousDoc?.status !== 'approved') {
          try {
            const techTags = (doc.techStack || []).map((t: any) => ({ tag: t.tech }))

            // Infer category from tech tags
            const lowerTags = (doc.techStack || []).map((t: any) => t.tech?.toLowerCase())
            let category = 'Web'
            if (lowerTags.some((t: string) => ['ai', 'ml', 'pytorch', 'tensorflow', 'nlp', 'llm'].includes(t))) category = 'AI/ML'
            else if (lowerTags.some((t: string) => ['flutter', 'mobile', 'android', 'ios', 'swift', 'kotlin'].includes(t))) category = 'Mobile'
            else if (lowerTags.some((t: string) => ['iot', 'arduino', 'esp32', 'sensor', 'firmware'].includes(t))) category = 'IoT'
            else if (lowerTags.some((t: string) => ['blockchain', 'hyperledger', 'solidity', 'web3', 'nft'].includes(t))) category = 'Blockchain'

            // Locate or auto-create User record for owner
            let ownerId = doc.user
            if (!ownerId) {
              const usernameToQuery = doc.githubUsername ? doc.githubUsername.trim() : null
              const emailToQuery = doc.email ? doc.email.trim() : null

              let existingUser = null

              if (usernameToQuery) {
                const usersRes = await req.payload.find({
                  collection: 'users',
                  where: {
                    githubUsername: {
                      equals: usernameToQuery,
                    },
                  },
                  limit: 1,
                })
                if (usersRes.docs && usersRes.docs.length > 0) {
                  existingUser = usersRes.docs[0]
                }
              }

              if (!existingUser && emailToQuery) {
                const usersRes = await req.payload.find({
                  collection: 'users',
                  where: {
                    email: {
                      equals: emailToQuery,
                    },
                  },
                  limit: 1,
                })
                if (usersRes.docs && usersRes.docs.length > 0) {
                  existingUser = usersRes.docs[0]
                }
              }

              if (existingUser) {
                ownerId = existingUser.id
                // Update bio and username if not set in database
                await req.payload.update({
                  collection: 'users',
                  id: ownerId,
                  data: {
                    githubUsername: existingUser.githubUsername || doc.githubUsername,
                    bio: existingUser.bio || doc.bio,
                  },
                })
              } else {
                // Create a new user record
                const newUser = await req.payload.create({
                  collection: 'users',
                  data: {
                    email: emailToQuery || `${usernameToQuery || 'user-' + Math.random().toString(36).slice(-4)}@jkosi.org`,
                    githubUsername: doc.githubUsername || 'anonymous',
                    bio: doc.bio || '',
                    password: Math.random().toString(36).slice(-10) + 'A1!',
                  },
                })
                ownerId = newUser.id
              }
            }

            await req.payload.create({
              collection: 'repositories',
              data: {
                name: doc.projectName,
                url: doc.repoUrl,
                description: doc.description,
                owner: ownerId,
                stars: 0,
                commits: 0,
                category,
                tags: techTags,
              },
            })
          } catch (error) {
            console.error('Failed to create repository from approved submission:', error)
          }
        }
      },
    ],
  },
}
