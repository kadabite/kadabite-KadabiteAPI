import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = ['https://acme.com', 'https://my-app.org']
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function corsMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin ? { 'Access-Control-Allow-Origin': origin } : {}),
      ...corsOptions
    }
    return NextResponse.json({ok: false, message: 'Preflight header sent', statusCode: 204}, { headers: preflightHeaders, status: 204 });
  }

  // Handle simple requests
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
 
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response;
}
