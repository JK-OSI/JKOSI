import { getDB } from '@/lib/db'
import { createJWT, verifyPassword, jsonResponse, errorResponse } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return errorResponse('Email and password required')

    const db = getDB()
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    if (!user) return errorResponse('Invalid credentials', 401)

    const valid = await verifyPassword(password, user.password_hash as string)
    if (!valid) return errorResponse('Invalid credentials', 401)

    const token = await createJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return jsonResponse({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (e) {
    return errorResponse('Login failed: ' + (e as Error).message, 500)
  }
}
