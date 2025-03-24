"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServicesService", {
    enumerable: true,
    get: function() {
        return ServicesService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ServicesService = class ServicesService {
    async searchServices(query, lang = 'en') {
        try {
            // Ensure query is a string, default to empty string if undefined
            const searchQuery = query || '';
            // Validate language parameter
            const validLanguage = [
                'en',
                'fr',
                'es'
            ].includes(lang) ? lang : 'en';
            this.logger.log(`Searching services with query: "${searchQuery}", language: ${validLanguage}`);
            if (!this.prisma?.services) {
                throw new _common.InternalServerErrorException('Prisma service is not initialized');
            }
            // Create the where condition based on the language
            const whereCondition = {
                is_active: true
            };
            // Search in the appropriate language field
            if (validLanguage === 'en') {
                whereCondition.name_en = {
                    contains: searchQuery,
                    mode: 'insensitive'
                };
            } else if (validLanguage === 'fr') {
                whereCondition.name_fr = {
                    contains: searchQuery,
                    mode: 'insensitive'
                };
            } else if (validLanguage === 'es') {
                whereCondition.name_es = {
                    contains: searchQuery,
                    mode: 'insensitive'
                };
            }
            const results = await this.prisma.services.findMany({
                where: whereCondition,
                select: {
                    service_id: true,
                    name_en: true,
                    name_fr: true,
                    name_es: true
                },
                orderBy: {
                    // Order by the appropriate language field
                    ...validLanguage === 'en' ? {
                        name_en: 'asc'
                    } : validLanguage === 'fr' ? {
                        name_fr: 'asc'
                    } : {
                        name_es: 'asc'
                    }
                }
            });
            if (!Array.isArray(results)) {
                throw new _common.InternalServerErrorException('Invalid response from database');
            }
            this.logger.log(`Found ${results.length} services matching query "${searchQuery}" in language ${validLanguage}`);
            return {
                services: results
            };
        } catch (error) {
            this.logger.error('Error searching services:', error);
            if (error instanceof _client.Prisma.PrismaClientKnownRequestError) {
                this.logger.error(`Database error code: ${error.code}, message: ${error.message}`);
                throw new _common.InternalServerErrorException(`Database error: ${error.message}`);
            }
            if (error instanceof _client.Prisma.PrismaClientInitializationError) {
                this.logger.error('Database connection error:', error.message);
                throw new _common.InternalServerErrorException('Database connection error');
            }
            throw new _common.InternalServerErrorException('Error searching services');
        }
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(ServicesService.name);
    }
};
ServicesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ServicesService);

//# sourceMappingURL=services.service.js.map