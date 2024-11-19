import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RefererOriginMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const referer = req.headers.referer;
    const origin = req.headers.origin;
    const trustedDomain = 'http://localhost:3000';

    if (referer && !referer.startsWith(trustedDomain)) {
      return res.status(403).send('Forbidden');
    }

    if (origin && origin !== trustedDomain) {
      return res.status(403).send('Forbidden');
    }

    next();
  }
}