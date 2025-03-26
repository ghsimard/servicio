import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        isVerified: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        isVerified: boolean;
    }>;
    create(createUserDto: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: UserRole;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        isVerified: boolean;
    }>;
    update(id: string, updateUserDto: {
        firstName?: string;
        lastName?: string;
        role?: UserRole;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        isVerified: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        phone: string | null;
        isVerified: boolean;
        profileImage: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
