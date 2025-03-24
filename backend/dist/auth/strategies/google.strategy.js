"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleStrategy", {
    enumerable: true,
    get: function() {
        return GoogleStrategy;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _passport = require("@nestjs/passport");
const _passportgoogleoauth20 = require("passport-google-oauth20");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GoogleStrategy = class GoogleStrategy extends (0, _passport.PassportStrategy)(_passportgoogleoauth20.Strategy, 'google') {
    async validate(accessToken, refreshToken, profile) {
        const { name, emails, photos } = profile;
        return {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        };
    }
    constructor(configService){
        const clientID = configService.get('GOOGLE_CLIENT_ID') || 'dummy-id';
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET') || 'dummy-secret';
        const callbackURL = configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback';
        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: [
                'email',
                'profile'
            ]
        }), this.configService = configService;
    }
};
GoogleStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], GoogleStrategy);

//# sourceMappingURL=google.strategy.js.map