"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: function() {
        return AppController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _prismaservice = require("./prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppController = class AppController {
    getStatus() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Servicio API is running'
        };
    }
    async healthCheck() {
        try {
            // Test database connection
            await this.prisma.$queryRaw`SELECT 1`;
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                database: 'connected'
            };
        } catch (error) {
            const err = error;
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: err.message
            };
        }
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get API status'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "getStatus", null);
_ts_decorate([
    (0, _common.Get)('health'),
    (0, _swagger.ApiOperation)({
        summary: 'Health check endpoint'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Health check response'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "healthCheck", null);
AppController = _ts_decorate([
    (0, _swagger.ApiTags)('App'),
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AppController);

//# sourceMappingURL=app.controller.js.map