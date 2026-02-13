import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);

    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isAdminRoute = path.startsWith('/admin');

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;
  // console.log(token)


  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = decodeJwtPayload(token);
      // console.log("dedocde token",Jwt.decode(token))
      if (!decoded || (typeof decoded !== 'object' || decoded.role !== 'admin')) {
        // console.log("There might be error",decoded)

        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      // console.log("There might be error",error)
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
