// ─────────────────────────────────────────────
// CHEMIN : src/middleware.ts
// Protection des routes admin
// ─────────────────────────────────────────────
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Laisser passer la page login
  if (pathname === '/admin/login') return NextResponse.next()

  // Protéger les routes admin
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll:  () => request.cookies.getAll(),
          setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Pas connecté → login
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}