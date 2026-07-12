import { getCloudflareContext } from '@opennextjs/cloudflare'

function base64UrlEncode(data: string): string {
  return btoa(data).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

async function getSecret(): Promise<CryptoKey> {
  const ctx = getCloudflareContext()
  const secret = ((ctx.env as Record<string, string>).JWT_SECRET) || 'jkosi-default-secret-change-me'
  const encoder = new TextEncoder()
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function createJWT(payload: Record<string, unknown>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + 604800 }

  const data = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(body))}`
  const key = await getSecret()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sigStr = base64UrlEncode(String.fromCharCode(...new Uint8Array(sig)))
  return `${data}.${sigStr}`
}

export async function verifyJWT(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const key = await getSecret()
    const data = `${parts[0]}.${parts[1]}`
    const sig = Uint8Array.from(base64UrlDecode(parts[2]), c => c.charCodeAt(0))

    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data))
    if (!valid) return null

    const body = JSON.parse(base64UrlDecode(parts[1]))
    if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null

    return body
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)

  const toHex = (b: Uint8Array) => Array.from(b).map(n => n.toString(16).padStart(2, '0')).join('')
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false

  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)

  const computedHash = Array.from(new Uint8Array(bits)).map(n => n.toString(16).padStart(2, '0')).join('')
  return computedHash === hashHex
}

export async function requireAdmin(request: Request): Promise<{ id: string; email: string; role: string } | Response> {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  const payload = await verifyJWT(auth.slice(7))
  if (!payload || payload.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  return { id: payload.sub as string, email: payload.email as string, role: payload.role as string }
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status)
}
