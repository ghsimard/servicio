import { ServicesService, SearchServicesResponse } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    private readonly logger;
    constructor(servicesService: ServicesService);
    searchServices(mainQuery: string, altQuery: string, lang?: string): Promise<SearchServicesResponse>;
}
