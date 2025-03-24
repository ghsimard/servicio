"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _config = require("@nestjs/config");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _prismaservice = require("../prisma/prisma.service");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _jwtauthguard = require("./guards/jwt-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: (configService)=>({
                        secret: configService.get('JWT_SECRET'),
                        signOptions: {
                            expiresIn: configService.get('JWT_EXPIRATION', '7d')
                        }
                    }),
                inject: [
                    _config.ConfigService
                ]
            })
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _prismaservice.PrismaService,
            _jwtstrategy.JwtStrategy,
            _jwtauthguard.JwtAuthGuard
        ],
        exports: [
            _authservice.AuthService,
            _jwt.JwtModule,
            _jwtstrategy.JwtStrategy,
            _jwtauthguard.JwtAuthGuard
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map