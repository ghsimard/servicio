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
var ServicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ServicesService = ServicesService_1 = class ServicesService {
    prisma;
    logger = new common_1.Logger(ServicesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchServices(query, lang = 'en') {
        try {
            const searchQuery = query || '';
            const validLanguage = ['en', 'fr', 'es'].includes(lang) ? lang : 'en';
            this.logger.log(`Searching services with query: "${searchQuery}", language: ${validLanguage}`);
            if (!this.prisma?.services) {
                throw new common_1.InternalServerErrorException('Prisma service is not initialized');
            }
            const whereCondition = {
                is_active: true,
            };
            if (validLanguage === 'en') {
                whereCondition.name_en = {
                    contains: searchQuery,
                    mode: 'insensitive',
                };
            }
            else if (validLanguage === 'fr') {
                whereCondition.name_fr = {
                    contains: searchQuery,
                    mode: 'insensitive',
                };
            }
            else if (validLanguage === 'es') {
                whereCondition.name_es = {
                    contains: searchQuery,
                    mode: 'insensitive',
                };
            }
            const results = await this.prisma.services.findMany({
                where: whereCondition,
                select: {
                    service_id: true,
                    name_en: true,
                    name_fr: true,
                    name_es: true,
                },
                orderBy: {
                    ...(validLanguage === 'en'
                        ? { name_en: 'asc' }
                        : validLanguage === 'fr'
                            ? { name_fr: 'asc' }
                            : { name_es: 'asc' }),
                },
            });
            if (!Array.isArray(results)) {
                throw new common_1.InternalServerErrorException('Invalid response from database');
            }
            this.logger.log(`Found ${results.length} services matching query "${searchQuery}" in language ${validLanguage}`);
            return {
                services: results,
            };
        }
        catch (error) {
            this.logger.error('Error searching services:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.logger.error(`Database error code: ${error.code}, message: ${error.message}`);
                throw new common_1.InternalServerErrorException(`Database error: ${error.message}`);
            }
            if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
                this.logger.error('Database connection error:', error.message);
                throw new common_1.InternalServerErrorException('Database connection error');
            }
            throw new common_1.InternalServerErrorException('Error searching services');
        }
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = ServicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map