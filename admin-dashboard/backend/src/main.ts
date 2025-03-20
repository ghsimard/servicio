import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORTS, URLS } from '../../config/ports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: URLS.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(PORTS.BACKEND);
  console.log(`Admin Dashboard Backend running on ${URLS.BACKEND_URL}`);
}
bootstrap(); 