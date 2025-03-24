"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLS = exports.PORTS = void 0;
exports.PORTS = {
    BACKEND: 3001,
    FRONTEND: 3000,
    ADMIN_DASHBOARD: 3003,
};
exports.URLS = {
    get BACKEND_URL() {
        return `http://localhost:${exports.PORTS.BACKEND}`;
    },
    get BACKEND_API_URL() {
        return `${this.BACKEND_URL}/api`;
    },
    get FRONTEND_URL() {
        return `http://localhost:${exports.PORTS.FRONTEND}`;
    },
    get ADMIN_DASHBOARD_URL() {
        return `http://localhost:${exports.PORTS.ADMIN_DASHBOARD}`;
    }
};
exports.default = { PORTS: exports.PORTS, URLS: exports.URLS };
//# sourceMappingURL=ports.js.map