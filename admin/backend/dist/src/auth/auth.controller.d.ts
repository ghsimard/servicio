import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            userId: any;
            firstname: any;
            lastname: any;
            email: any;
            username: any;
            preferred_language: any;
        };
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
