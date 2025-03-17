import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async searchServices(
    query: string,
    lang: string = 'en',
  ): Promise<SearchServicesResponse> {
    try {
      // Ensure query is a string, default to empty string if undefined
      const searchQuery = query || '';
      // Validate language parameter
      const validLanguage = ['en', 'fr', 'es'].includes(lang) ? lang : 'en';

      this.logger.log(
        `Searching services with query: "${searchQuery}", language: ${validLanguage}`,
      );

      if (!this.prisma?.services) {
        throw new InternalServerErrorException(
          'Prisma service is not initialized',
        );
      }

      // Create the where condition based on the language
      const whereCondition: Prisma.servicesWhereInput = {
        is_active: true,
      };

      // Search in the appropriate language field
      if (validLanguage === 'en') {
        whereCondition.name_en = {
          contains: searchQuery,
          mode: 'insensitive',
        };
      } else if (validLanguage === 'fr') {
        whereCondition.name_fr = {
          contains: searchQuery,
          mode: 'insensitive',
        };
      } else if (validLanguage === 'es') {
        whereCondition.name_es = {
          contains: searchQuery,
          mode: 'insensitive',
        };
      }

      const results = await this.prisma.services.findMany({
        where: whereCondition,
        select: {
          service_id: true,
          name_en: true,
          name_fr: true,
          name_es: true,
        },
        orderBy: {
          // Order by the appropriate language field
          ...(validLanguage === 'en'
            ? { name_en: 'asc' }
            : validLanguage === 'fr'
            ? { name_fr: 'asc' }
            : { name_es: 'asc' }),
        },
      });

      if (!Array.isArray(results)) {
        throw new InternalServerErrorException(
          'Invalid response from database',
        );
      }

      this.logger.log(
        `Found ${results.length} services matching query "${searchQuery}" in language ${validLanguage}`,
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
