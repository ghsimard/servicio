"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocationsController", {
    enumerable: true,
    get: function() {
        return LocationsController;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _axios = require("@nestjs/axios");
const _rxjs = require("rxjs");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let LocationsController = class LocationsController {
    async getLocationAutocomplete(input, types) {
        this.logger.log(`Received location autocomplete request for: "${input}", types: "${types}"`);
        const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            this.logger.warn('Google Maps API key not configured, returning empty results');
            return {
                predictions: [],
                error: 'Google Maps API key not configured'
            };
        }
        try {
            this.logger.log(`Making request to Google Places API for: "${input}"`);
            const response = await (0, _rxjs.firstValueFrom)(this.httpService.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
                params: {
                    input,
                    // Use 'geocode' type instead of '(cities)' to get address results
                    types: 'geocode',
                    // Include both US and Canada results
                    components: 'country:us|country:ca',
                    key: apiKey
                }
            }));
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
                predictions: data.predictions?.map((prediction)=>({
                        description: prediction.description,
                        place_id: prediction.place_id
                    })) || []
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
    async reverseGeocode(lat, lng) {
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
        const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            this.logger.warn('Google Maps API key not configured');
            return {
                error: 'Google Maps API key not configured'
            };
        }
        try {
            this.logger.log('Making request to Google Geocoding API');
            const response = await (0, _rxjs.firstValueFrom)(this.httpService.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: apiKey,
                    language: 'en',
                    result_type: 'street_address|route|locality|sublocality|postal_code'
                }
            }));
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
    constructor(httpService, configService){
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new _common.Logger(LocationsController.name);
    }
};
_ts_decorate([
    (0, _common.Get)('autocomplete'),
    (0, _swagger.ApiOperation)({
        summary: 'Get location autocomplete suggestions'
    }),
    (0, _swagger.ApiQuery)({
        name: 'input',
        required: true,
        description: 'Search input string'
    }),
    (0, _swagger.ApiQuery)({
        name: 'types',
        required: false,
        description: 'Place types to search for'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of location suggestions'
    }),
    _ts_param(0, (0, _common.Query)('input')),
    _ts_param(1, (0, _common.Query)('types')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationAutocomplete", null);
_ts_decorate([
    (0, _common.Get)('reverse-geocode'),
    (0, _swagger.ApiOperation)({
        summary: 'Get address from latitude and longitude'
    }),
    (0, _swagger.ApiQuery)({
        name: 'lat',
        required: true,
        description: 'Latitude'
    }),
    (0, _swagger.ApiQuery)({
        name: 'lng',
        required: true,
        description: 'Longitude'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Address information'
    }),
    _ts_param(0, (0, _common.Query)('lat')),
    _ts_param(1, (0, _common.Query)('lng')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LocationsController.prototype, "reverseGeocode", null);
LocationsController = _ts_decorate([
    (0, _swagger.ApiTags)('locations'),
    (0, _common.Controller)('locations'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], LocationsController);

//# sourceMappingURL=locations.controller.js.map