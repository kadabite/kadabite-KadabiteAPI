import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function cspMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-src 'none';";

  response.headers.set('Content-Security-Policy', csp);

  return response;
}