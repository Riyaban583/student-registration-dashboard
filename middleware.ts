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
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin/questions')) {
    return NextResponse.next();
  }

  const isAdminRoute = path.startsWith('/admin');
  const isAlumniRoute = path.startsWith('/alumni') && !path.startsWith('/alumni/login');
  const token = request.cookies.get('auth-token')?.value;

  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = decodeJwtPayload(token);
    if (!decoded || (typeof decoded !== 'object' || decoded.role !== 'admin')) {
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
