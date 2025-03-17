import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

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
    .addServer('http://localhost:3000', 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000; // Use PORT from environment or default to 3000
  await app.listen(port);
  console.log(`
Application is running on: http://localhost:${port}
Swagger documentation: http://localhost:${port}/api
Health check: http://localhost:${port}/health
API root: http://localhost:${port}/api
  `);
}
bootstrap();
