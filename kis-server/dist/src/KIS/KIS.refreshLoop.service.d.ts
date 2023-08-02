import { KISApiService } from 'src/KIS/KIS.API.service';
export declare const LoopCallback: Set<(recv: any) => Promise<void>>;
export declare class KISLoopService {
    private readonly apiService;
    onDoing: boolean;
    constructor(apiService: KISApiService);
    init(): Promise<void>;
}
