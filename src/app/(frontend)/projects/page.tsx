import ProjectsClient, { Project } from './ProjectsClient'
import { Suspense } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || ''

async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/api/repositories?limit=100`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.docs || []).map((d: any) => ({
      id: String(d.id),
      name: d.name,
      desc: d.description || '',
      repo: d.url,
      category: d.category || 'Web',
      author: d.owner?.githubUsername || 'anonymous',
      stars: d.stars || 0,
      commits: d.commits || 0,
      tags: d.tags?.map((t: any) => t.tag) || [],
      authorImage: `https://github.com/${(d.owner?.githubUsername || 'anonymous').replace(/^@/, '')}.png`,
    }))
  } catch {
    return []
  }
}

export default async function Projects() {
  const projects = await fetchProjects()

  return (
    <Suspense fallback={null}>
      <ProjectsClient initialProjects={projects} />
    </Suspense>
  )
}
