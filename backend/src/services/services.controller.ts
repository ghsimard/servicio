import { Controller, Get, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ServicesService, SearchServicesResponse } from './services.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  private readonly logger = new Logger(ServicesController.name);

  constructor(private readonly servicesService: ServicesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search services by name with optional language filter' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query string' })
  @ApiQuery({ name: 'q', required: false, description: 'Alternative search parameter (backward compatibility)' })
  @ApiQuery({ name: 'lang', required: false, description: 'Language code (en, fr, es)', enum: ['en', 'fr', 'es'] })
  @ApiResponse({ status: 200, description: 'List of services matching the search criteria' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async searchServices(
    @Query('query') mainQuery: string,
    @Query('q') altQuery: string,
    @Query('lang') lang: string = 'en'
  ): Promise<SearchServicesResponse> {
    // Use either query parameter, with mainQuery taking precedence
    const query = mainQuery || altQuery || '';
    this.logger.log(`Searching services with query: ${query}, language: ${lang}`);
    try {
      const results = await this.servicesService.searchServices(query, lang);
      this.logger.log(`Found ${results.services.length} services`);
      return results;
    } catch (error) {
      this.logger.error('Error searching services:', error);
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 