import { getDB, generateId, now, mapMember } from '@/lib/db'
import type { DbRow } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const db = getDB()
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 100)
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const { results } = await db.prepare('SELECT * FROM members ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(limit, offset).all()
    const docs = results.map(mapMember)

    const countResult = await db.prepare('SELECT COUNT(*) as total FROM members').first()

    return jsonResponse({ docs, total: (countResult?.total as number) || 0, limit, offset })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const db = getDB()
    const body = await request.json()
    const id = generateId()
    const ts = now()

    await db.prepare(
      'INSERT INTO members (id, github_username, email, full_name, avatar_url, bio, website_url, location, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, body.githubUsername, body.email || null, body.fullName || null, body.avatarUrl || null, body.bio || null, body.websiteUrl || null, body.location || null, ts, ts).run()

    const row = await db.prepare('SELECT * FROM members WHERE id = ?').bind(id).first() as DbRow
    return jsonResponse(mapMember(row), 201)
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
