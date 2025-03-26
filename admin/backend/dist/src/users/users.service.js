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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                preferred_language: true,
                createdAt: true,
                updatedAt: true,
                user_roles: {
                    select: {
                        role: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.user.findUnique({
            where: { userId: id },
            select: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                preferred_language: true,
                createdAt: true,
                updatedAt: true,
                user_roles: {
                    select: {
                        role: true,
                    },
                },
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                passwordHash: true,
                preferred_language: true,
                createdAt: true,
                updatedAt: true,
                user_roles: {
                    select: {
                        role: true,
                    },
                },
            },
        });
    }
    async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const { roles, ...userData } = data;
        const user = await this.prisma.user.create({
            data: {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                username: userData.username,
                passwordHash: hashedPassword,
                preferred_language: userData.preferred_language,
                user_roles: {
                    create: roles?.map((role) => ({
                        role: role,
                    })) || [],
                },
            },
            select: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                preferred_language: true,
                createdAt: true,
                updatedAt: true,
                user_roles: {
                    select: {
                        role: true,
                    },
                },
            },
        });
        return user;
    }
    async update(id, data) {
        const { roles, ...userData } = data;
        if (userData.password) {
            userData.passwordHash = await bcrypt.hash(userData.password, 10);
            delete userData.password;
        }
        await this.prisma.user_roles.deleteMany({
            where: { user_id: id },
        });
        const user = await this.prisma.user.update({
            where: { userId: id },
            data: {
                ...userData,
                user_roles: {
                    create: roles?.map((role) => ({
                        role: role,
                    })) || [],
                },
            },
            select: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                preferred_language: true,
                createdAt: true,
                updatedAt: true,
                user_roles: {
                    select: {
                        role: true,
                    },
                },
            },
        });
        return user;
    }
    async remove(id) {
        await this.prisma.user_roles.deleteMany({
            where: { user_id: id },
        });
        return this.prisma.user.delete({
            where: { userId: id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map