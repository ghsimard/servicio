import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Request as ExpressRequest } from 'express';
import { LoginDto } from './dto/login.dto';
interface RequestUser {
    userId: string;
    email: string;
}
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, req: ExpressRequest): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstname: any;
            lastname: any;
            username: any;
            preferred_language: any;
            roles: any;
        };
    }>;
    logout(req: Request & {
        user: RequestUser;
    }): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        userId: string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        preferred_language: string;
        createdAt: Date;
        updatedAt: Date;
        user_roles: {
            role: import(".prisma/client").$Enums.role_type;
        }[];
    }>;
}
export {};
