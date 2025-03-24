"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServicesController", {
    enumerable: true,
    get: function() {
        return ServicesController;
    }
});
const _common = require("@nestjs/common");
const _servicesservice = require("./services.service");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ServicesController = class ServicesController {
    async searchServices(mainQuery, altQuery, lang = 'en') {
        // Use either query parameter, with mainQuery taking precedence
        const query = mainQuery || altQuery || '';
        this.logger.log(`Searching services with query: ${query}, language: ${lang}`);
        try {
            const results = await this.servicesService.searchServices(query, lang);
            this.logger.log(`Found ${results.services.length} services`);
            return results;
        } catch (error) {
            this.logger.error('Error searching services:', error);
            throw new _common.HttpException(error.message || 'Internal server error', error.status || _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(servicesService){
        this.servicesService = servicesService;
        this.logger = new _common.Logger(ServicesController.name);
    }
};
_ts_decorate([
    (0, _common.Get)('search'),
    (0, _swagger.ApiOperation)({
        summary: 'Search services by name with optional language filter'
    }),
    (0, _swagger.ApiQuery)({
        name: 'query',
        required: false,
        description: 'Search query string'
    }),
    (0, _swagger.ApiQuery)({
        name: 'q',
        required: false,
        description: 'Alternative search parameter (backward compatibility)'
    }),
    (0, _swagger.ApiQuery)({
        name: 'lang',
        required: false,
        description: 'Language code (en, fr, es)',
        enum: [
            'en',
            'fr',
            'es'
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of services matching the search criteria'
    }),
    (0, _swagger.ApiResponse)({
        status: 500,
        description: 'Internal server error'
    }),
    _ts_param(0, (0, _common.Query)('query')),
    _ts_param(1, (0, _common.Query)('q')),
    _ts_param(2, (0, _common.Query)('lang')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ServicesController.prototype, "searchServices", null);
ServicesController = _ts_decorate([
    (0, _swagger.ApiTags)('services'),
    (0, _common.Controller)('services'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _servicesservice.ServicesService === "undefined" ? Object : _servicesservice.ServicesService
    ])
], ServicesController);

//# sourceMappingURL=services.controller.js.map