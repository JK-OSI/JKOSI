import { getPayload } from 'payload'
import config from '../../../../payload.config'
import ProjectsClient, { Project } from './ProjectsClient'
import { Suspense } from 'react'

export default async function Projects() {
  let projects: Project[] = []
  
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'repositories',
      limit: 100,
    })
    
    if (res.docs && res.docs.length > 0) {
      projects = res.docs.map((doc: any) => {
        const authorName = doc.owner && typeof doc.owner === 'object' ? doc.owner.githubUsername || 'anonymous' : 'anonymous'
        return {
          id: String(doc.id),
          name: doc.name,
          desc: doc.description || '',
          repo: doc.url,
          category: doc.category || 'Web',
          author: authorName,
          stars: doc.stars || 0,
          commits: doc.commits || 0,
          tags: doc.tags?.map((t: any) => t.tag) || [],
          authorImage: `https://github.com/${authorName.replace(/^@/, '')}.png`,
        }
      })
    }
  } catch (error) {
    console.error('Failed to load projects from database:', error)
  }

  return (
    <Suspense fallback={null}>
      <ProjectsClient initialProjects={projects} />
    </Suspense>
  )
}
