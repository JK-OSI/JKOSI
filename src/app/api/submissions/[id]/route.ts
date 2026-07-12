import { getDB, mapSubmission } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const { id } = await params
    const db = getDB()
    const row = await db.prepare(`
      SELECT s.*,
        (SELECT GROUP_CONCAT(st.tech, ',') FROM submission_tech_stack st WHERE st.submission_id = s.id) AS techs
      FROM submissions s WHERE s.id = ?
    `).bind(id).first()

    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapSubmission(row))
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
    const mapping: Record<string, string> = { projectName: 'project_name', repoUrl: 'repo_url', githubUsername: 'github_username', fullName: 'full_name', adminNotes: 'admin_notes' }
    for (const [key, val] of Object.entries({ projectName: body.projectName, repoUrl: body.repoUrl, description: body.description, status: body.status, fullName: body.fullName, email: body.email, githubUsername: body.githubUsername, bio: body.bio, adminNotes: body.adminNotes })) {
      if (val !== undefined) {
        fields.push(`${mapping[key] || key} = ?`)
        binds.push(val)
      }
    }
    fields.push('updated_at = ?')
    binds.push(ts, id)

    await db.prepare(`UPDATE submissions SET ${fields.join(', ')} WHERE id = ?`).bind(...binds).run()

    if (body.status === 'approved') {
      const sub = await db.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first() as any

      const lowerTags = body.techStack?.map((t: any) => (t.tech || t).toLowerCase()) || []
      let category = 'Web'
      if (lowerTags.some((t: string) => ['ai', 'ml', 'pytorch', 'tensorflow', 'nlp', 'llm'].includes(t))) category = 'AI/ML'
      else if (lowerTags.some((t: string) => ['flutter', 'mobile', 'android', 'ios', 'swift', 'kotlin'].includes(t))) category = 'Mobile'
      else if (lowerTags.some((t: string) => ['iot', 'arduino', 'esp32', 'sensor', 'firmware'].includes(t))) category = 'IoT'
      else if (lowerTags.some((t: string) => ['blockchain', 'hyperledger', 'solidity', 'web3', 'nft'].includes(t))) category = 'Blockchain'

      let memberId = sub.member_id
      if (!memberId) {
        const existing = await db.prepare('SELECT id FROM members WHERE github_username = ?').bind(sub.github_username).first()
        if (existing) {
          memberId = existing.id as string
        } else if (sub.github_username) {
          memberId = generateId()
          await db.prepare(
            'INSERT INTO members (id, github_username, email, full_name, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(memberId, sub.github_username, sub.email || null, sub.full_name || null, sub.bio || null, ts, ts).run()
        }
      }

      if (memberId) {
        const repoId = generateId()
        await db.prepare(
          'INSERT INTO repositories (id, name, url, description, stars, commits, category, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, 0, 0, ?, ?, ?, ?)'
        ).bind(repoId, sub.project_name, sub.repo_url, sub.description, category, memberId, ts, ts).run()
      }
    }

    const row = await db.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first()
    if (!row) return errorResponse('Not found', 404)
    return jsonResponse(mapSubmission(row))
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
    await db.prepare('DELETE FROM submissions WHERE id = ?').bind(id).run()
    return jsonResponse({ success: true })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}

function generateId(): string {
  return crypto.randomUUID()
}
