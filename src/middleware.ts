// middleware.ts
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token
    const { nextUrl } = req
    const isAuth = !!token
    const isAuthPage = nextUrl.pathname.startsWith('/auth/')
    const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth/')
    const isUnauthorizedPage = nextUrl.pathname === '/unauthorized'
    const isPublicPage = ['/', '/about', '/contact', '/privacy', '/terms'].includes(nextUrl.pathname)

    // Allow API auth routes and public pages
    if (isApiAuthRoute || isPublicPage || isUnauthorizedPage) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages (except when logging out)
    if (isAuthPage) {
      if (isAuth) {
        // If user is authenticated and trying to access auth pages, redirect to appropriate dashboard
        const userRole = token?.role as string || 'citizen'
        const dashboardPath = getDashboardPath(userRole)
        return NextResponse.redirect(new URL(dashboardPath, req.url))
      }
      // If not authenticated, allow access to auth pages
      return NextResponse.next()
    }

    // Redirect unauthenticated users to signin (except for public pages)
    if (!isAuth) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Role-based access control (only for authenticated users)
    if (token) {
      const userRole = token.role as string

      // Admin-only routes
      if (nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Moderator or Admin routes
      if (nextUrl.pathname.startsWith('/moderator') &&
        !['admin', 'moderator'].includes(userRole.toLowerCase())) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow access to auth pages, API routes, public pages, and unauthorized page
        if (pathname.startsWith('/auth/') || 
            pathname.startsWith('/api/') ||
            pathname === '/unauthorized' ||
            ['/', '/about', '/contact', '/privacy', '/terms'].includes(pathname)) {
          return true
        }

        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

// Helper function to get dashboard path based on role
function getDashboardPath(role: string): string {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin'
    case 'moderator':
      return '/moderator'
    case 'citizen':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}