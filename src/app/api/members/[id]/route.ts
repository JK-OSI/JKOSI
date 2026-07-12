import { getDB, mapMember } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDB()
    const row = await db.prepare('SELECT * FROM members WHERE id = ?').bind(id).first()
    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapMember(row))
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

    const fields: string[] = []
    const binds: unknown[] = []
    const mapping: Record<string, string> = { githubUsername: 'github_username', fullName: 'full_name', avatarUrl: 'avatar_url', websiteUrl: 'website_url' }
    for (const [key, val] of Object.entries({ githubUsername: body.githubUsername, email: body.email, fullName: body.fullName, avatarUrl: body.avatar_url, bio: body.bio, websiteUrl: body.websiteUrl, location: body.location })) {
      if (val !== undefined) {
        fields.push(`${mapping[key] || key} = ?`)
        binds.push(val)
      }
    }
    fields.push('updated_at = ?')
    binds.push(new Date().toISOString(), id)

    await db.prepare(`UPDATE members SET ${fields.join(', ')} WHERE id = ?`).bind(...binds).run()
    const row = await db.prepare('SELECT * FROM members WHERE id = ?').bind(id).first()
    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapMember(row))
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
    await db.prepare('DELETE FROM members WHERE id = ?').bind(id).run()
    return jsonResponse({ success: true })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
