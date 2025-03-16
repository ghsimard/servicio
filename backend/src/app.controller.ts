import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  error?: string;
}

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status' })
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Servicio API is running',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health check response' })
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: err.message,
      };
    }
  }
}
