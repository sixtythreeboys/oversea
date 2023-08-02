import { KISApiService } from 'src/KIS/KIS.API.service';
export declare class BatchUpdateContinuous {
    private readonly apiService;
    BASEDATE: Date | null;
    constructor(apiService: KISApiService);
    makeNew({ excd, symb }: {
        excd: any;
        symb: any;
    }): Promise<void>;
    updateContinuous(BASEDATE: Date): Promise<void>;
}
