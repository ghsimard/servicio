"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardController", {
    enumerable: true,
    get: function() {
        return DashboardController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _dashboardservice = require("./dashboard.service");
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
let DashboardController = class DashboardController {
    async getDashboard(req) {
        return this.dashboardService.getDashboardData(req.user.sub);
    }
    async getProfile(req) {
        return this.dashboardService.getUserProfile(req.user.sub);
    }
    async updateProfile(req, updateData) {
        return this.dashboardService.updateUserProfile(req.user.sub, updateData);
    }
    constructor(dashboardService){
        this.dashboardService = dashboardService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get dashboard data for the current user'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Dashboard data retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboard", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get user profile information'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User profile data retrieved successfully',
        schema: {
            example: {
                id: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
                username: 'johndoe',
                email: 'john@example.com',
                preferredLanguage: 'en'
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('profile'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getProfile", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Update user profile information'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User profile updated successfully',
        schema: {
            example: {
                id: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
                username: 'johndoe',
                email: 'john@example.com',
                name: 'John Doe',
                preferredLanguage: 'en'
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Put)('profile'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "updateProfile", null);
DashboardController = _ts_decorate([
    (0, _swagger.ApiTags)('dashboard'),
    (0, _common.Controller)('dashboard'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dashboardservice.DashboardService === "undefined" ? Object : _dashboardservice.DashboardService
    ])
], DashboardController);

//# sourceMappingURL=dashboard.controller.js.map