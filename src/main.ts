import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'fatal', 'debug', 'log'],
  });

  const allowlist = [
    process.env.FRONTEND_URL,
    'https://studio.apollographql.com',
    '*',
    'https://www.kadabite.com',
    'http://localhost:3000',
    'http://localhost:4000',
  ];

  const corsOptionDelegate = function (req, callback) {
    let corsOptions;
    const origin = req.header('Origin');
    if (allowlist.includes(origin)) {
      corsOptions = {
        origin: true,  // Allow the request from this origin
        methods: 'GET,POST', // Allow GET and POST methods
        allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
        credentials: true, // Allow cookies (if needed)
        exposedHeaders: 'Access-Control-Allow-Origin', // Expose the Access-Control-Allow-Origin header
      };
    } else {
      corsOptions = { origin: false }; // Deny CORS for other origins
    }
    callback(null, corsOptions);
  };

  // Enable CORS with the custom delegate
  app.enableCors(corsOptionDelegate);

  // Start the application on the specified port (default: 4000)
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
