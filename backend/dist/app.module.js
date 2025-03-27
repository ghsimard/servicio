"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _prismamodule = require("./prisma/prisma.module");
const _appcontroller = require("./app.controller");
const _servicesmodule = require("./services/services.module");
const _authmodule = require("./auth/auth.module");
const _dashboardmodule = require("./dashboard/dashboard.module");
const _locationsmodule = require("./locations/locations.module");
const _loggingmodule = require("./logging/logging.module");
const _appconfig = /*#__PURE__*/ _interop_require_default(require("./config/app.config"));
const _databaseconfig = /*#__PURE__*/ _interop_require_default(require("./config/database.config"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    _appconfig.default,
                    _databaseconfig.default
                ]
            }),
            _prismamodule.PrismaModule,
            _servicesmodule.ServicesModule,
            _authmodule.AuthModule,
            _dashboardmodule.DashboardModule,
            _locationsmodule.LocationsModule,
            _loggingmodule.LoggingModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: []
    })
], AppModule);

//# sourceMappingURL=app.module.js.map