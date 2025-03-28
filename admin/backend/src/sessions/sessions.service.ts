import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import * as UAParser from 'ua-parser-js';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  private parseUserAgent(userAgent: string) {
    const parser = new UAParser.UAParser(userAgent);
    const result = parser.getResult();
    return {
      device_type: result.device.type || 'desktop',
      browser: result.browser.name || 'unknown',
      os: result.os.name || 'unknown',
    };
  }

  async createSession(userId: string, req: Request, sessionType: 'admin' | 'main') {
    const userAgent = req.headers['user-agent'] || '';
    const { device_type, browser, os } = this.parseUserAgent(userAgent);
    const ipAddress = req.ip || req.connection.remoteAddress;

    return this.prisma.user_sessions.create({
      data: {
        user_id: userId,
        session_type: sessionType,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type,
        browser,
        os,
        is_active: true,
      },
    });
  }

  async endSession(userId: string, sessionId: string) {
    const session = await this.prisma.user_sessions.findFirst({
      where: {
        session_id: sessionId,
        user_id: userId,
        is_active: true,
      },
    });

    if (session) {
      const duration = Math.floor((new Date().getTime() - session.login_time.getTime()) / 1000);
      await this.prisma.user_sessions.update({
        where: { session_id: sessionId },
        data: {
          logout_time: new Date(),
          duration,
          is_active: false,
        },
      });
    }
  }

  async getActiveSessions(sessionType?: 'admin' | 'main') {
    const where = {
      is_active: true,
      ...(sessionType && { session_type: sessionType }),
    };

    return this.prisma.user_sessions.findMany({
      where,
      include: {
        users: {
          select: {
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        login_time: 'desc',
      },
    });
  }

  async getSessionStats(sessionType?: 'admin' | 'main') {
    try {
      const where = sessionType ? { session_type: sessionType } : {};

      // Get basic counts
      const [totalSessions, activeSessions] = await Promise.all([
        this.prisma.user_sessions.count({ where }),
        this.prisma.user_sessions.count({ where: { ...where, is_active: true } }),
      ]);

      // Calculate average session time for completed sessions
      const completedSessions = await this.prisma.user_sessions.findMany({
        where: {
          ...where,
          is_active: false,
          duration: { not: null },
        },
        select: { duration: true },
      });
      
      const avgSessionTime = completedSessions.length > 0
        ? completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / completedSessions.length
        : 0;

      // Get device types statistics
      const deviceStats = await this.prisma.user_sessions.groupBy({
        by: ['device_type'],
        where,
        _count: true,
      }).then(results => 
        results.map(item => ({
          device_type: item.device_type || 'unknown',
          count: item._count,
        }))
      );

      // Get browser statistics
      const browserStats = await this.prisma.user_sessions.groupBy({
        by: ['browser'],
        where,
        _count: true,
      }).then(results => 
        results.map(item => ({
          browser: item.browser || 'unknown',
          count: item._count,
        }))
      );

      return {
        totalSessions,
        activeSessions,
        avgSessionTime,
        deviceStats,
        browserStats,
      };
    } catch (error) {
      console.error('Error getting session stats:', error);
      // Return empty results instead of throwing an error
      return {
        totalSessions: 0,
        activeSessions: 0,
        avgSessionTime: 0,
        deviceStats: [],
        browserStats: [],
      };
    }
  }
} 