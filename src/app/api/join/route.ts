import { getDB, generateId, now, mapJoinApplication } from '@/lib/db'
import type { DbRow } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const db = getDB()
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100)
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const status = url.searchParams.get('status')

    let query = 'SELECT * FROM join_applications'
    const binds: unknown[] = []
    if (status) {
      query += ' WHERE status = ?'
      binds.push(status)
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    binds.push(limit, offset)

    const { results } = await db.prepare(query).bind(...binds).all()
    const docs = results.map(mapJoinApplication)

    const countResult = await db.prepare('SELECT COUNT(*) as total FROM join_applications' + (status ? ' WHERE status = ?' : '')).bind(...(status ? [status] : [])).first()

    return jsonResponse({ docs, total: (countResult?.total as number) || 0, limit, offset })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}

export async function POST(request: Request) {
  try {
    const db = getDB()
    const body = await request.json()
    const id = generateId()
    const ts = now()

    const role = body.role === 'Mentor' ? 'Mentor' : 'Volunteer'
    const fullName = body.fullName || ''
    const email = body.email || ''
    const githubUsername = body.githubUsername || null
    const skills = body.skills || null
    const bio = body.bio || null
    const location = body.location || null

    if (!fullName || !email) {
      return errorResponse('Full name and email are required.', 400)
    }

    await db.prepare(
      `INSERT INTO join_applications (id, role, full_name, email, github_username, skills, bio, location, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).bind(id, role, fullName, email, githubUsername, skills, bio, location, ts, ts).run()

    const row = await db.prepare('SELECT * FROM join_applications WHERE id = ?').bind(id).first()
    return jsonResponse(mapJoinApplication(row as DbRow), 201)
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
