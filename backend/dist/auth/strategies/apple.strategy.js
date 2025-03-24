"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppleStrategy", {
    enumerable: true,
    get: function() {
        return AppleStrategy;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppleStrategy = class AppleStrategy {
    /**
   * Validates an Apple profile (stub implementation)
   * In a real implementation, this would validate tokens from Apple
   */ validate(profile) {
        // Just return the profile data in the format our app expects
        return {
            email: profile?.email || '',
            firstName: profile?.name?.firstName || '',
            lastName: profile?.name?.lastName || ''
        };
    }
    constructor(configService){
        this.configService = configService;
    }
};
AppleStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AppleStrategy);

//# sourceMappingURL=apple.strategy.js.map