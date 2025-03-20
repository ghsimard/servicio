import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface GooglePrediction {
  description: string;
  place_id: string;
  [key: string]: string | Record<string, unknown>;
}

interface GooglePlacesResponse {
  predictions: GooglePrediction[];
  status: string;
  error_message?: string;
}

@Controller('locations')
export class LocationsController {
  private readonly logger = new Logger(LocationsController.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('autocomplete')
  async getLocationAutocomplete(
    @Query('input') input: string,
    @Query('types') types: string,
  ) {
    this.logger.log(`Received location autocomplete request for: "${input}", types: "${types}"`);

    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      this.logger.warn('Google Maps API key not configured, returning empty results');
      return { 
        predictions: [],
        error: 'Google Maps API key not configured' 
      };
    }
    
    try {
      this.logger.log(`Making request to Google Places API for: "${input}"`);
      const response = await firstValueFrom(
        this.httpService.get<GooglePlacesResponse>(
          'https://maps.googleapis.com/maps/api/place/autocomplete/json',
          {
            params: {
              input,
              // Use 'geocode' type instead of '(cities)' to get address results
              types: 'geocode',
              // Include both US and Canada results
              components: 'country:us|country:ca',
              key: apiKey,
            },
          }
        )
      );
      const data = response.data;

      // Check for API errors
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        this.logger.error(`Google Places API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`);
        return {
          predictions: [],
          error: `API Error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`,
          status: data.status
        };
      }

      this.logger.log(`Received ${data.predictions?.length || 0} results from Google Places API`);
      return {
        predictions: data.predictions?.map(prediction => ({
          description: prediction.description,
          place_id: prediction.place_id,
        })) || [],
      };
    } catch (error) {
      this.logger.error(`Error fetching location autocomplete: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : '');
      return { 
        predictions: [],
        error: 'Failed to fetch location suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 