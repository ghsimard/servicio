import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: {
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
    update(id: string, data: {
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
