import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
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
        totalRevenue: 0, // Placeholder for now
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }

  @Get('recent-activity')
  @UseGuards(JwtAuthGuard)
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
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      throw new Error('Failed to fetch recent activity');
    }
  }
}