import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/legislacao',
  '/processos',
  '/simulador',
  '/busca',
  '/chat',
  '/jurisprudencia',
  '/verificador',
  '/admin',
  '/usuario-seguranca',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/legislacao/:path*',
    '/processos/:path*',
    '/simulador/:path*',
    '/busca/:path*',
    '/chat/:path*',
    '/jurisprudencia/:path*',
    '/verificador/:path*',
    '/admin/:path*',
    '/usuario-seguranca',
  ],
};
