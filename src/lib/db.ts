import { getCloudflareContext } from '@opennextjs/cloudflare'

export type DbRow = Record<string, unknown>

interface D1Result {
  results: DbRow[]
}

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement
  all<T = DbRow>(): Promise<{ results: T[] }>
  first<T = DbRow>(): Promise<T | null>
  run(): Promise<unknown>
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement
}

export function getDB(): D1Database {
  const ctx = getCloudflareContext()
  const db = (ctx.env as Record<string, unknown>).DB as D1Database | undefined
  if (!db) {
    throw new Error(
      'D1 database binding "DB" is not configured. Make sure wrangler.jsonc has a d1_databases entry ' +
      'with binding "DB" pointing to your jkosi-db database, and that you\'ve run `npx wrangler d1 create jkosi-db`.'
    )
  }
  return db
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function now(): string {
  return new Date().toISOString()
}

export function mapRepo(row: DbRow) {
  return {
    id: row.id as string,
    name: row.name as string,
    url: row.url as string,
    description: row.description as string | null,
    stars: (row.stars as number) || 0,
    commits: (row.commits as number) || 0,
    category: (row.category as string) || 'Web',
    owner: row.owner_id ? { id: row.owner_id as string, githubUsername: row.owner_github as string } : null,
    tags: row.tags ? ((row.tags as string).split(',').filter(Boolean).map((t: string) => ({ tag: t }))) : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapMember(row: DbRow) {
  return {
    id: row.id as string,
    githubUsername: row.github_username as string,
    email: row.email as string | null,
    fullName: row.full_name as string | null,
    avatarUrl: row.avatar_url as string | null,
    bio: row.bio as string | null,
    websiteUrl: row.website_url as string | null,
    location: row.location as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapSubmission(row: DbRow) {
  return {
    id: row.id as string,
    projectName: row.project_name as string,
    repoUrl: row.repo_url as string,
    description: row.description as string | null,
    status: (row.status as string) || 'pending',
    member: row.member_id ? { id: row.member_id as string } : null,
    fullName: row.full_name as string | null,
    email: row.email as string | null,
    githubUsername: row.github_username as string | null,
    bio: row.bio as string | null,
    adminNotes: row.admin_notes as string | null,
    techStack: row.techs ? ((row.techs as string).split(',').filter(Boolean).map((t: string) => ({ tech: t }))) : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
