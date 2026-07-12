import { CollectionConfig } from 'payload'

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'projectName',
  },
  // Anyone can submit a project, but only admins can review/manage submissions
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true, // Public submit form posts here
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => user?.role === 'admin',
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
      // Links to a Member (public directory profile), not an admin User
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      label: 'Submitter (Member)',
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

            // Locate or auto-create a Member record for the submitter
            let memberId = doc.member
            if (!memberId) {
              const usernameToQuery = doc.githubUsername ? doc.githubUsername.trim() : null
              const emailToQuery = doc.email ? doc.email.trim() : null

              let existingMember = null

              // 1. Try to find by GitHub username first
              if (usernameToQuery) {
                const membersRes = await req.payload.find({
                  collection: 'members',
                  where: {
                    githubUsername: {
                      equals: usernameToQuery,
                    },
                  },
                  limit: 1,
                })
                if (membersRes.docs && membersRes.docs.length > 0) {
                  existingMember = membersRes.docs[0]
                }
              }

              // 2. Fall back to email match
              if (!existingMember && emailToQuery) {
                const membersRes = await req.payload.find({
                  collection: 'members',
                  where: {
                    email: {
                      equals: emailToQuery,
                    },
                  },
                  limit: 1,
                })
                if (membersRes.docs && membersRes.docs.length > 0) {
                  existingMember = membersRes.docs[0]
                }
              }

              if (existingMember) {
                memberId = existingMember.id
                // Fill in any missing profile data
                await req.payload.update({
                  collection: 'members',
                  id: memberId,
                  data: {
                    githubUsername: existingMember.githubUsername || doc.githubUsername,
                    bio: existingMember.bio || doc.bio,
                  },
                })
              } else {
                // Create a new Member record for this developer
                const newMember = await req.payload.create({
                  collection: 'members',
                  data: {
                    githubUsername: usernameToQuery || `user-${Math.random().toString(36).slice(-4)}`,
                    email: emailToQuery || undefined,
                    fullName: doc.fullName || undefined,
                    bio: doc.bio || '',
                  },
                })
                memberId = newMember.id
              }
            }

            await req.payload.create({
              collection: 'repositories',
              data: {
                name: doc.projectName,
                url: doc.repoUrl,
                description: doc.description,
                owner: memberId,
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
