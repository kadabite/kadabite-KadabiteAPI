import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function hstsMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  return response;
}
