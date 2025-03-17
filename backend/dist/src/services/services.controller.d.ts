import { ServicesService, SearchServicesResponse } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    private readonly logger;
    constructor(servicesService: ServicesService);
    searchServices(query: string, lang?: string): Promise<SearchServicesResponse>;
}
