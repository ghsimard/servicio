import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
