import { getDB, generateId, now, mapSubmission } from '@/lib/db'
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

    let query = `
      SELECT s.*,
        (SELECT GROUP_CONCAT(st.tech, ',') FROM submission_tech_stack st WHERE st.submission_id = s.id) AS techs
      FROM submissions s
    `
    const binds: unknown[] = []
    if (status) {
      query += ' WHERE s.status = ?'
      binds.push(status)
    }
    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?'
    binds.push(limit, offset)

    const { results } = await db.prepare(query).bind(...binds).all()
    const docs = results.map(mapSubmission)

    const countResult = await db.prepare('SELECT COUNT(*) as total FROM submissions' + (status ? ' WHERE status = ?' : '')).bind(...(status ? [status] : [])).first()

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

    await db.prepare(
      `INSERT INTO submissions (id, project_name, repo_url, description, status, full_name, email, github_username, bio, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)`
    ).bind(id, body.projectName, body.repoUrl, body.description || null, body.fullName || null, body.email || null, body.githubUsername || null, body.bio || null, ts, ts).run()

    if (body.techStack?.length) {
      const stmt = db.prepare('INSERT INTO submission_tech_stack (id, submission_id, tech) VALUES (?, ?, ?)')
      for (const t of body.techStack) {
        await stmt.bind(generateId(), id, t.tech || t).run()
      }
    }

    const row = await db.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first()
    return jsonResponse(mapSubmission(row as DbRow), 201)
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
