import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

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

interface GoogleGeocodeResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
  error_message?: string;
}

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  private readonly logger = new Logger(LocationsController.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get location autocomplete suggestions' })
  @ApiQuery({ name: 'input', required: true, description: 'Search input string' })
  @ApiQuery({ name: 'types', required: false, description: 'Place types to search for' })
  @ApiResponse({ status: 200, description: 'List of location suggestions' })
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

  @Get('reverse-geocode')
  @ApiOperation({ summary: 'Get address from latitude and longitude' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Address information' })
  async reverseGeocode(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    this.logger.log(`Received reverse geocoding request for coordinates: ${lat}, ${lng}`);

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      this.logger.error('Invalid coordinates provided');
      return {
        error: 'Invalid coordinates provided',
        details: 'Latitude and longitude must be valid numbers'
      };
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      this.logger.error('Coordinates out of valid range');
      return {
        error: 'Invalid coordinates',
        details: 'Coordinates are outside the valid range'
      };
    }

    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      this.logger.warn('Google Maps API key not configured');
      return { 
        error: 'Google Maps API key not configured'
      };
    }
    
    try {
      this.logger.log('Making request to Google Geocoding API');
      const response = await firstValueFrom(
        this.httpService.get<GoogleGeocodeResponse>(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              latlng: `${latitude},${longitude}`,
              key: apiKey,
              language: 'en', // Ensure we get results in English
              result_type: 'street_address|route|locality|sublocality|postal_code', // Get more precise results
            },
          }
        )
      );
      
      const data = response.data;
      this.logger.debug('Google Geocoding API response:', data);

      if (data.status !== 'OK' || !data.results?.length) {
        this.logger.error(`Google Geocoding API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`);
        return {
          error: 'Could not get address from your location',
          status: data.status,
          details: data.error_message || 'No results found for these coordinates'
        };
      }

      // Get the most detailed address from the results
      const result = data.results[0];
      const address = result.formatted_address;
      
      this.logger.log(`Successfully reverse geocoded to address: ${address}`);
      return {
        address,
        status: 'OK',
        components: result.address_components
      };
    } catch (error) {
      this.logger.error('Error reverse geocoding:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Detailed error:', errorMessage);
      
      return {
        error: 'Could not get address from your location',
        details: errorMessage,
        status: 'ERROR'
      };
    }
  }
} 