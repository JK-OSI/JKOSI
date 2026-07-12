import { getDB, generateId, now } from '@/lib/db'
import { jsonResponse, errorResponse } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const db = getDB()
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse('Valid email is required', 400)
    }

    const existing = await db.prepare('SELECT id FROM subscribers WHERE email = ?').bind(email).first()
    if (existing) {
      return jsonResponse({ message: 'Already subscribed' }, 200)
    }

    await db.prepare(
      'INSERT INTO subscribers (id, email, created_at) VALUES (?, ?, ?)'
    ).bind(generateId(), email, now()).run()

    return jsonResponse({ message: 'Subscribed successfully' }, 201)
  } catch (e) {
    return errorResponse((e as Error).message, 500)
  }
}
