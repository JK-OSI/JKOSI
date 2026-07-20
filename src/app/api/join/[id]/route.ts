import { getDB, mapJoinApplication, generateId } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'
import type { DbRow } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const { id } = await params
    const db = getDB()
    const row = await db.prepare('SELECT * FROM join_applications WHERE id = ?').bind(id).first()

    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapJoinApplication(row as DbRow))
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

    if (body.status !== undefined) {
      fields.push('status = ?')
      binds.push(body.status)
    }
    if (body.role !== undefined) {
      fields.push('role = ?')
      binds.push(body.role)
    }
    fields.push('updated_at = ?')
    binds.push(ts, id)

    await db.prepare(`UPDATE join_applications SET ${fields.join(', ')} WHERE id = ?`).bind(...binds).run()

    // If status changed to 'approved', promote application to a public member in members table
    if (body.status === 'approved') {
      const app = (await db.prepare('SELECT * FROM join_applications WHERE id = ?').bind(id).first()) as any

      if (app) {
        const githubUsername = app.github_username || app.full_name?.toLowerCase().replace(/\s+/g, '') || `user-${id.substring(0, 8)}`
        const bioText = `[${app.role.toUpperCase()}] ${app.bio || ''}`.trim()

        const existingMember = await db.prepare('SELECT id FROM members WHERE github_username = ?').bind(githubUsername).first()

        if (!existingMember) {
          const memberId = generateId()
          const locationVal = app.location || null
          await db.prepare(
            `INSERT INTO members (id, github_username, email, full_name, bio, location, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(memberId, githubUsername, app.email, app.full_name, bioText, locationVal, ts, ts).run()
        }
      }
    }

    const row = await db.prepare('SELECT * FROM join_applications WHERE id = ?').bind(id).first()
    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapJoinApplication(row as DbRow))
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
    await db.prepare('DELETE FROM join_applications WHERE id = ?').bind(id).run()
    return jsonResponse({ success: true })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
