"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServicesModule", {
    enumerable: true,
    get: function() {
        return ServicesModule;
    }
});
const _common = require("@nestjs/common");
const _servicescontroller = require("./services.controller");
const _servicesservice = require("./services.service");
const _prismamodule = require("../prisma/prisma.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ServicesModule = class ServicesModule {
};
ServicesModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule
        ],
        controllers: [
            _servicescontroller.ServicesController
        ],
        providers: [
            _servicesservice.ServicesService
        ],
        exports: [
            _servicesservice.ServicesService
        ]
    })
], ServicesModule);

//# sourceMappingURL=services.module.js.map