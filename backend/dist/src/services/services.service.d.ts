import { PrismaService } from '../prisma/prisma.service';
import { services } from '@prisma/client';
export interface SearchServicesResponse {
    services: Pick<services, 'service_id' | 'name'>[];
}
export declare class ServicesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    searchServices(query: string): Promise<SearchServicesResponse>;
}
