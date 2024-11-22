import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function xFrameOptionsMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}