import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 保护管理后台路由
    if (path.startsWith('/admin')) {
      if (!token || token.role !== 'manager') {
        return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', req.url))
      }
    }

    // 保护业务员面板路由
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // 公开路由
        if (path === '/' || path.startsWith('/auth') || path.startsWith('/api/auth')) {
          return true
        }

        // 需要身份验证的路由
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/clients/:path*',
    '/api/tasks/:path*',
    '/api/users/:path*',
    '/api/client-requests/:path*',
  ],
}
