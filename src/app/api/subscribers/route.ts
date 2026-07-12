import { getDB } from '@/lib/db'
import { requireAdmin, jsonResponse, errorResponse } from '@/lib/auth'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth

  try {
    const db = getDB()
    const { results } = await db.prepare(
      'SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC'
    ).all()

    const docs = results.map((row: any) => ({
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
    }))

    return jsonResponse({ docs, total: docs.length })
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
