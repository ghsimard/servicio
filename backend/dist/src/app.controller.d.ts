import { PrismaService } from './prisma/prisma.service';
interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    database: 'connected' | 'disconnected';
    error?: string;
}
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStatus(): {
        status: string;
        timestamp: string;
        message: string;
    };
    healthCheck(): Promise<HealthCheckResponse>;
}
export {};
