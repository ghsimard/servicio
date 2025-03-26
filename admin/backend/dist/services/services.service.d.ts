import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        duration: number;
        status: import(".prisma/client").$Enums.ServiceStatus;
        helperId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        duration: number;
        status: import(".prisma/client").$Enums.ServiceStatus;
        helperId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
