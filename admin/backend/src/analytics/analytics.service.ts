import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}
  
  /**
   * Track admin user actions
   * @param userId User ID
   * @param sessionId Session ID
   * @param pageVisited Current page path
   * @param actionType Type of action (view, create, update, delete, etc.)
   * @param actionData Additional data about the action
   */
  async trackAdminAction(
    userId: string,
    sessionId: string,
    pageVisited: string,
    actionType: string,
    actionData?: any
  ) {
    try {
      await this.prisma.user_analytics.create({
        data: {
          user_id: userId,
          session_id: sessionId,
          page_visited: pageVisited,
          action_type: actionType,
          action_data: actionData || {},
        },
      });
      this.logger.debug(
        `Tracked action: ${actionType} by user ${userId} on page ${pageVisited}`
      );
    } catch (error) {
      this.logger.error(
        `Error tracking user action: ${error.message}`,
        error.stack
      );
      // Don't rethrow - analytics should never break the application
    }
  }

  /**
   * Get analytics for a specific user
   * @param userId User ID
   * @param limit Number of records to return
   */
  async getUserAnalytics(userId: string, limit: number = 100) {
    return this.prisma.user_analytics.findMany({
      where: {
        user_id: userId,
      },
      include: {
        users: {
          select: {
            username: true,
            email: true,
          },
        },
        sessions: {
          select: {
            session_type: true,
            login_time: true,
            device_type: true,
            browser: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get admin analytics dashboard data
   */
  async getAdminAnalyticsDashboard() {
    const [
      pageViewsByPath,
      actionTypeCount,
      userActivityCount,
      recentActivity,
    ] = await Promise.all([
      // Most viewed pages
      this.prisma.user_analytics.groupBy({
        by: ['page_visited'],
        _count: true,
        orderBy: {
          _count: {
            page_visited: 'desc',
          },
        },
        take: 10,
      }),
      // Action type distribution
      this.prisma.user_analytics.groupBy({
        by: ['action_type'],
        _count: true,
      }),
      // Most active users
      this.prisma.user_analytics.groupBy({
        by: ['user_id'],
        _count: true,
        orderBy: {
          _count: {
            user_id: 'desc',
          },
        },
        take: 10,
      }),
      // Recent activity
      this.prisma.user_analytics.findMany({
        take: 20,
        orderBy: {
          timestamp: 'desc',
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Get usernames for most active users
    const userDetails = await this.prisma.user.findMany({
      where: {
        userId: {
          in: userActivityCount.map((item) => item.user_id),
        },
      },
      select: {
        userId: true,
        username: true,
        email: true,
      },
    });

    // Map user details to activity counts
    const userActivity = userActivityCount.map((item) => {
      const user = userDetails.find((u) => u.userId === item.user_id);
      return {
        userId: item.user_id,
        username: user?.username || 'Unknown',
        email: user?.email || 'Unknown',
        count: item._count,
      };
    });

    return {
      pageViewsByPath,
      actionTypeCount,
      userActivity,
      recentActivity,
    };
  }
} 