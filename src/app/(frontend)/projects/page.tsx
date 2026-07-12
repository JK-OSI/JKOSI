import ProjectsClient, { Project } from './ProjectsClient'
import { Suspense } from 'react'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

async function fetchProjects(): Promise<Project[]> {
  try {
    const ctx = getCloudflareContext()
    const db = (ctx.env as Record<string, unknown>).DB as {
      prepare(sql: string): {
        bind(...args: unknown[]): {
          all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
        }
      }
    }

    const { results } = await db.prepare(`
      SELECT r.*, m.github_username AS owner_github,
        (SELECT GROUP_CONCAT(rt.tag, ',') FROM repository_tags rt WHERE rt.repository_id = r.id) AS tags
      FROM repositories r
      LEFT JOIN members m ON r.owner_id = m.id
      ORDER BY r.stars DESC, r.created_at DESC
      LIMIT 100
    `).bind().all()

    return results.map((d: any) => ({
      id: String(d.id),
      name: d.name as string,
      desc: (d.description as string) || '',
      repo: d.url as string,
      category: (d.category as string) || 'Web',
      author: (d.owner_github as string) || 'anonymous',
      stars: (d.stars as number) || 0,
      commits: (d.commits as number) || 0,
      tags: d.tags ? ((d.tags as string).split(',').filter(Boolean)) : [],
      authorImage: `https://github.com/${((d.owner_github as string) || 'anonymous').replace(/^@/, '')}.png`,
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
