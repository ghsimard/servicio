import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  // Default CORS configuration
  const corsConfig = appConfig?.cors || {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  // Default port - explicitly set to 3001
  const port = 3001;
  
  // Enable CORS for the frontend
  app.enableCors(corsConfig);

  // Add /api prefix to all routes except health checks
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health'],
  });
  
  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Servicio API')
    .setDescription('The Servicio API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${port}`, 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`
Application is running on: http://localhost:${port}
Swagger documentation: http://localhost:${port}/api
Health check: http://localhost:${port}/health
API root: http://localhost:${port}/api
  `);
}
bootstrap();
