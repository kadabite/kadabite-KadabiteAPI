import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function permissionsPolicyMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Permissions-Policy', 'geolocation=(self), microphone=(), camera=(), payment=(), usb=()');
  return response;
}
