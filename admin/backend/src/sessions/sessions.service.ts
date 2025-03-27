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
    const where = sessionType ? { session_type: sessionType } : {};

    const [totalSessions, activeSessions, deviceStats, browserStats] = await Promise.all([
      this.prisma.user_sessions.count({ where }),
      this.prisma.user_sessions.count({ where: { ...where, is_active: true } }),
      this.prisma.user_sessions.groupBy({
        by: ['device_type'],
        where,
        _count: true,
      }),
      this.prisma.user_sessions.groupBy({
        by: ['browser'],
        where,
        _count: true,
      }),
    ]);

    return {
      totalSessions,
      activeSessions,
      deviceStats,
      browserStats,
    };
  }
} 