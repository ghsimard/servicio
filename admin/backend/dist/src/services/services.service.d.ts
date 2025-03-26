import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        createdAt: Date | null;
        updatedAt: Date | null;
        serviceId: string;
        parentServiceId: string | null;
        level: number;
        nameEn: string;
        nameFr: string | null;
        nameEs: string | null;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    findOne(serviceId: string): Promise<{
        createdAt: Date | null;
        updatedAt: Date | null;
        serviceId: string;
        parentServiceId: string | null;
        level: number;
        nameEn: string;
        nameFr: string | null;
        nameEs: string | null;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    create(data: any): Promise<{
        createdAt: Date | null;
        updatedAt: Date | null;
        serviceId: string;
        parentServiceId: string | null;
        level: number;
        nameEn: string;
        nameFr: string | null;
        nameEs: string | null;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(serviceId: string, data: any): Promise<{
        createdAt: Date | null;
        updatedAt: Date | null;
        serviceId: string;
        parentServiceId: string | null;
        level: number;
        nameEn: string;
        nameFr: string | null;
        nameEs: string | null;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(serviceId: string): Promise<{
        createdAt: Date | null;
        updatedAt: Date | null;
        serviceId: string;
        parentServiceId: string | null;
        level: number;
        nameEn: string;
        nameFr: string | null;
        nameEs: string | null;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
