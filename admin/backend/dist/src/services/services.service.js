"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const logging_service_1 = require("../logging/logging.service");
let ServicesService = class ServicesService {
    constructor(prisma, loggingService) {
        this.prisma = prisma;
        this.loggingService = loggingService;
    }
    async findAll() {
        return this.prisma.service.findMany();
    }
    async findOne(id) {
        return this.prisma.service.findUnique({
            where: { serviceId: id },
        });
    }
    async create(data, req) {
        const service = await this.prisma.service.create({
            data,
        });
        await this.loggingService.logDatabaseAction('services', 'insert', service.serviceId, service, undefined, req?.user?.sub);
        return service;
    }
    async update(id, data, req) {
        const oldService = await this.findOne(id);
        const service = await this.prisma.service.update({
            where: { serviceId: id },
            data,
        });
        await this.loggingService.logDatabaseAction('services', 'update', service.serviceId, service, oldService, req?.user?.sub);
        return service;
    }
    async remove(id, req) {
        const oldService = await this.findOne(id);
        const service = await this.prisma.service.delete({
            where: { serviceId: id },
        });
        await this.loggingService.logDatabaseAction('services', 'delete', id, undefined, oldService, req?.user?.sub);
        return service;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logging_service_1.LoggingService])
], ServicesService);
//# sourceMappingURL=services.service.js.map