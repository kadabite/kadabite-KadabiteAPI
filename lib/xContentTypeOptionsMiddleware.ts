import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function xContentTypeOptionsMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}