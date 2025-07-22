import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  const currentPath = request.nextUrl.pathname;

  // 1. Redirect root `/` based on auth
  if (currentPath === '/') {
    const redirectTo = token ? '/home' : '/login';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // 2. Prevent logged-in users from accessing `/login`
  if (currentPath === '/login' && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 3. Block unauthenticated users from accessing `/home`
  if (currentPath.startsWith('/home') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/home'],
};
