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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DashboardController = class DashboardController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        try {
            console.log('Fetching dashboard stats...');
            const [totalUsers, totalServices, totalBookings] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.service.count(),
                this.prisma.booking.count(),
            ]);
            return {
                totalUsers,
                totalServices,
                totalBookings,
                totalRevenue: 0,
            };
        }
        catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            throw new Error('Failed to fetch dashboard stats');
        }
    }
    async getRecentActivity() {
        try {
            console.log('Fetching recent activity...');
            const recentBookings = await this.prisma.booking.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    needer: {
                        select: {
                            firstname: true,
                            lastname: true,
                        },
                    },
                    helperService: {
                        include: {
                            users: {
                                select: {
                                    firstname: true,
                                    lastname: true,
                                },
                            },
                            service: {
                                select: {
                                    nameEn: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!recentBookings.length) {
                return [];
            }
            return recentBookings.map(booking => ({
                id: booking.bookingId,
                neederName: `${booking.needer.firstname} ${booking.needer.lastname}`,
                helperName: `${booking.helperService.users.firstname} ${booking.helperService.users.lastname}`,
                serviceName: booking.helperService.service.nameEn,
                status: booking.status,
                createdAt: booking.createdAt,
            }));
        }
        catch (error) {
            console.error('Failed to fetch recent activity:', error);
            throw new Error('Failed to fetch recent activity');
        }
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent-activity'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentActivity", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map