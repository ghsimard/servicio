import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardController {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalServices: number;
        totalBookings: number;
        totalRevenue: number;
    }>;
    getRecentActivity(): Promise<{
        id: string;
        neederName: string;
        helperName: string;
        serviceName: string;
        status: import(".prisma/client").$Enums.booking_status;
        createdAt: Date;
    }[]>;
}
