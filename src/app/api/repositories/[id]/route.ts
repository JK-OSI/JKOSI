import { getDB, mapRepo } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDB()
    const row = await db.prepare(`
      SELECT r.*, m.github_username AS owner_github,
        (SELECT GROUP_CONCAT(rt.tag, ',') FROM repository_tags rt WHERE rt.repository_id = r.id) AS tags
      FROM repositories r LEFT JOIN members m ON r.owner_id = m.id WHERE r.id = ?
    `).bind(id).first()

    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapRepo(row))
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const { id } = await params
    const db = getDB()
    const body = await request.json()
    const ts = new Date().toISOString()

    const fields: string[] = []
    const binds: unknown[] = []
    for (const [key, val] of Object.entries({ name: body.name, url: body.url, description: body.description, stars: body.stars, commits: body.commits, category: body.category, owner_id: body.owner_id })) {
      if (val !== undefined) {
        const col = key === 'owner_id' ? 'owner_id' : key
        fields.push(`${col} = ?`)
        binds.push(val)
      }
    }
    fields.push('updated_at = ?')
    binds.push(ts, id)

    await db.prepare(`UPDATE repositories SET ${fields.join(', ')} WHERE id = ?`).bind(...binds).run()

    if (body.tags !== undefined) {
      await db.prepare('DELETE FROM repository_tags WHERE repository_id = ?').bind(id).run()
      if (body.tags?.length) {
        const stmt = db.prepare('INSERT INTO repository_tags (id, repository_id, tag) VALUES (?, ?, ?)')
        for (const tag of body.tags) {
          await stmt.bind(crypto.randomUUID(), id, tag.tag || tag).run()
        }
      }
    }

    const row = await db.prepare(`
      SELECT r.*, m.github_username AS owner_github,
        (SELECT GROUP_CONCAT(rt.tag, ',') FROM repository_tags rt WHERE rt.repository_id = r.id) AS tags
      FROM repositories r LEFT JOIN members m ON r.owner_id = m.id WHERE r.id = ?
    `).bind(id).first()

    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapRepo(row))
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const { id } = await params
    const db = getDB()
    await db.prepare('DELETE FROM repositories WHERE id = ?').bind(id).run()
    return jsonResponse({ success: true })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
