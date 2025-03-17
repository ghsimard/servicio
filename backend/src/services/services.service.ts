import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { services, Prisma } from '@prisma/client';

// Using the database schema with name_en, name_fr, and name_es fields
export interface SearchServicesResponse {
  services: Array<{
    service_id: string;
    name_en: string;
    name_fr: string | null;
    name_es: string | null;
  }>;
}

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(private prisma: PrismaService) {}

  async searchServices(query: string): Promise<SearchServicesResponse> {
    try {
      // Ensure query is a string, default to empty string if undefined
      const searchQuery = query || '';
      this.logger.log(`Searching services with query: "${searchQuery}"`);

      if (!this.prisma?.services) {
        throw new InternalServerErrorException(
          'Prisma service is not initialized',
        );
      }

      const results = await this.prisma.services.findMany({
        where: {
          is_active: true,
          name_en: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        select: {
          service_id: true,
          name_en: true,
          name_fr: true,
          name_es: true,
        },
        orderBy: {
          name_en: 'asc',
        },
      });

      if (!Array.isArray(results)) {
        throw new InternalServerErrorException(
          'Invalid response from database',
        );
      }

      this.logger.log(
        `Found ${results.length} services matching query "${searchQuery}"`,
      );

      return {
        services: results,
      };
    } catch (error) {
      this.logger.error('Error searching services:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Database error code: ${error.code}, message: ${error.message}`,
        );
        throw new InternalServerErrorException(
          `Database error: ${error.message}`,
        );
      }

      if (error instanceof Prisma.PrismaClientInitializationError) {
        this.logger.error('Database connection error:', error.message);
        throw new InternalServerErrorException('Database connection error');
      }

      throw new InternalServerErrorException('Error searching services');
    }
  }
}
