"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const sessions_service_1 = require("../sessions/sessions.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService, sessionsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.sessionsService = sessionsService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                user_roles: true,
            },
        });
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user, req) {
        const payload = { email: user.email, sub: user.userId, roles: user.user_roles.map(ur => ur.role) };
        const token = this.jwtService.sign(payload);
        await this.sessionsService.createSession(user.userId, req, 'admin');
        return {
            access_token: token,
            user: {
                id: user.userId,
                email: user.email,
                roles: user.user_roles.map(ur => ur.role),
            },
        };
    }
    async logout(userId, sessionId) {
        await this.sessionsService.endSession(userId, sessionId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        sessions_service_1.SessionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map