"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.setGlobalPrefix('api', {
        exclude: ['/', 'health'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Servicio API')
        .setDescription('The Servicio API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('http://localhost:3001', 'Local environment')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = 3001;
    await app.listen(port);
    console.log(`
Application is running on: http://localhost:${port}
Swagger documentation: http://localhost:${port}/api
Health check: http://localhost:${port}/health
API root: http://localhost:${port}/api
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map