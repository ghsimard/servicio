"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoggingController", {
    enumerable: true,
    get: function() {
        return LoggingController;
    }
});
const _common = require("@nestjs/common");
const _loggingservice = require("./logging.service");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
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
let LoggingController = class LoggingController {
    async trackAction(data, req) {
        this.logger.debug(`Tracking action: ${data.actionType} on page ${data.pageVisited} for session ${data.sessionId}`);
        return this.loggingService.trackUserAction(req.user.userId, data.sessionId, data.pageVisited, data.actionType, data.actionData, data.source);
    }
    async createSession(data, req) {
        const userId = req.user.userId;
        // Debug the user object and token
        this.logger.debug('JWT user payload:', req.user);
        this.logger.debug(`Creating session for user ID: ${userId} with source: ${data.source || 'not specified'}`);
        const sessionType = 'web';
        return this.loggingService.createUserSession(userId, req, sessionType, data.source);
    }
    async endSession(data, req) {
        const userId = req.user.userId;
        this.logger.debug(`Ending session ${data.sessionId} for user ${userId}`);
        return this.loggingService.endUserSession(userId, data.sessionId);
    }
    constructor(loggingService){
        this.loggingService = loggingService;
        this.logger = new _common.Logger(LoggingController.name);
    }
};
_ts_decorate([
    (0, _common.Post)('track-action'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof TrackActionDto === "undefined" ? Object : TrackActionDto,
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], LoggingController.prototype, "trackAction", null);
_ts_decorate([
    (0, _common.Post)('create-session'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateSessionDto === "undefined" ? Object : CreateSessionDto,
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], LoggingController.prototype, "createSession", null);
_ts_decorate([
    (0, _common.Post)('end-session'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof EndSessionDto === "undefined" ? Object : EndSessionDto,
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], LoggingController.prototype, "endSession", null);
LoggingController = _ts_decorate([
    (0, _common.Controller)('logging'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loggingservice.LoggingService === "undefined" ? Object : _loggingservice.LoggingService
    ])
], LoggingController);

//# sourceMappingURL=logging.controller.js.map