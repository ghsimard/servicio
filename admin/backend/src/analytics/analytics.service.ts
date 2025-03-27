import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly APP_SOURCE = 'admin-app';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Track admin user actions
   * @param userId User ID
   * @param sessionId Session ID
   * @param pageVisited Current page path
   * @param actionType Type of action (view, create, update, delete, etc.)
   * @param actionData Additional data about the action
   * @param source Source of the action (admin-app or main-app)
   */
  async trackAdminAction(
    userId: string,
    sessionId: string,
    pageVisited: string,
    actionType: string,
    actionData?: any,
    source: string = this.APP_SOURCE
  ) {
    try {
      // Check if the session exists first
      const session = await this.prisma.user_sessions.findUnique({
        where: {
          session_id: sessionId
        }
      });

      // If session doesn't exist, log error and return without tracking
      if (!session) {
        this.logger.warn(`Session ${sessionId} does not exist for user ${userId}, cannot track action`);
        
        // Create a session on-the-fly if needed
        try {
          this.logger.debug(`Creating new session for user ${userId} since session ${sessionId} doesn't exist`);
          const newSession = await this.prisma.user_sessions.create({
            data: {
              user_id: userId,
              session_type: 'web',
              // Use the user_agent field to store source info
              user_agent: `Admin App (source:${source})`,
              is_active: true
            }
          });
          
          // Use the new session ID for tracking
          sessionId = newSession.session_id;
          this.logger.debug(`Created new fallback session ${sessionId} for user ${userId}`);
        } catch (sessionError) {
          this.logger.error(`Failed to create fallback session: ${sessionError.message}`);
          return; // Can't track without a valid session
        }
      }
      
      // Add source to the action_data
      const actionDataWithSource = {
        ...actionData || {},
        _source: source // Store source inside the action_data JSON
      };
      
      await this.prisma.user_analytics.create({
        data: {
          user_id: userId,
          session_id: sessionId,
          page_visited: pageVisited,
          action_type: actionType,
          action_data: actionDataWithSource
        },
      });
      
      this.logger.debug(
        `Tracked action: ${actionType} by user ${userId} on page ${pageVisited} from source ${source}`
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
   * Create a new analytics session
   * @param userId User ID
   * @param req Request object for IP and user agent
   * @param source Source of the session (admin-app or main-app)
   * @returns Session object
   */
  async createSession(
    userId: string,
    req: Request,
    source: string = this.APP_SOURCE
  ) {
    try {
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip || req.socket.remoteAddress;
      
      // Parse user agent to get device, browser and OS info
      let deviceType = 'unknown';
      let browser = 'unknown';
      let os = 'unknown';
      
      if (userAgent) {
        // Simple parsing
        if (userAgent.includes('Mobile')) {
          deviceType = 'mobile';
        } else if (userAgent.includes('Tablet')) {
          deviceType = 'tablet';
        } else {
          deviceType = 'desktop';
        }
        
        // Browser detection
        if (userAgent.includes('Chrome')) {
          browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
          browser = 'Firefox';
        } else if (userAgent.includes('Safari')) {
          browser = 'Safari';
        } else if (userAgent.includes('Edge')) {
          browser = 'Edge';
        }
        
        // OS detection
        if (userAgent.includes('Windows')) {
          os = 'Windows';
        } else if (userAgent.includes('Mac')) {
          os = 'MacOS';
        } else if (userAgent.includes('Linux')) {
          os = 'Linux';
        } else if (userAgent.includes('Android')) {
          os = 'Android';
        } else if (userAgent.includes('iOS')) {
          os = 'iOS';
        }
      }
      
      // Include source in user_agent field
      const userAgentWithSource = `${userAgent} [source:${source}]`;
      
      // Create the session
      const session = await this.prisma.user_sessions.create({
        data: {
          user_id: userId,
          ip_address: ip,
          device_type: deviceType,
          browser: browser,
          os: os,
          user_agent: userAgentWithSource,
          is_active: true,
          session_type: 'web',
        },
      });
      
      // Log the session creation with source
      this.logger.debug(
        `Created session ${session.session_id} for user ${userId} from source ${source}`
      );
      
      return {
        sessionId: session.session_id,
        loginTime: session.login_time
      };
    } catch (error) {
      this.logger.error(`Error creating session: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * End a user session
   * @param userId User ID
   * @param sessionId Session ID
   * @param source Source of the session (admin-app or main-app)
   * @returns boolean success
   */
  async endSession(
    userId: string, 
    sessionId: string,
    source: string = this.APP_SOURCE
  ): Promise<boolean> {
    try {
      const session = await this.prisma.user_sessions.findFirst({
        where: {
          session_id: sessionId,
          user_id: userId,
        },
      });
      
      if (session) {
        // Calculate session duration in seconds
        const loginTime = new Date(session.login_time);
        const logoutTime = new Date();
        const durationMs = logoutTime.getTime() - loginTime.getTime();
        const durationSec = Math.floor(durationMs / 1000);
        
        await this.prisma.user_sessions.update({
          where: {
            session_id: sessionId,
          },
          data: {
            is_active: false,
            logout_time: logoutTime,
            duration: durationSec,
          },
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      this.logger.error(`Error ending session: ${error.message}`, error.stack);
      // Don't rethrow - analytics should never break the application
      return false;
    }
  }

  /**
   * Get analytics for a specific user
   * @param userId User ID
   * @param limit Number of records to return
   * @returns Analytics data
   */
  async getUserAnalytics(userId: string, limit = 100) {
    try {
      const analytics = await this.prisma.user_analytics.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      });

      // Get user sessions
      const sessions = await this.prisma.user_sessions.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          login_time: 'desc',
        },
      });

      return {
        analytics,
        sessions,
        userId,
      };
    } catch (error) {
      this.logger.error(
        `Error getting user analytics: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Get analytics dashboard data for admin
   * @returns Dashboard data
   */
  async getAdminAnalyticsDashboard() {
    try {
      // Get action counts by type
      const actionCounts = await this.prisma.$queryRaw`
        SELECT COUNT(*), action_type 
        FROM user_analytics 
        GROUP BY action_type
      `;

      // Get top users by activity
      const topUsers = await this.prisma.$queryRaw`
        SELECT COUNT(*), user_id 
        FROM user_analytics 
        GROUP BY user_id 
        ORDER BY COUNT(user_id) DESC 
        LIMIT 10
      `;

      // Get top pages visited
      const topPages = await this.prisma.$queryRaw`
        SELECT COUNT(*), page_visited 
        FROM user_analytics 
        GROUP BY page_visited 
        ORDER BY COUNT(page_visited) DESC 
        LIMIT 10
      `;

      // Get latest activities
      const latestActivities = await this.prisma.user_analytics.findMany({
        orderBy: {
          timestamp: 'desc',
        },
        take: 20,
        include: {
          users: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      // Extract source from action_data
      const analytics = await this.prisma.user_analytics.findMany();
      const sourceCounts = analytics.reduce((acc, item) => {
        let source = 'unknown';
        try {
          if (item.action_data && typeof item.action_data === 'object') {
            // Cast to any to handle JsonValue type
            const data = item.action_data as any;
            if (data._source) source = String(data._source);
          } else if (item.action_data && typeof item.action_data === 'string') {
            const data = JSON.parse(item.action_data);
            if (data && data._source) source = String(data._source);
          }
        } catch (e) {
          // Ignore parsing errors
        }

        if (!acc.find(x => x.source === source)) {
          acc.push({ source, count: 1 });
        } else {
          const idx = acc.findIndex(x => x.source === source);
          acc[idx].count += 1;
        }
        return acc;
      }, [] as Array<{ source: string; count: number }>);

      // Ensure we always have data for both sources
      if (!sourceCounts.find(x => x.source === 'main-app')) {
        sourceCounts.push({ source: 'main-app', count: 0 });
      }
      if (!sourceCounts.find(x => x.source === 'admin-app')) {
        sourceCounts.push({ source: 'admin-app', count: 0 });
      }

      // Convert BigInt to number for serialization
      const serializableActionCounts = (actionCounts as any[]).map(item => ({
        action_type: item.action_type,
        count: Number(item.count)
      }));

      const serializableTopUsers = (topUsers as any[]).map(item => ({
        user_id: item.user_id,
        count: Number(item.count)
      }));

      const serializableTopPages = (topPages as any[]).map(item => ({
        page_visited: item.page_visited,
        count: Number(item.count)
      }));

      return {
        actionCounts: serializableActionCounts,
        topUsers: serializableTopUsers,
        topPages: serializableTopPages,
        latestActivities,
        sourceCounts,
      };
    } catch (error) {
      this.logger.error(
        `Error getting admin analytics dashboard: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Get all user sessions
   * @param limit Maximum number of sessions to return
   * @returns List of sessions
   */
  async getAllSessions(limit: number = 100) {
    try {
      // Ensure limit is a valid number and explicitly convert to Number
      const limitNum = Number(limit);
      
      // Get all sessions - using a different approach
      const options = {
        orderBy: {
          login_time: 'desc' as const
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      };
      
      // Only add take if we have a valid number
      if (!isNaN(limitNum) && limitNum > 0) {
        const sessions = await this.prisma.user_sessions.findMany({
          ...options,
          take: limitNum
        });
        return sessions;
      } else {
        // If no valid limit, use a default of 100
        const sessions = await this.prisma.user_sessions.findMany({
          ...options,
          take: 100
        });
        return sessions;
      }
    } catch (error) {
      this.logger.error(`Error getting sessions: ${error.message}`, error.stack);
      throw error;
    }
  }
} 