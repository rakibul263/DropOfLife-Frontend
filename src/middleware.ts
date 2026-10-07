import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('dropoflife_token')?.value;
  const rawRole = request.cookies.get('dropoflife_role')?.value;
  const role = rawRole === 'hospital' ? 'provider' : rawRole;

  const isDashboardRoute = pathname.startsWith('/dashboard');

  // If attempting to access /dashboard/hospital directly, route to /dashboard/provider
  if (pathname.startsWith('/dashboard/hospital')) {
    const tab = request.nextUrl.searchParams.get('tab');
    const dest = tab ? `/dashboard/provider?tab=${tab}` : '/dashboard/provider';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // If visiting /dashboard directly, forward to role dashboard
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const dest =
      role === 'admin'
        ? '/dashboard/admin'
        : role === 'provider'
        ? '/dashboard/provider'
        : '/dashboard/donor';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // If attempting to access protected dashboard without token
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route guard:
  if (isDashboardRoute && role) {
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      const dest = role === 'provider' ? '/dashboard/provider' : '/dashboard/donor';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    if (pathname.startsWith('/dashboard/provider') && role !== 'provider') {
      const dest = role === 'admin' ? '/dashboard/admin' : '/dashboard/donor';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    if (pathname.startsWith('/dashboard/donor') && role !== 'donor') {
      const dest = role === 'admin' ? '/dashboard/admin' : '/dashboard/provider';
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
