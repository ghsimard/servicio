"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaService", {
    enumerable: true,
    get: function() {
        return PrismaService;
    }
});
const _common = require("@nestjs/common");
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
let PrismaService = class PrismaService extends _client.PrismaClient {
    async onModuleInit() {
        this.logger.log('Connecting to PostgreSQL database...');
        try {
            await this.$connect();
            this.logger.log('Successfully connected to the database');
        } catch (error) {
            this.logger.error('Failed to connect to the database', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        this.logger.log('Disconnecting from PostgreSQL database...');
        try {
            await this.$disconnect();
            this.logger.log('Successfully disconnected from the database');
        } catch (error) {
            this.logger.error('Error disconnecting from database', error);
        }
    }
    constructor(){
        // Use selective logging to reduce noise in the logs
        super({
            log: [
                'error',
                'warn'
            ]
        }), this.logger = new _common.Logger(PrismaService.name);
    }
};
PrismaService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], PrismaService);

//# sourceMappingURL=prisma.service 2.js.map