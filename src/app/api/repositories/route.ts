import { getDB, generateId, now, mapRepo } from '@/lib/db'
import type { DbRow } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const db = getDB()
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 100)
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const category = url.searchParams.get('category')

    let query = `
      SELECT r.*, m.github_username AS owner_github,
        (SELECT GROUP_CONCAT(rt.tag, ',') FROM repository_tags rt WHERE rt.repository_id = r.id) AS tags
      FROM repositories r
      LEFT JOIN members m ON r.owner_id = m.id
    `
    const binds: unknown[] = []

    if (category) {
      query += ' WHERE r.category = ?'
      binds.push(category)
    }

    query += ' ORDER BY r.stars DESC, r.created_at DESC LIMIT ? OFFSET ?'
    binds.push(limit, offset)

    const { results } = await db.prepare(query).bind(...binds).all()
    const docs = results.map(mapRepo)

    const countResult = await db.prepare('SELECT COUNT(*) as total FROM repositories' + (category ? ' WHERE category = ?' : '')).bind(...(category ? [category] : [])).first()
    const total = (countResult?.total as number) || 0

    return jsonResponse({ docs, total, limit, offset })
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
      'INSERT INTO repositories (id, name, url, description, stars, commits, category, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, body.name, body.url, body.description || null, body.stars || 0, body.commits || 0, body.category || 'Web', body.owner_id || null, ts, ts).run()

    if (body.tags?.length) {
      const stmt = db.prepare('INSERT INTO repository_tags (id, repository_id, tag) VALUES (?, ?, ?)')
      for (const tag of body.tags) {
        await stmt.bind(generateId(), id, tag.tag || tag).run()
      }
    }

    const row = await db.prepare(`
      SELECT r.*, m.github_username AS owner_github,
        (SELECT GROUP_CONCAT(rt.tag, ',') FROM repository_tags rt WHERE rt.repository_id = r.id) AS tags
      FROM repositories r LEFT JOIN members m ON r.owner_id = m.id WHERE r.id = ?
    `).bind(id).first()

    return jsonResponse(mapRepo(row as DbRow), 201)
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
