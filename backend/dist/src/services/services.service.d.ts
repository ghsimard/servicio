import { PrismaService } from '../prisma/prisma.service';
export interface SearchServicesResponse {
    services: Array<{
        service_id: string;
        name_en: string;
        name_fr: string | null;
        name_es: string | null;
    }>;
}
export declare class ServicesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    searchServices(query: string): Promise<SearchServicesResponse>;
}
