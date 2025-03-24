"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _config = require("@nestjs/config");
const _ports = require("../../../config/ports.js");
const _default = (0, _config.registerAs)('app', ()=>({
        port: parseInt(process.env.PORT || _ports.PORTS.BACKEND.toString(), 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        jwtSecret: process.env.JWT_SECRET,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002',
                'http://localhost:3003'
            ],
            methods: [
                'GET',
                'POST',
                'PUT',
                'DELETE',
                'PATCH',
                'OPTIONS'
            ],
            allowedHeaders: [
                'Content-Type',
                'Authorization'
            ],
            credentials: true
        }
    }));

//# sourceMappingURL=app.config.js.map