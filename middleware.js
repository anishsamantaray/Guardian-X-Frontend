import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('authToken');

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // match everything except: /api, /_next, /favicon.ico, /login, /signup, /verify
    '/((?!api|_next|favicon\\.ico|login|signup|verify).*)'
  ]
};
