import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Skip Stripe webhook: raw body + signature must reach the route unchanged; no auth cookies needed
    '/((?!_next/static|_next/image|favicon.ico|api/webhook/stripe|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
