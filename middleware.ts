import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token // This will work now

    // If no token and trying to access protected routes, redirect to signin
    if (!token && pathname.startsWith('/dashboard')) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && (pathname === '/signin' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Role-based access control
    if (token && pathname.startsWith('/dashboard')) {
      const userRole = token.role

      // Admin-only routes
      if (pathname.startsWith('/dashboard/departments') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow all requests, we handle auth logic in the middleware function above
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup'
  ]
}