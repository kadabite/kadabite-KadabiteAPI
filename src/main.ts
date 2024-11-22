import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'fatal', 'debug', 'log']
  });
  const allowlist = [process.env.FRONTEND_URL, 'http://example2.com'];
  const corsOptionDelegate = function (req, callback) {
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } 
    } else {
      corsOptions = { origin: false }
    }
    callback(null, corsOptions)
  }
  app.enableCors(corsOptionDelegate);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
