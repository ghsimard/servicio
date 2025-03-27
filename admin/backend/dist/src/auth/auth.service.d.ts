import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { Request } from 'express';
export declare class AuthService {
    private prisma;
    private jwtService;
    private sessionsService;
    constructor(prisma: PrismaService, jwtService: JwtService, sessionsService: SessionsService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any, req: Request): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
        };
    }>;
    logout(userId: string, sessionId: string): Promise<void>;
}
