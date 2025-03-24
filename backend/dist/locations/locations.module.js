"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocationsModule", {
    enumerable: true,
    get: function() {
        return LocationsModule;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _config = require("@nestjs/config");
const _locationscontroller = require("./locations.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LocationsModule = class LocationsModule {
};
LocationsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _axios.HttpModule,
            _config.ConfigModule
        ],
        controllers: [
            _locationscontroller.LocationsController
        ]
    })
], LocationsModule);

//# sourceMappingURL=locations.module.js.map