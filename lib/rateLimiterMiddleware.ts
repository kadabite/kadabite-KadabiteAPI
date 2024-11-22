import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import { redisClient } from '@/lib/initialize';
import { NextRequest, NextResponse } from 'next/server';

interface RateLimiterRes {
  msBeforeNext: number;
  remainingPoints: number;
  consumedPoints: number;
  isFirstInDuration: boolean;
}

const errorMessage = {
  message: 'Too many requests, please try again later.',
  ok: false,
  statusCode: 429,
};

const serverError = {
  message: 'Internal Server Error',
  ok: false,
  statusCode: 500,
};

const rateLimiterOptions = {
  points: 200, // Number of requests
  duration: 900, // Per 15 minutes
  keyPrefix: 'rate-limit',
};

export let rateLimiter: RateLimiterRedis | RateLimiterMemory;

try {
  if (redisClient) {
    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      ...rateLimiterOptions,
    });
  } else {
    throw new Error('Redis not initialized');
  }
} catch (error) {
  console.warn('Falling back to in-memory rate limiting', error);
  rateLimiter = new RateLimiterMemory(rateLimiterOptions);
}

export async function handleRateLimiting(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  try {
    await rateLimiter.consume(ip);
    return null; // Allow request if under the limit
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error('Rate limiter error:', rateLimiterRes);
      return new NextResponse(JSON.stringify(serverError), { status: 500 });
    }

    // Type guard to ensure rateLimiterRes is of type RateLimiterRes
    if (typeof rateLimiterRes === 'object' && rateLimiterRes !== null && 'msBeforeNext' in rateLimiterRes) {
      const res = rateLimiterRes as RateLimiterRes; // Type assertion
      const retryAfter = Math.ceil(res.msBeforeNext / 1000);
      const headers = {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": rateLimiterOptions.points.toString(),
        "X-RateLimit-Remaining": res.remainingPoints.toString(),
        "X-RateLimit-Reset": new Date(Date.now() + res.msBeforeNext).toISOString()
      };

      return new NextResponse(JSON.stringify(errorMessage), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
    }

    // Fallback for unexpected error structure
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
