import { Response } from 'express';
import { KISApiService } from 'src/KIS/KIS.API.service';
export declare class APIController {
    private readonly apiService;
    constructor(apiService: KISApiService);
    test(res: Response, params: any): Promise<void>;
    HHDFS76240000(res: Response, params: object, period: number): Promise<void>;
}
