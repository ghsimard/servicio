import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';
import { Request } from 'express';
export declare class ServicesService {
    private prisma;
    private loggingService;
    constructor(prisma: PrismaService, loggingService: LoggingService);
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
    findOne(id: string): Promise<{
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
    create(data: any, req?: Request): Promise<{
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
    update(id: string, data: any, req?: Request): Promise<{
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
    remove(id: string, req?: Request): Promise<{
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
