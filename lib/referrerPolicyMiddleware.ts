import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function referrerPolicyMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Referrer-Policy', 'same-origin');
  return response;
}