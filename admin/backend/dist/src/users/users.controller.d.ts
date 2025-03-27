import { UsersService } from './users.service';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        user_roles: {
            role: import(".prisma/client").$Enums.role_type;
        }[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        preferred_language: string;
    }[]>;
    findOne(id: string): Promise<{
        user_roles: {
            role: import(".prisma/client").$Enums.role_type;
        }[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        preferred_language: string;
    }>;
    create(createUserDto: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
        username: string;
        preferred_language?: string;
        roles?: string[];
    }, req: Request): Promise<{
        user_roles: {
            role: import(".prisma/client").$Enums.role_type;
        }[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        preferred_language: string;
    }>;
    update(id: string, updateUserDto: {
        email?: string;
        password?: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        preferred_language?: string;
        roles?: string[];
    }, req: Request): Promise<{
        user_roles: {
            role: import(".prisma/client").$Enums.role_type;
        }[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        preferred_language: string;
    }>;
    remove(id: string, req: Request): Promise<{
        createdAt: Date | null;
        updatedAt: Date | null;
        userId: string;
        firstname: string | null;
        lastname: string | null;
        lastname2: string | null;
        dob: Date | null;
        username: string;
        email: string;
        passwordHash: string | null;
        preferred_language: string | null;
        profile_photo_url: string | null;
        subscription_id: string | null;
        company_id: string | null;
        primary_address_id: string | null;
        certification_status: import(".prisma/client").$Enums.certification_status_type | null;
        last_certified_at: Date | null;
        gender: string | null;
        title: string | null;
    }>;
}
