"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _jwtstrategy = require("../strategies/jwt.strategy");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtAuthGuard = class JwtAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            throw new _common.UnauthorizedException('Missing or invalid authorization token');
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const user = this.jwtStrategy.validate(token);
        if (!user) {
            throw new _common.UnauthorizedException('Invalid token');
        }
        // Add user to request object
        request.user = user;
        return true;
    }
    constructor(jwtStrategy){
        this.jwtStrategy = jwtStrategy;
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtstrategy.JwtStrategy === "undefined" ? Object : _jwtstrategy.JwtStrategy
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map