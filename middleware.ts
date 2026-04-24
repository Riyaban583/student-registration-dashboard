import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { Console } from 'console';
import Jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isAdminRoute = path.startsWith('/admin') ;
  const isAlumniRoute = path.startsWith('/alumni') && !path.startsWith('/alumni/login');

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = Jwt.decode(token);
      if (!decoded || (typeof decoded !== 'object' || decoded.role !== 'admin')) {
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