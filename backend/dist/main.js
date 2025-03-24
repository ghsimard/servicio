"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _config = require("@nestjs/config");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    const configService = app.get(_config.ConfigService);
    const appConfig = configService.get('app');
    // Default CORS configuration
    const corsConfig = appConfig?.cors || {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003'
        ],
        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ],
        credentials: true
    };
    // Default port - explicitly set to 3001
    const port = 3001;
    // Enable CORS for the frontend
    app.enableCors(corsConfig);
    // Add /api prefix to all routes except health checks
    app.setGlobalPrefix('api', {
        exclude: [
            '/',
            'health'
        ]
    });
    // Enable validation pipes
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        transform: true
    }));
    // Swagger setup
    const config = new _swagger.DocumentBuilder().setTitle('Servicio API').setDescription('The Servicio API Documentation').setVersion('1.0').addBearerAuth().addServer(`http://localhost:${port}`, 'Local environment').build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('api', app, document);
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