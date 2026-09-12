import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { Console } from 'console';
import Jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Drive questions management can be accessed by admin OR anyone with alumni access token
  if (path.startsWith('/admin/questions')) {
    const token = request.cookies.get('auth-token')?.value;
    const alumniToken = request.cookies.get('alumni-access-token')?.value;

    let hasAdmin = false;
    if (token) {
      try {
        const decoded = Jwt.decode(token);
        if (decoded && typeof decoded === 'object' && (decoded as any).role === 'admin') {
          hasAdmin = true;
        }
      } catch (error) {}
    }

    // Allow access or allow the page to show password prompt
    return NextResponse.next();
  }

  // Define protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isAlumniRoute = path.startsWith('/alumni') && !path.startsWith('/alumni/login');

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = Jwt.decode(token);
      if (!decoded || (typeof decoded !== 'object' || (decoded as any).role !== 'admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAlumniRoute) {
    const alumniToken = request.cookies.get('alumni-access-token')?.value;
    if (!alumniToken) {
       return NextResponse.redirect(new URL('/alumni/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/alumni/:path*'],
};