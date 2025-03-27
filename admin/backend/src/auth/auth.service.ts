import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
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

  async login(user: any, req: Request) {
    const payload = { email: user.email, sub: user.userId, roles: user.user_roles.map(ur => ur.role) };
    const token = this.jwtService.sign(payload);
    
    // Create session
    const session = await this.sessionsService.createSession(user.userId, req, 'admin');

    return {
      access_token: token,
      session_id: session.session_id,
      user: {
        id: user.userId,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        preferred_language: user.preferred_language || 'en',
        roles: user.user_roles.map(ur => ur.role),
      },
    };
  }

  async logout(userId: string, sessionId: string) {
    await this.sessionsService.endSession(userId, sessionId);
  }
} 