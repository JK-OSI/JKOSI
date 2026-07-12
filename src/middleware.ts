import { NextRequest, NextResponse } from 'next/server'

/**
 * Admin Route Protection Middleware
 *
 * Blocks public access to /admin by checking the requester's IP
 * against an allowlist defined in ADMIN_ALLOWED_IPS env variable.
 *
 * How to configure:
 *   In your .env file, add:
 *   ADMIN_ALLOWED_IPS=your.home.ip,your.office.ip
 *
 * To find your IP:  https://ifconfig.me
 * Leave ADMIN_ALLOWED_IPS empty or unset to allow all IPs (open, not recommended for production)
 */

const ALLOWED_IPS_RAW = process.env.ADMIN_ALLOWED_IPS || ''

// Parse comma-separated IPs, trim whitespace
const ALLOWED_IPS: string[] = ALLOWED_IPS_RAW
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean)

function getClientIP(req: NextRequest): string {
  // Handles proxies, Nginx, Traefik, Cloudflare, AWS ELB
  return (
    req.headers.get('cf-connecting-ip') ||       // Cloudflare
    req.headers.get('x-real-ip') ||              // Nginx
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || // Proxies
    '127.0.0.1'
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // If no IPs are configured, allow all (development mode / not yet set up)
  if (ALLOWED_IPS.length === 0) {
    return NextResponse.next()
  }

  const clientIP = getClientIP(req)

  if (ALLOWED_IPS.includes(clientIP)) {
    // IP is on the allowlist — let them through
    return NextResponse.next()
  }

  // Not on allowlist — show a 404 page so attackers don't even know /admin exists
  return NextResponse.rewrite(new URL('/not-found', req.url), { status: 404 })
}

export const config = {
  matcher: ['/admin/:path*'],
}
