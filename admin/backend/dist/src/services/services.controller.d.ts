import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
}
