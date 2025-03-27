"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardService", {
    enumerable: true,
    get: function() {
        return DashboardService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DashboardService = class DashboardService {
    async getDashboardData(userId) {
        // Get user info
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (!user) {
            return {
                message: 'User not found'
            };
        }
        // Basic welcome message
        return {
            message: `Welcome to your Servicio dashboard`,
            userName: user.username
        };
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Return user profile data
        return {
            id: user.user_id,
            username: user.username,
            email: user.email,
            preferredLanguage: user.preferred_language,
            profilePhotoUrl: user.profile_photo_url
        };
    }
    async updateUserProfile(userId, updateData) {
        // Verify user exists
        const existingUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (!existingUser) {
            throw new _common.NotFoundException('User not found');
        }
        // Check if username already exists (if username is being updated)
        if (updateData.username && updateData.username !== existingUser.username) {
            const usernameExists = await this.prisma.user.findFirst({
                where: {
                    username: {
                        equals: updateData.username,
                        mode: 'insensitive'
                    },
                    user_id: {
                        not: userId
                    }
                }
            });
            if (usernameExists) {
                throw new _common.BadRequestException('Username already taken');
            }
        }
        // Update user profile
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    user_id: userId
                },
                data: {
                    username: updateData.username,
                    preferred_language: updateData.preferredLanguage,
                    profile_photo_url: updateData.profilePhotoUrl
                }
            });
            return {
                id: updatedUser.user_id,
                username: updatedUser.username,
                email: updatedUser.email,
                preferredLanguage: updatedUser.preferred_language,
                profilePhotoUrl: updatedUser.profile_photo_url
            };
        } catch (error) {
            throw new _common.BadRequestException('Failed to update profile: ' + error.message);
        }
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
DashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], DashboardService);

//# sourceMappingURL=dashboard.service.js.map