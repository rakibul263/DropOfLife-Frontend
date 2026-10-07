import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('dropoflife_token')?.value;
  const role = request.cookies.get('dropoflife_role')?.value;

  const isDashboardRoute = pathname.startsWith('/dashboard');

  // If attempting to access /dashboard/hospital directly, route to /dashboard/provider
  if (pathname.startsWith('/dashboard/hospital')) {
    return NextResponse.redirect(new URL('/dashboard/provider', request.url));
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
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (pathname.startsWith('/dashboard/provider') && role !== 'provider') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (pathname.startsWith('/dashboard/donor') && role !== 'donor') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
