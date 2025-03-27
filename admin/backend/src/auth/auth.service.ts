import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    let user = null;
    
    // First try to find by email (case insensitive)
    try {
      user = await this.prisma.user.findFirst({
        where: { 
          email: { 
            mode: 'insensitive',
            equals: emailOrUsername 
          } 
        },
        include: {
          user_roles: true,
        },
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
    }

    // If not found by email, try by username (case insensitive)
    if (!user) {
      try {
        user = await this.prisma.user.findFirst({
          where: { 
            username: { 
              mode: 'insensitive',
              equals: emailOrUsername 
            } 
          },
          include: {
            user_roles: true,
          },
        });
      } catch (error) {
        console.error('Error finding user by username:', error);
      }
    }

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash || '');
    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
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