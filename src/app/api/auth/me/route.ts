import { verifyJWT, jsonResponse, errorResponse } from '@/lib/auth'
import { getDB } from '@/lib/db'

export async function GET(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return errorResponse('Unauthorized', 401)

  const payload = await verifyJWT(auth.slice(7))
  if (!payload) return errorResponse('Invalid token', 401)

  const db = getDB()
  const user = await db.prepare('SELECT id, email, role FROM users WHERE id = ?').bind(payload.sub as string).first()
  if (!user) return errorResponse('User not found', 404)

  return jsonResponse({ user })
}
