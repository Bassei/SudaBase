import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code || request.nextUrl.pathname === '/auth/callback') return NextResponse.next();

  const callback = request.nextUrl.clone();
  const originalPath = request.nextUrl.pathname;
  callback.pathname = '/auth/callback';
  callback.search = '';
  callback.searchParams.set('code', code);
  callback.searchParams.set('next', originalPath === '/' ? '/ar/marketplace' : originalPath);
  return NextResponse.redirect(callback);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
